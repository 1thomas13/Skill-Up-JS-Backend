const express = require('express')
const { getTransactions, getTransaction} = require('../controllers/transactions')

const router = express.Router()

router.get('/', getTransactions)
router.get('/:id', getTransaction)

module.exports = router