import RedButton from "../redButton/RedButton"

export default function RoundOver() {

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="contentCOntainer bg-[#0C2820] text-white font-bold w-128 h-96 flex flex-col items-center justify-center text-center sm:mx-8 lg:mx-auto my-auto rounded-2xl border-[3px] border-black p-3">
        <h1 className="text-5xl mb-3">ROUND OVER</h1>
        <div className="w-full border-t-4 border-white my-3"></div>
        <h2 className="text-4xl mb-3">BEGIN VOTING</h2>
        <RedButton label="RETURN TO ROOM"></RedButton>
        <RedButton label="EXIT ROOM"></RedButton>
      </div>
    </div>
  )
}