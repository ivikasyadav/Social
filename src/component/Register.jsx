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
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                name,
                email,
                password,
                role,
            });

            console.log('User registered:', response.data);
            setSuccess('Registration successful! Logging in...');

            const loginResult = await login(email, password);

            if (loginResult.success) {
                navigate('/pub');
            } else {
                setError('Registered, but login failed. Please login manually.');
            }

            setName('');
            setEmail('');
            setPassword('');
            setRole('public');

        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                set1Error('An unexpected error occurred during registration. Please try again later.'); // Note: Fix to setError
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all hover:shadow-3xl">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Join Us</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="role" className="block text-lg font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                            <option value="public">public</option>
                            <option value="celebrity">celebrity</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-xl text-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-3 rounded-xl text-lg">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <span className="inline-flex items-center justify-center gap-2">
                                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600 text-lg">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-bold underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
