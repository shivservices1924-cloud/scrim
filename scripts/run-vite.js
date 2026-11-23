import { createServer } from 'vite';

async function start() {
  const server = await createServer({
    configFile: './vite.config.js',
    server: {
      port: 5173,
      host: '0.0.0.0'
    }
  });
  await server.listen();
  console.log('VITE_DEV_SERVER_READY_ON_PORT_5173');
  server.printUrls();
}

start().catch(err => {
  console.error('Failed to start vite dev server:', err);
  process.exit(1);
});
