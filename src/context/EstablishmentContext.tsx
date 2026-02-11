import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

export interface BeachPriceRule {
  rowLabel: string;
  dailyPrice: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'bar' | 'restaurant' | 'service' | 'other';
  price: number;
}

export type UmbrellaStatus = 'free' | 'occupied' | 'reserved';

export interface UmbrellaSpot {
  id: string;
  row: string;
  number: number;
  status: UmbrellaStatus;
  sunbeds: number; // 0, 1, or 2
}

interface EstablishmentSettings {
  name: string;
  rows: number;
  cols: number;
}

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'umbrella' | 'service';
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  items: TransactionItem[];
  total: number;
  paymentMethod: 'cash' | 'card';
}

interface EstablishmentContextType {
  // Establishment Settings
  settings: EstablishmentSettings;
  updateSettings: (newSettings: EstablishmentSettings) => void;
  
  // Beach Grid
  umbrellaSpots: UmbrellaSpot[];
  updateUmbrellaStatus: (id: string, status: UmbrellaStatus) => void;
  updateUmbrellaSunbeds: (id: string, count: number) => void;

  // Pricing
  beachPrices: BeachPriceRule[];
  serviceMenu: ServiceItem[];
  updateBeachPrice: (rowLabel: string, newPrice: number) => void;
  addServiceItem: (item: Omit<ServiceItem, 'id'>) => void;
  updateServiceItem: (id: string, item: Partial<ServiceItem>) => void;
  deleteServiceItem: (id: string) => void;
  getUmbrellaPrice: (row: string) => number;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const EstablishmentContext = createContext<EstablishmentContextType | undefined>(undefined);

// Helper to generate grid
const generateGrid = (rows: number, cols: number): UmbrellaSpot[] => {
  const grid: UmbrellaSpot[] = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      grid.push({
        id: `${rowLabels[r]}${c}`,
        row: rowLabels[r],
        number: c,
        status: 'free',
        sunbeds: 0
      });
    }
  }
  return grid;
};

export const EstablishmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState<EstablishmentSettings>({
    name: 'Lido Manager',
    rows: 6,
    cols: 10
  });

  // Grid State
  const [umbrellaSpots, setUmbrellaSpots] = useState<UmbrellaSpot[]>(() => generateGrid(6, 10));

  // Update grid when settings change (preserve status if possible, but simplest is regen for now or smart merge)
  useEffect(() => {
    setUmbrellaSpots(prevSpots => {
      const newGrid = generateGrid(settings.rows, settings.cols);
      // Try to preserve existing statuses
      return newGrid.map(newSpot => {
        const existing = prevSpots.find(p => p.id === newSpot.id);
        return existing ? { ...newSpot, status: existing.status, sunbeds: existing.sunbeds } : newSpot;
      });
    });
  }, [settings.rows, settings.cols]);

  const updateSettings = (newSettings: EstablishmentSettings) => {
    setSettings(newSettings);
  };

  const updateUmbrellaStatus = (id: string, status: UmbrellaStatus) => {
    setUmbrellaSpots(prev => prev.map(spot => spot.id === id ? { ...spot, status } : spot));
  };

  const updateUmbrellaSunbeds = (id: string, count: number) => {
    setUmbrellaSpots(prev => prev.map(spot => spot.id === id ? { ...spot, sunbeds: Math.max(0, Math.min(2, count)) } : spot));
  };

  // Prices State
  const [beachPrices, setBeachPrices] = useState<BeachPriceRule[]>([
    { rowLabel: 'A', dailyPrice: 30 },
    { rowLabel: 'B', dailyPrice: 25 },
    { rowLabel: 'C', dailyPrice: 20 },
    { rowLabel: 'D', dailyPrice: 15 },
    { rowLabel: 'E', dailyPrice: 15 },
    { rowLabel: 'F', dailyPrice: 10 },
  ]);

  const [serviceMenu, setServiceMenu] = useState<ServiceItem[]>([
    { id: '1', name: 'Caffè Espresso', category: 'bar', price: 1.50 },
    { id: '2', name: 'Cappuccino', category: 'bar', price: 2.00 },
    { id: '3', name: 'Acqua Naturale 0.5L', category: 'bar', price: 1.50 },
    { id: '4', name: 'Club Sandwich', category: 'restaurant', price: 12.00 },
    { id: '5', name: 'Insalata Mista', category: 'restaurant', price: 8.00 },
    { id: '6', name: 'Spritz Aperol', category: 'bar', price: 5.00 },
    { id: '7', name: 'Noleggio Kayak (1h)', category: 'service', price: 15.00 },
    { id: '8', name: 'Giro in Barca', category: 'service', price: 25.00 },
    { id: '9', name: 'Noleggio Pedalò (1h)', category: 'service', price: 12.00 },
  ]);

  const updateBeachPrice = (rowLabel: string, newPrice: number) => {
    setBeachPrices(prev => {
      const exists = prev.find(p => p.rowLabel === rowLabel);
      if (exists) {
        return prev.map(p => p.rowLabel === rowLabel ? { ...p, dailyPrice: newPrice } : p);
      }
      return [...prev, { rowLabel, dailyPrice: newPrice }];
    });
  };

  const addServiceItem = (item: Omit<ServiceItem, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setServiceMenu(prev => [...prev, newItem]);
  };

  const updateServiceItem = (id: string, updates: Partial<ServiceItem>) => {
    setServiceMenu(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteServiceItem = (id: string) => {
    setServiceMenu(prev => prev.filter(item => item.id !== id));
  };

  const getUmbrellaPrice = (row: string) => {
    const rule = beachPrices.find(p => p.rowLabel === row);
    return rule ? rule.dailyPrice : 0;
  };

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <EstablishmentContext.Provider value={{
      settings,
      updateSettings,
      umbrellaSpots,
      updateUmbrellaStatus,
      updateUmbrellaSunbeds,
      beachPrices,
      serviceMenu,
      updateBeachPrice,
      addServiceItem,
      updateServiceItem,
      deleteServiceItem,
      getUmbrellaPrice,
      transactions,
      addTransaction
    }}>
      {children}
    </EstablishmentContext.Provider>
  );
};

export const useEstablishment = () => {
  const context = useContext(EstablishmentContext);
  if (context === undefined) {
    throw new Error('useEstablishment must be used within a EstablishmentProvider');
  }
  return context;
};
