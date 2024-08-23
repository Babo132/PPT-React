export const Accion = () => {
    return(<>
     <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="rounded-lg p-4 bg-gray-500">
        <h1 className="text-3xl mb-4 text-center font-bold">BIENVENIDO AL JUEGO</h1>
        <p className="text-xl mb-4 text-center font-mono">¿Que quieres hacer?</p>
        <div className="">
          <p className="text-xl mt-4"></p>
            <div className=" flex items-center justify-center mt-8  gap-8">
                <button // Redirigir a "game"
                className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
              >
                Unirme a sala 
              </button>
              <button // Redirijir a componente ListaSalas
                className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
              >
                Solo mirar
              </button>
            </div>
        </div>
      </div>
    </div>
  </>)
}