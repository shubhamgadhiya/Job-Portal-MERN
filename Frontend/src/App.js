
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Navbar from './Components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Components/Footer';
import Company from './Components/Admin/Company';
import Job from './Components/Admin/Job';
import ProtectedRoute from './Components/Utils/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from './Redux/AuthReducer';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import User from './Components/Admin/User';
import UserView from './Components/Admin/UserView';
import Browse from './Components/Browse';
import Profile from './Components/Profile';
import AppliedJob from './Components/AppliedJob';
import ScrollToTop from './Components/Utils/ScrollToTop';
import Token from './Components/Utils/Token';
import ForgotPassword from './Components/Auth/forgotPassword';

function App() {
  const { user } = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem("AuthToken");
      if (token) {
        Token(token);
        const data = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (data.exp < currentTime) {
          localStorage.removeItem('AuthToken');
          window.location.href = '/';
        } else {
          dispatch(setUser(data.userDetails));
          dispatch(setToken(token));
        }
      }
    }
  }, [user, dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
        <Route path="/admin/job" element={<ProtectedRoute><Job /></ProtectedRoute>} />
        <Route path="/admin/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/admin/user/:id" element={<UserView />} />
        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/job" element={<ProtectedRoute><AppliedJob /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
