const constant = require("../../constant/constant");
const sCode = require("../../constant/statusCode");
const Model = require("../../models");

exports.addMoneyToUserWallet = async (req, res) => {
  try {
    const body = req.body;
    body.transactionType = "credited";
    body.creditedBy = req.user._id;
    body.status = "success";
    console.log({ body });

    await Model.Transaction.create(req.body);
    let user = await Model.Wallet.findOne({ userId: body.userId });
    if (!user) {
      user = await Model.Wallet.create({ userId: body.userId, amount: 0 });
    }
    user.amount = body.amount;
    await Model.Wallet.findByIdAndUpdate(user._id, {
      $inc: { amount: body.amount },
    });

    return res
      .status(sCode.OK)
      .json({ msg: constant.transaction.ADDED, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getBalanceByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    let data = await Model.Wallet.findOne({ userId });

    return res
      .status(sCode.OK)
      .json({ data, msg: constant.FOUND, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const query = { userId: req.user._id?.toString() };
    console.log({ query: req.query });
    const { page, limit, status } = req.query;
    const skip = (page - 1) * limit;

    if (status != "all") {
      query.status = status;
    }

    let data = await Model.Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const length = await Model.Transaction.countDocuments(query);

    return res
      .status(sCode.OK)
      .json({ data: data || [], msg: constant.FOUND, length, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getTransactionTopBarData = async (req, res) => {
  try {
    const query = {
      userId: req.user._id,
      transactionType: "credited",
    };
    console.log({ query });
    let data = await Model.Transaction.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$status",
          amount: { $sum: "$amount" },
        },
      },
    ]);

    let transaction = {
      success: 0,
      pending: 0,
      failed: 0,
    };
    for (let item of data) {
      if (item?._id == "success") {
        transaction.success = item?.amount;
      } else if (item?._id == "pending") {
        transaction.pending = item?.amount;
      } else if (item?._id == "failed") {
        transaction.failed = item?.amount;
      }
    }

    return res.status(sCode.OK).json({
      data: transaction,
      msg: constant.FOUND,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
