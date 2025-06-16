import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust if needed

const CreatePost = () => {
    const { token, user } = useAuth(); // ensure user object contains user._id
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user?._id) {
            socket.emit('join', user._id); // join room with user's ID
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption && !image) {
            setMessage('Please add a caption or select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('caption', caption);
        if (image) formData.append('image', image);

        try {
            const res = await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const createdPost = res.data;

            // Optional: emit post manually (useful for preview or fast sync)
            socket.emit('new-post', createdPost);

            setMessage('Post created successfully!');
            setCaption('');
            setImage(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            setMessage('Failed to create post');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Post</h2>

            {message && <p className="mb-2 text-center text-sm text-blue-500">{message}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Caption</label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        rows="3"
                        placeholder="What's on your mind?"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded-md px-3 py-2"
                    />
                    {preview && (
                        <img src={preview} alt="Preview" className="mt-2 h-40 object-cover rounded-md" />
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
