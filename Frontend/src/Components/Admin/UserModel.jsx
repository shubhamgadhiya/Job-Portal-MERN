import React, { useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Loader from '../Utils/Loader';
import { useSelector } from 'react-redux';
const Modal = ({ closeModal, userDetails, handleChange, handleFileChange,handleSubmit, }) => {
    const {loading} = useSelector(state => state.Auth);
    useEffect(() => {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);
  return (
    <div
      className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
       <div className="relative bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-y-auto">
 
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal} 
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
        Edit User
       
        </h2>
        <form onSubmit={handleSubmit}>
         
          <div className="mb-4 flex gap-2">
          <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
              FirstName
            </label>
            <input
              type="text"
              name="firstName"
              id='firstName'
              value={userDetails.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter First Name"
              required
              autoComplete='off'
            />
          </div>
          <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
             LasttName
            </label>
            <input
              type="text"
              name="lastName"
              id='lastName'
              value={userDetails.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter Last Name"
              required
              autoComplete='off'
            />
          </div>
          </div>
         
          <div className="mb-4 flex gap-2">
          <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id='email'
              value={userDetails.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter email"
              required
              autoComplete='off'
            />
          </div>
          <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
             PhoneNumber
            </label>
            <input
              type="number"
              name="PhoneNumber"
              id='PhoneNumber'
              value={userDetails.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter PhoneNumber"
              required
              autoComplete='off'
            />
          </div>
          </div>

          <div className="mb-4 flex gap-2">
          <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <label className="mr-4">
      <input
        type="radio"
        name="role"
        value="user"
        checked={userDetails.role === 'user'}
        onChange={handleChange}
        className="mr-2"
      />
      User
    </label>
    <label>
      <input
        type="radio"
        name="role"
        value="admin"
        checked={userDetails.role === 'admin'}
        onChange={handleChange}
        className="mr-2"
      />
      Admin
    </label>
          </div>
       
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Pic (Image)
            </label>
            {userDetails?.profilePicture && typeof userDetails?.profilePicture === 'string' && (
    <img 
      src={userDetails.profilePicture} 
      alt="Company Logo" 
      className="mb-2 h-20 w-20 rounded-full object-cover" 
    />
  )}
            <input
              type="file"
              name="profilePicture"
                id='profilePicture'
                  accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2"
                required= {userDetails?.profilePicture ? false : true}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              onClick={closeModal}
              disabled={loading} 
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading} 
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
               
             {loading ? 'Loading...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Modal;
