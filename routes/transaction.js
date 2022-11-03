const express = require('express');
const {
    createTransaction,
    updateTransaction,
    deleteTransaction,
 } = require('../controllers/transactions')


const router = express.Router();

router.post("/", createTransaction);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);


module.exports = router;