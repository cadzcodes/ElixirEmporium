import React from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from "./components/Navbar"
import LoginPage from "./components/login/LoginPage"

const Login = () => {
  return (
    <div>
        <Navbar />
        <LoginPage />
    </div>
  )
}

const rootElement = document.getElementById('login');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<Login />);
} else {
    console.error("No element with id 'login' found.");
}
