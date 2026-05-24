const API_BASE = 'http://localhost:5000';
const firebaseForm = document.getElementById('firebaseForm');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const createFirebaseBtn = document.getElementById('createFirebaseBtn');
const firebaseResult = document.getElementById('firebaseResult');
const runEtlBtn = document.getElementById('runEtlBtn');
const etlResult = document.getElementById('etlResult');
const refreshFirebaseBtn = document.getElementById('refreshFirebaseBtn');
const firebaseProducts = document.getElementById('firebaseProducts');

const showMessage = (container, message, color = '#333') => {
  container.textContent = message;
  container.style.color = color;
};

const loadFirebaseProducts = async () => {
  firebaseProducts.innerHTML = '<li>Loading...</li>';

try {
  const response = await fetch(`${API_BASE}/product/firebase`);
  const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || 'Failed to load Firebase products');
}

if (!Array.isArray(data) || data.length === 0) {
  firebaseProducts.innerHTML = '<li>No Firebase products found.</li>';
  return;
}

firebaseProducts.innerHTML = '';
data.forEach(product => {
  const li = document.createElement('li');
  li.textContent = `${product.name} — $${product.price} (id: ${product.id})`;
  firebaseProducts.appendChild(li);
});

} catch (error) {
  firebaseProducts.innerHTML = `<li>Error loading Firebase products: ${error.message}</li>`;
  console.error(error);
}
};

firebaseForm.addEventListener('submit', async event => {
  event.preventDefault();
  createFirebaseBtn.disabled = true;
  showMessage(firebaseResult, 'Creating product in Firebase...', '#333');

  try {
    const response = await fetch(`${API_BASE}/product/firebase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: productName.value,
        price: parseFloat(productPrice.value)
      })
    });

    const result = await response.json();

if (!response.ok) {
  throw new Error(result.error || 'Failed to create Firebase product');
}

showMessage(firebaseResult, `Created Firebase product ${result.id}`, 'green');
productName.value = '';
productPrice.value = '';

await loadFirebaseProducts();

} catch (error) {
showMessage(firebaseResult, error.message, 'red');
} finally {
createFirebaseBtn.disabled = false;
}
});

runEtlBtn.addEventListener('click', async () => {
  runEtlBtn.disabled = true;
  showMessage(etlResult, 'Running ETL...', '#333');

  try {
    const response = await fetch(`${API_BASE}/product/etl`, { method: 'POST' });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'ETL failed');
    }

    showMessage(etlResult, `ETL completed: inserted ${result.inserted}, skipped ${result.skipped}, total ${result.total}`, 'green');
  } catch (error) {
    showMessage(etlResult, error.message, 'red');
  } finally {
    runEtlBtn.disabled = false;
  }
});

refreshFirebaseBtn.addEventListener('click', loadFirebaseProducts);

loadFirebaseProducts();
