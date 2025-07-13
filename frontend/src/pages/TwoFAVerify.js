import React, { useState } from 'react';

const TwoFAVerify = ({ onSubmit, error }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Two-Factor Verification</h2>
        <input name="otp" type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Verify OTP</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default TwoFAVerify; 