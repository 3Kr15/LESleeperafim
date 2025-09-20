document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (url, placeholderId, callback = null) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${url}.`);
        return response.text();
      })
      .then((data) => {
        document.getElementById(placeholderId).innerHTML = data;
        if (callback) callback();
      })
      .catch((error) => console.error("Error loading component:", error));
  };

  const setActiveNavItem = () => {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      const linkPage = link.getAttribute("href").split("/").pop();
      const navItem = link.parentElement;
      if (linkPage === currentPage) {
        navItem.classList.add("active");
      } else {
        navItem.classList.remove("active");
      }
    });
  };

  function attachSignOutListener() {
    const signOutBtn = document.getElementById("sign-out");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "../index.html";
      });
    }
  }

  // Load navbar and set up nav logic
  const currentPath = window.location.pathname;
  const navbarPath = currentPath.includes('/html/') ? "./navbar.html" : "./html/navbar.html";
  loadComponent(navbarPath, "navbar-container", () => {
    attachSignOutListener();
    setActiveNavItem();
  });

  // Toggle between login and signup
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");
  if (sign_up_btn && sign_in_btn && container) {
    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }

  // Get the forms
  const signInForm = document.querySelector(".sign-in-form");
  const signUpForm = document.querySelector(".sign-up-form");

  // Simulated login
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = signInForm.querySelector('input[type="text"]').value;
      const password = signInForm.querySelector('input[type="password"]').value;
      if (username && password) {
        alert(`Welcome back, ${username}! Redirecting to you...`);
        window.location.href = "./html/homePage.html";
      } else {
        alert("Please enter username and password.");
      }
    });
  }

  // Simulated signup
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = signUpForm.querySelector('input[type="text"]').value;
      const email = signUpForm.querySelector('input[type="email"]').value;
      const password = signUpForm.querySelector('input[type="password"]').value;
      if (username && email && password) {
        alert(`Thanks for signing up, ${username}! Redirecting to your dashboard...`);
        window.location.href = "dashboard.html";
      } else {
        alert("Please fill in all fields.");
      }
    });
  }
});