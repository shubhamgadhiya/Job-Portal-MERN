import React, { useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Loader from '../Utils/Loader';
import { useSelector } from 'react-redux';
const Modal = ({ company,job, handleChange, closeModal,handleSubmit}) => {
    const {loading} = useSelector(state => state.Auth);
    useEffect(() => {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);
                
        console.log('company',company )
        console.log('job',job )
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
          
            {job?._id ? 'Edit Job' : 'Add Job'}
       
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              name="role"
              id='role'
              value={job.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter Job Role"
              required
              autoComplete='off'
            />
          </div>
          <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              id='description'
              value={job.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter Job Description"
              required
              autoComplete='off'
            />
          </div>
          </div>
         
          <div className="mb-4 flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
                            name="type"
                            id="type"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            required
                            onChange={handleChange}
                            value={job.type || ""}
                        >
                            <option value="" disabled>Select a Job Type</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Internship">Internship</option>
                        </select>
          </div>
          <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
            </label>
            <input
              type="number"
              name="experience"
              id='experience'
              value={job.experience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter the Experience Level"
              required
              autoComplete='off'
            />
          </div>
          </div>
         
          <div className="mb-4 flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary
            </label>
            <input
              type="number"
              name="salary"
              id='salary'
              value={job.salary}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter the salary"
              required
              autoComplete='off'
            />
          </div>
            <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            No of Position
            </label>
            <input
              type="number"
              name="position"
              id='position'
              value={job.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter The No of Postion"
              required
              autoComplete='off'
            />
          </div>
          </div>
          <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Company
                        </label>
                        <select
                            name="company"
                            id="company"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            required
                            onChange={handleChange}
                            value={job?.company || ""}
                        >
                            <option value="" disabled>Select a Company</option>
                            {company?.map((comp) => (
                                <option key={comp._id} value={comp._id}>
                                    {comp.name}
                                </option>
                            ))}
                        </select>
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
              disabled={loading || !company || company?.length === 0}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"

            >
               
             {loading ? 'Loading...' : job?._id ? 'Update' : 'Add'}
            </button>
          </div>
            {company?.length == 0 || company == undefined && <p className="text-red-500 text-center mt-2">* Please Add Company First</p>}
        </form>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Modal;
