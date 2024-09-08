import React, {useEffect, useRef} from 'react';

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
    hoverSoundRef.current = new Audio('/soundEffects/redButtonHoverSoundEffect.mp3');
  }, []);

  const handleHover = () => {
    hoverSoundRef.current?.play();
  }

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
          className={`${allReady ? 'bg-green-400' : 'bg-figma-red'} border-black border-2 text-white text-2xl font-bold py-2 px-4 rounded w-[400px]`}
          onClick={handleClick}
          onMouseEnter={handleHover}

        >
          {label}
        </button>
      </div>
      
    </>
  )

};
export default StartButton;