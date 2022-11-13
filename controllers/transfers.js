const { endpointResponse } = require("../helpers/success");
const { Transaction } = require("../database/models");
const createHttpError = require("http-errors");
const { ErrorObject } = require("../helpers/error");
const { getUserService } = require("../services/userServices");

const makeTransfer = async (req, res, next) => {
  try {
    const fromUserId = req.body.userid;
    // const fromUser = await getUserService({ id: fromUserId });
    const toUserId = req.body.selecteduserid;
    // const toUser = await getUserService({ id: toUserId });
    const amount = req.body.amount;
    if (fromUserId && toUserId ) {
      let outcomeTransaction = {
        userId: fromUserId,
        amount: amount,
        description: `Transfer to ${toUserId}`,
        date: new Date().toISOString().slice(0, 10),
        categoryId: 2,
      };

      let incomeTransaction = {
        userId: toUserId,
        amount: amount,
        description: `Received from ${fromUserId}`,
        date: new Date().toISOString().slice(0, 10),
        categoryId: 1,
      };

      const outcomeResponse = await Transaction.create(outcomeTransaction);
      const incomeResponse = await Transaction.create(incomeTransaction);
      if (outcomeResponse && incomeResponse) {
        endpointResponse({
          res,
          message: "Operacion exitosa",
          body: [outcomeResponse, incomeResponse],
        });
      } else {
        throw new ErrorObject("Fail transfer", 500);
      }
    }
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode,
      `Error can't transfer - ${error.message}`
    );
    next(httpError);
  }
};

module.exports = {makeTransfer}
