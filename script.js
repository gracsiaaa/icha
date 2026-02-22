// 1. DATA PRODUK LENGKAP (8 Produk)
// ==========================================
const allProducts = [
  { id: 1, name: "Risol Mayo", price: 10000, img: "risol-mayo.jpg.jpeg", desc: "Risol crispy dengan isian smoked beef, telur, dan saus mayo premium yang lumer di mulut.", text:"/2pcs"},
  { id: 2, name: "Risol Beef Bolognese", price: 10000, img: "risol beef.jpeg", desc: "Perpaduan unik kulit risol renyah dengan isian daging sapi cincang bumbu bolognese khas Italia.", text:"/2pcs" },
  { id: 3, name: "Risol Cokelat Pisang", price: 10000, img: "risol coklat.jpeg", desc: "Camilan manis dengan isian pisang raja dan cokelat lumer yang melimpah di setiap gigitan.", text:"/2pcs" },
  { id: 4, name: "Es Cincau", price: 8000, img: "cincau.png", desc: "Minuman segar dengan cincau hitam pilihan dan sirup pandan yang menyegarkan.", text:"/2pcs" },
]

// ==========================================
// 2. LOGIKA RENDER (DETEKSI HALAMAN)
// ==========================================

// --- Fungsi Render Halaman DEPAN (Hanya 3 Produk) ---
function renderHomeProducts() {
  const container = document.getElementById("latest-products");
  if (!container) return; // Jika tidak ada ID ini, berarti bukan halaman index

  const homeItems = allProducts.slice(0, 3); // Ambil hanya 3 produk pertama

  container.innerHTML = homeItems.map(p => `
    <div class="product-card">
      <div style="position:relative; cursor:pointer;" onclick="openPopup(${p.id})">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="product-info">
        <h3 onclick="openPopup(${p.id})" style="cursor:pointer;">${p.name}</h3>
        <p class="price">Rp ${p.price.toLocaleString("id-ID")} ${p.text ? p.text : ""}</p>
        <button class="btn-add" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
      </div>
    </div>
  `).join("");
}

// --- Fungsi Render Halaman KATALOG (Semua Produk + Filter) ---
function renderFullCatalog(filterCat = "semua", searchTerm = "") {
  const container = document.getElementById("product-list");
  if (!container) return; // Jika tidak ada ID ini, berarti bukan halaman produk

  const filtered = allProducts.filter(p => {
    const matchCat = filterCat === "semua" || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align:center; grid-column:1/-1; padding:50px; color:#888;">Kue tidak ditemukan...</p>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div style="position:relative; cursor:pointer;" onclick="openPopup(${p.id})">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="product-info">
        <h3 onclick="openPopup(${p.id})" style="cursor:pointer;">${p.name}</h3>
        <p class="price">Rp ${p.price.toLocaleString("id-ID")} ${p.text ? p.text : ""}</p>
        <button class="btn-add" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
      </div>
    </div>
  `).join("");
}

// Fungsi Trigger Filter (Hanya di produk.html)
function combinedFilter() {
  const cat = document.getElementById("category-select").value;
  const search = document.getElementById("search-input").value;
  renderFullCatalog(cat, search);
}

// ==========================================
// 3. LOGIKA POPUP DETAIL (Modal)
// ==========================================
function openPopup(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  const modal = document.getElementById("product-modal");
  if (!modal) return; // Jika modal tidak ada di HTML halaman tersebut

  document.getElementById("modal-img").src = product.img;
  document.getElementById("modal-name").innerText = product.name;
  document.getElementById("modal-cat").innerText = product.category;
  document.getElementById("modal-price").innerText = `Rp ${product.price.toLocaleString("id-ID")}`;
  document.getElementById("modal-desc").innerText = product.desc;
  
  document.getElementById("modal-add-btn").onclick = function() {
    addToCart(product.id);
    closePopup();
  };
  modal.style.display = "flex";
}

function closePopup() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.style.display = "none";
}

// ==========================================
// 4. LOGIKA KERANJANG (Cart)
// ==========================================
let cart = JSON.parse(localStorage.getItem("DAPUR_MANIS_CART")) || [];

function updateCartUI() {
  const container = document.getElementById("cart-items-container");
  const countLabel = document.getElementById("cart-count");
  const totalLabel = document.getElementById("cart-total-amount");

  if (countLabel) countLabel.innerText = cart.length;

  if (container) {
    if (cart.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding:20px; color:#888;">Keranjang kosong</p>`;
      if (totalLabel) totalLabel.innerText = "Rp 0";
    } else {
      let total = 0;
      container.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
          <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>Rp ${item.price.toLocaleString("id-ID")}</p>
              <button class="btn-remove" onclick="removeFromCart(${index})">Hapus</button>
            </div>
          </div>
        `;
      }).join("");
      if (totalLabel) totalLabel.innerText = `Rp ${total.toLocaleString("id-ID")}`;
    }
  }
  localStorage.setItem("DAPUR_MANIS_CART", JSON.stringify(cart));
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  cart.push(product);
  updateCartUI();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function openCart() {
  const sidebar = document.getElementById("cart-sidebar");
  if(sidebar) sidebar.classList.add("active");
  const overlay = document.getElementById("cart-overlay");
  if(overlay) overlay.style.display = "block";
}

function closeCart() {
  const sidebar = document.getElementById("cart-sidebar");
  if(sidebar) sidebar.classList.remove("active");
  const overlay = document.getElementById("cart-overlay");
  if(overlay) overlay.style.display = "none";
}

function processCheckoutAll() {
  if (cart.length === 0) return alert("Keranjang kosong!");

  // 1. Hitung total harga belanjaan
  const totalHarga = cart.reduce((total, item) => total + item.price, 0);

  // 2. Susun daftar produk (Nama + Text Tambahan seperti /2pcs)
  const daftarPesanan = cart.map(i => {
    // Mengambil nama dan text (jika ada), jika tidak ada text maka kosongkan
    const infoTambahan = i.text ? i.text : ""; 
    return `- ${i.name} ${infoTambahan} (Rp ${i.price.toLocaleString("id-ID")})`;
  }).join("%0A");

  // 3. Susun template pesan lengkap
  const header = "Halo Dapur Manis, saya ingin memesan:%0A%0A";
  const footer = `%0A%0A*Total Belanja: Rp ${totalHarga.toLocaleString("id-ID")}*%0A%0AMohon konfirmasi pesanan saya. Terima kasih!`;
  
  const pesanFinal = header + daftarPesanan + footer;

  // 4. Kirim ke WhatsApp
  window.open(`https://wa.me/6281235832752?text=${pesanFinal}`, "_blank");

  // 5. Reset keranjang setelah checkout
  cart = [];
  updateCartUI();
  closeCart();
}

// ==========================================
// 5. LOGIKA SLIDER (Otomatis)
// ==========================================
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  if (slides.length === 0) return;

  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].classList.add("active");
  setTimeout(showSlides, 4000);
}

// ==========================================
// 6. INISIALISASI
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  showSlides();         // Jalankan Slider (jika ada)
  renderHomeProducts(); // Render 3 produk (jika di index)
  renderFullCatalog();  // Render semua produk (jika di produk.html)
  updateCartUI();       // Sinkronkan Keranjang
});