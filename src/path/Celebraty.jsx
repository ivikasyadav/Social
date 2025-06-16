import React, { useEffect } from 'react'
import UserSidebar from '../component/SIdebar';
import Home from '../component/Home';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CreatePost from '../component/CreatePost';
import ProtectedRoute from '../route/Protectedroute';
import RoleBasedRoute from '../route/ROlebased';
import { useAuth } from '../context/AuthContext';
import MyPosts from '../component/Mypost';
import AllPost from '../public/AllPost';
import Feed from '../public/Feed';
import Footer from '../component/Footer';
import Search from '../component/Search'

const Public = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/pub');
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 justify-center">
                <div className="flex w-full max-w-screen-lg">
                    <div className="hidden lg:block">
                        <UserSidebar />
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/post" element={
                                <RoleBasedRoute allowedRoles={['celebrity']}>
                                    <CreatePost />
                                </RoleBasedRoute>
                            } />
                            <Route path="/myfeed" element={
                                <RoleBasedRoute allowedRoles={['celebrity']}>
                                    <MyPosts />
                                </RoleBasedRoute>
                            } />
                            <Route path='/allpost' element={<AllPost />} />
                            <Route path='/selectpost' element={<Feed/>}/>
                       

                                <Route path='/sidebar' element={<Search />} />
                            
                        </Routes>
                        
                    </div>
                    <div className="block lg:hidden">
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Public;
