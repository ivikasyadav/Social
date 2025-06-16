// src/components/UserSidebar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';

const UserSidebar = () => {
    const { token } = useAuth();
    const { addPostsToFeed, removePostsByCelebrityId } = useFeed();

    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users');
        }
    };

    // Fetch who the current user is following
    const fetchFollowing = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/following', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const followedIds = res.data.map(user => user._id);
            setFollowing(followedIds);
        } catch (err) {
            console.error('Failed to fetch following:', err);
        }
    };

    // Toggle follow/unfollow
    const toggleFollow = async (userId) => {
        const isFollowing = following.includes(userId);
        const endpoint = isFollowing
            ? `http://localhost:5000/api/users/unfollow/${userId}`
            : `http://localhost:5000/api/users/follow/${userId}`;

        try {
            await axios.post(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (isFollowing) {
                setFollowing(prev => prev.filter(id => id !== userId));
                removePostsByCelebrityId(userId); // ✅ Remove posts of unfollowed user
            } else {
                setFollowing(prev => [...prev, userId]);

                // ✅ Add posts of newly followed user
                const postRes = await axios.get(`http://localhost:5000/api/posts/by/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (postRes.data?.length > 0) {
                    addPostsToFeed(postRes.data);
                }
            }
        } catch (err) {
            console.error('Follow/unfollow failed:', err);
        }
    };

    useEffect(() => {
        if (token) {
            Promise.all([fetchUsers(), fetchFollowing()]).finally(() => setLoading(false));
        }
    }, [token]);

    return (
        <div className="w-64 bg-white h-screen shadow-lg border-r p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Users</h2>

            {loading && <p className="text-gray-500">Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2">
                {users.map(user => (
                    <li
                        key={user._id}
                        className="flex justify-between items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-md text-gray-800"
                    >
                        <span>{user.name}</span>
                        {user.role === 'celebrity' && (
                            <button
                                onClick={() => toggleFollow(user._id)}
                                className={`px-2 py-1 text-sm rounded ${following.includes(user._id)
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                {following.includes(user._id) ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSidebar;
