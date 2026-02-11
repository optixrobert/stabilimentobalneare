import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

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
  row: string; // Mapped from rowLabel from API
  number: number;
  status: UmbrellaStatus;
  sunbeds: number;
}

interface EstablishmentSettings {
  name: string;
  rows: number;
  cols: number;
  address?: string;
  city?: string;
  phone?: string;
  isSetupCompleted?: boolean;
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

// Helper to generate local grid (fallback)
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
  const { token, isAuthenticated } = useAuth();
  
  // Settings
  const [settings, setSettings] = useState<EstablishmentSettings>({
    name: 'Lido Manager',
    rows: 6,
    cols: 10
  });

  // Grid State
  const [umbrellaSpots, setUmbrellaSpots] = useState<UmbrellaSpot[]>([]);

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

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load Data from API
  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Fallback to local defaults if not logged in (e.g. demo mode or just empty)
      setUmbrellaSpots(generateGrid(6, 10));
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Settings
        const settingsRes = await fetch(`${API_URL}/settings`, { headers });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings({
                name: settingsData.name,
                rows: settingsData.rows,
                cols: settingsData.cols,
                address: settingsData.address,
                city: settingsData.city,
                phone: settingsData.phone,
                isSetupCompleted: settingsData.isSetupCompleted
              });

          // 2. Fetch Umbrellas (after settings to know size, or just fetch all)
          const umbrellasRes = await fetch(`${API_URL}/umbrellas`, { headers });
          if (umbrellasRes.ok) {
            const umbrellasData = await umbrellasRes.json();
            
            if (umbrellasData.length === 0) {
              // If empty, sync/init
              const syncRes = await fetch(`${API_URL}/umbrellas/sync`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ rows: settingsData.rows, cols: settingsData.cols })
              });
              const syncedData = await syncRes.json();
              setUmbrellaSpots(mapApiUmbrellas(syncedData));
            } else {
              setUmbrellaSpots(mapApiUmbrellas(umbrellasData));
            }
          }
        }
        
        // 3. Fetch Transactions (Optional for now)
         const transactionsRes = await fetch(`${API_URL}/transactions`, { headers });
         if (transactionsRes.ok) {
           setTransactions(await transactionsRes.json());
         }

      } catch (error) {
        console.error("Failed to fetch establishment data", error);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const mapApiUmbrellas = (data: any[]): UmbrellaSpot[] => {
    return data.map(item => ({
      id: item.id,
      row: item.rowLabel,
      number: item.number,
      status: item.status as UmbrellaStatus,
      sunbeds: item.sunbeds
    }));
  };

  const updateSettings = async (newSettings: EstablishmentSettings) => {
    setSettings(newSettings); // Optimistic update
    
    if (token) {
      try {
        await fetch(`${API_URL}/settings`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newSettings)
        });
        // Trigger grid sync/resize if needed
        // For now, we rely on page refresh or explicit sync logic.
        // Ideally: call sync endpoint again.
        await fetch(`${API_URL}/umbrellas/sync`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ rows: newSettings.rows, cols: newSettings.cols })
        });
        // Reload spots
        const umbrellasRes = await fetch(`${API_URL}/umbrellas`, { headers: { Authorization: `Bearer ${token}` } });
        if (umbrellasRes.ok) {
            setUmbrellaSpots(mapApiUmbrellas(await umbrellasRes.json()));
        }

      } catch (error) {
        console.error("Failed to update settings", error);
      }
    }
  };

  const updateUmbrellaStatus = async (id: string, status: UmbrellaStatus) => {
    // Optimistic update
    setUmbrellaSpots(prev => prev.map(spot => spot.id === id ? { ...spot, status } : spot));

    if (token) {
      try {
        await fetch(`${API_URL}/umbrellas/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
      } catch (error) {
        console.error("Failed to update umbrella status", error);
      }
    }
  };

  const updateUmbrellaSunbeds = async (id: string, count: number) => {
    const newCount = Math.max(0, Math.min(2, count));
    // Optimistic
    setUmbrellaSpots(prev => prev.map(spot => spot.id === id ? { ...spot, sunbeds: newCount } : spot));

    if (token) {
      try {
        await fetch(`${API_URL}/umbrellas/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ sunbeds: newCount })
        });
      } catch (error) {
        console.error("Failed to update umbrella sunbeds", error);
      }
    }
  };

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

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    // Optimistic (temp ID)
    const tempId = Math.random().toString(36).substr(2, 9);
    const newTransaction: Transaction = {
      ...transaction,
      id: tempId,
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    if (token) {
        try {
            const res = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(transaction)
            });
            if (res.ok) {
                const savedTx = await res.json();
                // Replace temp transaction with real one
                setTransactions(prev => prev.map(t => t.id === tempId ? savedTx : t));
            }
        } catch (error) {
            console.error("Failed to save transaction", error);
        }
    }
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
