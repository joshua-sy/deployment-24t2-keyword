"use client"

import Image from "next/image";
import React, { useState } from 'react';
import Redbutton from '@/components/keyword/redButton/RedButton';
import GreyButton from '@/components/keyword/greyButton/GreyButton';
import Rules from "@/components/keyword/rules/Rules";

const howToPlayContent = `
EVERY PLAYER WILL BE GIVEN A KEYWORD, THEY ARE A [red]SCIENTIST[/red]. HOWEVER, ONE OF THE PLAYERS WILL NOT BE GIVEN A WORD. THEY ARE THE [red]CYBORG[/red].

THE [red]CYBORG'S[/red] GOAL IS TO FIND OUT WHAT THE WORD IS AND TRY TO FIT IN.
THE [red]SCIENTISTS'[/red] GOAL IS TO FIGURE OUT WHO THE [red]CYBORG[/red] IS.

THE PLAYERS WILL GO AROUND CLOCKWISE AND SAY A WORD RELATING TO THE KEYWORD. FOR EXAMPLE, IF THE WORD WAS "[green]LEBRON JAMES[/green]", YOU WOULD SAY "[green]BASKETBALL[/green]".

CONTINUE UNTIL THE TIMER RUNS OUT OR IF THE PLAYERS ARE READY TO VOTE FOR THE [red]CYBORG[/red].
`;

export default function Home() {
  const [showRules, setShowRules] = useState(false);

  const handleShowRules = () => {
    setShowRules(true);
  };
  const handleHideRules = () => {
    setShowRules(false);
  };

  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
        {/* Width is fixed to 500 pixels for now */}
        <div className={`contentContainer text-center w-[500px] mx-auto transition-all duration-500 ease-in-out 
          ${showRules ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
          {!showRules && (
            <div>
              <div className="titleContainer py-10">
                <h1 className="welcomeText text-white text-7xl"> WELCOME </h1>
                <h1 className="toText text-white text-7xl"> TO </h1>
                <div className="keywordDiv border-4 border-white rounded-3xl p-8 ">
                  <h1 className="keyWordText text-white text-7xl"> KEYWORD </h1>
                </div>
              </div>
              <div>
                <Redbutton label={"HOST ROOM"} />
                <Redbutton label={"JOIN ROOM"} />
              </div>
              <div>
                <GreyButton label="HOW TO PLAY" onClick={handleShowRules} />
              </div>
            </div>
          )}
        </div>

        {showRules && (
          <div className="absolute inset-0 backdrop-blur-sm">
            <div className="rulesContainer fixed bottom-0 left-0 w-full h-[65%] bg-[#0C2820] z-10 border-[10px] border-black
           rounded-tl-3xl rounded-tr-3xl animate-slide-up">
              <Rules title="HOW TO PLAY" content={howToPlayContent} onClose={handleHideRules} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}