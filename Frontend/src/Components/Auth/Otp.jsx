// EnterOtp.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../Utils/constant';

const EnterOtp = ({ email, onNext }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/auth/user/verify-otp`, { email, otp });
      toast.success("OTP Verified", { position: "top-center" });
      onNext();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-2xl font-bold">Enter OTP</h4>
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
        <label className="block text-sm text-slate-600 mb-2">OTP</label>
        <input
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="Enter OTP"
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full mt-4 bg-slate-800 text-white py-2 rounded-md"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default EnterOtp;
