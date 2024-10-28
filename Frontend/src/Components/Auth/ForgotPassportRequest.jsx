// ForgotPasswordRequest.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../Utils/constant';

const ForgotPasswordRequest = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/auth/user/forgot-password`, { email });
      toast.success("OTP sent to your email", { position: "top-center" });
      onNext(email);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error sending OTP", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-2xl font-bold">Forgot Password</h4>
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
        <label className="block text-sm text-slate-600 mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="Your Email"
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full mt-4 bg-slate-800 text-white py-2 rounded-md"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordRequest;
