// SetNewPassword.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../Utils/constant';
import { useNavigate } from 'react-router-dom';

const SetNewPassword = ({ email }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/auth/user/reset-password`, { email, password });
      toast.success("Password reset successfully", { position: "top-center" });
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error resetting password", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-2xl font-bold">Set New Password</h4>
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
        <label className="block text-sm text-slate-600 mb-2">New Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="Enter New Password"
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full mt-4 bg-slate-800 text-white py-2 rounded-md"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default SetNewPassword;
