import https from 'https';
import fs from 'fs';
import path from 'path';

const REPO_OWNER = 'shivservices1924-cloud';
const REPO_NAME = 'scrim';

function getFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if ([
      'node_modules', '.git', '.github', 'dist', '.gradle', 'build', '.DS_Store',
      '.tmp', 'scratch', 'releases', 'uploads'
    ].includes(file)) continue;

    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file).replace(/\\/g, '/');

    if (file.endsWith('.log') || file.endsWith('.tmp')) continue;
    if (file.endsWith('.apk') && relPath !== 'public/rushx.apk') continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      results.push({ relPath, fullPath, size: stat.size });
    }
  }
  return results;
}

function ghRequest(method, endpoint, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: endpoint,
      method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'RushX-Pusher',
        'Accept': 'application/vnd.github.v3+json',
        ...(payload ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        } : {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error [${res.statusCode}] on ${method} ${endpoint}: ${parsed.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Parse error [${res.statusCode}]: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

export async function pushAllFiles(token) {
  console.log(`🚀 Starting push to ${REPO_OWNER}/${REPO_NAME}...`);
  const files = getFiles('.');
  console.log(`📦 Found ${files.length} project files to upload.`);

  // Upload blobs in batches
  const treeItems = [];
  const batchSize = 10;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`📤 Uploading files ${i + 1} to ${Math.min(i + batchSize, files.length)} of ${files.length}...`);

    await Promise.all(batch.map(async (file) => {
      const buffer = fs.readFileSync(file.fullPath);
      const isBinary = /\.(png|jpg|jpeg|gif|ico|webp|jar|aar|zip|so|apk)$/i.test(file.relPath);

      const blobData = isBinary
        ? { content: buffer.toString('base64'), encoding: 'base64' }
        : { content: buffer.toString('utf8'), encoding: 'utf-8' };

      const blobRes = await ghRequest('POST', `/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, blobData, token);

      // Executable permission for gradlew
      const mode = file.relPath === 'android/gradlew' ? '100755' : '100644';

      treeItems.push({
        path: file.relPath,
        mode,
        type: 'blob',
        sha: blobRes.sha
      });
    }));
  }

  console.log(`🌳 Creating Git Tree with ${treeItems.length} items...`);
  const treeRes = await ghRequest('POST', `/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
    tree: treeItems
  }, token);

  console.log(`🔍 Getting current commit on main...`);
  let parents = [];
  try {
    const refRes = await ghRequest('GET', `/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/main`, null, token);
    if (refRes && refRes.object && refRes.object.sha) {
      parents = [refRes.object.sha];
    }
  } catch (e) {
    console.log('No parent found, creating root commit...');
  }

  console.log(`📝 Creating Commit...`);
  const commitRes = await ghRequest('POST', `/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
    message: 'Configure Vercel serverless functions, vercel.json SPA rewrites, and express api bridge',
    tree: treeRes.sha,
    parents
  }, token);

  console.log(`📌 Updating branch ref 'refs/heads/main'...`);
  try {
    await ghRequest('PATCH', `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, {
      sha: commitRes.sha,
      force: true
    }, token);
  } catch (err) {
    await ghRequest('POST', `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
      ref: 'refs/heads/main',
      sha: commitRes.sha
    }, token);
  }

  console.log(`✅ All ${files.length} files successfully pushed to https://github.com/${REPO_OWNER}/${REPO_NAME}!`);
  return { success: true, count: files.length, commitSha: commitRes.sha };
}

// If run directly with token argument
const cliToken = process.argv[2] || process.env.GITHUB_TOKEN;
if (cliToken) {
  pushAllFiles(cliToken)
    .then(r => console.log('Done!', r))
    .catch(e => {
      console.error('Push failed:', e.message);
      process.exit(1);
    });
}
