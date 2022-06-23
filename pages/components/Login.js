import React, { useState, useEffect } from 'react';
import {
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
} from '@100mslive/react-sdk';
import Room from './Room';

const Login = () => {
  const endpoint =
    'https://prod-in2.100ms.live/hmsapi/videoapp.app.100ms.live/';
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState('');
  const [selectValues, setSelectValues] = useState('viewer');

  //determine logout functionality
  useEffect(() => {
    window.onunload = () => {
      //when window is left/closed, leave the room
      hmsActions.leave();
    };
  }, [hmsActions]);

  //determine if connected to room
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  //handle change for inputs, two different methods to do so
  const handleInputChange = ({ target: { value } }) => {
    setInputValues(value);
  };

  const handleSelectChange = (e) => {
    setSelectValues(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchToken = async () => {
      const response = await fetch(`${endpoint}api/token`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: '1234',
          role: selectValues,
          type: 'app',
          room_id: 'my room id',
        }),
      });
      //pull token from response
      const { token } = await response.json();
      return token;
    };
    //run fetch token function
    const token = await fetchToken(inputValues);
    //join the room
    hmsActions.join({
      userName: inputValues,
      authToken: token,
      settings: {
        isAudioMuted: true,
        isVideoMuted: false,
      },
    });
    console.log('joined room!');
  };

  return (
    <>
      {!isConnected ? (
        <div className=' h-screen flex justify-center items-center bg-slate-800'>
          <div className=' flex flex-col gap-6 mt-8'>
            <input
              type='text'
              placeholder='John Doe'
              value={inputValues}
              onChange={handleInputChange}
              className=' focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600'
            />
            <input
              type='text'
              placeholder='Select Role'
              value={selectValues}
              onChange={handleSelectChange}
              className=' focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600'
            />
            <button
              onClick={handleSubmit}
              className='flex-1 text-white bg-blue-600 py-3 px-10 rounded-md'
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <Room />
      )}
    </>
  );
};

export default Login;
