# 🎨 MediConnect 
Live Link - https://mediconnect-frontend-seav.onrender.com

A lightweight, dashboard-style frontend for the MediConnect hospital system. Built using pure HTML, CSS, and JavaScript, focusing on performance, simplicity, and modular UI design.

---

## 🚀 Features

### 🔐 Authentication UI
- Login interface
- Role-based navigation (Patient, Doctor, Admin)
- Ready for JWT integration

---

### 📊 Patient Dashboard
- Overview cards (Appointments, Reports, Health Stats, Medicines)
- Search doctors by specialization/keyword
- Book & reschedule appointments
- Track past and upcoming bookings
- View health score and medicines
- Access reports

---

### 👨‍⚕️ Doctor Dashboard
- View daily schedule
- Accept/reject appointments
- Access patient history
- Assign medicines
- Upload reports

---

### 🛠️ Admin Dashboard
- Manage users (patients & doctors)
- Add/remove doctors
- Monitor appointments

---

## 🧱 Tech Stack

- HTML5
- CSS3 (modular styling)
- Vanilla JavaScript (no frameworks)

---

## ⚡ Why No Framework?

- Faster load times
- Better understanding of core JS
- Full control over DOM and state handling

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

## ⚡ API Design

- RESTful architecture
- Modular route handling
- Scalable service layer

---

## 📌 Future Improvements

- JWT Authentication
- Role-based middleware
- WebSocket notifications
- Rate limiting & security enhancements

---

## ▶️ Run Locally

```bash
uvicorn main:app --reload


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
