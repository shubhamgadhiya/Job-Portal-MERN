import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { setLoading } from '../Redux/AuthReducer';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from './Utils/Loader';

const Badge = ({ children, className, variant }) => {
    const baseStyles = "px-3 py-1 rounded-full text-sm";
    const variantStyles = variant === "ghost" ? "bg-gray-100 border border-gray-300" : "bg-blue-500 text-white";
    return (
        <span className={`${baseStyles} ${variantStyles} ${className}`}>
            {children}
        </span>
    );
};


const JobList = ({ jobs, resume, onclick }) => {
  const { user, loading } = useSelector(state => state.Auth);
    const dispatch = useDispatch();
  
  const handleClick = async(job) => {
    const datadetails = {
      job: job?._id,
      user: user?._id,
      company: job?.company[0]?._id,
      resume: resume,
      status: "Applied"
  };
    try {
      const response = await axios.post('http://localhost:4000/api/auth/application/create', datadetails);
      toast.success("Application has been successfully.", { position: "top-center" });
      onclick()
 
  } catch (err) {
    toast.error(err?.response?.data?.message, { position: "top-center" });
    console.log(err);
  } finally {
    dispatch(setLoading(false));
  }
  } 
  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Available Jobs</h2>
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Adjust grid layout for 2 jobs per row */}
          {jobs.map((job, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <div>
                  <img src={job?.company[0].logo} alt={job?.company[0].logo} className="h-10 w-10 rounded-full inline-block" />
            
                  <h1 className='m-2 font-medium text-lg inline-block'>{job?.company[0]?.name}</h1>

              </div>
              <div>
                <h1 className="font-bold text-lg my-2">{job?.role}</h1>
                <h2 className='font-bold text-lg my-2'>{job?.company[0]?.locations.join(', ')}</h2>
             
                <p className="text-sm text-gray-600">{job?.description}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Badge className="text-blue-700 font-bold" variant="ghost">{job?.position} Positions</Badge>
                <Badge className="text-[#F83002] font-bold" variant="ghost">{job?.type}</Badge>
                <Badge className="text-[#7209b7] font-bold" variant="ghost">{job?.salary} LPA</Badge>
              </div>
              <div className="flex mt-6">
                <button 
                  onClick={(e) => handleClick(job)}
                  disabled={job.applied ? true : false}
                  className={`px-4 py-2 rounded-md text-white transition 
                    ${job.applied ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {job.applied? "Applied" :  "Apply Now"} 
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs available for the selected filters.</p>
      )}
        {loading && <Loader />}
    </div>
  );
};

export default JobList;
