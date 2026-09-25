const form = document.getElementById("loginForm");
const error = document.getElementById("error");
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

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
        mode: "student",
        email: document.getElementById("email").value.trim(),
        password: password.value
      })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Login failed");
    localStorage.setItem("cmsToken", d.token);
    localStorage.setItem("cmsUser", JSON.stringify(d.user));
    location.href = "student-dashboard.html";
  } catch (e) {
    error.textContent = e.message;
  }
});