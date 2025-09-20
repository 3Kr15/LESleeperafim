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

  // Check if we're in the html folder or root folder
  const currentPath = window.location.pathname;
  const navbarPath = currentPath.includes('/html/') ? "./navbar.html" : "./html/navbar.html";
  
  loadComponent(navbarPath, "navbar-container", attachSignOutListener);
});

function attachSignOutListener() {
  const signOutBtn = document.getElementById("sign-out");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      // Navigate back to root index if we're in a subfolder
      window.location.href = "../index.html";
    });
  }
}