// Component loader for dynamic header and footer loading

(function () {
  // Load HTML component into target element
  async function loadComponent(componentPath, targetElement) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${componentPath}: ${response.status}`);
      }
      const htmlContent = await response.text();
      targetElement.innerHTML = htmlContent;
    } catch (error) {
      targetElement.innerHTML = "<p>Error loading component</p>";
    }
  }

  // Initialize component loading on page load
  document.addEventListener("DOMContentLoaded", function () {
    const headerElement = document.getElementById("header");
    const footerElement = document.getElementById("footer");

    if (headerElement) {
      loadComponent("../components/header.html", headerElement);
    }

    if (footerElement) {
      loadComponent("../components/footer.html", footerElement);
    }
  });
})();
