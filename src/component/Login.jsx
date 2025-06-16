import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- import context

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // <-- use login from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await login(email, password); // <-- login call
        setLoading(false);

        if (result.success) {
            setSuccess('Login successful!');
            navigate('/pub');
        } else {
            setError(result.message || 'Login failed. Try again.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="mt-6 text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/register">
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default Login;
