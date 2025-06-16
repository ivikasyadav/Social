import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext'; 

const AllPost = () => {
    const { token, user } = useAuth();
    const socket = useSocket(); 
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentTexts, setCommentTexts] = useState({});

    const fetchMixedFeed = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/feed/mixed`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch mixed feed:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMixedFeed();
        }
    }, [token]);


    const handleToggleLike = async (postId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`,
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

           
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? response.data.post : post
                )
            );
        } catch (error) {
            console.error('Error toggling like:', error);
          
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentTexts(prev => ({ ...prev, [postId]: text }));
    };

    const handleAddComment = async (postId) => {
        const text = commentTexts[postId];
        if (!text || text.trim() === '') {
            alert('Comment cannot be empty!');
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/posts/${postId}/comment`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

          
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: [...post.comments, response.data.comment] 
                        }
                        : post
                )
            );
            setCommentTexts(prev => ({ ...prev, [postId]: '' })); 
        } catch (error) {
            console.error('Error adding comment:', error);
            
        }
    };
    const handleSocketPostEvent = useCallback((payload) => {
        if (payload?.type === 'update' && payload.post) {
            const updatedPost = payload.post;
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                )
            );
        } else if (payload?.type === 'delete' && payload.postId) {
            setPosts(prevPosts => prevPosts.filter(p => p._id !== payload.postId));
        }
    }, []); 

    useEffect(() => {
        if (!socket) return;

        socket.on('new-post', handleSocketPostEvent);

        return () => {
            socket.off('new-post', handleSocketPostEvent);
        };
    }, [socket, handleSocketPostEvent]); 

    return (
        <div className="max-w-lg mx-auto py-4 px-2 sm:px-0"> 
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">All Posts</h2>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl shadow-sm">
                    <p className="text-lg text-gray-500">No posts available yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Check back later or explore different sections!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {posts.map((post) => {
                        const celebrity = typeof post.celebrityId === 'object' ? post.celebrityId : null;
                        const name = celebrity?.name || 'Unknown';
                        const currentUserLiked = post.likes.includes(user?._id);

                        return (
                            <div key={post._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        {name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-sm text-gray-800">
                                        {name}
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

                                <div className="px-4 py-1">
                                    <span className="text-sm font-medium text-gray-800">
                                        {name}
                                    </span>
                                    <span className="text-sm text-gray-800 ml-1">
                                        {post.caption}
                                    </span>
                                </div>

                                <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100">
                                    <button
                                        onClick={() => handleToggleLike(post._id)}
                                        className={`flex items-center gap-1 text-sm font-medium ${currentUserLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-600 transition duration-200`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 ${currentUserLiked ? 'fill-current' : 'fill-none'}`}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill={currentUserLiked ? 'red' : 'none'} 
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {post.likes.length > 0 && <span>{post.likes.length}</span>}
                                        <span>Like</span>
                                    </button>

                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.378l2.628 2.36c.544.488 1.407.02 1.407-.749V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v10.5z" />
                                        </svg>
                                        <span>{post.comments.length} Comments</span>
                                    </div>

                                    <span className="text-xs text-gray-400">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                <div className="px-4 py-2 border-t border-gray-100">
                                    {post.comments.length > 0 && (
                                        <div className="mb-2 max-h-40 overflow-y-auto">
                                            {post.comments.map((comment) => (
                                                <div key={comment._id} className="text-sm mb-1">
                                                    <span className="font-semibold text-gray-700">
                                                        {comment.user?.name || 'Unknown User'}:
                                                    </span>{' '}
                                                    <span className="text-gray-600">{comment.text}</span>
                                                    <span className="text-xs text-gray-400 ml-2">
                                                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={commentTexts[post._id] || ''}
                                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddComment(post._id);
                                                }
                                            }}
                                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                        <button
                                            onClick={() => handleAddComment(post._id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium transition duration-200"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllPost;
