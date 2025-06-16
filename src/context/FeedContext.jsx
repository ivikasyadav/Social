import React, { createContext, useContext, useState } from 'react';

const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
    const [feed, setFeed] = useState([]);
    const [newPostsQueue, setNewPostsQueue] = useState([]); 

    const addPostsToFeed = (newPostsToAdd) => { 
        setFeed(prev => [...newPostsToAdd, ...prev]);
    };

    const removePostsByCelebrityId = (celebrityId) => {
        setFeed(prev => prev.filter(post => post.celebrityId !== celebrityId));
        setNewPostsQueue(prev => prev.filter(post => post.celebrityId !== celebrityId));
    };

    const addNewPostToQueue = (newPost) => {
        setNewPostsQueue(prev => [newPost, ...prev]);
    };

    const clearNewPostsQueue = () => {
        setNewPostsQueue([]);
    };
    const contextValue = {
        feed,
        setFeed,
        addPostsToFeed,
        removePostsByCelebrityId,
        newPostsQueue, 
        addNewPostToQueue,
        clearNewPostsQueue, 
        setNewPostsQueue
    };

    return (
        <FeedContext.Provider value={contextValue}>
            {children}
        </FeedContext.Provider>
    );
};

export const useFeed = () => useContext(FeedContext);