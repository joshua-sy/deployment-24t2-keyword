import React, { useState } from "react";
import RedButton from "../redButton/RedButton";
import Rules from "@/components/keyword/rules/Rules";

// need timer, player identity, word and category
interface PlayerIdentityProps {
  timer: string;
  identity: string;
  word: string;
  category: string;
  isHost: boolean;
  roomCode: string;
  socket: any;
}

export default function PlayerIdentity({ timer, identity, word, category, isHost, socket, roomCode }: PlayerIdentityProps) {
  const scientistRuleContent = `
  EVERYBODY TAKES TURNS SAYING A WORD CORRELATING TO THE WORD GIVEN.

  THE CYBORG(S) DOES NOT [red]KNOW[/red] THE WORD.

  TRY YOUR BEST TO SAY WORDS THAT ARE NOT TOO SPECIFIC TO NOT LET THE CYBORG CATCH ONTO WHAT THE WORD IS WHILE ALSO NOT BEING TOO GENERIC AS TO NOT BE SUSPICIOUS!
  `;
  const cyborgRuleContent = `
  EVERYBODY TAKES TURNS SAYING A WORD CORRELATING TO THE WORD GIVEN.

  YOU DO [red]NOT[/red] KNOW THE WORD.

  TRY TO GIVE ANSWERS BASED ON THE ANSWERS GIVEN BY THE SCIENTISTS AND GUESS WHAT THE WORD COULD BE!

  DENY BEING THE CYBORG [red]AT ALL COST[/red].
  `;
  const hiddenRuleContent = `LOADING...`;

  let identityImage = "/icons/questionMarkIcon.png";
  let identityText = "LOADING IDENTITY...";
  let displayedWord = `LOADING...`;
  let howToPlayContent = hiddenRuleContent;

  if (identity === "SCIENTIST") {
    identityImage = "/icons/scientistIcon.svg";
    identityText = "A SCIENTIST";
    displayedWord = `WORD: ${word}`;
    howToPlayContent = scientistRuleContent;
  }
  if (identity === "CYBORG") {
    identityImage = "/icons/robotIcon.svg";
    identityText = "THE CYBORG";
    displayedWord = `CATEGORY: ${category}`;
    howToPlayContent = cyborgRuleContent;
  }

  const [isHidden, setIsHidden] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const currentImage = isHidden ? "/icons/questionMarkIcon.png" : identityImage;
  const profileText = isHidden ? "REVEAL PROFILE" : "HIDE PROFILE";
  const currentText = isHidden ? "?????????" : identityText;
  const wordText = isHidden ? `CATEGORY: ${category}` : displayedWord;

  const handleHideClick = () => {
    setIsHidden(!isHidden);
  };

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleHideRules = () => {
    setShowRules(false);
  };

  const handleEndGame = () => {
    console.log(roomCode);
    socket.emit('trigger-game-end', roomCode);
  }

  return (
    <>
      <div className={`contentContainer mx-auto transition-all duration-500 ease-in-out w-full max-w-md max-h-screen overflow-auto
      ${showRules ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {!showRules && (
          <div className="flex flex-col items-center justify-center text-white text-center font-bold space-y-8 p-8 md:space-y-12 lg:space-y-32 2xl:space-y-2 2xl:p-0">
            <div className="timeLeftContainer mt-4 p-4 border-[3px] border-black rounded-lg bg-[#289773] bg-opacity-70 w-[280px] p-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl">TIME LEFT: {timer}</h2>
                <img src="/icons/clockIcon.png" alt="Clock Icon" className="w-5 h-5" />
              </div>
            </div>
            <div className="pictureContainer mt-4 border-[5px] border-black rounded-[20px] w-[280px] h-[280px] 
            flex items-center justify-center bg-white bg-opacity-60 relative">
              <img src={currentImage} alt="Identity Icon" className="w-[265px] h-[265px] absolute top-2" />
            </div>
            <div className="textContainer flex flex-col space-y-1">
              <p className="text-sm underline cursor-pointer" onClick={handleHideClick}>{profileText}</p>
              <h2 className="text-3xl">YOU ARE</h2>
              <h1 className="text-4xl">{currentText}</h1>
              <h2 className="text-2xl underline">{wordText}</h2>
            </div>
            <div className="redButtonContainer mt-3">
              <RedButton label="WHAT TO DO" onClick={handleShowRules} />
            </div>
            {isHost && <RedButton label="END GAME" onClick={handleEndGame} />}
          </div>
        )}
      </div >

      {showRules && (
        <div className="absolute inset-0 no-scroll backdrop-blur-sm">
          <div className="rulesContainer fixed bottom-0 w-full max-w-xl mx-auto h-[40vh] md:h-[40vh] lg:h-[30vh] 2xl:h-[50vh] bg-[#0C2820] z-10 border-[10px] border-black rounded-tl-3xl rounded-tr-3xl animate-slide-up">
            <Rules title="HOW TO PLAY" content={howToPlayContent} onClose={handleHideRules} />
          </div>
        </div>
      )}
    </>
  );
};
