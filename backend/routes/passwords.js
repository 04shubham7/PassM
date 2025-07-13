const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const auth = require('../utils/authMiddleware');
const twofa = require('../utils/twofaMiddleware');

router.post('/', auth, passwordController.createPassword);
router.get('/', auth, passwordController.getPasswords);
router.get('/:id', auth, twofa, passwordController.getPassword);
router.put('/:id', auth, twofa, passwordController.updatePassword);
router.delete('/:id', auth, twofa, passwordController.deletePassword);

module.exports = router; 