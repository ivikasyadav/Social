import React from 'react';
import UserSidebar from '../component/SIdebar';
import Feed from '../public/Feed';
import AllPost from '../public/AllPost';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../component/Footer';
import Search from '../component/Search'

const Public = () => {
    const { user, token, logout } = useAuth();

    console.log(token);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 justify-center">
                <div className="flex w-full max-w-screen-lg">
                    <div className="hidden lg:block">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        <Routes>
                            <Route path="/selected" element={<Feed />} />
                            <Route path="/" element={<AllPost />} />
                            <Route path="/sidebar" element={< Search/>} />
                        </Routes>
                    </div>
                    <div className="block lg:hidden">
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Public;
