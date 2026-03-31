# 💻 Admission Management CRM - Frontend

A premium, high-performance Next.js application for campus admissions, featuring glassmorphism and real-time seat matrix monitoring.

## 🚀 Key Features
- **Dashboard HUD**: Visualizes seat filling percentage (KCET/COMEDK/Mgmt).
- **Master Setup**: Wizard interface for Institutions, Campuses, and Departments.
- **Dynamic Applicant Forms**: 15-field validation for student registration.
- **RBAC UI**: Sidebars and pages automatically hide/show based on roles.
- **Atomic Allocation**: Real-time feedback on seat availability.

## 🔑 Default Admin Access
```json
{
  "username": "admin",
  "password": "password123",
  "fullName": "System Admin"
}
```
**User logins and Password**
admin - password123
admissionofficer@gmail.com - 123456
manager1@gmail.com - 123456

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS (Custom Glassmorphism)
- **API Client**: Axios (with JWT Interceptors)
- **Icons**: Lucide React
- **State**: React Hooks (Real-time Filtering)

## 🎨 Design Principles
1. **Glassmorphism**: Sleek, modern cards with frosted glass effects.
2. **DynamicHUD**: Real-time status indicators in applicant lists.
3. **Responsive**: Optimized for both Desktop and Tablet management.

## 🚦 Getting Started
1. **Configure Environment**: Ensure `frontend/.env` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 🎭 User Roles
- **Admin**: All modules (Setup + Users).
- **Admission Officer**: Applicants + Admissions + Dashboard.
- **Management**: Dashboard only (Read-only).
