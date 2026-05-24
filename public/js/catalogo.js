document.addEventListener('DOMContentLoaded', () => {
const catalogoCards = document.getElementById('catalogoCards');

// fijossssssssssss
const productosFixos = [
  { id_product: 'fijo_1', name: 'Collar de Oro', price: '15000', imagen: 'img/collar.jpg', descripcion: 'Hermoso collar de oro' },
  { id_product: 'fijo_2', name: 'Camisa Estampada', price: '40000', imagen: 'img/camisa.jpg', descripcion: 'Camisa moderna y elegante' },
  { id_product: 'fijo_3', name: 'Brownie de Chocolate', price: '16000', imagen: 'img/brownie2.jpg', descripcion: 'Delicioso brownie casero' },
  { id_product: 'fijo_4', name: 'Accesorios Premium', price: '25000', imagen: 'img/producto1.jpg', descripcion: 'Accesorios de alta calidad' }
];

const createCard = (product) => {
  const card = document.createElement('div');
  card.className = 'card-producto';

  const nombre = product.name || 'Product';
  const descripcion = product.description || product.descripcion || product.descripcion_corta || 'Descripción no disponible';
  const precio = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
  const precioFormateado = isNaN(precio) ? product.price || '0' : precio.toLocaleString('es-CO');
  const imagen = product.imagen || 'img/producto1.jpg';

  card.innerHTML = `
    <img src="${imagen}" alt="${nombre}">
    <h4>${nombre}</h4>
    <p class="descripcion-producto">${descripcion}</p>
    <p>$${precioFormateado}</p>
    <div class="rating">★★★★★</div>
    <button class="btn-comprar">Comprar</button>
  `;

  return card;
};

const BACKEND = 'http://localhost:5000';

const renderProducts = (productosApi) => {
  catalogoCards.innerHTML = '';
  

  productosFixos.forEach((product) => {
    catalogoCards.appendChild(createCard(product));
  });

  // PROFE AQUI ESTAN LOS NO duplicados
if (Array.isArray(productosApi) && productosApi.length > 0) {
  const seen = new Set();
  const uniqueProducts = productosApi.filter((product) => {

if (product && product.id_product && String(product.id_product).startsWith('fijo_')) {
  const key = product.id_product;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
}

const nameKey = String((product.name || '').trim()).toLowerCase();
const priceRaw = (typeof product.price === 'number') ? String(product.price) : String(product.price || '');
const priceKey = priceRaw.replace(/\D/g, '');
const key = `${nameKey}-${priceKey}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

uniqueProducts.forEach((product) => {
catalogoCards.appendChild(createCard(product));
});
}
};

const loadProducts = async () => {
  if (window.location.protocol === 'file:') {
    catalogoCards.innerHTML = '<div class="error">Abre esta página desde el servidor: http://localhost:5000/catalogo.html</div>';
    return;
  }

const timestamp = new Date().getTime();
const mysqlRelativeUrl = `/product?t=${timestamp}`;
const firebaseRelativeUrl = `/product/firebase?t=${timestamp}`;
const mysqlAbsoluteUrl = `${BACKEND}/product?t=${timestamp}`;
const firebaseAbsoluteUrl = `${BACKEND}/product/firebase?t=${timestamp}`;

  const fetchProductSource = async (relativeUrl, absoluteUrl) => {
    let response = await fetch(relativeUrl, { cache: 'no-store' });
    if (response.status === 404 || !response.ok) {
      response = await fetch(absoluteUrl, { cache: 'no-store' });
    }
    if (!response.ok) {
      throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  try {
    const [mysqlResult, firebaseResult] = await Promise.all([
      fetchProductSource(mysqlRelativeUrl, mysqlAbsoluteUrl),
      fetchProductSource(firebaseRelativeUrl, firebaseAbsoluteUrl)
    ]);

    const mergedProducts = [...mysqlResult, ...firebaseResult];
    renderProducts(mergedProducts);
  } catch (error) {
    console.error('Error loading products from MySQL / Firebase:', error);

    try {
      const fallbackResponse = await fetch(mysqlAbsoluteUrl, { cache: 'no-store' });
      if (fallbackResponse.ok) {
        const productos = await fallbackResponse.json();
        renderProducts(productos);
        return;
      }
    } catch (fallbackError) {
      console.error('Fallback load failed:', fallbackError);
    }

    catalogoCards.innerHTML = `<div class="error">No se pudieron cargar los productos. ${error.message}</div>`;
    renderProducts([]);
  }
};


loadProducts();
setInterval(loadProducts, 5000);
});