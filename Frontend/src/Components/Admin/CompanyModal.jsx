import React, { useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Loader from '../Utils/Loader';
import { useSelector } from 'react-redux';
const Modal = ({ closeModal, company, handleChange, handleFileChange,handleSubmit, addLocation, removeLocation , locationInput, setLocationInput}) => {
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
        {company?._id ? 'Edit Company' : 'Add Company'}
       
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              id='name'
              value={company.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter Company Name"
              required
              autoComplete='off'
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              id='description'
              value={company.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter Company Description"
              required
              autoComplete='off'
            />
          </div>
         


          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locations
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name='location'
                id='location'
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-grow border border-gray-300 rounded-lg p-2"
                placeholder="Enter Company Location"
                autoComplete='off'
                
              />
              <button
                type="button"
                className="ml-2 bg-blue-500 text-white rounded-lg px-4"
                onClick={addLocation}
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {company.locations.map((location, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{location}</span>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => removeLocation(index)}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="text"
              name="website"
              id='website'
              value={company.website}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter Company Website"
              required
              autoComplete='off'
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo (Image)
            </label>
            {company?.logo && typeof company.logo === 'string' && (
    <img 
      src={company.logo} 
      alt="Company Logo" 
      className="mb-2 h-20 w-20 rounded-full object-cover" 
    />
  )}
            <input
              type="file"
              name="logo"
                id='logo'
                  accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2"
                required= {company?.logo ? false : true}
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
               
             {loading ? 'Loading...' : company?._id ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Modal;
