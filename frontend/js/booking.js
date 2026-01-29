function goBack() {
  window.location.href = "doctors.html";
}

function bookAppointment() {
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!date || !time) {
    alert("Please select date and time");
    return;
  }

  // Placeholder – backend integration later
  alert("Appointment booked successfully!");

  window.location.href = "dashboard.html";
}