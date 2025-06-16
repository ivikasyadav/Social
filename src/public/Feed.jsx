import React, { useEffect } from 'react';
import { useFeed } from '../context/FeedContext';
import { useAuth } from '../context/AuthContext';
import socket from '../utils/socket';
import axios from 'axios';

const Feed = () => {
    const { token } = useAuth();
    const { feed, setFeed, addPostsToFeed } = useFeed();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts/feed', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFeed(res.data);
            } catch (err) {
                console.error('Failed to fetch feed:', err);
            }
        };

        if (token) {
            fetchFeed();
        }
    }, [token]);

    

    useEffect(() => {
        if (!socket.connected) return;

        socket.on('new-post', (payload) => {
            if (payload && payload.type === 'create') {
                addPostsToFeed([payload.post]);
            }
        });

        return () => {
            socket.off('new-post');
        };
    }, [addPostsToFeed]);

    return (
        <div className="flex flex-col gap-4 p-4">
            {feed.length === 0 && <p>No posts yet.</p>}
            {feed.map((post) => (
                <div key={post._id} className="border rounded p-3 shadow bg-white">
                    <h3 className="text-lg font-semibold">{post.caption}</h3>
                    {post.image && (
                        <img
                            src={`http://localhost:5000/uploads/${post.image}`}
                            alt={post.caption}
                            className="mt-2 rounded"
                        />
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                        Posted at: {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Feed;
