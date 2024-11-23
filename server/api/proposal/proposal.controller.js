const constant = require("../../constant/constant");
const sCode = require("../../constant/statusCode");
const Model = require("../../models");

exports.createProject = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    await Model.Proposal.create(req.body);
    return res
      .status(sCode.CREATED)
      .json({ msg: constant.project.ADDED, success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getProjectByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const data = await Model.Proposal.findById(projectId);
    if (!data) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: "Not Found", success: false });
    }
    return res.status(sCode.OK).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getProjectByUserId = async (req, res) => {
  try {
    const { page, limit, userId, status } = req.query;
    const skip = (page - 1) * limit;
    const query = { userId };
    if (status != "all") {
      query.status = status;
    }
    const data = await Model.Proposal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    let length = await Model.Proposal.countDocuments(query);

    return res.status(sCode.OK).json({ data: { data, length }, success: true });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getProposalTopBarData = async (req, res) => {
  try {
    const query = {
      userId: req.user._id,
    };
    const data = await Model.Proposal.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "" },
        },
      },
    ]);

    let proposal = {
      success: 0,
      pending: 0,
      failed: 0,
      completed: 0,
      running: 0,
      cancelled: 0,
      approved: 0,
      total: 0,
      amount: 0,
    };
    for (let item of data) {
      if (item?._id == "running") {
        proposal.running = item?.count;
      } else if (item?._id == "pending") {
        proposal.pending = item?.count;
      } else if (item?._id == "failed") {
        proposal.failed = item?.count;
      } else if (item?._id == "completed") {
        proposal.amount = item?.amount || 0;
        proposal.completed = item?.count;
      } else if (item?._id == "approved") {
        proposal.approved = item?.count;
      } else if (item?._id == "cancelled") {
        proposal.cancelled = item?.count;
      }
      proposal.total += item?.count;
    }

    return res.status(sCode.OK).json({ data: proposal, success: true });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateProjectByUser = async (req, res) => {
  try {
    const body = req.body;
    const data = await Model.Proposal.findByIdAndUpdate(
      body.projectId,
      { $set: body },
      {
        new: true,
      }
    );
    if (!data) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.NOT_FOUND, success: false });
    }

    return res
      .status(sCode.OK)
      .json({ message: constant.UPDATED_RECORD, data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProjectByAdmin = async (req, res) => {
  try {
    const body = req.body;
    const data = await Model.Proposal.findByIdAndUpdate(
      body.projectId,
      { $set: body },
      {
        new: true,
      }
    );
    if (!data) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.NOT_FOUND, success: false });
    }
    return res
      .status(sCode.OK)
      .json({ message: constant.UPDATED_RECORD, data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProjectTopBarData = async (req, res) => {
  try {
    const body = req.body;
    const data = await Model.Proposal.findByIdAndUpdate(
      body.projectId,
      { $set: body },
      {
        new: true,
      }
    );
    if (!data) {
      return res
        .status(sCode.NOT_FOUND)
        .json({ msg: constant.NOT_FOUND, success: false });
    }
    return res
      .status(sCode.OK)
      .json({ message: constant.UPDATED_RECORD, data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
