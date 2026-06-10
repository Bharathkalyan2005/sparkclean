export async function wakeUpServer() {
  const API = process.env.REACT_APP_API_URL 
    || 'https://sparkclean-x3ze.onrender.com'
  
  try {
    const res = await fetch(`${API}/api/health`, {
      method : 'GET',
      cache  : 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}
