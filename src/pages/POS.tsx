import React, { useState, useMemo } from 'react';
import { useEstablishment } from '../context/EstablishmentContext';
import { ShoppingCart, Coffee, Umbrella, Trash2, Plus, Minus, Search, Ship, CreditCard } from 'lucide-react';
import { clsx } from 'clsx';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'umbrella' | 'service';
  referenceId?: string; // For umbrella ID or original product ID
}

const POS: React.FC = () => {
  const { 
    serviceMenu, 
    umbrellaSpots, 
    getUmbrellaPrice, 
    updateUmbrellaStatus,
    addTransaction
  } = useEstablishment();

  const [activeTab, setActiveTab] = useState<'bar' | 'beach' | 'services'>('bar');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // --- Cart Logic ---
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Process beach items: mark umbrellas as occupied
    cart.forEach(item => {
      if (item.type === 'umbrella' && item.referenceId) {
        updateUmbrellaStatus(item.referenceId, 'occupied');
      }
    });

    // Add transaction to history
    addTransaction({
      items: cart,
      total: cartTotal,
      paymentMethod: 'cash', // Default to cash for now
    });

    alert(`Pagamento di € ${cartTotal.toFixed(2)} effettuato con successo!`);
    setCart([]);
  };

  // --- Filtering Logic ---
  const filteredProducts = useMemo(() => {
    return serviceMenu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'bar') {
        const isBarOrRestaurant = item.category === 'bar' || item.category === 'restaurant';
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return isBarOrRestaurant && matchesSearch && matchesCategory;
      }
      
      if (activeTab === 'services') {
        return item.category === 'service' && matchesSearch;
      }

      return false;
    });
  }, [serviceMenu, searchQuery, selectedCategory, activeTab]);

  const freeUmbrellas = useMemo(() => {
    return umbrellaSpots.filter(spot => spot.status === 'free');
  }, [umbrellaSpots]);

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4 overflow-hidden">
      {/* LEFT: Selection Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('bar')}
            className={clsx(
              "flex-1 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-colors",
              activeTab === 'bar' ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Coffee size={20} /> Bar & Ristorante
          </button>
          <button
            onClick={() => setActiveTab('beach')}
            className={clsx(
              "flex-1 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-colors",
              activeTab === 'beach' ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Umbrella size={20} /> Spiaggia
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={clsx(
              "flex-1 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-colors",
              activeTab === 'services' ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Ship size={20} /> Servizi Extra
          </button>
        </div>

        {/* Filters (Bar Only) */}
        {activeTab === 'bar' && (
          <div className="p-4 border-b flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cerca prodotto..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={clsx("px-4 py-2 rounded-lg text-sm font-medium", selectedCategory === 'all' ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600")}
              >
                Tutti
              </button>
              <button 
                onClick={() => setSelectedCategory('bar')}
                className={clsx("px-4 py-2 rounded-lg text-sm font-medium", selectedCategory === 'bar' ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600")}
              >
                Bar
              </button>
              <button 
                onClick={() => setSelectedCategory('restaurant')}
                className={clsx("px-4 py-2 rounded-lg text-sm font-medium", selectedCategory === 'restaurant' ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600")}
              >
                Ristorante
              </button>
            </div>
          </div>
        )}

        {/* Filters (Services Only) */}
        {activeTab === 'services' && (
          <div className="p-4 border-b flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cerca servizio..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {activeTab === 'bar' || activeTab === 'services' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart({
                    id: `prod-${product.id}`,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    type: activeTab === 'services' ? 'service' : 'product',
                    referenceId: product.id
                  })}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all text-left flex flex-col justify-between h-32 active:scale-95"
                >
                  <span className="font-bold text-gray-800 line-clamp-2">{product.name}</span>
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-blue-600">€ {product.price.toFixed(2)}</span>
                    <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                      <Plus size={16} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-gray-700 mb-4">Ombrelloni Liberi</h3>
              <div 
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(80px, 1fr))` }}
              >
                {freeUmbrellas.map(spot => {
                  const price = getUmbrellaPrice(spot.row);
                  return (
                    <button
                      key={spot.id}
                      onClick={() => addToCart({
                        id: `spot-${spot.id}`,
                        name: `Ombrellone ${spot.id}`,
                        price: price,
                        quantity: 1,
                        type: 'umbrella',
                        referenceId: spot.id
                      })}
                      className="bg-green-50 border-2 border-green-200 p-3 rounded-xl hover:bg-green-100 hover:border-green-400 transition-all flex flex-col items-center gap-1 active:scale-95"
                    >
                      <Umbrella size={24} className="text-green-600" />
                      <span className="font-bold text-gray-800">{spot.id}</span>
                      <span className="text-xs font-bold text-green-700">€{price}</span>
                    </button>
                  );
                })}
              </div>
              {freeUmbrellas.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Nessun ombrellone libero disponibile.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Cart Area */}
      <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" />
            Carrello
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Il carrello è vuoto</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-blue-600 font-bold text-sm">€ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button 
                      onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t rounded-b-xl space-y-4">
          <div className="flex justify-between items-center text-gray-600">
            <span>Subtotale</span>
            <span>€ {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
            <span>Totale</span>
            <span>€ {cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <CreditCard size={24} />
            Paga Ora
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
