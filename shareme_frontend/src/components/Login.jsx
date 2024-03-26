import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { useGoogleLogin } from '@react-oauth/google'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { client } from '../client';


const Login = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false)

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setDisabled(true)

      console.log('Access Token:', tokenResponse.access_token)

      const userInfo = await getUserInfo(tokenResponse.access_token)

      console.log('userInfo:', userInfo)

      localStorage.setItem('user', JSON.stringify(userInfo))

      const { name, id, picture } = userInfo

      const doc = {
        _id: id,
        _type: 'user',
        userName: name,
        image: picture
      }

      client.createIfNotExists(doc)
        .then(() => {
          navigate('/', { replace: true })
        })

      setDisabled(false)

    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setDisabled(false)
    },

    onLoading: (loading) => {
      setDisabled(loading)
    },

    // If you need to access the token, you can specify the scopes.
    scope: 'openid email profile',
  });

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();

      // You now have the user's information. You can use it as needed in your application.
    } catch (error) {
      console.error('Error fetching user info:', error);
      return
    }
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'
    >
      <div className='relative w-full h-full'>
        <video 
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
      </div>
      <div className='absolute flex flex-col justify-center items-center top-0 right-0 bottom-0 left-0 bg-blackOverlay'>
        <div className='p-5'>
          <img src={logo} width='130px' alt='logo' />
        </div>

        <div className='shadow-2xl'>
          <button 
          type='button' 
          className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
          onClick={login}
          disabled={disabled}
          >
            <FcGoogle className='mr-4'/>
            Log in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login