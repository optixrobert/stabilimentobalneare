import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Routes ---

// 1. Establishment Settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.establishmentSettings.findFirst();
    res.json(settings || { name: 'Lido Manager', rows: 6, cols: 10 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// 2. Umbrella Spots (Grid)
app.get('/api/umbrellas', async (req, res) => {
  const spots = await prisma.umbrellaSpot.findMany();
  res.json(spots);
});

app.put('/api/umbrellas/:id', async (req, res) => {
  const { id } = req.params;
  const { status, sunbeds } = req.body;
  try {
    const updated = await prisma.umbrellaSpot.update({
      where: { id },
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
app.get('/api/transactions', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    include: { items: true },
    orderBy: { date: 'desc' }
  });
  res.json(transactions);
});

app.post('/api/transactions', async (req, res) => {
  const { items, total, paymentMethod } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: {
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

// Seed Initial Data Endpoint (for dev convenience)
app.post('/api/seed', async (req, res) => {
  // Logic to populate initial grid if empty
  const count = await prisma.umbrellaSpot.count();
  if (count === 0) {
    const grid = [];
    const rows = 6; 
    const cols = 10;
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        grid.push({
          id: `${rowLabels[r]}${c}`,
          rowLabel: rowLabels[r],
          number: c,
          status: 'free',
          sunbeds: 0
        });
      }
    }
    
    await prisma.umbrellaSpot.createMany({ data: grid });
    res.json({ message: 'Seeded grid successfully' });
  } else {
    res.json({ message: 'Grid already exists' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
