import React from 'react';
import { Users, Umbrella, DollarSign, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panoramica Giornaliera</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Lettini Occupati" 
          value="124/200" 
          icon={Umbrella} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Presenze Totali" 
          value="342" 
          icon={Users} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Incasso Oggi" 
          value="€ 2.450" 
          icon={DollarSign} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Ordini Servizi" 
          value="45" 
          icon={TrendingUp} 
          color="bg-purple-500" 
        />
      </div>

      {/* Recent Activity or Quick Actions could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Ultime Prenotazioni</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {i}
                  </div>
                  <div>
                    <p className="font-medium">Mario Rossi</p>
                    <p className="text-sm text-gray-500">Ombrellone A{i}</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Confermato</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
