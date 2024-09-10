import React from 'react';

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
  return (
    <>
      <div className='buttonDiv py-3'>
        <button
          className={`transition-colors duration-300 ${allReady ? 'bg-green-400' : 'bg-figma-red'} border-black border-2 text-white text-2xl font-bold py-2 px-4 rounded w-[400px]`}
          onClick={onClick}

        >
          {label}
        </button>
      </div>

    </>
  )

};
export default StartButton;