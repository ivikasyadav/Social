import { createContext, useContext, useState } from 'react';

const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
    const [feed, setFeed] = useState([]);

    const addPostsToFeed = (newPosts) => {
        setFeed(prev => [...newPosts, ...prev]);
    };

    const removePostsByCelebrityId = (celebrityId) => {
        setFeed(prev => prev.filter(post => post.celebrityId !== celebrityId));
    };

    return (
        <FeedContext.Provider value={{ feed, setFeed, addPostsToFeed, removePostsByCelebrityId }}>
            {children}
        </FeedContext.Provider>
    );
};

export const useFeed = () => useContext(FeedContext);
