// src/App.tsx
import RiveDebug from './features/pet/components/riveDebug';
import PetInteraction from './features/pet/components/petInteraction';
import PetChat from './features/pet/components/petChat';

function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* DEBUG FIRST - Shows at the top */}
      <RiveDebug />
      
      {/* Your actual demo below */}
      <h1 className="text-3xl font-bold text-center mb-8">Eunoia Pet Demo</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PetInteraction />
        <PetChat />
      </div>
    </div>
  );
}

export default App;