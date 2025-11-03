const content = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const randomBtn = document.getElementById("randomBtn");
const navBtns = document.querySelectorAll(".nav-btn");

// Load default section
let currentSection = "people";
renderSection(currentSection);

navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentSection = btn.dataset.section;
    renderSection(currentSection);
  });
});

function renderSection(section) {
  content.innerHTML = "";
  const data = section === "people" ? people : books;
  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML =
      section === "people"
        ? `<img src="${item.img}" alt="${item.name}">
           <h3>${item.name}</h3>
           <p>${item.info}</p>`
        : `<img src="${item.img}" alt="${item.title}">
           <h3>${item.title}</h3>
           <p>${item.author}</p>`;
    content.appendChild(card);
  });
}

searchBar.addEventListener("input", e => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(searchTerm)
      ? "block"
      : "none";
  });
});

randomBtn.addEventListener("click", () => {
  const randomSection = Math.random() > 0.5 ? "people" : "books";
  currentSection = randomSection;
  renderSection(currentSection);
});
