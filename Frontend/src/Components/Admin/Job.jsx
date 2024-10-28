import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Modal from "./JobModal";
import { setLoading } from '../../Redux/AuthReducer'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from 'react-toastify'
import Loader from '../Utils/Loader';
import { baseUrl } from '../Utils/constant';

const Job = () => {
  const { user, loading } = useSelector(state => state.Auth);
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState();
  const [job, setJob] = useState({
    role: "",
    description: "",
    type: "",
    experience: "",
    salary: "",
    position: "",
    company: "",
  });
  const [allJob, setAllJob] = useState([]);
  const  [query, setQuery] = useState("")


  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const JobAdd = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setJob({ role: "", description: "", type: "", experience: "", salary: "", position: "", company: "" });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true))
    if(job._id){
      try {
        const response = await axios.patch(`${baseUrl}api/auth/admin/job/update/${job._id}`, job);
        toast.success("Job Added Successfully", { position: "top-center" });
        closeModal();
      } catch (err) {
        toast.error(err?.response?.data?.message, { position: "top-center" });
    } finally {
        dispatch(setLoading(false));
    }
    } else{

      try {
        const response = await axios.post(`${baseUrl}/api/auth/admin/job/add`, job);
        toast.success("Job Added Successfully", { position: "top-center" });
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message, { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }
  };
}

  const CompanyList = async (e) => {
    dispatch(setLoading(true));

    let url = `${baseUrl}/api/auth/admin/company`;
    try {
      const response = await axios.get(url);
      setCompany(response.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching companies", { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }
  };
    
  console.log('query',query )
  const JobList = async (e) => {
    if (e) e.preventDefault();
    dispatch(setLoading(true));

    let url = `${baseUrl}/api/auth/admin/job`;
    if (query) {
      url += `?role=${query}`;
    }

    try {
      const response = await axios.get(url);
      setAllJob(response.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching companies", { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if(user) {

      CompanyList();
      JobList();
    }
  }, [showModal])

  const jobEdit = (job) => {
    setJob({ ...job, company: job?.company[0]?._id });
    setShowModal(true);
  }
  
    
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 3; 

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  
  const totalPages = Math.ceil(allJob.length / companiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-2xl font-bold">Job List</h1>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 m-2">
      <div className="flex w-full md:w-[30%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4">
      <input
            type="text"
            placeholder="search jobs by role"
            className="outline-none border-none w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={(e) => JobList(e)}
            className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition-all">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
        <div>
          <button
            className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md hover:shadow-lg focus:opacity-[0.85]"
            type="button"
            onClick={() => JobAdd()}
          >
            Add Job
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          company={company}
          job={job}
          handleChange={handleChange}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
        />
      )}
      <div className="overflow-x-auto">
{allJob.length === 0 ? ( // Check if the array is empty
    <div className="p-4 text-center text-gray-500">
      No data found
    </div>
  ) : (
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Company</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Role</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Description</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Job Type</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Experience Level</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Salary</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">No of position</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-right">
                <p className="text-sm font-normal leading-none text-slate-500">Action</p>
              </th>
            </tr>
          </thead>
          <tbody>
          {allJob.slice(indexOfFirstCompany, indexOfLastCompany).map((job) => (
              <tr key={job.id}>
                
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{job?.company[0]?.name}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{job.role}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{job.description}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{job.type}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{job.experience}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{job.salary}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{job.position}</p>
                </td>
               
                <td className="p-4 py-5 text-right">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => jobEdit(job)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  )}
      </div>

      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <li key={pageNumber}>
              <button
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 rounded-lg ${
                  pageNumber === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      </div>
    
      {loading && <Loader />}
    </div>
  );
};

export default Job;
