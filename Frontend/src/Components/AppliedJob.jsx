import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setLoading } from '../Redux/AuthReducer';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from './Utils/Loader';
import { baseUrl } from './Utils/constant';

const Badge = ({ children, className, variant }) => {
  const baseStyles = "px-3 py-1 rounded-full text-sm";
  const variantStyles = variant === "ghost" ? "bg-gray-100 border border-gray-300" : "bg-blue-500 text-white";
  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};


const AppliedJob = () => {
  const { user, loading } = useSelector(state => state.Auth);
  const [job, setJob] = useState([])
  const dispatch = useDispatch();

  const JobList = async () => {
    dispatch(setLoading(true));
    let url = `${baseUrl}/api/auth/application/list/${user._id}`;
    try {
      const response = await axios.get(url);
      setJob(response.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching jobs", { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      JobList();
    }
  }, [])

  return (
    <div className='m-4'>
      <h2 className="font-semibold text-lg mb-4">Applied Jobs</h2>
      {job.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {job.map((job, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <div>
                <img src={job?.company.logo} alt={job?.company.logo} className="h-10 w-10 rounded-full inline-block" />

                <h1 className='m-2 font-medium text-lg inline-block'>{job?.company?.name}</h1>

              </div>
              <div>
                <h1 className="font-bold text-lg my-2">{job?.job?.role}</h1>
                <h2 className='font-bold text-lg my-2'>{job?.company?.locations.join(', ')}</h2>

                <p className="text-sm text-gray-600">{job?.job?.description}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Badge className="text-blue-700 font-bold" variant="ghost">{job?.job?.position} Positions</Badge>
                <Badge className="text-[#F83002] font-bold" variant="ghost">{job?.job?.type}</Badge>
                <Badge className="text-[#7209b7] font-bold" variant="ghost">{job?.job?.salary} LPA</Badge>
              </div>
              <div className="flex mt-6">
                <button
                  disabled={true}
                  className={`px-4 py-2 rounded-md text-white transition bg-red-500`}
                >
                  Applied
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

export default AppliedJob;
