// Search functionality (shared)
document.addEventListener("input", (e) => {
    if (e.target.id.startsWith("search")) {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll(".card").forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? "block" : "none";
      });
    }
  });
  
  // Random button (only on home page)
  const randomBtn = document.getElementById("randomBtn");
  if (randomBtn) {
    const pages = ["people.html", "books.html"];
    randomBtn.addEventListener("click", () => {
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      window.location.href = randomPage;
    });
  }
  