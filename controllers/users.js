const createHttpError = require('http-errors')
const { User } = require('../database/models')
const { endpointResponse } = require('../helpers/success')
const { catchAsync } = require('../helpers/catchAsync')
const {
  createUserService,
  userUpdateService,
  userDeleteService,
  updatePasswordService,
  loginUserService,
  getUserService,
} = require('../services/userServices')
const { encodeToken } = require('../helpers/tokenizer')
const { ErrorObject } = require('../helpers/error')

// example of a controller. First call the service, then build the controller method
const get = catchAsync(async (req, res, next) => {
  try {
    const response = await User.findAll()
    endpointResponse({
      res,
      message: 'Users retrieved successfully',
      body: response,
    })
  } catch (error) {
    const httpError = createHttpError(error.statusCode, `[Error retrieving users] - [index - GET]: ${error.message}`)
    next(httpError)
  }
})

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body
    const { user, created } = await createUserService(
      { email: email },
      { firstName: firstName, lastName: lastName, email: email, password: password, roleId: roleId },
    )

    if (!created) {
      throw new ErrorObject('E-mail exists', 403)
    } else {
      endpointResponse({
        res,
        message: 'The user has been created',
        body: user,
      })
    }
  } catch (err) {
    const httpError = createHttpError(err.statusCode, `[Error creating user] - [index - POST]: ${err.message}`)
    next(httpError)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, avatar, roleId } = req.body
    const userBody = {
      firstName,
      lastName,
      email,
      avatar,
      roleId,
    }


    const userUpdated = await userUpdateService({ id: req.user.id }, userBody)

    if (userUpdated === null) {
      throw new ErrorObject('The user does not exist', 404)
    } else {
      endpointResponse({
        res,
        message: 'The user has been updated',
        body: userUpdated,
      })
    }
  } catch (err) {
    const httpError = createHttpError(err.statusCode, `[Error updating user] - [index - PUT]: ${err.message}`)
    next(httpError)
  }
}

const updateUserPassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body


    if(password === newPassword){
      throw new ErrorObject('The password and new password are equals', 400);
    }

    const passwordUpdated = await updatePasswordService({id: req.user.id}, password, newPassword)


    if (passwordUpdated === null) {
      throw new ErrorObject('The user does not exist', 404)
    } else if (passwordUpdated) {
      endpointResponse({
        res,
        message: 'The password has been changed',
      })
    } else {
      throw new ErrorObject('Old password is incorrect', 400)
    }
  } catch (err) {
    const httpError = createHttpError(err.statusCode, `[Error updating password user] - [index - PUT]: ${err.message}`)
    next(httpError)
  }
}

const deleteUser = catchAsync(async(req, res, next)=>{
  try{
    const userDeleted = await userDeleteService({id: req.user.id})


    if (!userDeleted) {
      throw new ErrorObject('The user does not exist', 404)
    }

    endpointResponse({
      res,
      message: 'The user has been deleted',
      body: userDeleted,
    })
  } catch (err) {
    const httpError = createHttpError(err.statusCode, `[Error deleting user] - [index - DELETE]: ${err.message}`)
    next(httpError)
  }
})

/** test method for check upload img */
const testImg = async (req, res, next) => {
  res.json(req.file)
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const loginUser = await loginUserService(email, password)
    console.log(loginUser)
    if (!loginUser || loginUser.Error) {
      throw new ErrorObject('Invalid e-mail or password', 400)
    }

    const userData = {
      id: loginUser.id,
      firstName: loginUser.firstName,
      lastName: loginUser.lastName,
      email: loginUser.email,
      avatar: loginUser.avatar,
      roleId: loginUser.roleId,
      deletedAt: loginUser.deletedAt,
      createdAt: loginUser.createdAt,
      updatedAt: loginUser.updatedAt,
    }

    let encodedData = encodeToken(userData)
    endpointResponse({
      res,
      message: 'Successful authentication',
      body: { userData: userData, token: encodedData },
    })
  } catch (error) {
    const httpError = createHttpError((error.statusCode = 400), `[Error login user] - [index - LOGIN]: ${error.message}`)
    next(httpError)
  }
}
const getUser = async (req, res, next) => {
  try {
    const response = await getUserService({ id: req.user.id })
    if (response) {
      endpointResponse({
        res,
        message: 'Operacion exitosa',
        body: response,
      })
    } else {
      throw new ErrorObject('The user does not exist', 400)
    }
  } catch (error) {
    const httpError = createHttpError(error.statusCode, `Error retrieving user - ${error.message}`)
    next(httpError)
  }
}

module.exports = {
  get,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  testImg,
  loginUser,
  getUser,
}
