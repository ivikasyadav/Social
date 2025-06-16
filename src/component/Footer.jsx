import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
    const { user } = useAuth();

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-gray-200 shadow-lg z-50">
            <div className="flex justify-around items-center py-4 text-sm text-gray-700">
                {!user && (
                    <>
                        <Link
                            to="/login"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">🔑</span>
                            <span>Login</span>
                        </Link>
                        <Link
                            to="/register"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">📝</span>
                            <span>Register</span>
                        </Link>
                    </>
                )}

                {user?.role === "public" && (
                    <>
                        <Link
                            to="/pub/sidebar"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">🔍</span>
                            <span>Search</span>
                        </Link>
                        <Link
                            to="/pub/"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">📰</span>
                            <span>All Posts</span>
                        </Link>
                        <Link
                            to="/pub/selected"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">👥</span>
                            <span>Following</span>
                        </Link>
                    </>
                )}

                {user?.role === "celebrity" && (
                    <>
                        <Link
                            to="/pub/sidebar"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">🔍</span>
                            <span>Search</span>
                        </Link>
                        <Link
                            to="/pub"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">📰</span>
                            <span>All Posts</span>
                        </Link>
                        <Link
                            to="/celeb/post"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">✏️</span>
                            <span>Create</span>
                        </Link>
                        <Link
                            to="/celeb/myfeed"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">📋</span>
                            <span>My Posts</span>
                        </Link>
                        <Link
                            to="/celeb/selectpost"
                            className="flex flex-col items-center hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">⭐</span>
                            <span>Following</span>
                        </Link>
                    </>
                )}
            </div>
        </footer>
    );
};

export default Footer;
