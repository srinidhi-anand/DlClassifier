import React from 'react';
import './App.css';

function Home() {
  return (
    <>
      <div className='flex flex-row home_screen'>
        <div className='flex flex-col  text-left'>
          <h1>Welcome to smart food classifier app</h1>
          <h4 className='leading-2'>Our smart food classifier app uses deep learning to instantly recognize your meals from a photo. Get ready for a new level of food awareness!</h4>
          <div className="card pl-0">
              <button role="button"
              className="proceed button-34 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() =>  window.location.href='/Upload'}>
                Proceed
              </button>
          </div>
        </div>
          <img src='https://res.cloudinary.com/dsfayktkz/image/upload/v1746553674/home_img_zpyp5q.jpg' className="logo" alt="App logo" />          
      </div>
      
      <p className="read-the-docs">
        Credits: Google Images <a href="https://towardsdatascience.com/deploying-a-deep-learning-model-on-mobile-using-tensorflow-and-react-4b594fe04ab/" target="_blank"> Medium </a>
      </p>
      
    </>
  )
}

export default Home
