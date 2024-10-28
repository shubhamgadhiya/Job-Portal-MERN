import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser, setToken } from '../../Redux/AuthReducer'
import axios from 'axios';
import Loader from '../Utils/Loader';
import Token from '../Utils/Token';
import { baseUrl } from '../Utils/constant';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, loading } = useSelector(state => state.Auth);
  const [login, setLogin] = useState({
    email: '',
    password: ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true));
    try {
      const response = await axios.post(`${baseUrl}/api/auth/user/login`, login);
      toast.success("User Login Successfully", { position: "top-center" });
      setLogin({ email: '', password: '' })
      localStorage.setItem("AuthToken", response.data.token)
      dispatch(setUser(response.data.data));
      dispatch(setToken(response.data.token));
      Token(response.data.token);
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message, { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }

  }

  return (
    <div className=''>
      <div class="flex flex-col top-5 my-4 rounded-xl bg-transparent">

        <form class="mt-8 mb-2 m-auto w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div class="mb-1 flex flex-col gap-6 border-2 rounded-lg p-2 shadow-2xl">
            <h4 class="block text-2xl m-auto font-bold text-slate-800">
              Login
            </h4>
            <p class="text-slate-500 m-auto font-light">
              Nice to meet you! Enter your details to Login.
            </p>
            <div class="w-full max-w-sm min-w-[200px]">
              <label class="block mb-2 text-sm text-slate-600">
                Email
              </label>
              <input type="email"
                name='email'
                id='email'
                required
                value={login.email}
                onChange={(e) => setLogin({ ...login, email: e.target.value })}

                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Email" />
            </div>
            <div class="w-full max-w-sm min-w-[200px]">
              <label class="block mb-2 text-sm text-slate-600">
                Password
              </label>
              <input type="password"
                name='password'
                id='password'
                required
                value={login.password}
                onChange={(e) => setLogin({ ...login, password: e.target.value })}
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Password" />
            </div>
            <button
              disabled={loading}
              class="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="submit">
              {loading ? 'Loading...' : 'Login'}

            </button>
            <p class="flex justify-center mt-6 text-sm text-slate-600">
              Don't have an account?
              <Link to="/register" class="ml-1 text-sm font-semibold text-slate-700 underline">
                Register
              </Link>
            </p>
            <p className="flex justify-center mt-2 text-sm text-slate-600">
  Forgot your password?
  <Link to="/forgot-password" className="ml-1 text-sm font-semibold text-slate-700 underline">
    Reset it here
  </Link>
</p>

          </div>
        </form>
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Login
