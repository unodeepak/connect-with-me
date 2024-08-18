const constant = require("../../constant/constant");
const sCode = require("../../constant/statusCode");
const Model = require("../../models");

exports.createProject = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    await Model.Project.create(req.body);
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
    const data = await Model.Project.findById(projectId);
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
    const { page, limit, userId } = req.query;
    const skip = (page - 1) * limit;
    const data = await Model.Project.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    let length = await Model.Project.countDocuments({ userId });

    return res.status(sCode.OK).json({ data: { data, length }, success: true });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateProjectByUser = async (req, res) => {
  try {
    const body = req.body;
    const data = await Model.Project.findByIdAndUpdate(
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
    const data = await Model.Project.findByIdAndUpdate(
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
