import React, { useState } from 'react';
import { useEstablishment, type ServiceItem } from '../context/EstablishmentContext';
import { Save, Plus, Trash2, Edit2, X, Check, Building2, Grid } from 'lucide-react';

const Settings: React.FC = () => {
  const { 
    settings,
    updateSettings,
    beachPrices, 
    serviceMenu, 
    updateBeachPrice, 
    addServiceItem, 
    updateServiceItem, 
    deleteServiceItem 
  } = useEstablishment();

  // State for Service Item Form
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Omit<ServiceItem, 'id'>>({
    name: '',
    category: 'bar',
    price: 0
  });

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<Partial<ServiceItem>>({});

  const handleAddService = () => {
    if (newService.name && newService.price > 0) {
      addServiceItem(newService);
      setNewService({ name: '', category: 'bar', price: 0 });
      setIsAddingService(false);
    }
  };

  const startEditing = (item: ServiceItem) => {
    setEditingServiceId(item.id);
    setEditServiceForm(item);
  };

  const saveEditing = () => {
    if (editingServiceId && editServiceForm.name) {
      updateServiceItem(editingServiceId, editServiceForm);
      setEditingServiceId(null);
      setEditServiceForm({});
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Impostazioni & Listini</h2>

      {/* Establishment Settings Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <Building2 size={24} />
          </span>
          Dati Stabilimento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Stabilimento</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => updateSettings({ ...settings, name: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">File (Righe)</label>
              <input
                type="number"
                value={settings.rows}
                onChange={(e) => updateSettings({ ...settings, rows: parseInt(e.target.value) || 1 })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                min="1"
                max="26"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ombrelloni per Fila</label>
              <input
                type="number"
                value={settings.cols}
                onChange={(e) => updateSettings({ ...settings, cols: parseInt(e.target.value) || 1 })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                min="1"
                max="50"
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
          <Grid size={16} />
          Modificando le dimensioni della griglia, la mappa verrà rigenerata.
        </p>
      </section>

      {/* Beach Prices Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-blue-100 p-2 rounded-lg text-blue-600">🏖️</span>
          Listino Spiaggia (Giornaliero)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beachPrices.map((rule) => (
            <div key={rule.rowLabel} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Fila</span>
                <p className="text-2xl font-bold text-gray-800">{rule.rowLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">€</span>
                <input
                  type="number"
                  value={rule.dailyPrice}
                  onChange={(e) => updateBeachPrice(rule.rowLabel, parseFloat(e.target.value) || 0)}
                  className="w-20 p-2 border rounded-md text-right font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  step="0.50"
                  min="0"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Menu Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-orange-100 p-2 rounded-lg text-orange-600">☕</span>
            Listino Bar & Ristorante
          </h3>
          <button 
            onClick={() => setIsAddingService(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Aggiungi Prodotto
          </button>
        </div>

        {isAddingService && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Prodotto</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Es. Coca Cola"
              />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value as any })}
                className="w-full p-2 border rounded-md"
              >
                <option value="bar">Bar</option>
                <option value="restaurant">Ristorante</option>
                <option value="other">Altro</option>
              </select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€)</label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded-md"
                step="0.10"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddService} className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <Save size={20} />
              </button>
              <button onClick={() => setIsAddingService(false)} className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 pl-2 font-semibold text-gray-600">Prodotto</th>
                <th className="pb-3 font-semibold text-gray-600">Categoria</th>
                <th className="pb-3 font-semibold text-gray-600">Prezzo</th>
                <th className="pb-3 pr-2 text-right font-semibold text-gray-600">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {serviceMenu.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 group">
                  <td className="py-3 pl-2">
                    {editingServiceId === item.id ? (
                      <input
                        type="text"
                        value={editServiceForm.name || ''}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                        className="p-1 border rounded w-full"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{item.name}</span>
                    )}
                  </td>
                  <td className="py-3">
                    {editingServiceId === item.id ? (
                      <select
                        value={editServiceForm.category || 'bar'}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, category: e.target.value as any })}
                        className="p-1 border rounded"
                      >
                        <option value="bar">Bar</option>
                        <option value="restaurant">Ristorante</option>
                        <option value="other">Altro</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.category === 'bar' ? 'bg-purple-100 text-purple-700' :
                        item.category === 'restaurant' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-mono">
                    {editingServiceId === item.id ? (
                      <input
                        type="number"
                        value={editServiceForm.price || 0}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, price: parseFloat(e.target.value) })}
                        className="p-1 border rounded w-20"
                        step="0.10"
                      />
                    ) : (
                      `€ ${item.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingServiceId === item.id ? (
                        <>
                          <button onClick={saveEditing} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Check size={18} />
                          </button>
                          <button onClick={() => setEditingServiceId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => deleteServiceItem(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Settings;
