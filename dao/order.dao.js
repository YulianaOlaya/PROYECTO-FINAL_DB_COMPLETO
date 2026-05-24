const db = require('../services/mysql.service');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM order');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM `order` WHERE id_order = ?',
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
    const { date, id_user } = req.body;

    if (!date || !id_user) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const [result] = await db.query(
      'INSERT INTO `order` (date, id_user) VALUES (?, ?)',
      [date, id_user]
    );

    res.status(201).json({
      id: result.insertId, date, id_user});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




const update = async (req, res) => {
  try {
    const { date, id_user } = req.body;
    await db.query(
      'UPDATE `order` SET date=?, id_user=? WHERE id_order=?',
      [date, id_user, req.params.id]
    );

    res.json({ mensaje: "Actualizado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM `order` WHERE id_order=?',
      [req.params.id]
    );

    res.json({ mensaje: "Eliminado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
