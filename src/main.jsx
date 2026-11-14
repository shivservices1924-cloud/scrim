import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Global API Interceptor for Capacitor Native APK & Cloudflare / Web
const originalFetch = window.fetch;

export const isNativeApp =
  typeof window !== 'undefined' &&
  (!!window.Capacitor?.isNativePlatform?.() ||
   window.location.protocol === 'capacitor:' ||
   window.location.protocol === 'ionic:');

export const PRIMARY_API_HOST =
  typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.startsWith('capacitor:')
    ? window.location.origin
    : '';

export const FALLBACK_API_HOST = 'http://192.168.29.71:5050';

window.fetch = async function (input, init = {}) {
  let url = input;
  const isApiCall = typeof input === 'string' && input.startsWith('/api');

  const headers = new Headers(init.headers || {});
  headers.set('Bypass-Tunnel-Reminder', 'true');
  headers.set('bypass-tunnel-reminder', '1');

  if (isApiCall && isNativeApp) {
    const configuredHost = localStorage.getItem('rushx_api_host') || PRIMARY_API_HOST;
    if (configuredHost) {
      const targetUrl = `${configuredHost.replace(/\/$/, '')}${input}`;
      try {
        const res = await originalFetch(targetUrl, { ...init, headers });
        return wrapResponse(res);
      } catch (err) {
        console.warn(`Host ${configuredHost} failed, retrying direct/fallback...`, err);
      }
    }
  }

  try {
    const res = await originalFetch(url, { ...init, headers });
    return wrapResponse(res);
  } catch (err) {
    console.error('Fetch failed for:', url, err);
    throw new Error('Network connection error. Please check your internet connectivity.');
  }
};

// Safe response wrapper to prevent "Unexpected token '<'" JSON crashes
function wrapResponse(res) {
  const originalJson = res.json.bind(res);
  res.json = async function () {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      if (text.includes('Tunnel Reminder') || text.includes('localtunnel')) {
        throw new Error('Tunnel gateway reminder active. Please refresh or retry.');
      }
      if (res.status === 404) {
        throw new Error('Requested service endpoint not found (404).');
      }
      if (res.status >= 500) {
        throw new Error(`Server error (${res.status}). Our team has been notified.`);
      }
      throw new Error(`Unexpected server response (${res.status}). Please try again.`);
    }
    return await originalJson();
  };
  return res;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
