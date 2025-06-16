import React, { useEffect, useState } from 'react';
import { useFeed } from '../context/FeedContext';
import { useAuth } from '../context/AuthContext';
import socket from '../utils/socket';
import axios from 'axios';

const Feed = () => {
    const { token, user } = useAuth();
    const { feed, setFeed } = useFeed();
    const [loading, setLoading] = useState(false);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/posts/feed', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFeed(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Failed to fetch feed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchFeed();
        }
    }, [token]);

    useEffect(() => {
        if (!socket || !token || !user?._id) return;

        socket.emit('join', user._id);

        const handleNewPost = (payload) => {
            if (payload?.type === 'create') {
                const postCelebrityId = payload.post?.celebrityId?._id || payload.post?.celebrityId;

                setFeed((prevFeed) => {
                    const alreadyExists = prevFeed.some(p => p._id === payload.post._id);
                    return alreadyExists ? prevFeed : [payload.post, ...prevFeed];
                });
            }
        };

        socket.on('new-post', handleNewPost);

        return () => {
            socket.off('new-post', handleNewPost);
        };
    }, [socket, token, user]);

    return (
        <div className="max-w-lg mx-auto py-4 px-2 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">Your Feed</h2>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : feed.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl shadow-sm">
                    <p className="text-lg text-gray-500">No posts in your feed yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Follow people or create a post to get started!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {feed.map((post) => {
                        const celebrity = typeof post.celebrityId === 'object' ? post.celebrityId : null;
                        const name = celebrity?.name || 'Unknown';

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
                                        src={`http://localhost:5000/uploads/${post.image}`}
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

                                <div className="px-4 py-2">
                                    <span className="text-xs text-gray-400">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Feed;