import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiMessageSquare, FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let response;
      
      if (!isLogin) {
        // Signup logic
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          setLoading(false);
          return;
        }
  
        response = await axios.post('http://localhost:7000/api/user/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
  
        toast.success(response.data.message || 'Registration successful!');
      } else {
        // Login logic
        response = await axios.post('http://localhost:7000/api/user/login', {
          email: formData.email,
          password: formData.password
        });
        
        toast.success(response.data.message || 'Login successful!');
      }
  
      // Store token and redirect for both register and login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo',JSON.stringify(response.data.user))
        navigate('/'); // Redirect to home page
      }
  
    } catch (error) {
      // Handle Axios errors
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FiMessageSquare className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-white">ConnectU</h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8 pt-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-1">
              {isLogin ? 'Welcome back' : 'Join us today'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin 
                ? 'Continue your conversations securely'
                : 'Create your account in seconds'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500 text-sm" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm transition group-hover:border-gray-500"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-500 text-sm" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm transition group-hover:border-gray-500"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500 text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm transition group-hover:border-gray-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-400 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500 text-sm" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm transition group-hover:border-gray-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-400 transition"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                  <FiArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>

            <div className="text-center text-xs text-gray-400 pt-2">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300 transition font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    ...formData,
                    confirmPassword: ''
                  });
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}