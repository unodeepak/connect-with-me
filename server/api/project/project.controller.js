const sCode = require("../../constant/statusCode");
const Model = require("../../models");

exports.createProject = async (req, res) => {
  try {
    const project = await Model.Project.create(req.body);
    return res
      .status(sCode.CREATED)
      .json({ message: "Project created successfully", project });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getProjectByProjectId = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProjectByUserId = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
