import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

interface PetAvatarProps {
  emotion?: 'idle' | 'happy' | 'sad';
  isSpeaking?: boolean;
}

export default function PetAvatar({ emotion = 'idle', isSpeaking = false }: PetAvatarProps) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/Euna.riv',
    stateMachines: 'Animations',
    autoplay: true,
  });

  // Control animation states
  const emotionInput = useStateMachineInput(rive, 'Animations', 'emotion');
  const speakInput = useStateMachineInput(rive, 'Animations', 'speak');

  // Update animation when props change
  if (emotionInput && emotion === 'happy') emotionInput.value = 1;
  if (speakInput) speakInput.value = isSpeaking;

  return (
    <div className="w-64 h-64 mx-auto">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}