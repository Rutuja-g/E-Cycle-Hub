// components.js - Dynamic loading of header and footer components

(function () {
  // Load component into element
  async function loadComponent(componentPath, targetElement) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${componentPath}: ${response.status}`);
      }
      const html = await response.text();
      targetElement.innerHTML = html;
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      targetElement.innerHTML = "<p>Error loading component</p>";
    }
  }

  // Load header and footer on page load
  document.addEventListener("DOMContentLoaded", function () {
    const headerElement = document.getElementById("header");
    const footerElement = document.getElementById("footer");

    if (headerElement) {
      loadComponent("components/header.html", headerElement);
    }

    if (footerElement) {
      loadComponent("components/footer.html", footerElement);
    }
  });
})();
