import { useEffect, useState } from 'react';

type Props = {
  text: string;
  isVisible: boolean;
};

export const SpeechBubble = ({ text, isVisible }: Props) => {
  const [displayedText, setDisplayedText] = useState('');

  // Typewriter effect for realism
  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('');
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 30); // Speed of typing
    return () => clearInterval(timer);
  }, [text, isVisible]);

  if (!isVisible && !displayedText) return null;

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 -top-24 z-50 pointer-events-none"
      style={{ width: '200px' }}
    >
      <div className="bg-white/90 backdrop-blur-sm border-2 border-[#5c4b43] p-4 rounded-2xl rounded-bl-none shadow-xl text-center">
        <p className="text-[#5c4b43] font-medium text-sm leading-snug">
          {displayedText}
        </p>
      </div>
    </div>
  );
};