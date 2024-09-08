import React, {useRef, useEffect} from 'react';

interface greyButtonProps {
  label: string;
  onClick?: () => void;
}

const GreyButton: React.FC<greyButtonProps> = ({
  label,
  onClick,
}) => {

  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('/soundEffects/redButtonClickSoundEffect.mp3');
    hoverSoundRef.current = new Audio('/soundEffects/redButtonHoverSoundEffect.mp3');
  }, []);

  const handleHover = () => {
    hoverSoundRef.current?.play();
  }

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
          className={"bg-gray-100 border-2 border-black text-black text-2xl font-bold py-2 px-4 rounded w-[400px] hover:bg-gray-200"}
          onClick={handleClick}
          onMouseEnter={handleHover}
        >
          {label}
        </button>
      </div>

    </>
  )

};
export default GreyButton;