import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from './../Redux/AuthReducer'
import axios from 'axios';
import Loader from './Utils/Loader';
import { baseUrl } from './Utils/constant';

const Login = () => {
  const dispatch = useDispatch()

  const { user, loading } = useSelector(state => state.Auth);
  const [update, setUpdate] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    resume: [],
    profilePicture: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("firstName", profile.firstName);
    formData.append("lastName", profile.lastName);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    formData.append("resume", profile.resume);
    formData.append("profilePicture", profile.profilePicture);

    try {
      const response = await axios.patch(`${baseUrl}/api/auth/admin/user/update/${user._id}`, formData);
      toast.success("User Updated Successfully", { position: "top-center" });

    } catch (err) {
      toast.error(err?.response?.data?.message, { position: "top-center" });
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    if (user) {
      userDetails();
    }
  }, [user, update])

  const userDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/admin/user/list/${user._id}`);
      setProfile(response.data.data[0])
      setUpdate(true)
    } catch (err) {
      toast.error(err?.response?.data?.message, { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }
  }
  return (
    <div>
      <div class="flex flex-col top-5 my-4 rounded-xl bg-transparent">

        <form class="mt-8 mb-2 m-auto w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div class="mb-1 flex flex-col gap-6 border-2 rounded-lg p-2 shadow-2xl">
            <h4 class="block text-2xl m-auto font-bold text-slate-800">
              Profile
            </h4>
            <p class="text-slate-500 m-auto font-light">
              Nice to meet you! Update your details.
            </p>
            <div class="w-full max-w-sm min-w-[200px]">
              <label class="block mb-2 text-sm text-slate-600">
                First Name
              </label>
              <input
                type="text"
                name='firstName'
                id='firstName'
                required
                autoComplete='off'
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}

                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your First Name" />
            </div>
            <div class="w-full max-w-sm min-w-[200px]">
              <label class="block mb-2 text-sm text-slate-600">
                Last Name
              </label>
              <input
                type="text"
                name='lastName'
                id='lastName'
                required
                autoComplete='off'
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
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
                autoComplete='off'
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Email" />
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
                autoComplete='off'
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Phone Number" />
            </div>
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                Resume
              </label>
              {profile?.resume && typeof profile?.resume === 'string' && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Resume
                </a>
              )}
              <input
                type="file"
                accept="application/pdf"
                required={profile?.resume ? false : true}

                onChange={(e) => setProfile({ ...profile, resume: e.target.files?.[0] })}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>


            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                profilePicture
              </label>
              {profile?.profilePicture && typeof profile?.profilePicture === 'string' && (
                <img src={profile?.profilePicture} alt='Profile' className='h-20 w-20 rounded-full' />
              )}
              <input
                type="file"
                accept="image/*"
                required={profile?.profilePicture ? false : true}

                onChange={(e) => setProfile({ ...profile, profilePicture: e.target.files?.[0] })}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>


            <button
              disabled={loading}
              class="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="submit">
              {loading ? 'Loading...' : 'Update'}

            </button>

          </div>


        </form>
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Login
