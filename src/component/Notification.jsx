
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useFeed } from '../context/FeedContext'; 
import { useLocation } from 'react-router-dom'; 

const Notification = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const { newPostsQueue, addNewPostToQueue, clearNewPostsQueue } = useFeed(); 
    const location = useLocation(); 

    useEffect(() => {
        if (!socket || !user?._id) return;

        const handleNewPostNotification = (payload) => {
            if (payload?.type === 'create' && payload.post) {
                console.log("New post notification received (via Notification component listener):", payload.post);
                addNewPostToQueue(payload.post);
            }
        };

        socket.on('new-post', handleNewPostNotification);

        return () => {
            socket.off('new-post', handleNewPostNotification);
        };
    }, [socket, user, addNewPostToQueue]);
    useEffect(() => {
        if (location.pathname === '/pub/feed') {
            clearNewPostsQueue();
        }
    }, [location.pathname, clearNewPostsQueue]);


    const handleNotificationClick = () => {
        console.log("Notification clicked. New posts count will be cleared on feed page visit.");
    };

    const unseenPostsCount = location.pathname !== '/pub/feed' ? newPostsQueue.length : 0;

    return (
        <div className="relative cursor-pointer" onClick={handleNotificationClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white hover:text-purple-200 transition duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>
            {unseenPostsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unseenPostsCount}
                </span>
            )}
        </div>
    );
};

export default Notification;