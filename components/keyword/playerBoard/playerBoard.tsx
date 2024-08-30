import React from 'react';
import Image from 'next/image';


interface User {
  username: string;
  isHost: boolean;
  readyStatus: boolean;
}

interface PlayerBoardProps {
  users: User[];
}

const PlayerBoard: React.FC<PlayerBoardProps> = ({
  users,
}) => {
  const sampleUsers = [
    {
      username: 'User1',
      isHost: true,
      readyStatus: true
    },
    {
      username: 'User2',
      isHost: false,
      readyStatus: false
    },
    {
      username: 'User3',
      isHost: false,
      readyStatus: true
    },
    {
      username: 'User4',
      isHost: false,
      readyStatus: false
    },
    {
      username: 'User5',
      isHost: false,
      readyStatus: true
    },
    {
      username: 'User6',
      isHost: false,
      readyStatus: false
    },
    {
      username: 'User7',
      isHost: false,
      readyStatus: false
    },
    {
      username: 'User8',
      isHost: false,
      readyStatus: false
    },
    {
      username: 'User9',
      isHost: false,
      readyStatus: false
    },
    {
      username: 'User10',
      isHost: false,
      readyStatus: false
    },

  ]
  return (
    <>
      <div className='playerBoardContainer rounded-xl bg-faded-max-white max-h-80 overflow-auto'>
        <div className='playerBoard opacity-100'>
            <div className='px-5 py-3 text-sm'>
              <div className='text-white flex justify-between'>
                <div>NAME</div>
                <div>STATUS</div>
              </div>
            </div>
            {FadedBorder()}
          {users.map((user: User, index: number) => (
            <div key={index} className='playerContainer'>
              <div className='flex justify-between py-4 px-5 text-lg items-center'>
                <div className='playerName flex items-center'>
                  <Image src="/icons/playerIcon.svg" alt="playerIcon" width={30} height={30}/>
                  <div className='px-3'>
                    {user.username}
                   </div>
                   <div>
                    {user.isHost && <Image src="/icons/crown.svg" alt="hostIcon" width={20} height={20}/>}
                  </div>
                </div>
                <div className='playerStatus'>
                  {user.readyStatus ? 'READY' : 'NOT READY'}
                </div>
              </div>
              {index < users.length - 1 && FadedBorder()}
            </div>
          ))}
        </div>
      </div>
      
    </>
  )

};

const FadedBorder = () => {
  return (
    <div className='fadedBorder border-2 w-full border-faded-mid-white'>
      
    </div>
  )
}
export default PlayerBoard;