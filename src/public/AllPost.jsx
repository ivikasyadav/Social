import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const AllPost = () => {
    const { token } = useAuth();
    const socket = useSocket();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial feed fetch
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

    // Listen for socket events
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
        <div>
            <h2 className="text-2xl font-semibold mb-4">Feed</h2>
            {loading ? (
                <p>Loading feed...</p>
            ) : posts.length === 0 ? (
                <p>No posts in your feed.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="mb-4 p-4 border rounded shadow">
                        {post.image && (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/${post.image}`}
                                alt="Post"
                                className="w-full h-auto mb-2 rounded"
                                onError={(e) => (e.target.src = '/placeholder.png')}
                            />
                        )}
                        <p className="text-lg">{post.caption}</p>
                        <p className="text-sm text-gray-500">
                            Posted on: {new Date(post.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default AllPost;
