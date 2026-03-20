# 🖥️ MediConnect Frontend – Hospital Appointment System UI

## 📌 Overview

MediConnect Frontend is a **lightweight, dashboard-style web interface** for an AI-assisted hospital appointment system. It allows patients to search doctors, book appointments, manage bookings, and view health-related information.

The frontend is built using **pure HTML, CSS, and JavaScript**, ensuring fast performance, simplicity, and easy integration with the FastAPI backend.

---

## 🚀 Features

### 🔐 Authentication

* User login interface
* Role-based flow (Patient-focused UI)
* Local session handling (ready for backend JWT integration)

---

### 📊 Dashboard

* Overview cards:

  * Your Appointments
  * Your Reports
  * Your Health Stats
  * Your Medicines
* Quick actions:

  * Search Doctors
  * Message Your Doctor
* Recent activity tracking

---

### 🔍 Search Doctors

* Search doctors by name, specialization, or keyword
* Clean card-based UI
* Displays:

  * Doctor name
  * Specialization
  * Patients visited
  * Availability status
  * Available time slots

---

### 📅 Book Appointment

* Select doctor
* Choose date and time slot
* Add reason for visit
* Confirm appointment flow

---

### 📖 Bookings Management

* View all appointments
* Track appointment status
* Ready for reschedule/cancel integration

---

### 👤 Profile

* User information display
* Basic account management UI
* Extendable for medical history & preferences

---

## 🏗️ Tech Stack

* **HTML5** – Structure
* **CSS3** – Styling (modular files per screen)
* **JavaScript (Vanilla)** – Logic & API handling

No frameworks used → fast, simple, and easy to scale.

---

## 📂 Project Structure

```id="3y1n0f"
mediconnect-frontend/
├── assets/
│   └── NAMASTE.png
│
├── index.html          # Login page
├── dashboard.html      # Dashboard
├── doctors.html        # Search doctors
├── book.html           # Book appointment
├── bookings.html       # Appointment list
├── profile.html        # User profile
│
├── css/
│   ├── login.css
│   ├── dashboard.css
│   ├── doctors.css
│   ├── book.css
│   ├── bookings.css
│   ├── profile.css
│   └── main.css
│
├── js/
│   ├── config.js       # API base URL
│   ├── auth.js         # Login logic
│   ├── dashboard.js
│   ├── doctors.js
│   ├── book.js
│   ├── bookings.js
│   ├── profile.js
│   └── utils.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash id="c6s5vd"
git clone <repo-url>
cd mediconnect-frontend
```

---

### 2️⃣ Configure Backend URL

Update API base URL in:

```js id="3u0xgm"
js/config.js
```

Example:

```js id="a9o3m2"
const API_BASE = "http://localhost:8000";
```

---

### 3️⃣ Run Frontend

Simply open:

```bash id="1p1l3s"
index.html
```

Or use **Live Server** in VS Code.

---

## 🔌 API Integration

The frontend communicates with the FastAPI backend using REST APIs.

### Example Usage

```js id="sqh3nq"
fetch(`${API_BASE}/doctors`)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔄 Application Flow

1. User logs in → `index.html`
2. Redirect to → `dashboard.html`
3. Navigate via sidebar:

   * Search doctors
   * Book appointment
   * View bookings
   * Profile
4. API calls handled via `config.js`

---

## 📊 Development Status

### ✅ Completed

* Login UI
* Dashboard UI
* Search Doctors UI
* Book Appointment UI
* Bookings page
* Profile page
* Modular CSS & JS structure

---

### 🚧 Pending / Future Work

* Full backend API integration
* JWT authentication handling
* Real-time updates
* UI improvements & responsiveness
* Migration to React (optional)

---

## 🎯 Design Principles

* Clean dashboard UI
* Modular CSS per screen
* Feature-based JS structure
* Separation of concerns
* Backend-agnostic frontend

---

## 🌟 Future Enhancements

* React / Next.js migration
* Mobile responsive design
* Dark mode
* AI chatbot UI
* Push notifications

---

## 📌 Author

**Sarthak Singh**

---

## 📜 License

MIT License

Copyright (c) 2026 Sarthak Singh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

---

## 🏁 Summary

MediConnect Frontend provides a clean and scalable user interface for a hospital appointment system. It integrates seamlessly with the backend and is designed for rapid development, clarity, and future scalability.

---
