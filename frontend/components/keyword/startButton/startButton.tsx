import React, { useEffect, useRef } from 'react';

interface startButtonProps {
  label: string;
  onClick?: () => void;
  allReady: boolean;
}

const StartButton: React.FC<startButtonProps> = ({
  label,
  onClick,
  allReady
}) => {
  const clickWrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickStartSoundRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    clickWrongSoundRef.current = new Audio('/soundEffects/wrong.mp3');
    clickStartSoundRef.current = new Audio('/soundEffects/startButtonSound.mp3');
  }, []);



  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (allReady) {
      clickStartSoundRef.current?.play();
      if (onClick) {
        onClick();
      }
    } else {
      clickWrongSoundRef.current?.play();
    }

  };
  return (
    <>
      <div className='buttonDiv py-3'>
        <button
          onClick={handleClick}
          className={`transition-colors duration-300 ${allReady ? 'bg-[#661C1C] hover:bg-[#4B0A0A]' : 'bg-figma-red hover:bg-red-600'} border-black border-2 text-white text-2xl font-bold py-2 px-4 rounded w-[400px]`}
        >
          {label}
        </button>
      </div>

    </>
  )

};
export default StartButton;