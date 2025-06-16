export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Página Não Encontrada
      </h2>
      <p className="text-gray-600 mb-6">
        O recurso que você está tentando acessar não existe ou foi removido.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}
