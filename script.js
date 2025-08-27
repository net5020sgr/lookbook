
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const caption = document.getElementById("caption");

let photos = [];
let currentIndex = 0;

// let basePath = "";
const basePath = window.location.hostname.includes("github.io") ? "/lookbook/" : "/";


// 將日期字串轉換成月份標題 (e.g., "2025-08-28" → "August 2025")
function formatMonth(dateStr) {
  const months = ["January","February","March","April","May","June","July",
                  "August","September","October","November","December"];
  const [year, month] = dateStr.split("-");
  return `${months[parseInt(month)-1]} ${year}`;
}

// 載入 JSON
async function loadPhotos() {
  const res = await fetch(basePath + "photos.json");
  photos = await res.json();

  // Debug log
  console.log("Loaded photos:", photos);

  photos = photos.map(p => ({
  ...p,
  src: basePath + p.src
}));
  console.log("Mapped photos:", photos);

  renderGallery("all");
}


// 建立相片牆 (依月份分組)
function renderGallery(filter="all") {
  gallery.innerHTML = "";
  const grouped = {};

  photos.forEach((p, idx) => {
    const datePart = p.src.match(/(\d{4}-\d{2}-\d{2})/);
    if (!datePart) return;
    const monthKey = formatMonth(datePart[1]);
    if (!grouped[monthKey]) grouped[monthKey] = [];
    if (filter==="all" || p.tags.includes(filter)) {
      grouped[monthKey].push({...p, index: idx});
    }
  });

  Object.keys(grouped).forEach(month => {
    const section = document.createElement("div");
    section.innerHTML = `<h2>${month}</h2>`;
    section.className = "month-section";

    const container = document.createElement("div");
    container.className = "month-gallery";

    grouped[month].forEach(p=>{
      const div = document.createElement("div");
      div.className = "gallery-item";
      div.innerHTML = `
        <img src="${p.src}" alt="${p.title}" data-index="${p.index}">
        <p>${p.title}</p>`;
      container.appendChild(div);
    });

    section.appendChild(container);
    gallery.appendChild(section);
  });
}

// 篩選
document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.addEventListener("click", ()=> renderGallery(btn.dataset.filter));
});

// Lightbox
gallery.addEventListener("click", e=>{
  if(e.target.tagName==="IMG"){
    currentIndex = parseInt(e.target.dataset.index);
    showLightbox(currentIndex);
  }
});
function showLightbox(index){
  lightbox.style.display="block";
  lightboxImg.src = photos[index].src;
  caption.textContent = photos[index].title;
}
document.querySelector(".close").onclick=()=>lightbox.style.display="none";
document.querySelector(".prev").onclick=()=>{ currentIndex=(currentIndex-1+photos.length)%photos.length; showLightbox(currentIndex); };
document.querySelector(".next").onclick=()=>{ currentIndex=(currentIndex+1)%photos.length; showLightbox(currentIndex); };
lightbox.onclick = (e)=>{ if(e.target===lightbox) lightbox.style.display="none"; }

// 初始化
loadPhotos();
