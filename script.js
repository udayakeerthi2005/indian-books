let allData = [];
let currentType = "";

function loadData(type) {
  currentType = type;
  fetch(`data/${type}.json`)
    .then(res => res.json())
    .then(data => {
      allData = data;
      renderList(data);
    });
}

function renderList(data) {
  const container = document.getElementById("listContainer");
  container.innerHTML = "";
  if (!data.length) {
    container.innerHTML = "<p style='text-align:center'>No results found.</p>";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="list-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function showTop(type) {
  renderList(allData.slice(0, 5));
}

function showRandom(type) {
  const shuffled = [...allData].sort(() => 0.5 - Math.random());
  renderList(shuffled.slice(0, 5));
}

window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("people")) loadData("people");
  if (path.includes("books")) loadData("books");

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      const filtered = allData.filter(item =>
        item.name.toLowerCase().includes(term)
      );
      renderList(filtered);
    });
  }
});
