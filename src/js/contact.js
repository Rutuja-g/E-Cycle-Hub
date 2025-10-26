// Contact form handler for message submission and validation

(function () {
  const MESSAGES_STORAGE_KEY = "contactMessages";

  // Retrieve messages from localStorage
  function getMessages() {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      if (!Array.isArray(messages)) {
        return [];
      }
      return messages;
    } catch (error) {
      return [];
    }
  }

  // Save messages to localStorage
  function saveMessages(messages) {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      // Error handled silently
    }
  }

  // Validate email format
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Validate contact form fields
  function validateForm() {
    let isFormValid = true;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Clear previous error messages
    document.querySelectorAll(".error").forEach((element) => {
      element.textContent = "";
      element.style.display = "none";
    });

    if (!name) {
      showError("nameError", "Name is required.");
      isFormValid = false;
    }

    if (!email) {
      showError("emailError", "Email is required.");
      isFormValid = false;
    } else if (!validateEmail(email)) {
      showError("emailError", "Please enter a valid email address.");
      isFormValid = false;
    }

    if (!message) {
      showError("messageError", "Message is required.");
      isFormValid = false;
    }

    return isFormValid;
  }

  // Display error message for specific field
  function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  // Show success popup after form submission
  function showSuccessPopup() {
    const popup = document.createElement("div");
    popup.className = "success-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Message Sent!</h3>
        <p>Thank you for contacting us. We'll get back to you soon.</p>
        <button id="close-popup">OK</button>
      </div>
    `;
    document.body.appendChild(popup);

    document
      .getElementById("close-popup")
      .addEventListener("click", function () {
        popup.remove();
      });

    // Auto-remove popup after 5 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.remove();
      }
    }, 5000);
  }

  // Handle contact form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const contactMessage = {
      id: Date.now(),
      name: name,
      email: email,
      message: message,
      date: new Date().toISOString(),
    };

    const messages = getMessages();
    messages.push(contactMessage);
    saveMessages(messages);

    // Clear form after successful submission
    document.getElementById("contact-form").reset();

    // Show success popup
    showSuccessPopup();
  }

  // Initialize contact form functionality
  document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", handleFormSubmit);
    }
  });
})();
