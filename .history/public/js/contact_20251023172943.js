(function () {
  const MESSAGES_KEY = "contactMessages";

  function getMessages() {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      const messages = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(messages)) {
        console.warn("Messages data is not an array, resetting to empty.");
        return [];
      }
      return messages;
    } catch (e) {
      console.error("Failed to parse messages from localStorage:", e);
      return [];
    }
  }

  function saveMessages(messages) {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to save messages", e);
    }
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateForm() {
    let isValid = true;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Clear previous errors
    document.querySelectorAll(".error").forEach((el) => {
      el.textContent = "";
      el.style.display = "none";
    });

    if (!name) {
      showError("nameError", "Name is required.");
      isValid = false;
    }

    if (!email) {
      showError("emailError", "Email is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      showError("emailError", "Please enter a valid email address.");
      isValid = false;
    }

    if (!message) {
      showError("messageError", "Message is required.");
      isValid = false;
    }

    return isValid;
  }

  function showError(errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
  }

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

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.remove();
      }
    }, 5000);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

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

    // Clear form
    document.getElementById("contact-form").reset();

    // Show success popup
    showSuccessPopup();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", handleFormSubmit);
    }
  });
})();
