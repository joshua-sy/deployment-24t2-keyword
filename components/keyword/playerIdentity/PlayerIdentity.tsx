import React, { useState } from "react";
import RedButton from "../redButton/RedButton";

const PlayerIdentity = () => {
  const [isHidden, setIsHidden] = useState(false);

  const currentImage = isHidden ? "./icons/questionMarkIcon.png" : "./icons/scientistIcon.png";
  const profileText = isHidden ? "REVEAL PROFILE" : "HIDE PROFILE";
  const identityText = isHidden ? "?????????" : "A SCIENTIST";
  const wordText = isHidden ? "CATEGORY: ANIMALS" : "WORD: CAPYBARA";

  const handleHideClick = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white text-center font-bold">
      <div className="timeLeftContainer mt-4 p-4 border-[3px] border-black rounded-lg bg-[#289773] bg-opacity-70 w-[280px] p-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl">TIME LEFT: 00:00</h2>
          <img src="./icons/clockIcon.png" alt="Clock Icon" className="w-5 h-5" />
        </div>
      </div>
      <div className="pictureContainer mt-4 border-[5px] border-black rounded-[20px] w-[280px] h-[280px] 
      flex items-center justify-center bg-white bg-opacity-60">
        <img src={currentImage} alt="Identity Icon" className="w-[265px] h-[265px]" />
      </div>
      <div className="textContainer flex flex-col space-y-1">
        <p className="text-sm underline cursor-pointer" onClick={handleHideClick}>{profileText}</p>
        <h2 className="text-3xl">YOU ARE</h2>
        <h1 className="text-4xl">{identityText}</h1>
        <h2 className="text-2xl underline">{wordText}</h2>
      </div>
      <div className="redButtonContainer mt-3">
        <RedButton label="WHAT TO DO" />
      </div>
      <RedButton label="END GAME" />
    </div>
  );
};

export default PlayerIdentity;