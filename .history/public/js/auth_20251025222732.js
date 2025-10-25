// Authentication module for user login, signup, and session management

(function () {
  const USERS_STORAGE_KEY = "ecycle_users";
  const CURRENT_USER_STORAGE_KEY = "ecycle_current_user";
  const LOGGED_IN_STORAGE_KEY = "isLoggedIn";
  const ADMIN_EMAIL = "admin@ecyclehub.com";
  const MIN_PASSWORD_LENGTH = 6;

  // Retrieve users from localStorage
  function getUsers() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  // Save users to localStorage
  function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  // Get current logged-in user
  function getCurrentUser() {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Set current user in storage
  function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  }

  // Clear current user (logout)
  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }

  // Check if user is logged in
  function isLoggedIn() {
    return localStorage.getItem(LOGGED_IN_STORAGE_KEY) === "true";
  }

  // Set logged in flag
  function setLoggedIn() {
    localStorage.setItem(LOGGED_IN_STORAGE_KEY, "true");
  }

  // Clear logged in flag
  function clearLoggedIn() {
    localStorage.removeItem(LOGGED_IN_STORAGE_KEY);
  }

  // Validate email format
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Validate password length
  function validatePassword(password) {
    return password.length >= MIN_PASSWORD_LENGTH;
  }

  // Update navbar with user information
  function updateNavbar() {
    const currentUser = getCurrentUser();
    const userInfoElement = document.getElementById("user-info");
    const authLinksElement = document.getElementById("auth-links");
    const userNameElement = document.getElementById("user-name");
    const logoutElement = document.getElementById("logout");

    if (currentUser && userInfoElement && authLinksElement) {
      userInfoElement.style.display = "flex";
      authLinksElement.style.display = "none";
      userNameElement.textContent = `Hello, ${currentUser.name}`;
      if (logoutElement) {
        logoutElement.addEventListener("click", function (event) {
          event.preventDefault();
          clearCurrentUser();
          clearLoggedIn();
          window.location.reload();
        });
      }
    } else if (userInfoElement && authLinksElement) {
      userInfoElement.style.display = "none";
      authLinksElement.style.display = "flex";
    }
  }

  // Initialize navbar update after header loads
  function initNavbarUpdate() {
    const checkHeader = () => {
      const userInfoElement = document.getElementById("user-info");
      if (userInfoElement) {
        updateNavbar();
      } else {
        setTimeout(checkHeader, 100);
      }
    };
    checkHeader();
  }

  // Restrict cart and checkout actions for non-logged-in users
  function restrictActions() {
    const currentUser = getCurrentUser();
    const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
    const checkoutButtons = document.querySelectorAll(".btn-checkout");

    if (!currentUser) {
      addToCartButtons.forEach((button) => {
        button.disabled = true;
        button.textContent = "Login to Add to Cart";
        button.addEventListener("click", function (event) {
          event.preventDefault();
          alert("Please login to add items to cart.");
          window.location.href = "login.html";
        });
      });

      checkoutButtons.forEach((button) => {
        button.disabled = true;
        button.textContent = "Login to Checkout";
        button.addEventListener("click", function (event) {
          event.preventDefault();
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

    // Admin page access check
    if (currentPage === "admin.html") {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        alert("Access denied. Only admin can access this page.");
        window.location.href = "login.html";
      }
    }
  }

  // Handle login form submission
  function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const emailErrorElement = document.getElementById("emailError");
      const passwordErrorElement = document.getElementById("passwordError");

      emailErrorElement.textContent = "";
      passwordErrorElement.textContent = "";

      let isFormValid = true;

      if (!validateEmail(email)) {
        emailErrorElement.textContent = "Please enter a valid email address.";
        isFormValid = false;
      }

      if (!validatePassword(password)) {
        passwordErrorElement.textContent = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        isFormValid = false;
      }

      if (!isFormValid) return;

      const users = getUsers();
      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        setCurrentUser(foundUser);
        setLoggedIn();
        alert("Login successful!");
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        } else {
          window.location.href = "index.html";
        }
      } else {
        emailErrorElement.textContent = "Invalid email or password.";
      }
    });
  }

  // Handle signup form submission
  function handleSignup() {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;

    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      const nameErrorElement = document.getElementById("nameError");
      const emailErrorElement = document.getElementById("emailError");
      const passwordErrorElement = document.getElementById("passwordError");
      const confirmPasswordErrorElement = document.getElementById(
        "confirmPasswordError"
      );

      nameErrorElement.textContent = "";
      emailErrorElement.textContent = "";
      passwordErrorElement.textContent = "";
      confirmPasswordErrorElement.textContent = "";

      let isFormValid = true;

      if (!name) {
        nameErrorElement.textContent = "Name is required.";
        isFormValid = false;
      }

      if (!validateEmail(email)) {
        emailErrorElement.textContent = "Please enter a valid email address.";
        isFormValid = false;
      }

      if (!validatePassword(password)) {
        passwordErrorElement.textContent = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        isFormValid = false;
      }

      if (password !== confirmPassword) {
        confirmPasswordErrorElement.textContent = "Passwords do not match.";
        isFormValid = false;
      }

      if (!isFormValid) return;

      const users = getUsers();
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        emailErrorElement.textContent = "Email already registered.";
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

  // Initialize authentication functionality
  document.addEventListener("DOMContentLoaded", function () {
    // Create default admin user if not exists
    const users = getUsers();
    const adminExists = users.find((user) => user.email === ADMIN_EMAIL);
    if (!adminExists) {
      users.push({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: "admin123",
      });
      saveUsers(users);
    }

    checkSession();
    initNavbarUpdate();
    restrictActions();
    handleLogin();
    handleSignup();
  });
})();
