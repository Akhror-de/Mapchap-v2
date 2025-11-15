const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let ads = [{
  id: 1,
  name: 'Test Ad',
  description: 'Тестовое предложение',
  category: 'food',
  lat: 55.751244,
  lng: 37.618423,
  likes: 5,
  views: 100,
  createdAt: new Date().toISOString()
}];

// ✅ СУЩЕСТВУЮЩИЕ ENDPOINTS - БЕЗ ИЗМЕНЕНИЙ
app.get('/', (req, res) => {
  res.json({ status: "OK", service: "MapChap API" });
});

app.get("/ads", (req, res) => {
  res.json(ads);
});

app.post("/ads", (req, res) => {
  try {
    const { name, description, category, lat, lng } = req.body;
    if (!name || !category || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newAd = {
      id: Date.now(),
      name: name,
      description: description || '',
      category: category,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString()
    };
    ads.push(newAd);
    res.status(201).json(newAd);
  } catch (error) {
    console.error('Error in POST /ads:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.patch("/ads/:id", (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    const { likes, views } = req.body;
    const adIndex = ads.findIndex(ad => ad.id === adId);
    if (adIndex === -1) return res.status(404).json({ error: 'Ad not found' });
    if (likes !== undefined) ads[adIndex].likes += parseInt(likes);
    if (views !== undefined) ads[adIndex].views += parseInt(views);
    res.json(ads[adIndex]);
  } catch (error) {
    console.error('Error in PATCH /ads/:id:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// 🆕 НОВЫЕ ENDPOINTS - ДОБАВЛЯЕМ В КОНЕЦ
app.post("/ads/:id/like", (req, res) => {
  try {
    const adId = parseInt(req.params.id);
    const adIndex = ads.findIndex(ad => ad.id === adId);
    if (adIndex === -1) return res.status(404).json({ error: 'Ad not found' });
    
    ads[adIndex].likes += 1;
    res.json(ads[adIndex]);
  } catch (error) {
    console.error('Error in POST /ads/:id/like:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.get("/stats", (req, res) => {
  const stats = {
    totalOffers: ads.length,
    totalLikes: ads.reduce((sum, ad) => sum + ad.likes, 0),
    totalViews: ads.reduce((sum, ad) => sum + ad.views, 0),
    activeUsers: 142
  };
  res.json(stats);
});

module.exports = app;
