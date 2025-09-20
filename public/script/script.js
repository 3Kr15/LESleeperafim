// Toggle between login and signup
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Get the forms
const signInForm = document.querySelector(".sign-in-form");
const signUpForm = document.querySelector(".sign-up-form");

// Simulated login
signInForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent actual form submission

  const username = signInForm.querySelector('input[type="text"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;

  // You can add a simple validation
  if (username && password) {
    alert(`Welcome back, ${username}! Redirecting to your dashboard...`);
    window.location.href = "dashboard.html"; // replace with your page
  } else {
    alert("Please enter username and password.");
  }
});

// Simulated signup
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = signUpForm.querySelector('input[type="text"]').value;
  const email = signUpForm.querySelector('input[type="email"]').value;
  const password = signUpForm.querySelector('input[type="password"]').value;

  if (username && email && password) {
    alert(`Thanks for signing up, ${username}! Redirecting to your dashboard...`);
    window.location.href = "dashboard.html"; // replace with your page
  } else {
    alert("Please fill in all fields.");
  }
});
