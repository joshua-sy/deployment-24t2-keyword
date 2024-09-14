import React, { useState } from 'react';

const LeaveRoomIcon = ({ handleClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => handleClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-16 h-16 py-4 cursor-pointer transition-colors duration-300 ${
        isHovered ? 'text-slate-400' : 'text-slate-50'
      }`}
    >
      <svg width="28" height="35" viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4332 0.713974C9.33337 1.81128 9.33337 3.81864 9.33337 7.83161V27.1666C9.33337 31.1796 9.33337 33.187 10.4332 34.2843C11.5329 35.3816 13.2145 35.0526 16.5776 34.3928L20.202 33.6822C23.926 32.9507 25.788 32.5849 26.894 31.0484C28 29.51 28 27.2874 28 22.8404V12.1578C28 7.7126 28 5.48998 26.8956 3.95165C25.788 2.41507 23.9245 2.0493 20.2005 1.31951L16.5792 0.607219C13.216 -0.0525665 11.5345 -0.381584 10.4347 0.715725M14 14.2947C14.644 14.2947 15.1667 14.909 15.1667 15.6668V19.3315C15.1667 20.0893 14.644 20.7035 14 20.7035C13.356 20.7035 12.8334 20.0893 12.8334 19.3315V15.6668C12.8334 14.909 13.356 14.2947 14 14.2947Z" fill="currentColor"/>
      <path d="M7.07311 4.37341C3.87178 4.37866 2.20267 4.45742 1.13867 5.65448C1.85437e-07 6.93555 0 8.99716 0 13.1239V21.8744C0 25.9993 1.85437e-07 28.0609 1.13867 29.3438C2.20267 30.5391 3.87178 30.6196 7.07311 30.6248C7 29.5328 7 28.2727 7 26.9094V8.08886C7 6.72379 7 5.46372 7.07311 4.37341Z" fill="currentColor"/>
      </svg>

    </div>
  );
};

export default LeaveRoomIcon;