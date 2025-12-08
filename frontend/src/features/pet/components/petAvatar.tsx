import { useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';

interface PetAvatarProps {
  animation?: string; // Change from emotion/isSpeaking to animation name
}

export default function PetAvatar({ animation = 'idle' }: PetAvatarProps) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/Euna.riv',
    animations: ['anim_idle', 'anim_happy', 'anim_sad', 'anim_breathLOOP', 'drinking'], // Names from your .riv file
    autoplay: true,
  });

  // THIS IS THE KEY: When animation prop changes, play that animation
  useEffect(() => {
    if (rive && animation) {
      rive.play(animation);
    }
  }, [rive, animation]);

  return (
    <div className="w-64 h-64 mx-auto">
      <RiveComponent className="w-full h-full" />
      <p className="text-sm text-gray-500 text-center mt-2">
        Playing: {animation}
      </p>
    </div>
  );
}