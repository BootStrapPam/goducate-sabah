(function () {
  "use strict";

  // Highlight current nav item based on page-level variable set in each HTML file.
  const currentPage = window.GODUCATE_CURRENT_PAGE;
  const navLinks = document.querySelectorAll(".site-nav a[data-page]");
  const nav = document.querySelector(".site-nav");
  const menuToggle = document.querySelector(".menu-toggle");

  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("active");
    }
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  const lessonGrid = document.querySelector(".lesson-grid[data-level]");
  if (!lessonGrid) {
    return;
  }

  const levelKey = lessonGrid.dataset.level;
  // Load lesson content from local JS data first (works on file://), then JSON fallback.
  const localLessons = window.GODUCATE_LESSONS;
  if (localLessons && typeof localLessons === "object") {
    renderLessons(localLessons);
    return;
  }

  fetch("assets/data/lessons.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lesson data could not be loaded.");
      }
      return response.json();
    })
    .then((lessonsByLevel) => renderLessons(lessonsByLevel))
    .catch(() => {
      lessonGrid.innerHTML = "<p>Unable to load lessons right now. Please check assets/data/lessons-data.js.</p>";
    });

  function renderLessons(lessonsByLevel) {
    const lessons = lessonsByLevel[levelKey] || [];

    if (!lessons.length) {
      lessonGrid.innerHTML = "<p>No lessons yet. Add lessons in assets/data/lessons-data.js.</p>";
      return;
    }

    lessonGrid.innerHTML = lessons
      .map((lesson) => {
        const safeTitle = escapeHtml(lesson.title || "Untitled Lesson");
        const safeDescription = escapeHtml(lesson.description || "Description coming soon.");
        const safeLink = lesson.link || "#";

        return `
          <article class="lesson-card">
            <div class="icon" aria-hidden="true">LESSON</div>
            <h3>${safeTitle}</h3>
            <p>${safeDescription}</p>
            <a class="btn btn-primary" href="${safeLink}" target="_blank" rel="noopener noreferrer">Open Lesson</a>
          </article>
        `;
      })
      .join("");
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
