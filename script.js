/* Shared script for people.html and books.html
   - Top: shows first N items (featured order in JSON)
   - New: random shuffle (to simulate new arrivals)
   - Random: random set
   - Search: filters name/title, description/author, and recommended books
   - Clicking a book link uses ?q=title to open books.html filtered by that book
*/

let allData = [];
let currentType = ""; // "people" or "books"

function fetchData(type){
  currentType = type;
  return fetch(`data/${type}.json`).then(r => r.json());
}

function renderList(data){
  const container = document.getElementById("listContainer");
  container.innerHTML = "";
  if(!data || data.length === 0){
    container.innerHTML = "<p style='text-align:center;color:#666'>No results found.</p>";
    return;
  }

  data.forEach(item => {
    const imgSrc = item.image || "";
    const title = item.name || item.title || "";
    const subtitle = currentType === "books" ? (item.author || "") : (item.description || "");
    // for people: item.books[] ; for books: item.recommendedBy[]
    const recs = currentType === "people" ? (item.books || []) : (item.recommendedBy || []);
    const row = document.createElement("div");
    row.className = "list-item";
    row.innerHTML = `
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(title)}" onerror="this.src='https://via.placeholder.com/64?text=No+Img'"/>
      <div class="list-info">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(subtitle)}</p>
        ${ currentType === "people" ? renderRecsHtml(recs) : renderBookMetaHtml(recs) }
      </div>
    `;
    container.appendChild(row);
  });
}

function renderRecsHtml(recs){
  if(!recs || recs.length === 0) return "";
  const inner = recs.map(r => {
    // r: {title, cover, link}
    const link = r.link ? r.link : `books.html?q=${encodeURIComponent(r.title)}`;
    const cover = r.cover || '';
    return `<a class="rec" href="${link}" target="_blank" rel="noopener noreferrer"><img src="${cover}" alt="${escapeHtml(r.title)}" onerror="this.src='https://via.placeholder.com/28x38?text=+'"/> ${escapeHtml(r.title)}</a>`;
  }).join("");
  return `<div class="recs">${inner}</div>`;
}

function renderBookMetaHtml(recs){
  if(!recs || recs.length === 0) return "";
  // recs is array of names who recommended
  const inner = recs.map(n => `<span class="rec">${escapeHtml(n)}</span>`).join(" ");
  return `<div style="margin-top:8px">${inner}</div>`;
}

function sortTop(data){ // top = use original order (first items are featured)
  return [...data];
}

function sortNew(data){ // new = shuffle to give "new" feeling
  return shuffle(data);
}

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function escapeHtml(s){
  if(!s) return "";
  return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

/* Initialization and UI binding */
window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if(path.includes("people")) {
    fetchData("people").then(data => { allData = data; renderList(allData); handleQuery(); });
  } else if(path.includes("books")) {
    fetchData("books").then(data => { allData = data; renderList(allData); handleQuery(); });
  }

  // search binding (single input id on both pages)
  const searchInput = document.getElementById("searchInput");
  if(searchInput){
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase().trim();
      if(!term) { renderList(allData); return; }
      const filtered = allData.filter(item => {
        const name = (item.name||item.title||"").toLowerCase();
        const desc = ((item.description||item.author||"") +"").toLowerCase();
        if(name.includes(term) || desc.includes(term)) return true;
        // people.books titles
        if(item.books && item.books.some(b => (b.title||"").toLowerCase().includes(term))) return true;
        // books.recommendedBy
        if(item.recommendedBy && item.recommendedBy.some(n => n.toLowerCase().includes(term))) return true;
        return false;
      });
      renderList(filtered);
    });
  }

  // buttons
  const topBtn = document.getElementById("topBtn");
  const newBtn = document.getElementById("newBtn");
  const randomBtn = document.getElementById("randomBtn");

  if(topBtn) topBtn.addEventListener("click", () => renderList(sortTop(allData).slice(0, 20)));
  if(newBtn) newBtn.addEventListener("click", () => renderList(sortNew(allData).slice(0, 20)));
  if(randomBtn) randomBtn.addEventListener("click", () => renderList(shuffle(allData).slice(0, 20)));

});

/* If opened with ?q=... route to filter on books page */
function handleQuery(){
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if(!q) return;
  const term = decodeURIComponent(q).toLowerCase();
  // if books page, filter books by title/author; if people page, show people who recommended that book
  const path = window.location.pathname;
  if(path.includes("books")){
    const filtered = allData.filter(b => (b.name||"").toLowerCase().includes(term) || (b.author||"").toLowerCase().includes(term));
    renderList(filtered);
    const input = document.getElementById("searchInput");
    if(input) input.value = decodeURIComponent(q);
  } else if(path.includes("people")){
    const filtered = allData.filter(p => (p.books||[]).some(b => (b.title||"").toLowerCase().includes(term)));
    renderList(filtered);
    const input = document.getElementById("searchInput");
    if(input) input.value = decodeURIComponent(q);
  }
}
