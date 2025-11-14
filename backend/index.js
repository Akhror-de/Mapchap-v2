import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Подключение к Yandex StoreDoc
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to Yandex StoreDoc')
  } catch (error) {
    console.error('❌ StoreDoc connection error:', error)
    process.exit(1)
  }
}

connectDB()

// Модель для предложений
const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    required: true,
    enum: ['food', 'entertainment', 'shopping', 'services', 'other']
  },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  userId: { type: String, default: '' },
  userName: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Offer = mongoose.model('Offer', offerSchema)

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  })
})

// Получить все предложения
app.get('/api/offers', async (req, res) => {
  try {
    const { category, lat, lng, radius = 10 } = req.query
    
    let query = {}
    
    // Фильтр по категории
    if (category && category !== 'all') {
      query.category = category
    }
    
    // Фильтр по расстоянию (базовый)
    if (lat && lng) {
      // StoreDoc не поддерживает гео-запросы напрямую, 
      // поэтому сначала получаем все, потом фильтруем на бэкенде
    }
    
    const offers = await Offer.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
    
    res.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Создать новое предложение
app.post('/api/offers', async (req, res) => {
  try {
    const { title, description, category, lat, lng, userId, userName } = req.body
    
    if (!title || !category || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    const newOffer = new Offer({
      title,
      description: description || '',
      category,
      lat,
      lng,
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous'
    })
    
    const savedOffer = await newOffer.save()
    res.status(201).json(savedOffer)
    
  } catch (error) {
    console.error('Error creating offer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Обновить предложение (лайки, просмотры)
app.patch('/api/offers/:id', async (req, res) => {
  try {
    const { likes, views } = req.body
    const updateData = { updatedAt: new Date() }
    
    if (likes !== undefined) updateData.likes = likes
    if (views !== undefined) updateData.views = views
    
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    
    if (!updatedOffer) {
      return res.status(404).json({ error: 'Offer not found' })
    }
    
    res.json(updatedOffer)
  } catch (error) {
    console.error('Error updating offer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Удалить предложение
app.delete('/api/offers/:id', async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id)
    
    if (!deletedOffer) {
      return res.status(404).json({ error: 'Offer not found' })
    }
    
    res.json({ message: 'Offer deleted successfully' })
  } catch (error) {
    console.error('Error deleting offer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`)
})
