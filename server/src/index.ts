import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import { authenticateToken, AuthRequest } from './middleware/auth';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://iltuostabilimentobalneare.com',
  'https://www.iltuostabilimentobalneare.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
// All routes below this line require a valid JWT token
app.use('/api', authenticateToken);

// Admin Routes
app.use('/api/admin', adminRoutes);

// --- Protected API Endpoints (User Scoped) ---

// 1. Establishment Settings
app.get('/api/settings', async (req: any, res) => {
  const userId = req.user.userId;
  try {
    let settings = await prisma.establishmentSettings.findUnique({ where: { userId } });
    
    // If no settings exist yet (shouldn't happen due to signup hook, but just in case)
    if (!settings) {
       settings = await prisma.establishmentSettings.create({
         data: { userId, name: 'Lido Manager', rows: 6, cols: 10 }
       });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req: any, res) => {
  const userId = req.user.userId;
  const { name, rows, cols } = req.body;
  try {
    const updated = await prisma.establishmentSettings.update({
      where: { userId },
      data: { name, rows, cols }
    });
    // Trigger grid update logic here if needed? 
    // For now, client handles grid regen request or we do it lazily.
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// 2. Umbrella Spots (Grid)
app.get('/api/umbrellas', async (req: any, res) => {
  const userId = req.user.userId;
  const spots = await prisma.umbrellaSpot.findMany({ where: { userId } });
  res.json(spots);
});

// Sync/Init Grid (Idempotent)
app.post('/api/umbrellas/sync', async (req: any, res) => {
  const userId = req.user.userId;
  const { rows, cols } = req.body; // Client tells us intended size, or we fetch from settings

  // Basic logic: generate missing spots. 
  // Real implementation: sync diff. 
  // Simplified: If empty, create.
  
  const count = await prisma.umbrellaSpot.count({ where: { userId } });
  if (count === 0) {
    const grid = [];
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        grid.push({
          id: `${userId}_${rowLabels[r]}${c}`, // Unique ID strategy
          rowLabel: rowLabels[r],
          number: c,
          status: 'free',
          sunbeds: 0,
          userId
        });
      }
    }
    await prisma.umbrellaSpot.createMany({ data: grid });
    const newSpots = await prisma.umbrellaSpot.findMany({ where: { userId } });
    res.json(newSpots);
  } else {
    // If grid exists, return it (ignoring resize logic for this MVP step)
    const spots = await prisma.umbrellaSpot.findMany({ where: { userId } });
    res.json(spots);
  }
});

app.put('/api/umbrellas/:row/:number', async (req: any, res) => {
  const userId = req.user.userId;
  const { row, number } = req.params;
  const { status, sunbeds } = req.body;
  
  try {
    // Find the spot by composite key logic
    const spot = await prisma.umbrellaSpot.findFirst({
      where: { userId, rowLabel: row, number: parseInt(number) }
    });

    if (!spot) {
      res.status(404).json({ error: 'Spot not found' });
      return;
    }

    const updated = await prisma.umbrellaSpot.update({
      where: { id: spot.id },
      data: { 
        ...(status && { status }),
        ...(sunbeds !== undefined && { sunbeds })
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update umbrella' });
  }
});

// 3. Transactions
app.get('/api/transactions', async (req: any, res) => {
  const userId = req.user.userId;
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { date: 'desc' }
  });
  res.json(transactions);
});

app.post('/api/transactions', async (req: any, res) => {
  const userId = req.user.userId;
  const { items, total, paymentMethod } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        total,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type
          }))
        }
      },
      include: { items: true }
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
