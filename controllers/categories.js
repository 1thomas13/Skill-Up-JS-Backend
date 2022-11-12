const { Category } = require("../database/models");
const { endpointResponse } = require("../helpers/success");
const createHttpError = require("http-errors");
const { ErrorObject } = require('../helpers/error');

const createCategory = async function (req, res, next) {
  try {
    const response = await Category.create({
      name: req.body.name,
      description: req.body.description,
    });
    if (response) {
      endpointResponse({
        res,
        message: "Operacion exitosa",
        body: response,
      });
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error creating category - ${error.message}`
    );
    next(httpError);
  }
};

const getCategories = async function (req, res, next) {
  try {
    const response = await Category.findAll();
    if (response) {
      endpointResponse({
        res,
        message: "Operacion exitosa",
        body: response,
      });
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error retrieving all categories - ${error.message}`
    );
    next(httpError);
  }
};

const getCategoryById = async function (req, res, next) {
  try {
    const response = await Category.findByPk(req.params.id);
    if (response) {
      endpointResponse({
        res,
        message: "Operacion exitosa",
        body: response,
      });
    } else {
      throw new ErrorObject('Category not found', 404);
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error retrieving category by id - ${error.message}`
    );
    next(httpError);
  }
};

const modifyCategory = async function (req, res, next) {
  try {
    const response = await Category.update(
      {
        name: req.body.name,
        description: req.body.description,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (response) {
      endpointResponse({
        res,
        message: "Operacion exitosa",
        body: response,
      });
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error modifying category - ${error.message}`
    );
    next(httpError);
  }
};

const deleteCategory = async function (req, res, next) {
  try {
    const response = await Category.destroy({ where: { id: req.params.id } });
    if (response) {
      endpointResponse({
        res,
        message: "Operacion exitosa",
        body: response,
      });
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error retrieving deleting category - ${error.message}`
    );
    next(httpError);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  modifyCategory,
  deleteCategory,
};
