import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const AllPost = () => {
    const { token } = useAuth();
    const socket = useSocket();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/feed/mixed`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Failed to fetch feed:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, [token]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new-post', (data) => {
            console.log("Socket received:", data);
            if (data.type === 'create') {
                setPosts(prev => [data.post, ...prev]);
            } else if (data.type === 'update') {
                setPosts(prev => prev.map(p => p._id === data.post._id ? data.post : p));
            } else if (data.type === 'delete') {
                setPosts(prev => prev.filter(p => p._id !== data.postId));
            }
        });

        return () => socket.off('new-post');
    }, [socket]);

    return (
        <div className="max-w-lg mx-auto  sm:px-0">
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl shadow-sm">
                    <p className="text-lg text-gray-500">No posts in your feed yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Follow someone to see their posts!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                       
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                     
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    {post.celebrityId?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="font-medium text-sm text-gray-800">
                                    {post.celebrityId?.name || "Unknown"}
                                </span>
                            </div>
                            {post.image && (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/${post.image}`}
                                    alt={post.caption}
                                    className="w-full aspect-square object-cover"
                                    onError={(e) => (e.target.src = '/placeholder.png')}
                                />
                            )}
                        
                            {/* <div className="flex items-center gap-4 px-4 py-3">
                                <button className="text-xl hover:text-gray-600">
                                    ❤️
                                </button>
                                <button className="text-xl hover:text-gray-600">
                                    💬
                                </button>
                                <button className="text-xl hover:text-gray-600">
                                    ↪️
                                </button>
                                <div className="flex-1"></div>
                                <button className="text-xl hover:text-gray-600">
                                    ⋯
                                </button>
                            </div> */}
                            {/* Likes (placeholder) */}
                            {/* <div className="px-4 py-1">
                                <span className="text-sm font-medium text-gray-800">
                                    {post.likes?.length || 0} likes
                                </span>
                            </div> */}
                           
                            <div className="px-4 py-1">
                                <span className="text-sm font-medium text-gray-800">
                                    {post.celebrityId?.name || "Unknown"}
                                </span>
                                <span className="text-sm text-gray-800 ml-1">
                                    {post.caption}
                                </span>
                            </div>

                            {/* <div className="px-4 py-1">
                                <button className="text-sm text-gray-500">View all comments</button>
                            </div> */}
                            {/* Timestamp */}
                            <div className="px-4 py-2">
                                <span className="text-xs text-gray-400">
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllPost;
