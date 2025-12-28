export default async function handler(req, res) {
  const { q } = req.query;

  res.setHeader("Cache-Control", "no-store");

  const base = `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_CLIENT}&format=json&limit=20&audioformat=mp31`;

  let url;

  if (q === "random_home") {
    // Popular tracks = always returns data
    url = `${base}&order=popularity_total`;
  } else {
    url = `${base}&fuzzysearch=1&search=${encodeURIComponent(q)}`;
  }

  try {
    const r = await fetch(url, { cache: "no-store" });
    const data = await r.json();

    return res.status(200).json(data.results || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}