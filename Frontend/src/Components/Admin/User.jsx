
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Modal from "./UserModel";
import { setLoading } from '../../Redux/AuthReducer'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from 'react-toastify'
import Loader from '../Utils/Loader';
import { useNavigate } from "react-router-dom";
import { baseUrl } from '../Utils/constant';

const User = () => {
  const { user, loading } = useSelector(state => state.Auth);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null); 
  
  const [userDetails, setUserDetails] = useState({
    profilePicture: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserDetails({ ...userDetails, profilePicture: file });
  };

  const closeModal = () => {
    setShowModal(false);
    setUserDetails({
      profilePicture: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("firstName", userDetails.firstName);
    formData.append("lastName", userDetails.lastName);
    formData.append("email", userDetails.email);
    formData.append("phoneNumber", userDetails.phoneNumber);
    formData.append("role", userDetails.role);
    formData.append("profilePicture", userDetails.profilePicture);

    try {
      await axios.patch(`${baseUrl}/api/auth/admin/user/update/${userDetails._id}`, formData);
      toast.success("User Updated Successfully", { position: "top-center" });
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message, { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const allUserList = async (e) => {
    if (e) e.preventDefault();
    dispatch(setLoading(true));

    let url = `${baseUrl}/api/auth/admin/user/list`;
    if (query) {
      url += `?name=${query}`;
    }

    try {
      const response = await axios.get(url);
      setUserList(response.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching users", { position: "top-center" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      allUserList();
    }
  }, [showModal]);

  const userEdit = (user) => {
    setShowModal(true);
    setUserDetails(user);
    setDropdownOpen(null); 
  };
  const navigate = useNavigate();
  const userViewdata = (user) => {
    setDropdownOpen(null); 
    navigate(`/admin/user/${user._id}`);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const totalPages = Math.ceil(userList.length / usersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto my-10 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 m-2">
    
        <h1 className="text-2xl font-bold">User List</h1>
        <div className="flex w-full md:w-[30%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4">
       <input
            type="text"
            placeholder="search user by firstname / lastname / email / phonenumber / role"
            className="outline-none border-none w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={(e) => allUserList(e)}
            className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition-all">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          userDetails={userDetails}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
        />
      )}
      
      <div className="overflow-x-auto">
        {userList.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No data found</div>
        ) : (
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-200 bg-slate-50">Profile Pic</th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">FirstName</th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">LastName</th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">Email</th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">PhoneNumber</th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">Role</th>
                <th className="p-4 border-b border-slate-200 bg-slate-50 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {userList.slice(indexOfFirstUser, indexOfLastUser).map((user) => (
                <tr key={user.id}>
                  <td className="p-4 py-5">
                    <img src={user.profilePicture} alt={user.firstName} className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="p-4 py-5">{user.firstName}</td>
                  <td className="p-4 py-5">{user.lastName}</td>
                  <td className="p-4 py-5">{user.email}</td>
                  <td className="p-4 py-5">{user.phoneNumber}</td>
                  <td className="p-4 py-5">{user.role}</td>
                  <td className="p-4 py-5 text-right relative">
                    <button onClick={() => toggleDropdown(user._id)} className="p-2">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    {dropdownOpen === user._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => userEdit(user)}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                          Edit
                        </button>
                        <button
                          onClick={() => userViewdata(user)}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                          View
                        </button>
                      </div>
                    )}
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
                className={`px-3 py-1 rounded-lg ${pageNumber === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}>
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

export default User;
