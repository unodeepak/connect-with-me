const db = {};
db.User = require("../models/user.model");
db.Otp = require("../models/otp.model");
db.Project = require("../models/project.model");
db.Transaction = require("../models/transaction.model");
db.Proposal = require("../models/proposal.model");
db.Wallet = require("../models/wallet.model");

module.exports = db;
