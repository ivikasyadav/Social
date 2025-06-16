import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const MyPosts = () => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize socket
    const socket = io(import.meta.env.VITE_API_URL, {
        auth: {
            token,
        },
    });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/self`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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

        // Listen for new post events
        socket.on('new-post', (newPost) => {
            if (newPost?.author?._id === user?._id) {
                setPosts((prev) => [newPost, ...prev]);
            }
        });

        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, [token, user?._id]);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">My Posts</h2>
            {loading ? (
                <p>Loading posts...</p>
            ) : posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="mb-4 p-4 border rounded shadow">
                        {post.image && (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/${post.image}`}
                                alt="Post"
                                className="w-full h-auto mb-2 rounded"
                                onError={(e) => {
                                    e.target.src = '/placeholder.png';
                                }}
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

export default MyPosts;
