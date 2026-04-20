# 🥑 Nutrition-app: Your Personalized AI Health Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue.svg)](https://reactjs.org/)

**Nutrition-app** is a state-of-the-art MERN stack platform designed to revolutionize how you track and optimize your health. Built with a focus on personalized nutrition, it leverages AI-driven insights to help you reach your fitness goals.

---

## ✨ Key Features

- **🛡️ Intelligent Dashboard**: A sleek, bento-style interface providing real-time tracking of macros, micros, and water intake.
- **🥗 Personalized Recommendations**: Custom calorie and nutrient targets calculated using the advanced **Mifflin-St Jeor Equation**.
- **🌱 Vegetarian-First Insights**: Specialized guidance and boosted nutritional targets for key nutrients like **B12**, **Iron**, and **Protein**.
- **💧 Smart Hydration**: Track your daily water intake with interactive visualizations.
- **📱 Responsive & Fluid**: Premium glassmorphic design that looks stunning on any device, powered by **Framer Motion**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Redux Toolkit, Framer Motion, Tailwind CSS |
| **Backend** | Node.js, Express, JWT Authentication, Bcrypt |
| **Database** | MongoDB, Mongoose |
| **Icons & UI** | Lucide-React, Shadcn/UI (Inspired) |

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

### 2️⃣ Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on the provided template.
4. Seed initial data: `node src/utils/seedData.js`
5. Start the development server: `npm start`

### 3️⃣ Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Launch the Vite dev server: `npm run dev`

---

## 📸 Preview

*Stay tuned for stunning UI walkthroughs!*

## 🎮 Running Locally

Since this is a monorepo, you can now run both the frontend and backend with a single command from the root directory:

1. **Install all dependencies** (run once):
   ```bash
   npm run install:all
   ```

2. **Start both servers**:
   ```bash
   npm run dev
   ```

*   **Frontend**: `http://localhost:5173`
*   **Backend**: `http://localhost:5000`

---

## 🚀 Vercel Deployment Prepared

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Protus Team]
