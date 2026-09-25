const form = document.getElementById("adminLoginForm");
const error = document.getElementById("error");
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

const existingToken = localStorage.getItem("cmsToken");
const existingUser = JSON.parse(localStorage.getItem("cmsUser") || "null");
if (existingToken && existingUser?.role === "admin") location.href = "dashboard.html";

if (toggle && password) {
  toggle.addEventListener("change", () => {
    password.type = toggle.checked ? "text" : "password";
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  error.textContent = "";
  try {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value.trim(),
        password: password.value
      })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Login failed");
    if (d.user.role !== "admin") throw new Error("This page is only for administrators");
    localStorage.setItem("cmsToken", d.token);
    localStorage.setItem("cmsUser", JSON.stringify(d.user));
    location.href = "dashboard.html";
  } catch (e) {
    error.textContent = e.message;
  }
});