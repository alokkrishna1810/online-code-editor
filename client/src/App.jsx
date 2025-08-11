function App() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">DevPad</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Run
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">HTML</h2>
          <textarea className="w-full h-full p-2 border border-gray-200 rounded"></textarea>
        </div>
        <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">CSS</h2>
          <textarea className="w-full h-full p-2 border border-gray-200 rounded"></textarea>
        </div>
        <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">JS</h2>
          <textarea className="w-full h-full p-2 border border-gray-200 rounded"></textarea>
        </div>
        <div className="w-1/4 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">Output</h2>
          <iframe
            className="w-full h-full border border-gray-200 rounded"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default App;
