const { Transaction } = require("../database/models");
const { endpointResponse } = require("../helpers/success");
const createHttpError = require("http-errors");
const { ErrorObject } = require('../helpers/error');

//Validation middleware is needed.

const getTransactions = async (req, res, next) => {
  let queryConfig = {deletedAt: null}
  req.user.roleId == 1 ? undefined : queryConfig.userId = req.user.id
  try {
      const response = await Transaction.findAll({where: queryConfig})
      endpointResponse({
          res,
          message: 'Operacion Exitosa',
          body: response
      })
  } catch (error) {
      const httpError = createHttpError(error.statusCode, `Error retrieving transactions - ${error.message}`)
      next(httpError)
  }
}

const getTransaction = async (req, res, next) => {
  try {
      const response = await Transaction.findByPk(req.params.id)
      if(response){
          endpointResponse({
              res,
              message: 'Operacion exitosa',
              body: response
          })
      }
      else{
          throw new ErrorObject('Transaction not found', 404);
      }

  } catch (error) {
      const httpError = createHttpError(error.statusCode, `Error retrieving transaction by id - ${error.message}`)
      next(httpError)
  }
}

const createTransaction = async (req, res, next) => {
  try {
    let transaction = {
      amount: req.body.amount,
      description: req.body.description,
      date: req.body.date,
      categoryId: req.body.categoryId,
    }
    if (req.user.roleId == 1)  {
      if (req.body.id) {
        transaction.userId = req.body.id;
      } else {
        transaction.userId = req.user.id
      }
    } else {
      transaction.userId = req.user.id
    }

    const response = await Transaction.create(
      transaction,
    );
    if (response) {
      endpointResponse({
        res,
        message: "Operacion exitosa",
        body: response,
      });
    } else {
      throw new ErrorObject('Transaction not found', 404);
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error creating transaction - ${error.message}`
    );
    next(httpError);
  }
};
// Operation update  controller
const updateTransaction = async (req, res, next) => {
  
  try {
    let transaction = {
      amount: req.body.amount,
      date: req.body.date,
      categoryId: req.body.categoryId,
    }
    if (req.user.roleId == 1)  {
      if (req.body.id) {
        transaction.userId = req.body.id;
      } else {
        transaction.userId = req.user.id
      }
    } else {
      transaction.userId = req.user.id
    }
    
    const response = await Transaction.update(
      transaction,
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (response) {
      endpointResponse({
        res,
        message: "Operacion exitosa",
        body: response,
      });
    } else {
      throw new ErrorObject('Transaction not found', 404);
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error updating transaction - ${error.message}`
    );
    next(httpError);
  }
};

// Operation delete controller
const deleteTransaction = async (req, res, next) => {
  try {
    const response = await Transaction.destroy(
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (response) {
      endpointResponse({
        res,
        message: "Operacion eliminada",
        body: response,
      });
    } else {
      throw new ErrorObject('Transaction not found', 404);
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error deleting transaction - ${error.message}`
    );
    next(httpError);
  }
};

module.exports = { getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction };
