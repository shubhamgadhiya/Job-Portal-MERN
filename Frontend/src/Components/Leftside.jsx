import React from 'react';

const Leftside = ({ location, role, onChangeLocation, onChangeRole, setSelectedSalaryRange }) => {
  return (
    <>
      <div className="mb-6">
        <h1 className='text-2xl font-bold '>Filter Jobs</h1>
        <hr />
        <h2 className="font-semibold text-lg mb-4">Locations</h2>
        {location.map((location, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              id={`location-${index}`}
              type="checkbox"
              value={location}
              onChange={onChangeLocation}
              className="mr-2"
            />
            <label htmlFor={`location-${index}`} className="text-gray-700">{location}</label>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <hr />
        <h2 className="font-semibold text-lg mb-4">Roles</h2>
        {role.map((role, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              id={`location-${index}`}
              type="checkbox"
              value={role}
              onChange={onChangeRole}
              className="mr-2"
            />
            <label htmlFor={`role-${index}`} className="text-gray-700">{role}</label>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4">Select Salary Range</h2>
        {['Below 9k', '10k - 29k', '30k - 59k', 'Above 60k'].map((range, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              id={`salary-range-${index}`}
              type="radio"
              name="salaryRange"
              value={range}
              onChange={(e) => setSelectedSalaryRange(e.target.value)}
              className="mr-2"
            />
            <label htmlFor={`salary-range-${index}`} className="text-gray-700">{range}</label>
          </div>
        ))}
      </div>

    </>
  );
};

export default Leftside;
