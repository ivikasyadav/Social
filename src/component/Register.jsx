import React, { useState } from 'react';
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Register = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [role, setRole] = useState('public'); 
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate()
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // 1. Register the user
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role,
            });

            console.log('User registered:', response.data);
            setSuccess('Registration successful! Logging in...');

            // 2. Automatically log them in after successful registration
            const loginResult = await login(email, password);

            if (loginResult.success) {
                // 3. Navigate to homepage
                navigate('/');
            } else {
                setError('Registered, but login failed. Please login manually.');
            }

            // 4. Reset form
            setName('');
            setEmail('');
            setPassword('');
            setRole('public');

        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred during registration. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Register</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                </div>

                {/* Email Input Field */}
                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state on change
                        required
                    />
                </div>

                {/* Password Input Field */}
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state on change
                        required
                    />
                </div>

                {/* Role Selection (Optional, can be hidden or set by default) */}
                <div className="mb-6">
                    <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">
                        Role
                    </label>
                    <select
                        id="role"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="public">public</option>
                        <option value="celebrity">celebrity</option>
                        {/* Add more roles as needed */}
                    </select>
                </div>

                {/* Error Message Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {/* Success Message Display */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline ml-2">{success}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            {/* Optional: Link to login page */}
            <p className="mt-6 text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <Link className="text-blue-600 hover:text-blue-800 font-medium" to='/login'>  Login here</Link>
            </p>
        </div>
    );
};

export default Register;