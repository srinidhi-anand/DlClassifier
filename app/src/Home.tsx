import React from 'react';
import './App.css';

function Home() {
  return (
    <>
      <div>
          <img src='https://img.freepik.com/premium-vector/ai-logo-template-vector-with-white-background_1023984-15078.jpg' className="logo" alt="App logo" />
      </div>
      <h1>DeepLearn Classifier App</h1>
      <div className="card">
          <button role="button"
          className="proceed button-34 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() =>  window.location.href='/Upload'}>
            Proceed
          </button>
        <h3><p>
          Click <i>proceed</i> to test classifier using various foods
        </p></h3>
      </div>
      <p className="read-the-docs">
        Credits: Google Images <a href="https://towardsdatascience.com/deploying-a-deep-learning-model-on-mobile-using-tensorflow-and-react-4b594fe04ab/" target="_blank"> Medium </a>
      </p>
    </>
  )
}

export default Home
