const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://sparkclean-x3ze.onrender.com',
  
  razorpayMode: process.env.NODE_ENV === 'production' ? 'live' : 'test',

  frontendUrl: process.env.NODE_ENV === 'production'
    ? 'https://sparkclean-orcin.vercel.app'
    : 'http://localhost:3000',

  waNumber: '919392420643',
  
  supportEmail: 'Welcome@vrcpvtltd.com',
  supportPhone: '9392420643',
};

let cachedConfig: any = null;

export async function getPublicConfig() {
  if (cachedConfig) return cachedConfig;
  
  try {
    const res = await fetch(`${config.apiUrl}/config/public`);
    cachedConfig = await res.json();
    return cachedConfig;
  } catch (err) {
    console.error('Failed to load public config', err);
    return {};
  }
}

export default config;
