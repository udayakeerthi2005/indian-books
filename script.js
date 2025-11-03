// ===== PEOPLE PAGE =====
async function loadPeople() {
  const res = await fetch("data/people.json");
  const data = await res.json();
  window.peopleData = data;
  displayPeople(data);
}

function displayPeople(list) {
  const container = document.getElementById("peopleList");
  container.innerHTML = "";
  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "person";
      div.innerHTML = `
     <img src="${p.image ? encodeURI(p.image) : defaultImage}"
       alt="${p.name}"
       loading="lazy"
       onerror="this.onerror=null; this.src='${defaultImage}'; handleImageLoad(this)">
        <h4>${p.name}</h4>
        <small>${p.books ? p.books.length : 0} books</small>
      `;
    div.onclick = () => window.location.href = `person.html?id=${encodeURIComponent(p.name)}`;
    container.appendChild(div);
    // Attach load handler for dynamically created image so CSS 'loaded' class is applied
    const imgEl = div.querySelector('img');
    if (imgEl) {
      imgEl.addEventListener('load', () => handleImageLoad(imgEl));
      imgEl.addEventListener('error', (e) => {
        console.warn('Person image failed to load:', imgEl.src, e);
        // ensure fallback and visible
        imgEl.onerror = null;
        imgEl.src = defaultImage;
        handleImageLoad(imgEl);
      });
      if (imgEl.complete) handleImageLoad(imgEl);
    }
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

// ===== BOOKS PAGE =====
async function loadBooks() {
  const res = await fetch("data/books.json");
  const books = await res.json();
  window.bookData = books;
  displayBooks(books);
}

function displayBooks(list) {
  const container = document.getElementById("bookList");
  container.innerHTML = "";
  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjIyMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==";
  list.forEach(b => {
    const div = document.createElement("div");
    div.className = "book";
      div.innerHTML = `
     <img src="${b.image ? encodeURI(b.image) : defaultImage}"
       alt="${b.title}"
       loading="lazy"
       onerror="this.onerror=null; this.src='${defaultImage}'; handleImageLoad(this)">
      <h4>${b.title}</h4>
      <p>${b.author}</p>
      <small>Recommended by ${b.recommended_by ? b.recommended_by.join(", ") : "N/A"}</small>
    `;
    div.onclick = () => window.location.href = `book.html?id=${encodeURIComponent(b.title)}`;
    container.appendChild(div);
    // Attach load handler for dynamically created book image
    const bookImg = div.querySelector('img');
    if (bookImg) {
      bookImg.addEventListener('load', () => handleImageLoad(bookImg));
      bookImg.addEventListener('error', (e) => {
        console.warn('Book image failed to load:', bookImg.src, e);
        bookImg.onerror = null;
        bookImg.src = defaultImage;
        handleImageLoad(bookImg);
      });
      if (bookImg.complete) handleImageLoad(bookImg);
    }
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

// ===== PERSON DETAILS PAGE =====
async function loadPersonDetails(name) {
  const res = await fetch("data/people.json");
  const people = await res.json();
  const person = people.find(p => p.name === name);
  const container = document.getElementById("personDetails");

  if (person) {
    const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==";
    container.innerHTML = `
     <img src="${person.image ? encodeURI(person.image) : defaultImage}"
       alt="${person.name}"
       class="person-detail-img"
       loading="lazy"
       onerror="this.onerror=null; this.src='${defaultImage}'; handleImageLoad(this)">
      <h1>${person.name}</h1>
      <p>${person.description}</p>
      <p><strong>Birth Date:</strong> ${person.birth_date || 'Not specified'}</p>
      <p><strong>Occupation:</strong> ${person.occupation || 'Not specified'}</p>
      <p><strong>Achievements:</strong> ${person.achievements || 'Not specified'}</p>
      <div class="recommended-books">
        <h2>Recommended Books (${person.books.length})</h2>
        <ul>
          ${person.books.map(book =>
            `<li onclick="window.location.href='book.html?id=${encodeURIComponent(book)}'">📘 ${book}</li>`
          ).join("")}
        </ul>
      </div>
    `;
    // Attach load handler for the person detail image we just inserted
    const detailImg = container.querySelector('.person-detail-img');
    if (detailImg) {
      detailImg.addEventListener('load', () => handleImageLoad(detailImg));
      detailImg.addEventListener('error', (e) => {
        console.warn('Person detail image failed to load:', detailImg.src, e);
        detailImg.onerror = null;
        detailImg.src = defaultImage;
        handleImageLoad(detailImg);
      });
      if (detailImg.complete) handleImageLoad(detailImg);
    }
  } else {
    container.innerHTML = `
      <h1>Person Not Found</h1>
      <p>Sorry, we couldn't find details for "${name}".</p>
      <a href="people.html">← Back to People</a>
    `;
  }
}

// ===== BOOK DETAILS PAGE =====
async function loadBookDetails(title) {
  const res = await fetch("data/books.json");
  const books = await res.json();
  const book = books.find(b => b.title === title);
  const container = document.getElementById("bookDetails");

  if (book) {
    const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==";
    container.innerHTML = `
     <img src="${book.image ? encodeURI(book.image) : defaultImage}"
       alt="${book.title}"
       class="book-detail-img"
       loading="lazy"
       onerror="this.onerror=null; this.src='${defaultImage}'; handleImageLoad(this)">
      <h1>${book.title}</h1>
      <p>By ${book.author}</p>
      <p><strong>ISBN:</strong> ${book.isbn || 'Not available'}</p>
      <p><strong>Pages:</strong> ${book.pages || 'Not specified'}</p>
      <p><strong>Published:</strong> ${book.published || 'Not specified'}</p>
      <p><strong>Genre:</strong> ${book.genre || 'Not specified'}</p>
      <p><strong>Description:</strong> ${book.description || 'No description available.'}</p>
      <div class="recommended-by">
        <h2>Recommended by</h2>
        <ul>
          ${book.recommended_by.map(person =>
            `<li onclick="window.location.href='person.html?id=${encodeURIComponent(person)}'">${person}</li>`
          ).join("")}
        </ul>
      </div>
    `;
    // Attach load handler for the book detail image
    const bookDetailImg = container.querySelector('.book-detail-img');
    if (bookDetailImg) {
      bookDetailImg.addEventListener('load', () => handleImageLoad(bookDetailImg));
      bookDetailImg.addEventListener('error', (e) => {
        console.warn('Book detail image failed to load:', bookDetailImg.src, e);
        bookDetailImg.onerror = null;
        bookDetailImg.src = defaultImage;
        handleImageLoad(bookDetailImg);
      });
      if (bookDetailImg.complete) handleImageLoad(bookDetailImg);
    }
  } else {
    container.innerHTML = `
      <h1>Book Not Found</h1>
      <p>Sorry, we couldn't find details for "${title}".</p>
      <a href="books.html">← Back to Books</a>
    `;
  }
}

// ===== IMAGE LOADING HANDLER =====
function handleImageLoad(img) {
  img.classList.add('loaded');
}

// ===== PAGE INITIALIZATION =====
if (location.pathname.endsWith("people.html")) loadPeople();
if (location.pathname.endsWith("books.html")) loadBooks();

if (location.pathname.endsWith("person.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const personName = urlParams.get("id");
  if (personName) loadPersonDetails(decodeURIComponent(personName));
}

if (location.pathname.endsWith("book.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const bookTitle = urlParams.get("id");
  if (bookTitle) loadBookDetails(decodeURIComponent(bookTitle));
}

// Add event listeners for lazy-loaded images
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    img.addEventListener('load', () => handleImageLoad(img));
    // If image is already loaded (cached), trigger immediately
    if (img.complete) handleImageLoad(img);
  });
});
