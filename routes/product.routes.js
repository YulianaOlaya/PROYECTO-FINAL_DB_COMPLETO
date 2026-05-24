const express = require('express');
const router = express.Router();
const product = require('../dao/product.dao');

router.get('/', product.getAll);
router.get('/firebase', product.getFirebaseAll);
router.get('/:id', product.getById);
router.post('/firebase', product.createFirebase);
router.post('/etl', product.syncFromFirebase);
router.post('/', product.create);
router.put('/:id', product.update);
router.delete('/:id', product.remove);

module.exports = router;
