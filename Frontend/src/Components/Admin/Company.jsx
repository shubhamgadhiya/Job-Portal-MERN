import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Modal from "./CompanyModal";
import { setLoading } from '../../Redux/AuthReducer'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from 'react-toastify'
import Loader from '../Utils/Loader';
import { baseUrl } from '../Utils/constant';
const Company = () => {
  const {user, loading} = useSelector(state => state.Auth);
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [allCompany, setAllCompany] = useState([]);
  const [company, setCompany] = useState({
    logo: "",
    name: "",
    description: "",
    locations: [],
    website: "",
  });
  const [locationInput, setLocationInput] = useState("");
  const  [query, setQuery] = useState("")

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCompany({ ...company, logo: file });
  };
  const closeModal = () => {
    setShowModal(false);
    setLocationInput("");
    setCompany({logo: "", name: "", description: "", locations: [], website: ""});
  }

  const addLocation = () => {
    if (locationInput.trim()) {
      setCompany((prev) => ({
        ...prev,
        locations: [...prev.locations, locationInput],
      }));
      setLocationInput(""); 
    }
  };

  const removeLocation = (index) => {
    setCompany((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const CompanyAdd = () => {
    setShowModal(true);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const formData = new FormData(); 
    formData.append("name", company.name);
    formData.append("description", company.description);
    company.locations.forEach((location) => {
      formData.append("locations[]", location); 
    });
    formData.append("website", company.website);
    formData.append("logo", company.logo);
if(company._id) {
  try {
    const response = await axios.patch(`${baseUrl}/api/auth/admin/company/update/${company._id}`, formData);
    toast.success("Company Updated Successfully", { position: "top-center" });
    closeModal();
  } catch (err) {
    toast.error(err?.response?.data?.message, { position: "top-center" });
    console.log(err);
} finally {
    dispatch(setLoading(false));
}
}else{
  try {
    const response = await axios.post(`${baseUrl}/api/auth/admin/company/add `, formData);
    toast.success("Company Added Successfully", { position: "top-center" });
    closeModal();
  } catch (err) {
    toast.error(err?.response?.data?.message, { position: "top-center" });
    console.log(err);
} finally {
    dispatch(setLoading(false));
}
}
  
  };
  const companyList = async (e) => {
    if (e) e.preventDefault(); 
    dispatch(setLoading(true));

    let url = `${baseUrl}/api/auth/admin/company`;
    if (query) {
      url += `?name=${query}`;
    }

    try {
      const response = await axios.get(url);
      setAllCompany(response.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching companies", { position: "top-center" });
      console.error('Error fetching companies:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if(user){
      companyList();
    }
  }, [showModal]);

  
  const companyEdit = (company) => {
    setCompany(company); 
    setShowModal(true);
  }

  
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 3; 

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  
  const totalPages = Math.ceil(allCompany.length / companiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-2xl font-bold">Company List</h1>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 m-2">
      <div className="flex w-full md:w-[30%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4">
      <input
            type="text"
            placeholder="search company by name"
            className="outline-none border-none w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={(e) => companyList(e)}
           className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition-all">
            <MagnifyingGlassIcon className="h-5 w-5"  />
          </button>
        </div>
        <div>
          <button
            className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md hover:shadow-lg focus:opacity-[0.85]"
            type="button"
            onClick={() => CompanyAdd()}
          >
            Add Company
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          company={company}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          addLocation={addLocation} 
          removeLocation={removeLocation} 
          locationInput={locationInput} 
          setLocationInput={setLocationInput} 
        />
      )}

<div className="overflow-x-auto">
{allCompany.length === 0 ? ( 
    <div className="p-4 text-center text-gray-500">
      No data found
    </div>
  ) : (
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Logo</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Name</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">Description</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">location</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">website</p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-right">
                <p className="text-sm font-normal leading-none text-slate-500">Action</p>
              </th>
            </tr>
          </thead>
          <tbody>
          {allCompany.slice(indexOfFirstCompany, indexOfLastCompany).map((company) => (
              <tr key={company.id}>
                <td className="p-4 py-5">
                  <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-full" />
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{company.name}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{company.description}</p>
                </td>
                <td className="p-4 py-5">
                <p className="text-sm text-slate-600 whitespace-nowrap">
        {company?.locations && company?.locations?.length > 0 ? company.locations.join(', ') : 'No locations'}
      </p>
              </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-600 whitespace-nowrap">{company.website}</p>
                </td>
                <td className="p-4 py-5 text-right">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => companyEdit(company)}
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

export default Company;
