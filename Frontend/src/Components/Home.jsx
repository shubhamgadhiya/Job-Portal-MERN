import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import JobOpenings from './JobDetails';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setLoading } from '../Redux/AuthReducer';
import { useSelector } from 'react-redux';
import { baseUrl } from './Utils/constant';
import Loader from './Utils/Loader';
const Home = () => {
    const { user, loading } = useSelector(state => state.Auth);
    const [query, setQuery] = useState("");
    const [allJob, setAllJob] = useState([]);
    const [role, setRole] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const JobList = async (e) => {
        if (e) e.preventDefault();
        dispatch(setLoading(true));
        let url = `${baseUrl}/api/auth/admin/job`;
        if (query) {
            url += `?role=${query}`;
        }

        try {
            const response = await axios.get(url);
            console.log(response.data.data);
            setAllJob(response.data.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error fetching companies", { position: "top-center" });
            console.error('Error fetching companies:', err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const jobRole = async () => {
        dispatch(setLoading(true));
        let url = `${baseUrl}/api/auth/admin/job/role-location`;

        try {
            const response = await axios.get(url);
            console.log(response.data.data);
            setRole(response.data.data.job);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error fetching companies", { position: "top-center" });
            console.error('Error fetching companies:', err);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(() => {
        JobList();
        jobRole();
    }, [])

    const Carousel = ({ children, className = "" }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const items = React.Children.toArray(children);

        const handleNext = () => {
            setCurrentIndex((prevIndex) => (prevIndex < items.length / 2 - 1 ? prevIndex + 1 : 0));
        };

        const handlePrevious = () => {
            setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : Math.floor(items.length / 2) - 1));
        };

        return (
            <div className={`relative overflow-hidden ${className}`}>
                <div className="flex transition-transform duration-500 ease-in-out text-center" style={{ transform: `translateX(-${currentIndex * (100 / 2)}%)` }}>
                    {children}
                </div>
                <CarouselPrevious onClick={handlePrevious} />
                <CarouselNext onClick={handleNext} />
            </div>
        );
    };

    const CarouselItem = ({ children, className = "" }) => {
        return (
            <div className={`carousel-item flex-shrink-0 w-1/2 ${className}`}>
                {children}
            </div>
        );
    };

    const CarouselNext = ({ onClick }) => {
        return (
            <button
                onClick={onClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition"
            >
                <ChevronRightIcon className='h-5 w-5' />
            </button>
        );
    };

    const CarouselPrevious = ({ onClick }) => {
        return (
            <button
                onClick={onClick}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition"
            >
                <ChevronLeftIcon className='h-5 w-5' />
            </button>
        );
    };
    const handleClick = () => {
        if (user) {
            navigate("/browse")
        } else {
            toast.error("please Login First", { position: "top-center" })
        }
        navigate("/browse")
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='text-center '>
                <div className='flex flex-col gap-5 my-10'>
                    <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[rgb(248,48,2)] font-medium'>ob Search Website</span>
                    <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#457cea]'>Dream Jobs</span></h1>
                    <p>The Online Job Portal Project is a web-based platform designed to connect job seekers with potential employers in an efficient and user-friendly manner.</p>
                    <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                        <input
                            type="text"
                            placeholder='Find your dream jobs'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='outline-none border-none w-full'
                        />
                        <button
                            onClick={(e) => JobList(e)}
                            className='bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition-all'
                        >
                            <MagnifyingGlassIcon className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-xl mx-auto my-20">
                <Carousel>
                    {role.map((cat, index) => (
                        <CarouselItem key={index}>
                            <button
                                onClick={() => setQuery(cat)}
                                className="w-half mx-auto rounded-full border border-gray-300 px-4 py-2 hover:bg-gray-100"
                            >
                                {cat}
                            </button>
                        </CarouselItem>
                    ))}
                </Carousel>
            </div>
            <JobOpenings allJobs={allJob} onClick={handleClick} />
            {loading && <Loader />}
        </div>
    );
};

export default Home;
