const express = require('express')
const { get, createUser, updateUser, deleteUser, updateUserPassword, testImg, loginUser, getUser } = require('../controllers/users')

const { upload } = require('../services/uploadImgServices')
const { schemaValidator } = require('../middlewares/validator')
const { image } = require('../schemas/image')
const { user } = require('../schemas/users')
const { login } = require('../schemas/login')
const getToken = require('../helpers/getToken')
const { userAuthenticated } = require('../middlewares/userAuthenticated')
const ownership = require('../middlewares/ownership')

const router = express.Router()

router.get('/', getToken, userAuthenticated, get)

router.post('/', createUser)

router.get('/user', getToken, userAuthenticated, getUser)


router.delete('/user', getToken, userAuthenticated, deleteUser)



router.put('/user/changepassword', getToken, userAuthenticated, updateUserPassword)


router.post('/login', schemaValidator(login), loginUser)


module.exports = router
