import RedButton from "../redButton/RedButton"

interface RoundOverProps {
  onReturnToLobby: () => void;
  onExitRoom: () => void;
}

export default function RoundOver({onReturnToLobby, onExitRoom}: RoundOverProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="contentContainer bg-[#0C2820] text-white font-bold w-128 h-96 flex flex-col items-center justify-center text-center sm:mx-8 lg:mx-auto my-auto rounded-2xl border-[3px] border-black p-3">
        <h1 className="text-5xl mb-3">ROUND OVER</h1>
        <div className="w-full border-t-4 border-white my-3"></div>
        <h2 className="text-4xl mb-3">BEGIN VOTING</h2>
        <RedButton label="RETURN TO LOBBY" onClick={onReturnToLobby}></RedButton>
        <RedButton label="RETURN TO HOMEPAGE" onClick={onExitRoom}></RedButton>
      </div>
    </div>
  )
}