const express = require("express");
const router = express.Router();
const userDao = require("../dao/user.dao")

router.post('/', userDao.create);
router.post('/login', userDao.login);

module.exports = router;
