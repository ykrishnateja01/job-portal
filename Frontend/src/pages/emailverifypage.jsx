import React, { useState } from 'react';
import { useAuth } from '../Component/auth.jsx';
import { useNavigate } from 'react-router-dom';

const EmailVerifyPage = () => {
  const { verifyEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await verifyEmail(email.trim(), code.trim());
    setLoading(false);

    if (result.success) {
      // Redirect to home page after successful verification
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Verify Your Email</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="code" className="block mb-1 font-medium">
            6-Digit Verification Code
          </label>
          <input
            type="text"
            id="code"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // only digits allowed
            placeholder="123456"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
};

export default EmailVerifyPage;
