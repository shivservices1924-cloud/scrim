import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://scrim-six.vercel.app';
const DEFAULT_TITLE = 'RushX - Free Fire Tournaments & Cash Esports';
const DEFAULT_DESC = 'Play verified Free Fire Battle Royale & Clash Squad tournaments. Win cash prizes daily with instant UPI payouts.';

export default function SEO({ title, description, path }) {
  const location = useLocation();
  const currentPath = path || location.pathname;

  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} | RushX Esports` : DEFAULT_TITLE;
    document.title = fullTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attr, name, content) => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const desc = description || DEFAULT_DESC;
    const url = `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;

    setMetaTag('name', 'description', desc);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:url', url);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', desc);

    // 3. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, currentPath]);

  return null;
}

