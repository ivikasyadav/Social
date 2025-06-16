import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 shadow-lg sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="text-xl md:text-2xl font-bold hover:text-blue-200 transition duration-200">
                    Social App
                </Link>

                <div className="flex items-center space-x-4 md:space-x-6">
                    {!user && (
                        <>
                            <Link to="/login" className="px-3 py-1 rounded hover:bg-blue-700 transition duration-200">
                                Login
                            </Link>
                            <Link to="/register" className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 transition duration-200">
                                Register
                            </Link>
                        </>
                    )}

                    {user?.role === 'public' && (
                        <>
                            <Link to="/" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                Home
                            </Link>
                            <Link to="/explore" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                Explore
                            </Link>
                            <Link to="/profile" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                My Profile
                            </Link>
                            <Link to="/pub/allpost" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                All Post
                            </Link>
                        </>
                    )}

                    {user?.role === 'celebrity' && (
                        <>
                            <Link to="/" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                Dashboard
                            </Link>
                            <Link to="/celeb/post" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                Create Post
                            </Link>
                            <Link to="/celeb/myfeed" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                My Feed
                            </Link>
                            <Link to="/celeb/allpost" className="px-2 py-1 rounded hover:bg-blue-700 transition duration-200">
                                All post
                            </Link>
                        </>
                    )}

                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm md:text-base font-medium hidden sm:inline">
                                Hello, {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
