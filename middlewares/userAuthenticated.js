const createHttpError = require("http-errors");
const { ErrorObject } = require("../helpers/error");

const userAuthenticated = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    if (userId && userId != null) {
      return next();
    } else {
      res
        .status(403)
        .send("You do not have authorization to perform this action");
      throw new ErrorObject("Unauthorized", 403);
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `[Error] : ${error.message}`
    );
    return next(httpError);
  }
};

module.exports = { userAuthenticated };
