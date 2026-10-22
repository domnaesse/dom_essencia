// DOM NA ESSÊNCIA — catálogo e contato via WhatsApp
// IMPORTANTE: troque o número abaixo pelo WhatsApp da empresa, com código do país e DDD.
// Exemplo Brasil: 5511999999999 (somente números, sem +, espaços ou traços).
const WHATSAPP_NUMBER = "5511992299143";

const productGrid = document.querySelector("#product-grid");
const filterButtons = document.querySelectorAll("[data-filter]");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
let allProducts = [];
let activeFilter = "Todos";

function openWhatsApp(message) {
  if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER === "11992299143") {
    alert("Antes de publicar, configure o número real do WhatsApp no arquivo script.js.");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function productMessage(product) {
  return `Olá! Vim pelo site da DOM NA ESSÊNCIA e gostaria de saber mais sobre o produto ${product.name}. Poderia me passar mais informações?`;
}

function renderProducts() {
  const filtered = activeFilter === "Todos"
    ? allProducts
    : allProducts.filter(product => product.category === activeFilter);

  if (!filtered.length) {
    productGrid.innerHTML = '<p class="empty-state">Não encontramos produtos nesta categoria.</p>';
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
        <span class="product-category">${escapeHTML(product.category)}</span>
      </div>
      <div class="product-info">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <div class="product-action">
          <span>DESCUBRA MAIS ESSÊNCIAS</span>
          <button class="learn-more" type="button" data-product-id="${product.id}">SAIBA MAIS ↗</button>
        </div>
      </div>
    </article>
  `).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-button").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  renderProducts();
}

fetch("produtos.json")
  .then(response => {
    if (!response.ok) throw new Error("Não foi possível carregar produtos.json");
    return response.json();
  })
  .then(products => {
    allProducts = products;
    renderProducts();
  })
  .catch(error => {
    console.error(error);
    productGrid.innerHTML = '<p class="empty-state">Não foi possível carregar o catálogo. Verifique se está executando o site por um servidor local e se o arquivo produtos.json está na mesma pasta.</p>';
  });

filterButtons.forEach(button => {
  button.addEventListener("click", event => {
    const filter = event.currentTarget.dataset.filter;
    if (event.currentTarget.classList.contains("category-link")) {
      setFilter(filter);
    } else {
      setFilter(filter);
    }
  });
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  const product = allProducts.find(item => item.id === Number(button.dataset.productId));
  if (product) openWhatsApp(productMessage(product));
});

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openWhatsApp(link.dataset.whatsapp);
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
