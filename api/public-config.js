// Exposes only the public, safe-to-share Supabase config to the browser.
// The anon key is designed by Supabase to be public — access is enforced
// server-side by Row Level Security, not by hiding this key.
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || null,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || null,
  });
};
