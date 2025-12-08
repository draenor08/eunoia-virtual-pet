import PetInteraction from '../components/petInteraction';
import PetChat from '../components/petChat';

export default function PetDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-2">Eunoia Virtual Pet</h1>
      <p className="text-center text-gray-600 mb-8">Your mental health companion</p>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Pet Animation */}
        <div className="space-y-8">
          <PetInteraction />
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">💡 Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Mood Today</p>
                <p className="text-2xl font-bold">😊 Good</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Water Today</p>
                <p className="text-2xl font-bold">3/8 glasses</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Chat */}
        <PetChat />
      </div>
    </div>
  );
}