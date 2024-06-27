import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewSubPage from './NewSubscriptionPage';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import SubscriptionManager from './NewSubscriptionPage';
const ErrorPage = () => {
  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <h1>Error 404</h1>
      <p>Page not found</p>
    </div>
  );
}
const App = () => {
  return (
    <>
      <Router>
          <Routes>
            <Route exact path="/new" element={<SubscriptionManager />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
      </Router>
    </>
  );
}

export default App