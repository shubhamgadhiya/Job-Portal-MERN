import React, { useEffect, useState } from 'react';
import Leftside from './Leftside';
import Rightside from './Rightside';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../Redux/AuthReducer';
import Loader from './Utils/Loader';
import { baseUrl } from './Utils/constant';

const Browse = () => {
    const { user, loading } = useSelector(state => state.Auth);
    const dispatch = useDispatch();
    const [location, setLocation] = useState([]);
    const [role, setRole] = useState([]);
    const [allJob, setAllJob] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedRole, setSelectedRole] = useState([]);
    const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
    const [resume, setResume] = useState("");
    const [update, setUpdate] = useState(false)

    const onChangeLocation = (e) => {
        const value = e.target.value;
        setSelectedLocation(prev =>
            prev.includes(value) ? prev.filter(loc => loc !== value) : [...prev, value]
        );
    };
    const onChangeRole = (e) => {
        const value = e.target.value;
        setSelectedRole(prev =>
            prev.includes(value) ? prev.filter(role => role !== value) : [...prev, value]
        );
    };
    const onclick = () => {
        setUpdate(true)
    }

    const JobList = async () => {
        dispatch(setLoading(true));
        const locationQuery = selectedLocation.length ? selectedLocation.join(',') : '';
        const roleQuery = selectedRole.length ? selectedRole.join(',') : '';
        const salaryQuery = selectedSalaryRange ? selectedSalaryRange : '';

        let url = `${baseUrl}/api/auth/admin/job?locations=${locationQuery}&role=${roleQuery}&salaryRange=${salaryQuery}`;
        try {
            const response = await axios.get(url);
            setAllJob(response.data.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error fetching jobs", { position: "top-center" });
        } finally {
            dispatch(setLoading(false));
        }
    };

    const jobRoleLocation = async () => {
        dispatch(setLoading(true));
        let url = `${baseUrl}/api/auth/admin/job/role-location`;
        try {
            const response = await axios.get(url);
            setRole(response.data.data.job);
            setLocation(response.data.data.location);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error fetching roles and locations", { position: "top-center" });
        } finally {
            dispatch(setLoading(false));
        }
    };
    const userDetails = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/auth/admin/user/list?_id=${user._id}`);
            setResume(response.data.data[0]?.resume)

        } catch (err) {
            toast.error(err?.response?.data?.message, { position: "top-center" });
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(() => {
        userDetails()
        JobList();
    }, [])

    useEffect(() => {
        if (user) {
            jobRoleLocation();
            JobList();
        }
    }, [update, selectedLocation, selectedRole, selectedSalaryRange]);

    return (
        <div className="flex flex-col sm:flex-row p-6">
            <div className="w-full sm:w-1/4 p-4 border-b sm:border-b-0 sm:border-r border-gray-200">
                <Leftside
                    location={location}
                    role={role}
                    onChangeLocation={onChangeLocation}
                    onChangeRole={onChangeRole}
                    setSelectedSalaryRange={setSelectedSalaryRange}
                />
            </div>

            <div className="w-full sm:w-3/4 p-4">
                <Rightside jobs={allJob} resume={resume} onclick={onclick} />
            </div>
            {loading && <Loader />}
        </div>
    );
};

export default Browse;
