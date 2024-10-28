import React, { useState } from 'react';
import { BookOpenIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  
    let [open, setOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);

    const {user} = useSelector(state => state.Auth);
    const navigate = useNavigate();

    let userLinks = [
        { name: "Home", link: "/" },
        { name: "Browse", link: "/browse" },    
        { name: "Job", link: "/job" },    
    ];
    let adminLinks = [
        { name: "Company", link: "/admin/company" },
        { name: "Job", link: "/admin/job" },    
        { name: "User", link: "/admin/user" },    
    ];

    const toggle = () => {
        setProfileMenu(!profileMenu);
    }
    
    const profile = () => {
        navigate('/profile');
        setOpen(false)
    }
    const logout = () => {
        localStorage.removeItem('AuthToken')
        navigate("/")
        setOpen(false)
        window.location.reload();
    }
    return (
        <div className='shadow-md w-full sticky top-0 left-0 z-50' >
            <div className='md:flex items-center justify-between bg-white py-4 md:px-10 px-7'>
                <div className='font-bold text-2xl cursor-pointer flex items-center gap-1' >
                    <BookOpenIcon className='w-7 h-7 text-blue-600' onClick={() => navigate("/")} />
                    <span onClick={() => navigate("/")}>Job-Portal</span>
                </div>
                <div onClick={() => setOpen(!open)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                    {
                        open ? <XMarkIcon /> : <Bars3BottomRightIcon  />
                    }
                </div>
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12 h-[95vh]' : 'top-[-490px]'}`}>
                {
  user?.role === "admin"
    ? adminLinks.map((link) => (
        <li className='md:ml-8 md:my-0 my-7 font-semibold' key={link.name} onClick={() => setOpen(false)}>
          <Link to={link.link} className='text-gray-800 hover:text-blue-400 duration-500'>
            {link.name}
          </Link>
        </li>
      ))
    : userLinks.map((link) => (
        <li className='md:ml-8 md:my-0 my-7 font-semibold' key={link.name} onClick={() => setOpen(false)}>
          <Link to={link.link} className='text-gray-800 hover:text-blue-400 duration-500'>
            {link.name}
          </Link>
        </li>
      ))
}
                    {!user ? (
                        <>
                            <button className='btn md:hidden flex my-2 bg-black text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500' onClick={() => setOpen(false)}><Link to="/login">Login</Link></button>
                            <button className='btn md:hidden flex my-2 bg-black text-white md:ml-4 font-semibold px-3 py-1 rounded duration-500 md:static' onClick={() => setOpen(false)}><Link to="/register">Register</Link></button>
                        </>
                    )
                        : (
                            <>
                                <li className='md:ml-8 md:my-0 my-7 font-semibold'
                                onClick={() => profile()} >
                                    <a className='md:hidden text-gray-800 hover:text-blue-400 duration-500'>Profile</a>
                                </li>
                                <li className='md:ml-8 md:my-0 my-7 font-semibold'
                                onClick={() => logout()}>
                                    <a className='md:hidden text-gray-800 hover:text-blue-400 duration-500'>Logout</a>
                                </li>
                            </>
                        )}
                </ul>
                <div className='hidden md:flex md:items-center' >
                    {!user ? (
                        <>
                            <button className='btn bg-black text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static'><Link to="/login">Login</Link></button>
                           <button className='btn bg-black text-white md:ml-4 font-semibold px-3 py-1 rounded duration-500 md:static'><Link to="/register">Register</Link></button>
                        </>
                    ) : (
                        < div>
                            <img
                                alt="profilePicture"
                                src={user?.profilePicture}
                                class="relative inline-block h-10 w-10 cursor-pointer rounded-full object-cover object-center"
                                data-popover-target="profile-menu"
                                onClick={toggle}
                            />
                            {profileMenu && (
                                <ul
                                    role="menu"
                                    data-popover="profile-menu"
                                    data-popover-placement="bottom"
                                    class="absolute z-10 min-w-[180px] overflow-auto right-0 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-sm focus:outline-none"
                                >
                                      <p class="text-slate-800 text-center font-medium ml-2">
                                      {user?.firstName + ' ' + user?.lastName}
                                        </p>
                                    <li
                                        role="menuitem"
                                        onClick={() => profile()} 
                                        class="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-slate-400">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clip-rule="evenodd" />
                                        </svg>

                                        <p class="text-slate-800 font-medium ml-2">
                                            My Profile
                                        </p>
                                    </li>
                                    <li
                                        role="menuitem"
                                        class="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-slate-400">
                                            <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clip-rule="evenodd" />
                                            <path fill-rule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clip-rule="evenodd" />
                                        </svg>

                                        <p class="text-slate-800 font-medium ml-2" onClick={() => logout()}>
                                            Log Out
                                        </p>
                                    </li>

                                </ul>
                            )}
                                 </div>
                    )}

                </div>
            </div>

        </div>
    );
};

export default Header;