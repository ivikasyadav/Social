import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            setSuccess('Login successful!');
            navigate('/pub');
        } else {
            setError(result.message || 'Login failed. Try again.');
        }
    };

    const handleFastLoginPublic = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const dummyPublicEmail = 'public@example.com';
        const dummyPublicPassword = 'password123';

        const result = await login(dummyPublicEmail, dummyPublicPassword);
        setLoading(false);

        if (result.success) {
            setSuccess('Public fast login successful!');
            navigate('/pub');
        } else {
            setError(result.message || 'Public fast login failed. Ensure dummy public user exists.');
        }
    };

    const handleFastLoginCelebrity = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const dummyCelebrityEmail = 'celebrity@example.com';
        const dummyCelebrityPassword = 'password123';

        const result = await login(dummyCelebrityEmail, dummyCelebrityPassword);
        setLoading(false);

        if (result.success) {
            setSuccess('Celebrity fast login successful!');
            navigate('/pub'); 
        } else {
            setError(result.message || 'Celebrity fast login failed. Ensure dummy celebrity user exists.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all hover:shadow-3xl">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* --- Fast Login Buttons --- */}
                <div className="mt-4 space-y-4">
                    <button
                        onClick={handleFastLoginPublic}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-4 text-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <span className="inline-flex items-center justify-center gap-2">
                                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Public Logging in...
                            </span>
                        ) : (
                            'Fast Login as Public '
                        )}
                    </button>

                    <button
                        onClick={handleFastLoginCelebrity}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 text-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <span className="inline-flex items-center justify-center gap-2">
                                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Celebrity Logging in...
                            </span>
                        ) : (
                            'Fast Login as Celebrity '
                        )}
                    </button>
                </div>
                
                <p className="mt-8 text-center text-gray-600 text-lg">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;