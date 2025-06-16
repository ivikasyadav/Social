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
        <nav className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-4 py-3 shadow-lg sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link
                    to="/pub"
                    className="text-xl md:text-2xl font-bold hover:text-purple-200 transition duration-300"
                >
                    Social App
                </Link>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
                        {!user && (
                            <>
                                <Link
                                    to="/login"
                                    className="px-3 py-1 rounded-lg bg-purple-500 hover:bg-purple-700 text-white transition duration-300 shadow hover:shadow-md"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-800 text-white transition duration-300 shadow hover:shadow-md"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {user?.role === 'public' && (
                            <>
                                <Link
                                    to="/pub/"
                                    className="px-3 py-1 rounded-lg hover:bg-purple-700 bg-opacity-0 hover:bg-opacity-20 transition duration-300"
                                >
                                    All Posts
                                </Link>
                                <Link
                                    to="/pub/selected"
                                    className="px-3 py-1 rounded-lg hover:bg-purple-700 bg-opacity-0 hover:bg-opacity-20 transition duration-300"
                                >
                                    Following 
                                </Link>
                            </>
                        )}

                        {user?.role === 'celebrity' && (
                            <>
                                <Link
                                    to="/pub"
                                    className="px-3 py-1 rounded-lg hover:bg-purple-700 bg-opacity-0 hover:bg-opacity-20 transition duration-300"
                                >
                                    All Posts
                                </Link>
                                <Link
                                    to="/celeb/post"
                                    className="px-3 py-1 rounded-lg hover:bg-purple-700 bg-opacity-0 hover:bg-opacity-20 transition duration-300"
                                >
                                    Create Post
                                </Link>
                                <Link
                                    to="/celeb/myfeed"
                                    className="px-3 py-1 rounded-lg hover:bg-purple-700 bg-opacity-0 hover:bg-opacity-20 transition duration-300"
                                >
                                    My Posts
                                </Link>
                                <Link
                                    to="/celeb/selectpost"
                                    className="px-3 py-1 rounded-lg hover:bg-purple-700 bg-opacity-0 hover:bg-opacity-20 transition duration-300"
                                >
                                    Following 
                                </Link>
                            </>
                        )}
                    </div>

                    {user && (
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <span className="text-sm md:text-base font-medium bg-purple-700 bg-opacity-30 px-3 py-1 rounded-lg">
                                👋 Hello, {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-300 shadow hover:shadow-md"
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
