import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = 'gxow56tybimzulve3j9djm1iz0jlop';
const CLIENT_SECRET = 'w2n3ot796od289xd7m6uqlzn7jxoqm';

let accessToken = '';
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();
  if (!accessToken || now >= tokenExpiry) {
    try {
      const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
        method: 'POST',
        timeout: 10000,
      });
      if (!res.ok) throw new Error(`Token error: ${res.status}`);
      const data = await res.json();
      accessToken = data.access_token;
      tokenExpiry = now + data.expires_in * 1000 - 60000;
    } catch (err) {
      console.error('❌ Error getting token:', err.message);
      throw err;
    }
  }
  return accessToken;
}

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) {
        if (res.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res;
    } catch (err) {
      console.warn(`⚠️ Retry ${i + 1}/${retries} for ${url}:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

app.get('/api/games', async (req, res) => {
  try {
    const category = req.query.category || 'popular';
    const token = await getAccessToken();
    const now = Math.floor(Date.now() / 1000);
    let bodyQuery = '';

    if (category === 'upcoming') {
      bodyQuery = `
        fields name, summary, cover.url, genres.name, first_release_date;
        where first_release_date > ${now};
        sort first_release_date asc;
        limit 20;
      `;
    } else if (category === 'top100') {
      bodyQuery = `
        fields name, summary, cover.url, genres.name, first_release_date, rating, total_rating_count;
        where rating != null & total_rating_count > 1000;
        sort rating desc;
        limit 100;
      `;
    } else if (category === 'ps5') {
      bodyQuery = `
        fields name, summary, cover.url, genres.name, first_release_date, rating;
        where platforms = 167;
        sort rating desc;
        limit 20;
      `;
    } else if (category === 'xbox') {
      bodyQuery = `
        fields name, summary, cover.url, genres.name, first_release_date, rating;
        where platforms = 49;
        sort rating desc;
        limit 20;
      `;
    } else if (category === 'nintendo') {
      bodyQuery = `
        fields name, summary, cover.url, genres.name, first_release_date, rating;
        where platforms = 130;
        sort rating desc;
        limit 20;
      `;
    } else {
      bodyQuery = `
        fields name, summary, cover.url, genres.name, first_release_date, hypes;
        where hypes > 0;
        sort hypes desc;
        limit 20;
      `;
    }

    console.log(`🔍 Querying IGDB for category '${category}':\n${bodyQuery}`);
    const response = await fetchWithRetry('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: bodyQuery,
    });

    const data = await response.json();
    console.log(`✅ IGDB returned ${data.length} games for category '${category}'`);
    res.json(data);
  } catch (err) {
    console.error('❌ Full error in /api/games:', err.message);
    res.status(500).json({ error: 'Failed to fetch games. Intenta más tarde.' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getAccessToken();
    const bodyQuery = `
      fields name, summary, cover.url, genres.name, first_release_date, rating, involved_companies.company.name, videos.video_id, screenshots.url;
      where id = ${id};
      limit 1;
    `;

    console.log(`🔍 Querying IGDB for game ID '${id}':\n${bodyQuery}`);
    const response = await fetchWithRetry('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: bodyQuery,
    });

    const data = await response.json();
    if (data.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado.' });
    }

    console.log(`✅ IGDB returned game data for ID '${id}'`);
    res.json(data[0]);
  } catch (err) {
    console.error('❌ Error in /api/games/:id:', err.message);
    res.status(500).json({ error: 'Failed to fetch game details. Intenta más tarde.' });
  }
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));