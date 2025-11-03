document.addEventListener("DOMContentLoaded", () => {
    const peopleContainer = document.getElementById("peopleList");
    const booksContainer = document.getElementById("booksList");
    const searchPeople = document.getElementById("searchPeople");
    const searchBooks = document.getElementById("searchBooks");
  
    const page = peopleContainer ? "people" : booksContainer ? "books" : "home";
  
    if (page === "people") loadPeople();
    if (page === "books") loadBooks();
  
    async function loadPeople() {
      const res = await fetch("data/people.json");
      const people = await res.json();
      renderPeople(people);
  
      document.querySelectorAll(".filter-btn").forEach(btn =>
        btn.addEventListener("click", () => {
          const type = btn.dataset.type;
          let sorted = [...people];
          if (type === "new") sorted.reverse();
          else if (type === "top") sorted.sort(() => 0.5 - Math.random());
          else if (type === "random") sorted.sort(() => 0.5 - Math.random());
          renderPeople(sorted);
        })
      );
  
      searchPeople.addEventListener("input", e => {
        const q = e.target.value.toLowerCase();
        const filtered = people.filter(p => p.name.toLowerCase().includes(q));
        renderPeople(filtered);
      });
    }
  
    function renderPeople(data) {
      peopleContainer.innerHTML = data.map(p => `
        <div class="person">
          <img src="${p.image}" alt="${p.name}">
          <div class="person-info">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="recommended-books">
              Recommended ${p.books.length} books: ${p.books.map(b => `<em>${b}</em>`).join(", ")}
            </div>
          </div>
        </div>
      `).join("");
    }
  
    async function loadBooks() {
      const res = await fetch("data/books.json");
      const books = await res.json();
      renderBooks(books);
  
      document.querySelectorAll(".filter-btn").forEach(btn =>
        btn.addEventListener("click", () => {
          const type = btn.dataset.type;
          let sorted = [...books];
          if (type === "new") sorted.reverse();
          else if (type === "top") sorted.sort(() => 0.5 - Math.random());
          else if (type === "random") sorted.sort(() => 0.5 - Math.random());
          renderBooks(sorted);
        })
      );
  
      searchBooks.addEventListener("input", e => {
        const q = e.target.value.toLowerCase();
        const filtered = books.filter(b => b.title.toLowerCase().includes(q));
        renderBooks(filtered);
      });
    }
  
    function renderBooks(data) {
      booksContainer.innerHTML = data.map(b => `
        <div class="book">
          <img src="${b.image}" alt="${b.title}">
          <div class="book-info">
            <h3>${b.title}</h3>
            <p>by ${b.author}</p>
            <div class="recommended-by">Recommended by ${b.recommendedBy.join(", ")}</div>
          </div>
        </div>
      `).join("");
    }
  });
  