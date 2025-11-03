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
      div.onclick = () => showPopup(p);
      container.appendChild(div);
    });
  }
  
  function showPopup(person) {
    const popup = document.getElementById("popup");
    const details = document.getElementById("popupDetails");
    details.innerHTML = `
      <img src="${person.image}" alt="${person.name}">
      <h2>${person.name}</h2>
      <p>${person.description}</p>
      <h3>Recommended Books:</h3>
      <ul>${person.books.map(b => `<li>📘 ${b}</li>`).join("")}</ul>
    `;
    popup.style.display = "block";
  }
  
  function closePopup() {
    document.getElementById("popup").style.display = "none";
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
  