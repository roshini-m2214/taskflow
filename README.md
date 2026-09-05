# ✨ TaskFlow

> A modern, responsive task management application designed to help you organize tasks, manage projects, track progress, and stay on top of deadlines.

TaskFlow combines a clean **liquid-glass / glassmorphism interface** with powerful task management, project organization, calendar scheduling, reminders, notifications, progress tracking, and **Progressive Web App (PWA)** support.

---

## 🌐 Live Demo

🚀 **Try TaskFlow:**  
https://taskflow-rosh12.vercel.app

📦 **GitHub Repository:**  
https://github.com/roshini-m2214/taskflow

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Supabase Authentication
- Email confirmation support
- Password reset support
- Protected application routes
- User-specific data access

### ✅ Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Track task status
- Set task priorities
- Mark tasks as important
- Add task descriptions
- Assign tasks to projects
- Search and filter tasks
- Sort tasks by different criteria

### ⏰ Deadlines & Reminders

- Set task due dates
- Set specific due times
- Configure reminder intervals
- Automatic deadline reminders
- Automatic overdue detection
- In-app notifications
- Duplicate notification prevention

### 📅 Calendar

- View scheduled tasks
- Organize tasks by date
- View upcoming deadlines
- Create tasks from the calendar
- Manage task scheduling

### 📁 Projects

- Create projects
- Edit projects
- Delete projects
- Organize tasks by project
- Assign tasks to specific projects
- Track project-related tasks

### 📊 Progress Tracking

- Monitor task completion
- Track productivity
- View task statistics
- Track completed and pending work
- Visualize overall progress

### 🔔 Notifications

TaskFlow includes an in-app notification system for:

- 🎉 Task completion
- ⭐ Important tasks
- 📁 Project updates
- ⏰ Upcoming deadlines
- 🔴 Overdue tasks

Notifications support read/unread states and are associated with relevant tasks or projects when applicable.

---

## 📱 Progressive Web App

TaskFlow supports **Progressive Web App (PWA)** functionality.

Users can install TaskFlow on supported devices and use it similarly to a native application.

### PWA Features

- 📱 Installable web application
- 🖼️ Custom application icons
- 🚀 Standalone application mode
- ⚙️ Web App Manifest
- 🔄 Service worker
- 💾 Application shell caching
- 🌐 Offline fallback support

---

## 🎨 Design

TaskFlow uses a modern **liquid-glass / glassmorphism** design system focused on simplicity and usability.

### Design Highlights

- 🌸 Soft baby-pink visual theme
- 🫧 Translucent glass surfaces
- 🧊 Glassmorphism cards
- 🎨 Soft gradients
- ✨ Subtle shadows
- 🔘 Rounded UI elements
- 📱 Responsive layouts
- ⚡ Smooth interactions
- 🎯 Clean task-focused interface

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

### Backend & Database

- **Supabase**
- **PostgreSQL**
- **Supabase Authentication**
- **PostgreSQL Row Level Security (RLS)**

### PWA

- **Web App Manifest**
- **Service Worker**
- **Application Shell Caching**

### Deployment & Version Control

- **GitHub**
- **Vercel**

---

## 🏗️ Application Architecture


                         ┌─────────────────────┐
                         │      TaskFlow       │
                         │     Web / PWA       │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
             ┌──────▼──────┐                ┌──────▼──────┐
             │   Next.js   │                │   Supabase  │
             │  Frontend   │                │ Auth + DB   │
             └──────┬──────┘                └──────┬──────┘
                    │                              │
                    │                       ┌──────▼──────┐
                    │                       │ PostgreSQL  │
                    │                       │     + RLS   │
                    │                       └──────┬──────┘
                    │                              │
             ┌──────▼──────────────────────────────▼──────┐
             │                                             │
             │          TaskFlow Application               │
             │                                             │
             │ Dashboard │ Calendar │ Projects │ Progress  │
             │                                             │
             │       Notifications │ Profile               │
             │                                             │
             └─────────────────────────────────────────────┘

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
