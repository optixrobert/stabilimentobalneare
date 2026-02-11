import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const Services: React.FC = () => {
  const orders = [
    { id: 1, umbrella: 'A12', items: ['2x Spritz', '1x Patatine'], status: 'pending', time: '12:30' },
    { id: 2, umbrella: 'B04', items: ['1x Acqua Nat.', '1x Caffè'], status: 'completed', time: '12:15' },
    { id: 3, umbrella: 'C01', items: ['2x Club Sandwich', '2x Coca Cola'], status: 'processing', time: '12:40' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Ordini e Servizi</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Nuovo Ordine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 px-3 py-1 rounded-lg">
                <span className="font-bold text-gray-700">Ombrellone {order.umbrella}</span>
              </div>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} /> {order.time}
              </span>
            </div>

            <ul className="space-y-2 mb-6">
              {order.items.map((item, idx) => (
                <li key={idx} className="text-gray-600">• {item}</li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status === 'completed' ? 'Completato' :
                 order.status === 'processing' ? 'In Preparazione' :
                 'In Attesa'}
              </span>
              
              <div className="flex gap-2">
                {order.status !== 'completed' && (
                  <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
