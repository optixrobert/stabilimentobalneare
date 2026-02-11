import React from 'react';
import { Link } from 'react-router-dom';
import { Umbrella, Store, Smartphone, TrendingUp, CheckCircle, ArrowRight, MousePointer2, Receipt, Calendar } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Umbrella size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">Lido Manager</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Funzionalità</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Prezzi</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contatti</a>
              <Link 
                to="/app" 
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                Accedi alla Demo <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left duration-700">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
                Già scelto da 50+ stabilimenti in Italia
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Il futuro del tuo <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Stabilimento Balneare
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Gestisci prenotazioni, ombrelloni e servizi bar in un'unica piattaforma intuitiva. Ottimizza il lavoro e aumenta i profitti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-300 flex items-center justify-center gap-2 text-lg"
                >
                  Prova la demo gratuita <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/login"
                  className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center text-lg"
                >
                  Accedi
                </Link>
              </div>
              <div className="pt-4 flex items-center gap-6 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Setup in 2 minuti</span>
                <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Nessuna carta richiesta</span>
              </div>
            </div>

            <div className="relative animate-in slide-in-from-right duration-700 delay-200">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 opacity-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop" 
                alt="Lido Manager Dashboard" 
                className="rounded-xl w-full h-auto object-cover shadow-2xl border border-gray-100 relative z-10"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce z-20">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Incasso Oggi</p>
                  <p className="text-xl font-bold text-gray-900">+24%</p>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">Funzionalità Premium</h2>
            <h3 className="text-4xl font-black text-gray-900 mb-4">Tutto ciò che serve per la tua spiaggia</h3>
            <p className="text-xl text-gray-600">Dalla mappa interattiva al punto cassa, abbiamo pensato a ogni dettaglio.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MousePointer2 size={32} className="text-blue-600" />}
              title="Mappa Interattiva"
              description="Gestisci visivamente la tua spiaggia. Assegna ombrelloni, lettini e verifica le disponibilità in tempo reale."
            />
            <FeatureCard 
              icon={<Receipt size={32} className="text-purple-600" />}
              title="Punto Cassa Smart"
              description="Interfaccia touch veloce per bar e ristorante. Gestisci ordini, pagamenti e stampa scontrini in un click."
            />
            <FeatureCard 
              icon={<Calendar size={32} className="text-orange-600" />}
              title="Prenotazioni Online"
              description="Permetti ai tuoi clienti di prenotare l'ombrellone direttamente dal loro smartphone, 24/7."
            />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop" 
                alt="Relax on beach" 
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-gray-900">
                Meno stress, <br/>
                <span className="text-blue-600">più tempo per i tuoi clienti.</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Lido Manager automatizza i compiti ripetitivi e riduce gli errori. Dedica più tempo all'accoglienza e meno alla burocrazia.
              </p>
              
              <div className="space-y-4">
                <BenefitItem text="Elimina il cartaceo e i fogli Excel" />
                <BenefitItem text="Controllo totale anche da casa" />
                <BenefitItem text="Report dettagliati su incassi e presenze" />
                <BenefitItem text="Supporto dedicato 7 giorni su 7" />
              </div>

              <div className="pt-4">
                 <Link 
                  to="/signup" 
                  className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 text-lg"
                >
                  Inizia ora <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-black">Pronto a trasformare il tuo lido?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Unisciti agli imprenditori balneari che hanno già scelto l'innovazione. Prova la demo gratuita oggi stesso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              Crea Account Gratuito
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <Umbrella size={24} />
              <span className="text-xl font-bold">Lido Manager</span>
            </div>
            <p className="text-sm">
              Il software gestionale N.1 per stabilimenti balneari in Italia.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Prodotto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Funzionalità</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prezzi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Azienda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Chi Siamo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contatti</h4>
            <p className="text-sm">info@iltuostabilimentobalneare.com</p>
            <p className="text-sm">+39 02 12345678</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
    <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="bg-green-100 p-1 rounded-full">
      <CheckCircle className="text-green-600 shrink-0" size={16} />
    </div>
    <span className="text-lg text-gray-700 font-medium">{text}</span>
  </div>
);

export default LandingPage;
