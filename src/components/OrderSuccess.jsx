export default function OrderSuccess() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in pointer-events-none">
      <div className="bg-brand-gray-dark rounded-3xl p-10 max-w-xs w-full mx-4 text-center animate-bounce-in shadow-2xl border border-green-700/30">
        <div className="text-8xl mb-4 animate-bounce">🌭</div>
        <h2 className="font-display font-black text-2xl text-white mb-2">
          Pedido Confirmado!
        </h2>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          Seu pedido foi recebido! Estamos preparando seu hot dog com todo carinho e capricho.
        </p>
        <div className="bg-green-900/30 border border-green-700/50 rounded-xl px-4 py-3 inline-block">
          <span className="text-green-400 font-semibold text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
            Previsão: 15–25 minutos
          </span>
        </div>
        <p className="text-gray-600 text-xs mt-4">
          Acompanhe seu pedido pelo app
        </p>
      </div>
    </div>
  );
}
