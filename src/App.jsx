
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import User from './components/User'
import Register from './components/Register'
import OTP from './components/Otp'
import Admin from './components/Admin'


function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/user" element={<User />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/otp" element={<OTP />}></Route>
      <Route path="/admin" element={<Admin />}></Route>
      
    </Routes>
    </BrowserRouter>
  )


}

export default App