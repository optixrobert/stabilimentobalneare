import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Umbrella, Coffee, Settings, Menu, Store, Receipt } from 'lucide-react';
import { clsx } from 'clsx';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/pos', label: 'Cassa Touch', icon: Store },
    { path: '/app/map', label: 'Mappa Spiaggia', icon: Umbrella },
    { path: '/app/services', label: 'Servizi', icon: Coffee },
    { path: '/app/transactions', label: 'Transazioni', icon: Receipt },
    { path: '/app/settings', label: 'Impostazioni', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "bg-white shadow-md transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {isSidebarOpen && <h1 className="font-bold text-xl text-blue-600">Lido Manager</h1>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                location.pathname === item.path 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
