import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../Component/auth.jsx';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password
    });
    setLoading(false);
    if (result.success) {
      // Redirect to email verification page
      navigate('/verify-email');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            {...register('name', { required: "Full name is required" })}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register('email', { required: "Email is required" })}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register('password', { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: "Confirm your password",
              validate: value => value === watch('password') || "Passwords do not match"
            })}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
