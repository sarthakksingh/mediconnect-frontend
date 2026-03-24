import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtE17k8DMJAeHLlgu6O6-SlW3lUTmJuQc",
  authDomain: "mediconnect-87603.firebaseapp.com",
  projectId: "mediconnect-87603",
  storageBucket: "mediconnect-87603.firebasestorage.app",
  messagingSenderId: "229190716030",
  appId: "1:229190716030:web:4cbaaa555e44c895f4e62f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


window.loginWithGoogle = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const res = await fetch(`${API_BASE}/auth/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Google login failed");
      return;
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("user_name", data.name);
    localStorage.setItem("user_role", data.role);

    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Google login error:", error);
    alert("Google login failed: " + error.message);
  }
}