import React from 'react';

const Badge = ({ children, className, variant }) => {
    const baseStyles = "px-3 py-1 rounded-full text-sm";
    const variantStyles = variant === "ghost" ? "bg-gray-100 border border-gray-300" : "bg-blue-500 text-white";
    return (
        <span className={`${baseStyles} ${variantStyles} ${className}`}>
            {children}
        </span>
    );
};


const JobOpenings = ({ allJobs = [], onClick }) => {

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
            </h1>
            <div className='grid  grid-cols-1 sm:grid-cols-3 gap-4 my-5'>
                {allJobs.length === 0 ? (
                    <span className='col-span-3 text-center text-gray-500'>No Job Available</span>
                ) : (
                    allJobs.slice(0, 6).map((job) => (
                        <LatestJobCards key={job._id} job={job} onClick={onClick} />
                    ))
                )}
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                    View More
                </button>
            </div>

        </div>
    );
};

const LatestJobCards = ({ job, onClick }) => {
    return (
        <div
            onClick={onClick}
            className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer transition duration-300 hover:shadow-2xl'
        >
            <div>
                <img src={job?.company[0].logo} alt={job?.company[0].logo} className="h-10 w-10 rounded-full inline-block" />

                <h1 className='m-2 font-medium text-lg inline-block'>{job?.company[0]?.name}</h1>

            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.role}</h1>
                <h2 className='font-bold text-lg my-2'>{job?.company[0]?.locations.join(', ')}</h2>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className='text-blue-700 font-bold' variant="ghost">{job?.position} Positions</Badge>
                <Badge className='text-[#F83002] font-bold' variant="ghost">{job?.type}</Badge>
                <Badge className='text-[#7209b7] font-bold' variant="ghost">{job?.salary} LPA</Badge>
            </div>
            <div className="flex mt-6">
                <button
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobOpenings;
