function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  // temporary storage (replace with FastAPI later)
  localStorage.setItem("userEmail", email);

  window.location.href = "doctors.html";
}