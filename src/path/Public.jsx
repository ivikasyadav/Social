import React from 'react'
import UserSidebar from '../component/SIdebar'
import Home from '../component/Home'
import { Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Feed from '../public/Feed'
import AllPost from '../public/AllPost'

const Public = () => {
     const { user, token, logout } = useAuth();

     console.log(token)
  return (
      <div className="flex flex-col h-screen">
          <div className="flex flex-1">
              <UserSidebar />
              <div className="flex-1 p-2 overflow-y-auto">
                  <Routes>
                      <Route path="/" element={<Feed />} />
                      <Route path='/allpost' element={<AllPost/>}/>
                  </Routes>
              </div>
          </div>
      </div>
  )
}

export default Public