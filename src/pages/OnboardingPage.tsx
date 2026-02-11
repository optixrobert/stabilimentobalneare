import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstablishment } from '../context/EstablishmentContext';
import { Store, Map, ArrowRight, Check } from 'lucide-react';
import { clsx } from 'clsx';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useEstablishment();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: settings.name || '',
    address: settings.address || '',
    city: settings.city || '',
    phone: settings.phone || '',
    rows: settings.rows || 6,
    cols: settings.cols || 10
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rows' || name === 'cols' ? parseInt(value) || 0 : value
    }));
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save everything
      await updateSettings({
        ...formData,
        isSetupCompleted: true
      });
      navigate('/app');
    } catch (error) {
      console.error('Onboarding failed', error);
      alert('Failed to save setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Benvenuto in Lido Manager
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Configuriamo il tuo stabilimento in pochi passi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={clsx("text-xs font-semibold", step >= 1 ? "text-blue-600" : "text-gray-400")}>Dettagli</span>
              <span className={clsx("text-xs font-semibold", step >= 2 ? "text-blue-600" : "text-gray-400")}>Mappa</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-300" 
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Stabilimento</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="Lido La Playa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Indirizzo</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                  placeholder="Via Roma 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Città</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                    placeholder="Rimini"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefono</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                    placeholder="333 1234567"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continua <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <Map className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Configura la Spiaggia</h3>
                <p className="text-sm text-gray-500">Definisci le dimensioni della griglia ombrelloni</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numero di File</label>
                  <input
                    type="number"
                    name="rows"
                    min="1"
                    max="26"
                    value={formData.rows}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                  />
                  <p className="mt-1 text-xs text-gray-500">Da A a {String.fromCharCode(64 + (formData.rows || 1))}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ombrelloni per Fila</label>
                  <input
                    type="number"
                    name="cols"
                    min="1"
                    max="50"
                    value={formData.cols}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  Verrà generata una griglia di <strong>{formData.rows * formData.cols}</strong> ombrelloni totali.
                  Potrai modificare questa configurazione in seguito dalle impostazioni.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Indietro
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Salvataggio...' : 'Completa Setup'} <Check className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
