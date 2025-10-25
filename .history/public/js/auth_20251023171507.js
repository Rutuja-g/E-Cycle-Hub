// auth.js - Handles user authentication, login, signup, and session management

(function () {
  const USERS_KEY = "ecycle_users";
  const CURRENT_USER_KEY = "ecycle_current_user";
  const LOGGED_IN_KEY = "isLoggedIn";

  // Get users from localStorage
  function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Get current user
  function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Set current user
  function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  // Clear current user (logout)
  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Check if user is logged in
  function isLoggedIn() {
    return localStorage.getItem(LOGGED_IN_KEY) === "true";
  }

  // Set logged in flag
  function setLoggedIn() {
    localStorage.setItem(LOGGED_IN_KEY, "true");
  }

  // Clear logged in flag
  function clearLoggedIn() {
    localStorage.removeItem(LOGGED_IN_KEY);
  }

  // Validate email format
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password (at least 6 characters)
  function validatePassword(password) {
    return password.length >= 6;
  }

  // Update navbar with user info
  function updateNavbar() {
    const user = getCurrentUser();
    const userInfo = document.getElementById("user-info");
    const userName = document.getElementById("user-name");
    const logout = document.getElementById("logout");

    if (user && userInfo && userName) {
      userInfo.style.display = "block";
      userName.textContent = user.name;
      if (logout) {
        logout.addEventListener("click", function (e) {
          e.preventDefault();
          clearCurrentUser();
          clearLoggedIn();
          window.location.href = "login.html";
        });
      }
    } else if (userInfo) {
      userInfo.style.display = "none";
    }
  }

  // Restrict cart/checkout for non-logged-in users
  function restrictActions() {
    const user = getCurrentUser();
    const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
    const checkoutButtons = document.querySelectorAll(".btn-checkout");

    if (!user) {
      addToCartButtons.forEach((btn) => {
        btn.disabled = true;
        btn.textContent = "Login to Add to Cart";
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          alert("Please login to add items to cart.");
          window.location.href = "login.html";
        });
      });

      checkoutButtons.forEach((btn) => {
        btn.disabled = true;
        btn.textContent = "Login to Checkout";
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          alert("Please login to checkout.");
          window.location.href = "login.html";
        });
      });
    }
  }

  // Check session and redirect if not logged in on protected pages
  function checkSession() {
    const protectedPages = ["cart.html", "admin.html"];
    const currentPage = window.location.pathname.split("/").pop();
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
      window.location.href = "login.html";
    }

    // Additional check for admin page
    if (currentPage === "admin.html") {
      const user = getCurrentUser();
      if (!user || user.email !== "admin@ecyclehub.com") {
        alert("Access denied. Only admin can access this page.");
        window.location.href = "login.html";
      }
    }
  }

  // Handle login form
  function handleLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");

      // Clear previous errors
      emailError.textContent = "";
      passwordError.textContent = "";

      let isValid = true;

      if (!validateEmail(email)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
      }

      if (!validatePassword(password)) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
      }

      if (!isValid) return;

      const users = getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        setCurrentUser(user);
        setLoggedIn();
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        emailError.textContent = "Invalid email or password.";
      }
    });
  }

  // Handle signup form
  function handleSignup() {
    const form = document.getElementById("signupForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");
      const confirmPasswordError = document.getElementById(
        "confirmPasswordError"
      );

      // Clear previous errors
      nameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";
      confirmPasswordError.textContent = "";

      let isValid = true;

      if (!name) {
        nameError.textContent = "Name is required.";
        isValid = false;
      }

      if (!validateEmail(email)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
      }

      if (!validatePassword(password)) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
      }

      if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        isValid = false;
      }

      if (!isValid) return;

      const users = getUsers();
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        emailError.textContent = "Email already registered.";
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);
      setLoggedIn();

      alert("Signup successful!");
      window.location.href = "index.html";
    });
  }

  // Initialize auth functionality
  document.addEventListener("DOMContentLoaded", function () {
    checkSession();
    updateNavbar();
    restrictActions();
    handleLogin();
    handleSignup();
  });
})();
