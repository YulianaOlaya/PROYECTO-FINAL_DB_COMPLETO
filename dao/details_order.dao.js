const db = require('../services/mysql.service');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM details_order');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM details_order WHERE id_details = ?',
      [req.params.id]
    );

    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const create = async (req, res) => {
  try {
    const { quantity, id_order, id_product } = req.body;

    if (!quantity || !id_order || !id_product) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    const [result] = await db.query(
      'INSERT INTO details_order (quantity, id_order, id_product) VALUES (?, ?, ?)',
      [quantity, id_order, id_product]
    );

    res.status(201).json({
      id: result.insertId, quantity, id_order, id_product});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const update = async (req, res) => {
  try {
    const { quantity, id_order, id_product } = req.body;

    await db.query(
      'UPDATE details_order SET quantity=?, id_order=?, id_product=? WHERE id_details=?',
      [quantity, id_order, id_product, req.params.id]
    );

    res.json({ mensaje: "Actualizado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM details_order WHERE id_details=?',
      [req.params.id]
    );

    res.json({ mensaje: "Eliminado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
