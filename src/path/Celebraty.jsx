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

const Public = () => {
    const { user, token, logout } = useAuth();
    const navigate=useNavigate()

    console.log(user)
    console.log(token)

    useEffect(() => {
        if (!user) {
            navigate('/pub');
        }
    }, [user, navigate]);
      

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <UserSidebar />
                <div className="flex-1 p-2 overflow-y-auto">
                    {/* <SmallNavbar2 /> */}
                    <Routes>
                        
                        <Route path="/" element={<Home />} />
                        {/* <Route path='/post' element={<CreatePost/>}/> */}
                        {/* <ROute path='/myfeed' element= */}


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
                        
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Public