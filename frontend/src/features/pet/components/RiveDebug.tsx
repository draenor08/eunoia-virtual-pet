// src/components/RiveDebug.tsx
import { useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';

export default function RiveDebug() {
  const { rive } = useRive({
    src: '/animations/Euna.riv',
    stateMachines: 'Animations',
    autoplay: true,
  });

  useEffect(() => {
    if (rive) {
      console.log('🎯 RIVE DEBUG INFO:');
      console.log('State Machines:', rive.stateMachineNames);
      console.log('Animation Names:', rive.animationNames);
      
      // Check ALL state machines
      rive.stateMachineNames?.forEach((stateMachineName) => {
        console.log(`--- State Machine: "${stateMachineName}" ---`);
        const inputs = rive.stateMachineInputs(stateMachineName);
        console.log('Available Inputs:', inputs);
        
        inputs?.forEach((input: any) => {
          console.log(`  - ${input.name}: type=${input.type}`);
        });
      });
    }
  }, [rive]);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800">🛠️ Rive Debug Component</h3>
      <p className="text-sm text-yellow-600">
        Check browser console (F12 → Console) for animation details
      </p>
      <p className="text-xs mt-2">
        {rive ? '✅ Rive loaded' : '⏳ Loading Rive...'}
      </p>
    </div>
  );
}