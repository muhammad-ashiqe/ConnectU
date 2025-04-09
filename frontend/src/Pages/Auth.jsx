import React, { useState, useRef } from 'react';
import { FiEye, FiEyeOff, FiMessageSquare, FiUser, FiMail, FiLock, FiCamera, FiArrowRight } from 'react-icons/fi';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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

          <form className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Full name"
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
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm transition group-hover:border-gray-500"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500 text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
              <>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-500 text-sm" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
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

                <div className="flex justify-center">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center text-xs text-gray-300 hover:text-white transition"
                    >
                      {previewImage ? (
                        <>
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2 border border-gray-600">
                            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                          </div>
                          Change photo
                        </>
                      ) : (
                        <>
                          <FiCamera className="mr-1.5 text-gray-400" />
                          Add profile photo (optional)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center group"
            >
              <span>{isLogin ? 'Sign in' : 'Create account'}</span>
              <FiArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <div className="text-center text-xs text-gray-400 pt-2">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300 transition font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPreviewImage(null);
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