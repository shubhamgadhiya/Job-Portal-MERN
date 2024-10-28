import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setLoading } from '../../Redux/AuthReducer'
import axios from 'axios';
import Loader from '../Utils/Loader';
import { baseUrl } from '../Utils/constant';

const Register = () => {
  const dispatch = useDispatch()
 const navigate = useNavigate()

  const {loading} = useSelector(state => state.Auth);
  
  const fileInputRef = useRef(null);
  const [register, setRegister] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: []
});

const handlesubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData(); 
    formData.append("firstName", register.firstName);
    formData.append("lastName", register.lastName);
    formData.append("email", register.email);
    formData.append("phoneNumber", register.phoneNumber);
    formData.append("password", register.password);
    formData.append("profilePicture", register.profilePicture);

    try {
        const response = await axios.post(`${baseUrl}/api/auth/user/register`, formData);
        toast.success("User Registered Successfully", { position: "top-center" });
        setRegister({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '', profilePicture: '' });
        navigate('/login');
    } catch (err) {
        toast.error(err?.response?.data?.message, { position: "top-center" });
    } finally {
        dispatch(setLoading(false));
    }
};


  return (
    <div className='container'>
    <div class="flex flex-col top-5 my-4 rounded-xl bg-transparent">
    <form class="mt-8 mb-2 m-auto w-80 max-w-screen-lg sm:w-96" onSubmit={handlesubmit}>
      <div class="mb-1 flex flex-col gap-6 border-2 rounded-lg p-2 shadow-2xl">
      <h4 class="block text-2xl m-auto font-bold text-slate-800">
      Register
    </h4>
    <p class="text-slate-500 m-auto font-light">
      Nice to meet you! Enter your details to register.
    </p>
        <div class="w-full max-w-sm min-w-[200px]">
          <label class="block mb-2 text-sm text-slate-600">
            Your First Name
          </label>
          <input
           type="text"
           name='firstName'
           id='firstName'
           required
           value={register.firstName}
           onChange={(e) => setRegister({...register, firstName: e.target.value})}

            class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your First Name" />
        </div>
        <div class="w-full max-w-sm min-w-[200px]">
          <label class="block mb-2 text-sm text-slate-600">
            Your Last Name
          </label>
          <input
           type="text"
            name='lastName'
            id='lastName'
            required
            value={register.lastName}
            onChange={(e) => setRegister({...register, lastName: e.target.value})}
            class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Last Name" />
        </div>
        <div class="w-full max-w-sm min-w-[200px]">
          <label class="block mb-2 text-sm text-slate-600">
            Email
          </label>
          <input
           type="email"
            name='email'
            id='email'
            required
            value={register.email}
            onChange={(e) => setRegister({...register, email: e.target.value})}
            class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Email" />
        </div>
        <div class="w-full max-w-sm min-w-[200px]">
          <label class="block mb-2 text-sm text-slate-600">
            Password
          </label>
          <input
           type="password"
            name='password'
            id='password'
            required
            value={register.password}
            onChange={(e) => setRegister({...register, password: e.target.value})} 
           class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Password" />
        </div>
        <div class="w-full max-w-sm min-w-[200px]">
          <label class="block mb-2 text-sm text-slate-600">
            Phone Number
          </label>
          <input
           type="number"
            name='phoneNumber'
            id='phoneNumber'
            required
            value={register.phoneNumber}
            onChange={(e) => setRegister({...register, phoneNumber: e.target.value})}
            class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Phone Number" />
        </div>
        <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                required
                ref={fileInputRef}
                 onChange={(e) => setRegister({...register, profilePicture: e.target.files?.[0]})}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>
            <button type='submit'
                            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            disabled={loading} 
                        >
                              {loading ? 'Loading...' : 'Sign Up'}
                        </button>
      <p class="flex justify-center mt-6 text-sm text-slate-600">
        have an account?
        <Link to="/login" class="ml-1 text-sm font-semibold text-slate-700 underline">
          Login
        </Link>
      </p>
      </div>
   
   
    </form>
  </div>
  {loading && <Loader />}
  </div>
  )
}

export default Register
