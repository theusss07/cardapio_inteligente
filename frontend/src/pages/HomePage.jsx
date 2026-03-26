import { Link } from 'react-router-dom';
import { QRCode } from 'react-qr-code';
import { stores } from '../data/stores';

export default function HomePage() {
  const currentUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-brand-black p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="font-display text-5xl font-black text-white mb-4">
            Painel <span className="text-brand-yellow">Lojas Inteligentes</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Selecione uma loja abaixo para acessar o cardápio ou gere o QR Code para uso nas mesas.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map(store => {
            const storeUrl = `${currentUrl}/store/${store.id}`;
            return (
              <div key={store.id} className="bg-brand-gray-dark rounded-3xl p-8 border border-brand-gray-mid/50 shadow-2xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 rounded-2xl bg-brand-gray-mid flex items-center justify-center text-3xl mb-4">
                  {store.id === 'loja-matriz' ? '🏢' : '⚡'}
                </div>
                <h2 className="text-white font-bold text-2xl text-center mb-2">{store.name}</h2>
                <p className="text-gray-400 text-center text-sm mb-6">{store.description}</p>
                
                <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                  <QRCode value={storeUrl} size={180} />
                </div>

                <div className="bg-brand-gray-mid/30 p-3 rounded-lg w-full mb-6">
                  <p className="text-gray-500 text-xs text-center mb-1 uppercase font-bold tracking-wider">URL Direta</p>
                  <a href={storeUrl} className="text-brand-yellow text-sm text-center block truncate hover:underline" target="_blank" rel="noreferrer">
                    {storeUrl}
                  </a>
                </div>

                <Link
                  to={`/store/${store.id}`}
                  className="w-full btn-primary text-center flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Abrir Emulador da Loja
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
