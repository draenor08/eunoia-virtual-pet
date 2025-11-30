import './App.css'

function App() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-purple-800 text-center mb-4">
        Eunoia Virtual Pet
      </h1>
      <p className="text-lg text-gray-600 text-center">
        Your mental health companion is ready!
      </p>
      <div className="flex justify-center mt-6">
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
