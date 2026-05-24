const db = require('../services/mysql.service');
const firebaseDB = require('../services/firebase.service');

const getAll = async (req, res) => {
try {
const [rows] = await db.query('SELECT * FROM product');
res.json(rows);
} catch (error) {
console.error('Error al obtener productos:', error);
res.status(500).json({ error: error.message });
}
};


const getById = async (req, res) => {
try {
const [rows] = await db.query(
'SELECT * FROM product WHERE id_product = ?',
[req.params.id]
);
res.json(rows[0]);
} catch (error) {
console.error('Error al obtener producto:', error);
res.status(500).json({ error: error.message });
}
};

const create = async (req, res) => {
try {
const { name, price } = req.body;

const [existing] = await db.query(
'SELECT id_product FROM product WHERE name = ? LIMIT 1',
[name]
);

if (existing.length > 0) {
return res.status(409).json({ error: 'Producto ya existe' });
}

const [result] = await db.query(
'INSERT INTO product (name, price) VALUES (?, ?)',
[name, price]
);

res.json({ id: result.insertId });
} catch (error) {
console.error('Error al crear producto:', error);
res.status(500).json({ error: error.message });
}
};

const update = async (req, res) => {
try {
const { name, price } = req.body;

await db.query(
'UPDATE product SET name=?, price=? WHERE id_product=?',
[name, price, req.params.id]
);

res.json({ mensaje: "Actualizado" });
} catch (error) {
console.error('Error al actualizar producto:', error);
res.status(500).json({ error: error.message });
}
};

const remove = async (req, res) => {
try {
await db.query(
'DELETE FROM product WHERE id_product=?',
[req.params.id]
);

res.json({ mensaje: "Eliminado" });
} catch (error) {
console.error('Error al eliminar producto:', error);
res.status(500).json({ error: error.message });
}
};








const getFirebaseAll = async (req, res) => {
console.log('GET /product/firebase requested');
try {
const snapshot = await firebaseDB.collection('product').get();
const products = [];


for (const doc of snapshot.docs) {
  const data = doc.data();
  const name = String(data.name || '').trim();
  const price = parseFloat(data.price);
  const priceNormalized = String(price).replace(/\D/g, '');

  if (!name || Number.isNaN(price)) {
    continue;
  }

  products.push({ id: doc.id, ...data });

  const [existing] = await db.query(
    "SELECT id_product FROM product WHERE name = ? AND REPLACE(REPLACE(price, '.', ''), ',', '') = ? LIMIT 1",
    [name, priceNormalized]
  );





if (existing.length === 0) {
  try {
    await db.query(
      'INSERT INTO product (name, price) VALUES (?, ?)',
      [name, price]
    );
    console.log('Auto-sync Firebase to MySQL:', name, price);
  } catch (insertError) {
    console.error('Error auto-syncing to MySQL:', insertError.message);
  }
}
}


console.log('Firebase products count=', products.length);
if (!Array.isArray(products)) {
console.warn('Firebase products was not an array:', products);
return res.json([]);
}
return res.json(products);
} catch (error) {
console.error('Error al obtener productos de Firebase:', error);
res.status(500).json({ error: error.message });
}
};





const createFirebase = async (req, res) => {
try {
  const { name, price } = req.body;

if (!name || price === undefined) {
return res.status(400).json({ error: 'Missing name or price' });
}


const docRef = await firebaseDB.collection('product').add({ name, price });
console.log('Product created in Firebase:', docRef.id);

const priceNormalized = String(parseFloat(price)).replace(/\D/g, '');
const [existing] = await db.query(
  "SELECT id_product FROM product WHERE name = ? AND REPLACE(REPLACE(price, '.', ''), ',', '') = ? LIMIT 1",
  [name, priceNormalized]
);

if (existing.length === 0) {
  await db.query(
    'INSERT INTO product (name, price) VALUES (?, ?)',
    [name, price]
  );
  console.log('Product also inserted into MySQL:', name, price);
} else {
  console.log('Product already exists in MySQL, skipped duplicate insert');
}

res.json({ message: 'Product created in Firebase and MySQL', id: docRef.id });
} catch (error) {
console.error('Error al crear producto en Firebase:', error);
res.status(500).json({ error: error.message });
}
};





const syncFromFirebase = async (req, res) => {
try {
const snapshot = await firebaseDB.collection('product').get();
let inserted = 0;
let skipped = 0;

for (const doc of snapshot.docs) {
  const data = doc.data();
  const name = String(data.name || '').trim();
  const price = parseFloat(data.price);
  const priceNormalized = String(price).replace(/\D/g, '');

  if (!name || Number.isNaN(price)) {
    continue;
  }

  const [existing] = await db.query(
    "SELECT id_product FROM product WHERE name = ? AND REPLACE(REPLACE(price, '.', ''), ',', '') = ? LIMIT 1",
    [name, priceNormalized]
  );

  if (existing.length > 0) {
    skipped++;
    continue;
  }

  await db.query('INSERT INTO product (name, price) VALUES (?, ?)', [name, price]);
  inserted++;
}

res.json({ message: 'ETL completed', total: snapshot.size, inserted, skipped });
} catch (error) {
console.error('Error during ETL from Firebase:', error);
res.status(500).json({ error: error.message });
}
};

module.exports = { getAll, getById, create, update, remove, getFirebaseAll, createFirebase, syncFromFirebase };
