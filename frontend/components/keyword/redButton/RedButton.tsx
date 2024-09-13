import React, {useEffect, useRef} from 'react';

interface redButtonProps {
  label: string;
  onClick?: () => void;
}

const RedButton: React.FC<redButtonProps> = ({
  label,
  onClick,
}) => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('/soundEffects/redButtonClickSoundEffect.mp3');
    hoverSoundRef.current = new Audio('/soundEffects/redButtonHoverSoundEffect.mp3');
  }, []);

  // const handleHover = () => {
  //   hoverSoundRef.current?.play();
  // }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    clickSoundRef.current?.play();
    if (onClick) {
      onClick();
    }
  };


  return (
    <>
      <div className='buttonDiv py-3'>
        <button
          className={"bg-figma-red border-black border-2 text-white text-2xl font-bold py-2 px-4 rounded w-[400px] hover:bg-red-600"}
          onClick={handleClick}
          // onMouseEnter={handleHover}
        >
          {label}
        </button>
      </div>
      
    </>
  )

};
export default RedButton;