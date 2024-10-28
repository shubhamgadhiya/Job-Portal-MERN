import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setLoading } from '../../Redux/AuthReducer';
import Loader from '../Utils/Loader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { baseUrl } from '../Utils/constant';

const Badge = ({ children, className, variant }) => {
  const baseStyles = "px-3 py-1 rounded-full text-sm";
  const variantStyles = variant === "ghost" ? "bg-gray-100 border border-gray-300" : "bg-blue-500 text-white";

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

const UserDetail = () => {
  const { id } = useParams(); // Get user ID from URL
  const [userDetail, setUserDetail] = useState([]);
  const [company, setCompany] = useState([]);
  const { loading, user } = useSelector(state => state.Auth);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/auth/admin/user/list/${id}`);
        setUserDetail(response.data.data[0]); // Set the user details

        let url = `${baseUrl}/api/auth/application/list/${id}`;
        const companyResponse = await axios.get(url);
        setCompany(companyResponse.data.data);

      } catch (err) {
        toast.error(err?.response?.data?.message || "Error fetching user details", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserDetail();
    }
  }, [user, id]);

  if (loading) return <Loader />;
  return (
    <div className="container mx-auto my-10 px-4 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        {userDetail ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-bold text-3xl text-lg mb-4">User Details</h2>
            <img src={userDetail?.profilePicture} alt="Profile" className="h-20 w-20 rounded-full flex" />
            <h1 className="text-2xl font-bold">{userDetail.firstName} {userDetail.lastName}</h1>
            <p>Email: {userDetail.email}</p>
            <p>Phone Number: {userDetail.phoneNumber}</p>
            <p>Role: {userDetail.role}</p>
            <p>
              Resume: {userDetail.resume ? (
                <a 
                  href={userDetail.resume} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 underline"
                >
                  View Resume
                </a>
              ) : (
                "No resume uploaded"
              )}
            </p>
          </div>
        ) : (
          <div>No user details found.</div>
        )}
      </div>
  
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-bold text-3xl text-lg mb-4">Applied Jobs</h2>
          {company.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {company.map((job, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg shadow-sm">
                  <div>
                    <img src={job?.company.logo} alt={job?.company.name} className="h-10 w-10 rounded-full inline-block" />
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
                      className="px-4 py-2 rounded-md text-white transition bg-red-500"
                    >
                      Applied 
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No jobs available for the selected user.</p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default UserDetail;
