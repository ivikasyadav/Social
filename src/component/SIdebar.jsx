import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';

const UserSidebar = () => {
    const { token } = useAuth();
    const { addPostsToFeed, removePostsByCelebrityId } = useFeed();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users');
        }
    };

    const fetchFollowing = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const followedIds = res.data.map(user => user._id);
            setFollowing(followedIds);
        } catch (err) {
            console.error('Failed to fetch following:', err);
        }
    };

    const toggleFollow = async (userId) => {
        const isFollowing = following.includes(userId);
        const endpoint = isFollowing
            ? `${import.meta.env.VITE_API_URL}/api/users/unfollow/${userId}`
            : `${import.meta.env.VITE_API_URL}/api/users/follow/${userId}`;

        try {
            await axios.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (isFollowing) {
                setFollowing(prev => prev.filter(id => id !== userId));
                removePostsByCelebrityId(userId);
            } else {
                setFollowing(prev => [...prev, userId]);
                const postRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/by/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (postRes.data?.length > 0) {
                    addPostsToFeed(postRes.data);
                }
            }
        } catch (err) {
            console.error('Follow/unfollow failed:', err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredUsers(
            users.filter(user =>
                user.name.toLowerCase().includes(value) ||
                user.email?.toLowerCase().includes(value)
            )
        );
    };

    useEffect(() => {
        if (token) {
            Promise.all([fetchUsers(), fetchFollowing()]).finally(() => setLoading(false));
        }
    }, [token]);

    return (
        <div className="w-64 bg-gray-50 h-screen shadow-lg border-r border-gray-200 p-4 overflow-y-auto sticky top-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                All Celebrities
            </h2>

            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name or email"
                className="w-full px-3 py-2 mb-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {loading && <p className="text-gray-500 italic">Loading users...</p>}
            {error && <p className="text-red-500 font-medium">{error}</p>}

            <ul className="space-y-2">
                {filteredUsers.map(user => (
                    <li
                        key={user._id}
                        className="flex flex-col items-start bg-white hover:bg-purple-50 p-3 rounded-lg shadow-sm transition duration-200"
                    >
                        <div className="w-full flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-800">{user.name}</span>
                            {user.role === 'celebrity' && (
                                <button
                                    onClick={() => toggleFollow(user._id)}
                                    className={`px-3 py-1 text-xs md:text-sm rounded-full transition duration-200 ${following.includes(user._id)
                                            ? 'bg-red-400 hover:bg-red-500 text-white'
                                            : 'bg-green-400 hover:bg-green-500 text-white'
                                        }`}
                                >
                                    {following.includes(user._id) ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 truncate">{user.email}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSidebar;
