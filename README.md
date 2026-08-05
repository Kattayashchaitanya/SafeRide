# 🚌 SafeRide — Smart Campus Transport Management System

<div align="center">

![SafeRide Banner](https://img.shields.io/badge/SafeRide-Campus%20Transport%20System-blue?style=for-the-badge&logo=bus&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-safe--ride--fawn.vercel.app-22c55e?style=for-the-badge)](https://safe-ride-fawn.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Kattayashchaitanya%2FSafeRide-181717?style=for-the-badge&logo=github)](https://github.com/Kattayashchaitanya/SafeRide)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**A role-based campus bus transport management platform built for institutions — enabling students, drivers, in-charges, and admins to collaborate for a safer commute.**

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🎯 About the Project

**SafeRide** is a full-stack web application designed to digitize and streamline campus bus transport management. It provides tailored dashboards for four user roles — **Students**, **Drivers**, **In-Charges**, and **Admins** — giving each stakeholder the tools they need for safe, transparent, and efficient transport operations.

Key goals:
- 🔒 Secure, role-based authentication via Firebase
- 📊 Real-time driver performance monitoring
- 📝 Student complaint submission & management
- 🌐 Multilingual support for broader accessibility
- 📱 Responsive design for all devices

---

## 🌐 Live Demo

> **[https://safe-ride-fawn.vercel.app](https://safe-ride-fawn.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Role-Based Auth** | Firebase Authentication with distinct roles: Admin, Driver, In-Charge, Student |
| 📊 **Admin Dashboard** | Full control panel — manage drivers, view all complaints, monitor performance |
| 🚗 **Driver Dashboard** | Drivers can view their schedule, route info, and performance metrics |
| 📈 **Driver Performance** | Detailed performance breakdowns and analytics per driver |
| 🧑‍💼 **In-Charge Dashboard** | In-charges can manage complaints and monitor assigned drivers |
| 🎓 **Student Dashboard** | Students can view bus schedules and submit complaints |
| 📩 **Complaints System** | Submit, track, and resolve transport complaints |
| 🌍 **Multi-Language Support** | Multilingual UI for diverse campus communities |
| 📱 **Responsive Design** | Fully responsive on mobile, tablet, and desktop |
| ⚡ **Vite + React** | Lightning-fast frontend powered by Vite |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://reactjs.org/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [React Router](https://reactrouter.com/) | Client-side Routing |
| [Firebase SDK](https://firebase.google.com/) | Authentication & Realtime DB |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime Environment |
| [Express.js](https://expressjs.com/) | REST API Framework |
| [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) | Server-side Auth & DB |

### DevOps & Deployment
| Tool | Purpose |
|---|---|
| [Vercel](https://vercel.com/) | Hosting & Deployment |
| [GitHub](https://github.com/) | Version Control |

---

## 📁 Project Structure

```
SafeRide/
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/            # Global state management
│   │   │   ├── AuthContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── firebase/           # Firebase configuration
│   │   │   └── config.js
│   │   ├── layouts/            # Page layouts
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/              # Application pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DriverBreakdown.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── DriverPerformanceDetail.jsx
│   │   │   ├── InChargeComplaints.jsx
│   │   │   ├── InChargeDashboard.jsx
│   │   │   ├── InChargePerformance.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RoleSelectionPage.jsx
│   │   │   ├── StudentComplaints.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── services/           # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                    # Node.js + Express backend
│   ├── config/
│   │   └── firebase.js         # Firebase Admin SDK setup
│   ├── controllers/            # Route logic handlers
│   │   ├── adminController.js
│   │   ├── complaintsController.js
│   │   ├── driverController.js
│   │   └── performanceController.js
│   ├── middleware/
│   │   └── auth.js             # JWT / Firebase auth middleware
│   ├── routes/                 # API route definitions
│   │   ├── admin.js
│   │   ├── complaints.js
│   │   ├── driver.js
│   │   └── performance.js
│   ├── index.js                # Entry point
│   └── package.json
│
├── api/                        # Vercel serverless API bridge
│   └── index.js
│
├── vercel.json                 # Vercel deployment config
├── package.json
└── README.md
```



## 👥 User Roles

SafeRide supports four distinct user roles, each with a dedicated dashboard:

### 🎓 Student
- View assigned bus route & schedule
- Submit transport complaints
- Track complaint status

### 🚗 Driver
- View personal dashboard and schedule
- Check performance metrics and feedback

### 🧑‍💼 In-Charge
- Manage and resolve student complaints
- Monitor driver performance for assigned routes

### 🛡️ Admin
- Full system access
- Manage all users (students, drivers, in-charges)
- View and resolve all complaints
- Analyze performance reports across all drivers

---

## ☁️ Deployment

This project is deployed on **Vercel**.

To deploy your own instance:

1. Push the project to your GitHub account
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all required environment variables in the Vercel dashboard
4. Deploy!

The `vercel.json` file in the root handles routing and API proxying automatically.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and **commit**: `git commit -m "Add: your feature description"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request** describing your changes

Please make sure your code follows the existing style and is well-documented.

---

## 👤 Author

**Katta Yash Chaitanya**

- GitHub: [@Kattayashchaitanya](https://github.com/Kattayashchaitanya)
- Project Link: [https://github.com/Kattayashchaitanya/SafeRide](https://github.com/Kattayashchaitanya/SafeRide)

---

## 📄 License

This project is open-source. Feel free to use and build upon it with credit to the original author.

---

<div align="center">

Made with ❤️ for safer campus commutes

⭐ **Star this repo if you found it helpful!** ⭐

</div>
