const email = localStorage.getItem("userEmail");

if (!email) {
  window.location.href = "index.html";
}

document.getElementById("userEmail").innerText = email;

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function goDoctors() {
  window.location.href = "doctors.html";
}