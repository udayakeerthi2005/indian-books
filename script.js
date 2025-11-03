async function loadPeople() {
    const res = await fetch("data/people.json");
    const data = await res.json();
    window.peopleData = data;
    displayPeople(data);
  }
  
  function displayPeople(list) {
    const container = document.getElementById("peopleList");
    container.innerHTML = "";
    list.forEach(p => {
      const div = document.createElement("div");
      div.className = "person";
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <small>${p.books.length} books</small>
      `;
      div.onclick = () => window.location.href = `person.html?id=${encodeURIComponent(p.name)}`;
      container.appendChild(div);
    });
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

  async function loadPersonDetails(name) {
    const res = await fetch("data/people.json");
    const people = await res.json();
    const person = people.find(p => p.name === name);
    if (person) {
      const container = document.getElementById("personDetails");
      container.innerHTML = `
        <img src="${person.image}" alt="${person.name}">
        <h1>${person.name}</h1>
        <p>${person.description}</p>
        <div class="recommended-books">
          <h2>Recommended Books</h2>
          <ul>
            ${person.books.map(book => `<li onclick="window.location.href='book.html?id=${encodeURIComponent(book)}'">📘 ${book}</li>`).join("")}
          </ul>
        </div>
      `;
    }
  }

  async function loadBookDetails(title) {
    const res = await fetch("data/books.json");
    const books = await res.json();
    const book = books.find(b => b.title === title);
    if (book) {
      const container = document.getElementById("bookDetails");
      container.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <h1>${book.title}</h1>
        <p>By ${book.author}</p>
        <div class="recommended-by">
          <h2>Recommended by</h2>
          <ul>
            ${book.recommended_by.map(person => `<li onclick="window.location.href='person.html?id=${encodeURIComponent(person)}'">${person}</li>`).join("")}
          </ul>
        </div>
      `;
    }
  }

  // Load person details if on person.html
  if (location.pathname.endsWith("person.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const personName = urlParams.get('id');
    if (personName) loadPersonDetails(decodeURIComponent(personName));
  }

  // Load book details if on book.html
  if (location.pathname.endsWith("book.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const bookTitle = urlParams.get('id');
    if (bookTitle) loadBookDetails(decodeURIComponent(bookTitle));
  }

  if (location.pathname.endsWith("people.html")) loadPeople();
  if (location.pathname.endsWith("books.html")) loadBooks();
  