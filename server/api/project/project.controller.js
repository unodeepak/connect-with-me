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
    const userId = req.params.userId;
    const data = await Model.Project.find({ userId });
    return res.status(sCode.OK).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const body = req.body;
    const data = await Model.Project.findByIdAndUpdate(
      projectId,
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
    res.status(sCode.OK).json({ message: constant.UPDATED_RECORD, data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
