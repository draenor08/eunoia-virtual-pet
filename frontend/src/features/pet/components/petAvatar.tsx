// src/features/pet/components/petAvatar.tsx
import { useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';

interface PetAvatarProps {
  animation?: string; 
}

export default function PetAvatar({ animation = 'idle' }: PetAvatarProps) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/Euna.riv',
    // 🔴 REMOVE the 'animations' array property here. 
    // Let Rive load everything so we can see what exists.
    autoplay: true,
  });

  // 🕵️ DEBUGGING: Print valid animation names to Console
  useEffect(() => {
    if (rive) {
      console.log("---------------------------------------------");
      console.log("👀 DETECTED ANIMATIONS IN RIVE FILE:");
      // This prints the actual names found in the file
      console.log(rive.animationNames); 
      console.log("---------------------------------------------");
    }
  }, [rive]);

  useEffect(() => {
    // Only try to play if the animation name actually exists in the list
    if (rive && animation && rive.animationNames.includes(animation)) {
      rive.play(animation);
    } else if (rive && animation) {
      console.warn(`⚠️ Warning: Could not find animation named "${animation}"`);
    }
  }, [rive, animation]);

  return (
    <div className="w-64 h-64 mx-auto">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}