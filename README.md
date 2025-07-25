# 🌍 GlobalLoop - Erasmus-Style Project Discovery Platform

A comprehensive web platform that connects students and volunteers with Erasmus-style projects worldwide. Discover, review, and engage with volunteer opportunities, cultural exchanges, and educational projects across the globe.

## ✨ Features

### 🔐 **User Management & Authentication**
- **Role-based Access Control**: Admin, Reviewer, and Viewer roles
- **Secure Authentication**: JWT-based login/registration system
- **User Approval Workflow**: Reviewers require admin approval
- **Profile Management**: User role management and approval system

### 📋 **Project Discovery**
- **Browse Projects**: Explore volunteer opportunities worldwide
- **Smart Search**: Search by project title, location, or description
- **Multiple Views**: Grid and list view options
- **Project Details**: Comprehensive project information with images

### ⭐ **Review & Rating System**
- **Multi-dimensional Ratings**: Overall rating plus specific area ratings
- **Detailed Reviews**: Written feedback with star ratings
- **Reviewer Privileges**: Only approved reviewers can submit reviews
- **Rating Aggregation**: Automatic project rating calculations

### ❓ **Q&A System**
- **Ask Questions**: Viewers can ask project-related questions
- **Multiple Answers**: Reviewers and admins can provide answers
- **Knowledge Base**: Build community knowledge about projects
- **Interactive Discussions**: Real-time question and answer flow

### 🔔 **Real-time Notifications**
- **Activity Updates**: Get notified about new projects, reviews, and answers
- **Notification Center**: Dedicated notifications page
- **Smart Alerts**: Bell icon with unread count
- **Auto-refresh**: Real-time notification updates

### 👑 **Admin Dashboard**
- **Project Management**: Full CRUD operations for projects
- **User Management**: Manage user roles, approvals, and accounts
- **Content Moderation**: Review and manage user-generated content
- **Image Upload**: Integrated image upload system for projects

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Lucide React** for beautiful icons
- **React Context** for state management
- **React Toastify** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alihussnain1122/GlobalLoop-frontend.git
   cd GlobalLoop
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   echo "PORT=5000
   MONGO_URI=mongodb://localhost:27017/globalloop
   JWT_SECRET=your_jwt_secret_here" > .env
   
   # Start backend server
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 User Roles & Permissions

### 🔍 **Viewer**
- Browse and search projects
- View project details and reviews
- Ask questions about projects
- Receive notifications

### ⭐ **Reviewer** (Requires Admin Approval)
- All Viewer permissions
- Submit project reviews and ratings
- Answer questions from other users
- Rate projects on multiple dimensions

### 👑 **Admin**
- All Reviewer permissions
- Create, edit, and delete projects
- Manage user accounts and roles
- Approve reviewer applications
- Moderate content and reviews
- Access comprehensive admin dashboard

## 📱 Screenshots & Demo

### Project Discovery
- **Grid View**: Beautiful card-based project browsing
- **Search & Filter**: Find projects by location, title, or content
- **Project Details**: Rich project information with images and ratings

### Review System
- **Star Ratings**: 5-star rating system for overall and specific areas
- **Written Reviews**: Detailed feedback from experienced users
- **Rating Analytics**: Automatic calculation of project ratings

### Admin Dashboard
- **User Management**: Approve reviewers, manage accounts
- **Project Management**: Full CRUD operations with image upload
- **Content Oversight**: Review and moderate user content

## 🔧 Development

### Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React Context providers
│   ├── api/          # API configuration
│   └── assets/       # Static assets
├── public/           # Public assets
└── package.json
```

### Key Components
- **Navbar**: Navigation with role-based menu items
- **ImageUpload**: Drag-and-drop image upload component
- **NotificationDropdown**: Real-time notification system
- **ProjectCard**: Beautiful project display cards

### API Integration
- **Axios Instance**: Centralized API configuration
- **JWT Authentication**: Automatic token handling
- **Error Handling**: Comprehensive error management
- **Loading States**: User-friendly loading indicators

## 🎨 UI/UX Features

- **Responsive Design**: Works perfectly on all devices
- **Modern Gradients**: Beautiful gradient backgrounds and elements
- **Smooth Animations**: Subtle hover effects and transitions
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Skeleton screens and loading indicators

## 📦 Dependencies

### Core Dependencies
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `react-toastify` - Toast notifications
- `lucide-react` - Icon library
- `jwt-decode` - JWT token decoding

### Development Dependencies
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite
- `tailwindcss` - Utility-first CSS framework
- `eslint` - Code linting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ali Hussnain**
- GitHub: [@alihussnain1122](https://github.com/alihussnain1122)
- Email: alihussnain1122@gmail.com

## 🙏 Acknowledgments

- Inspired by Erasmus+ exchange programs
- Built with modern web technologies
- Designed for global volunteer community
- Made with ❤️ for connecting people worldwide

---

⭐ Star this repository if you find it helpful!
