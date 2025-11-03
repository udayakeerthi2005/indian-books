// For people page
if (document.getElementById("peopleContainer")) {
    fetch("data/people.json")
      .then(res => res.json())
      .then(data => renderPeople(data));
  
    function renderPeople(people) {
      const container = document.getElementById("peopleContainer");
      people.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${p.img}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.info}</p>
        `;
        container.appendChild(div);
      });
  
      document.getElementById("searchPeople").addEventListener("input", e => {
        const val = e.target.value.toLowerCase();
        document.querySelectorAll(".card").forEach(card => {
          card.style.display = card.textContent.toLowerCase().includes(val) ? "" : "none";
        });
      });
    }
  }
  
  // For books page
  if (document.getElementById("booksContainer")) {
    fetch("data/books.json")
      .then(res => res.json())
      .then(data => renderBooks(data));
  
    function renderBooks(books) {
      const container = document.getElementById("booksContainer");
      books.forEach(b => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${b.img}" alt="${b.title}">
          <h3>${b.title}</h3>
          <p>${b.author}</p>
        `;
        container.appendChild(div);
      });
  
      document.getElementById("searchBooks").addEventListener("input", e => {
        const val = e.target.value.toLowerCase();
        document.querySelectorAll(".card").forEach(card => {
          card.style.display = card.textContent.toLowerCase().includes(val) ? "" : "none";
        });
      });
    }
  }
  