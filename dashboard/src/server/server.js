import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/salesRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import storeRoutes from './routes/storeRoutes.js';

const app = express();

// 🔥 Corrige o CORS
app.use(cors({
  origin: 'http://localhost:3000', // endereço do seu frontend React
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.use('/api/sales-summary', salesRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stores', storeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
