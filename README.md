# 🎟️ Conference Ticket Generator

Welcome to the **Conference Ticket Generator**! 🚀 This app allows users to generate a personalized conference ticket by filling out a simple form. Built with **React**, it ensures smooth user experience with **form validation, accessibility, persistent state storage, and responsive design**.

## 🚀 Features

### 🎨 Form Elements
- **Full Name** – Enter your full name.
- **Email Address** – Provide a valid email.
- **Avatar Upload** – Upload your profile picture stored via Cloudinary.
- **Submit Button** – Generate your ticket instantly!

### ✅ Form Validation
- All fields are required before submission.
- The email must be in a valid format.
- Only image URLs (Cloudinary or any image hosting service) are accepted for the avatar.
- Clear and user-friendly error messages near the respective fields.

### 💾 State Persistence
- Your form inputs are stored using local storage to prevent data loss on page refresh.
- ✔️ Ticket data is lightweight, so local storage is used to store it.
- ✔️ User info (which could grow) is in IndexedDB, which handles larger datasets efficiently.


### 🎫 Ticket Generation
Once you successfully submit the form, a **Conference Ticket** is generated with:
- Your **Full Name**
- Your **Email Address**
- Your **Avatar** 

### 🌍 Accessibility
- Fully screen-reader accessible with clear error messages and field hints.
- All elements are focusable, with visible hover and focus states.
- Full **keyboard navigation support** – complete the form without using a mouse!

### 📱 Responsive Design
- Looks amazing on all screen sizes! 📱💻
- Optimized layout for mobile, tablet, and desktop views.

## 🎯 Acceptance Criteria
- **Validation:** Users must fill all required fields, provide a valid email, and upload an avatar.
- **State Persistence:** Data should remain intact even after a page refresh.
- **Ticket Generation:** The ticket only appears when all validations pass successfully.
- **Accessibility:** Fully accessible for screen readers and keyboard navigation.
- **Responsiveness:** Works seamlessly across all devices.
- **Code Quality:** Uses modular, well-structured code with proper React hooks like `useState` and `useEffect`.

## 🛠️ Tech Stack
- **React**
- **IndexedDB / Local Storage**
- **Cloudinary**
- **CSS (for styling)**

## 🚀 Getting Started
1. **Clone the repo:**
   ```bash
   git clone https://github.com/AshleyMekolle/HNG-Stage2.git
   cd conference-ticket-generator
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the app:**
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:5173`.

## 🎨 How It Works
1. Fill in your details in the form.
2. Upload your avatar.
3. Click the **Submit** button.
4. If everything checks out, your conference ticket will be generated instantly! 🎟️

## 📸 Link
🚀 https://conference-ticket-passify.netlify.app/

## 🏆 Contributing
Got ideas? Found a bug? Feel free to fork this repo and submit a pull request! 🙌

---
Made with ❤️ by Ashley 🚀

