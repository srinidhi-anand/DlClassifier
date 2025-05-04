import { Route, Routes } from 'react-router';
import './App.css';
import Home from './Home';
import Upload from './Upload';
import Predict from './Predict';
import React from 'react';

function App() {
  return (
    <>
     <Routes>
      <Route path ="" element={<Home />} />
        <Route path ="upload" element={<Upload />} />
        <Route path ="predict" element={<Predict />} />
      </Routes>
    </>
  )
}

export default App
