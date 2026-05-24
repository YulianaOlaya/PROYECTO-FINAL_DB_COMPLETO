const express = require('express');
const router = express.Router();
const details_order = require('../dao/details_order.dao');

router.get('/', details_order.getAll);
router.get('/:id', details_order.getById);
router.post('/', details_order.create);
router.put('/:id', details_order.update);
router.delete('/:id', details_order.remove);

module.exports = router;
