import React from 'react';
import { useEstablishment } from '../context/EstablishmentContext';
import { Banknote, TrendingUp, Calendar, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';

const Transactions: React.FC = () => {
  const { transactions } = useEstablishment();

  // --- Statistics Calculation ---
  const today = new Date().toISOString().split('T')[0];
  
  const todaysTransactions = transactions.filter(t => t.date.startsWith(today));
  const todaysTotal = todaysTransactions.reduce((sum, t) => sum + t.total, 0);
  
  const totalItemsSold = todaysTransactions.reduce((sum, t) => 
    sum + t.items.reduce((acc, item) => acc + item.quantity, 0)
  , 0);

  const averageTransaction = todaysTransactions.length > 0 
    ? todaysTotal / todaysTransactions.length 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Storico Transazioni</h2>
        <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-2 rounded-lg border">
          <Calendar size={18} />
          <span>Oggi, {new Date().toLocaleDateString('it-IT')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <Banknote size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Incasso Giornaliero</p>
            <h3 className="text-2xl font-bold text-gray-900">€ {todaysTotal.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <ShoppingBag size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Transazioni Oggi</p>
            <h3 className="text-2xl font-bold text-gray-900">{todaysTransactions.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-full text-purple-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Scontrino Medio</p>
            <h3 className="text-2xl font-bold text-gray-900">€ {averageTransaction.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Dettaglio Movimenti</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Nessuna transazione registrata.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Orario</th>
                  <th className="p-4 font-semibold">Articoli</th>
                  <th className="p-4 font-semibold">Metodo</th>
                  <th className="p-4 font-semibold text-right">Totale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">#{t.id}</td>
                    <td className="p-4 text-gray-700">
                      {new Date(t.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {t.items.map((item, idx) => (
                          <span key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={clsx(
                        "px-2 py-1 rounded text-xs font-bold uppercase",
                        t.paymentMethod === 'card' ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                      )}>
                        {t.paymentMethod === 'card' ? 'Carta' : 'Contanti'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900">
                      € {t.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
