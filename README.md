# 🌟 Social Feed App – Frontend (React)

This is the frontend interface of the Infinite Scroll Social Feed app with real-time updates.

---

## 🔥 Features

### 🧑‍🎤 User Roles
- Celebrity: Can post content (text & image), see their own posts
- Public: Can follow celebrities and see posts from followed users

### 🎯 Functionality
- Infinite scrolling feed
- Real-time notifications when followed celebrities post
- Notification badge updates
- Lazy-loading post images
- Responsive layout for mobile & desktop
- Smooth transitions on scroll
- Mock login buttons for demo

---

## 🖥 Tech Stack

- React + Vite
- Axios
- React Router
- Tailwind CSS or custom CSS
- WebSocket (Socket.IO Client)
- React Toastify / Notification UI
- React Infinite Scroll Component

---

## ⚙️ Setup Instructions

### 1. Navigate to frontend folder

```bash
cd client


2. Install dependencies
bash
Copy
Edit
npm install

3. Create .env file
env
Copy
Edit
VITE_BACKEND_URL=http://localhost:5000

4. Start the development server
bash
Copy
Edit
npm run dev
