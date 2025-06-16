import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const MyPosts = () => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedCaption, setEditedCaption] = useState('');

    const socket = io(import.meta.env.VITE_API_URL, {
        auth: { token },
    });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/self`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedPosts = Array.isArray(response.data?.posts)
                    ? response.data.posts
                    : Array.isArray(response.data)
                        ? response.data
                        : [];
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();

        socket.on('new-post', (newPost) => {
            if (newPost?.author?._id === user?._id) {
                setPosts(prev => [newPost, ...prev]);
            }
        });

        return () => socket.disconnect();
    }, [token, user?._id]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(prev => prev.filter(post => post._id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleEdit = (post) => {
        setEditingPostId(post._id);
        setEditedCaption(post.caption);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/posts/${editingPostId}`,
                { caption: editedCaption },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(prev =>
                prev.map(post => post._id === editingPostId ? response.data : post)
            );
            setEditingPostId(null);
            setEditedCaption('');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className="max-w-lg mx-auto py-4 px-2 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h2>

            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl shadow-sm">
                    <p className="text-lg text-gray-500">No posts found.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {posts.map(post => (
                        <div key={post._id} className="bg-white border rounded-xl shadow-sm relative">
                          
                            <div className="flex items-center gap-2 px-4 py-3 border-b">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="font-medium text-sm text-gray-800">
                                    {user?.name || 'You'}
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

                            <div className="flex items-center gap-4 px-4 py-3">
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
                            </div>

                            <div className="px-4 py-1">
                                <span className="text-sm font-medium text-gray-800">
                                    {post.likes?.length || 0} likes
                                </span>
                            </div>

                            <div className="px-4 py-2 text-sm text-gray-800">
                                {editingPostId === post._id ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1"
                                            value={editedCaption}
                                            onChange={(e) => setEditedCaption(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={handleEditSubmit} className="text-sm text-white bg-blue-500 px-3 py-1 rounded">Save</button>
                                            <button onClick={() => setEditingPostId(null)} className="text-sm text-gray-500">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <strong>{user?.name || 'You'}:</strong> {post.caption}
                                    </>
                                )}
                            </div>

                            <div className="px-4 py-1">
                                <button className="text-sm text-gray-500">View all comments</button>
                            </div>

                            <div className="px-4 py-2 text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleString()}
                            </div>

                            <div className="absolute bottom-4 right-4 flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600"
                                    title="Edit"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPosts;
