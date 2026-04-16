const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");

const transactionController = {
  // add transaction
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!amount || !type || !date) {
      res.status(400);
      throw new Error("Type, amount and date are required");
    }
    // create transaction
    const transaction = await Transaction.create({
      user: req.user,
      type,
      category,
      amount,
      description,
    });
    res.status(201).json(transaction);
  }),

  // list transactions with filters
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };

    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "All") {
        // no category filter needed
      } else if (category === "Uncategorized") {
        // filter transactions categorized as uncategorized
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }
    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.json(transactions);
  }),

  // update transaction
  update: asyncHandler(async (req, res) => {
    // find transaction by id
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.amount = req.body.amount || transaction.amount;
      transaction.date = req.body.date || transaction.date;
      transaction.description =
        req.body.description || transaction.description;
      // save updates
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    } else {
      res.status(404);
      throw new Error("Transaction not found or user not authorized");
    }
  }),

  // delete transaction
  delete: asyncHandler(async (req, res) => {
    // find transaction by id
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Transaction removed" });
    } else {
      res.status(404);
      throw new Error("Transaction not found or user not authorized");
    }
  }),
};

module.exports = transactionController;
