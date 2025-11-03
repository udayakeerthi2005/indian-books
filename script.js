async function loadPeople() {
    const res = await fetch("data/people.json");
    const people = await res.json();
    window.peopleData = people;
    displayPeople(people);
  }
  
  function displayPeople(list) {
    const container = document.getElementById("peopleList");
    container.innerHTML = "";
    list.forEach(p => {
      const div = document.createElement("div");
      div.className = "person";
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <small>${p.books.length} books recommended</small>
        <ul class="recommended" id="rec-${p.name.replace(/\s+/g, '')}" style="display:none;"></ul>
      `;
      div.addEventListener("click", () => toggleBooks(p));
      container.appendChild(div);
    });
  }
  
  function toggleBooks(person) {
    const list = document.getElementById(`rec-${person.name.replace(/\s+/g, '')}`);
    if (list.style.display === "none") {
      list.innerHTML = person.books.map(b => `<li>📘 ${b}</li>`).join("");
      list.style.display = "block";
    } else {
      list.style.display = "none";
    }
  }
  
  function filterPeople(type) {
    let data = [...window.peopleData];
    if (type === "new") data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (type === "top") data.sort((a, b) => b.popularity - a.popularity);
    if (type === "random") data.sort(() => Math.random() - 0.5);
    displayPeople(data);
  }
  
  function searchPeople() {
    const term = document.getElementById("peopleSearch").value.toLowerCase();
    const filtered = window.peopleData.filter(p => p.name.toLowerCase().includes(term));
    displayPeople(filtered);
  }
  
  async function loadBooks() {
    const res = await fetch("data/books.json");
    const books = await res.json();
    window.bookData = books;
    displayBooks(books);
  }
  
  function displayBooks(list) {
    const container = document.getElementById("bookList");
    container.innerHTML = "";
    list.forEach(b => {
      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `
        <img src="${b.image}" alt="${b.title}">
        <h4>${b.title}</h4>
        <p>${b.author}</p>
        <small>Recommended by ${b.recommended_by.join(", ")}</small>
      `;
      container.appendChild(div);
    });
  }
  
  function filterBooks(type) {
    let data = [...window.bookData];
    if (type === "new") data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (type === "top") data.sort((a, b) => b.popularity - a.popularity);
    if (type === "random") data.sort(() => Math.random() - 0.5);
    displayBooks(data);
  }
  
  function searchBooks() {
    const term = document.getElementById("bookSearch").value.toLowerCase();
    const filtered = window.bookData.filter(b => b.title.toLowerCase().includes(term));
    displayBooks(filtered);
  }
  
  if (location.pathname.endsWith("people.html")) loadPeople();
  if (location.pathname.endsWith("books.html")) loadBooks();
  