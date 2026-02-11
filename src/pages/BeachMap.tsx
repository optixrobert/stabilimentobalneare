import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { Umbrella, Info, X, Sun, Plus, Minus } from 'lucide-react';
import { useEstablishment, type UmbrellaStatus, type UmbrellaSpot } from '../context/EstablishmentContext';

const BeachMap: React.FC = () => {
  const { settings, umbrellaSpots, updateUmbrellaStatus, updateUmbrellaSunbeds, getUmbrellaPrice } = useEstablishment();
  const [selectedSpot, setSelectedSpot] = useState<UmbrellaSpot | null>(null);

  // Group spots by row for better layout control
  const rows = useMemo(() => {
    const grouped: Record<string, UmbrellaSpot[]> = {};
    umbrellaSpots.forEach(spot => {
      if (!grouped[spot.row]) grouped[spot.row] = [];
      grouped[spot.row].push(spot);
    });
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  }, [umbrellaSpots]);

  const getStatusStyles = (status: UmbrellaStatus) => {
    switch (status) {
      case 'free': return {
        wrapper: 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md',
        icon: 'text-blue-400',
        text: 'text-blue-900'
      };
      case 'occupied': return {
        wrapper: 'bg-red-50 border-red-200 hover:border-red-400',
        icon: 'text-red-500',
        text: 'text-red-900'
      };
      case 'reserved': return {
        wrapper: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
        icon: 'text-yellow-600',
        text: 'text-yellow-900'
      };
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold text-gray-800">{settings.name} - Mappa Spiaggia</h2>
        <div className="flex gap-6 text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-200"></div>
            <span className="text-gray-600">Libero</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-50 border-2 border-red-200"></div>
            <span className="text-gray-600">Occupato</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-50 border-2 border-yellow-200"></div>
            <span className="text-gray-600">Prenotato</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#f5e6c8] rounded-xl shadow-inner border border-[#e6d5b0] overflow-hidden flex flex-col relative">
        {/* Sea Area */}
        <div className="h-32 bg-gradient-to-b from-blue-500 to-blue-400 w-full shrink-0 relative overflow-hidden">
            <div className="absolute bottom-0 w-full h-4 bg-[#f5e6c8] rounded-t-[50%] scale-x-150 opacity-80 translate-y-2"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/30 text-4xl font-black tracking-[1em]">MARE</span>
            </div>
        </div>

        {/* Sand Area / Grid */}
        <div className="flex-1 overflow-auto p-8">
            <div className="flex flex-col gap-8 min-w-max pb-20">
                {rows.map(([rowLabel, spots]) => (
                    <div key={rowLabel} className="flex items-center gap-6">
                        {/* Row Label */}
                        <div className="w-12 h-12 flex items-center justify-center bg-[#e6d5b0] rounded-full text-[#8c7e60] font-bold text-xl shadow-inner">
                            {rowLabel}
                        </div>
                        
                        {/* Spots in this row */}
                        <div className="flex gap-4">
                            {spots.map((spot) => {
                                const styles = getStatusStyles(spot.status);
                                return (
                                    <button
                                        key={spot.id}
                                        onClick={() => setSelectedSpot(spot)}
                                        className={clsx(
                                            "w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative group",
                                            styles.wrapper
                                        )}
                                    >
                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Info size={14} className="text-gray-400" />
                                        </div>
                                        <Umbrella className={clsx("w-8 h-8 drop-shadow-sm", styles.icon)} fill="currentColor" />
                                        <span className={clsx("font-bold text-sm", styles.text)}>{spot.number}</span>
                                        
                                        {/* Sunbeds visual indicator */}
                                        <div className="flex gap-1 mt-1 h-1.5 justify-center w-full px-2">
                                          {[...Array(spot.sunbeds)].map((_, i) => (
                                            <div key={i} className="flex-1 bg-gray-300 rounded-full shadow-sm max-w-[12px]"></div>
                                          ))}
                                          {spot.sunbeds === 0 && <div className="w-1 h-1 rounded-full bg-gray-200/50"></div>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Ombrellone {selectedSpot.id}</h3>
                    <p className="text-gray-500">Fila {selectedSpot.row}</p>
                </div>
                <button 
                    onClick={() => setSelectedSpot(null)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} className="text-gray-400" />
                </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Prezzo Giornaliero</span>
                <span className="text-xl font-bold text-blue-600">€ {getUmbrellaPrice(selectedSpot.row).toFixed(2)}</span>
            </div>

            {/* Sunbed Controls */}
            <div className="bg-orange-50 p-4 rounded-xl mb-6 border border-orange-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-orange-800 font-bold">
                  <Sun size={20} />
                  <span>Lettini Assegnati</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{selectedSpot.sunbeds}/2</span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const newValue = Math.max(0, selectedSpot.sunbeds - 1);
                    updateUmbrellaSunbeds(selectedSpot.id, newValue);
                    setSelectedSpot(prev => prev ? { ...prev, sunbeds: newValue } : null);
                  }}
                  disabled={selectedSpot.sunbeds === 0}
                  className="flex-1 py-2 bg-white border border-orange-200 rounded-lg text-orange-700 hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-white transition-colors flex justify-center items-center"
                >
                  <Minus size={20} />
                </button>
                <button 
                  onClick={() => {
                    const newValue = Math.min(2, selectedSpot.sunbeds + 1);
                    updateUmbrellaSunbeds(selectedSpot.id, newValue);
                    setSelectedSpot(prev => prev ? { ...prev, sunbeds: newValue } : null);
                  }}
                  disabled={selectedSpot.sunbeds === 2}
                  className="flex-1 py-2 bg-white border border-orange-200 rounded-lg text-orange-700 hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-white transition-colors flex justify-center items-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        className={clsx(
                            "py-3 px-4 rounded-xl font-bold transition-all border-2",
                            selectedSpot.status === 'free' 
                                ? "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200 ring-offset-2" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50"
                        )}
                        onClick={() => {
                            updateUmbrellaStatus(selectedSpot.id, 'free');
                            setSelectedSpot(null);
                        }}
                    >
                        Libero
                    </button>
                    <button 
                        className={clsx(
                            "py-3 px-4 rounded-xl font-bold transition-all border-2",
                            selectedSpot.status === 'occupied' 
                                ? "bg-red-100 border-red-500 text-red-700 ring-2 ring-red-200 ring-offset-2" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50"
                        )}
                        onClick={() => {
                            updateUmbrellaStatus(selectedSpot.id, 'occupied');
                            setSelectedSpot(null);
                        }}
                    >
                        Occupato
                    </button>
                </div>
                <button 
                    className={clsx(
                        "w-full py-3 px-4 rounded-xl font-bold transition-all border-2",
                        selectedSpot.status === 'reserved' 
                            ? "bg-yellow-100 border-yellow-500 text-yellow-700 ring-2 ring-yellow-200 ring-offset-2" 
                            : "bg-white border-gray-200 text-gray-600 hover:border-yellow-300 hover:bg-yellow-50"
                    )}
                    onClick={() => {
                        updateUmbrellaStatus(selectedSpot.id, 'reserved');
                        setSelectedSpot(null);
                    }}
                >
                    Prenotato
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeachMap;
