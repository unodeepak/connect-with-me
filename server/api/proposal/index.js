const express = require("express");
const route = express.Router();
const proposal = require("./proposal.controller");
const schema = require("./schemaRule");
const checkAuth = require("../../middleware/checkAuth");
const validateForm = require("../../middleware/validateSchema");

route.post(
  "/createProject",
  checkAuth(),
  validateForm(schema.createProject),
  proposal.createProject
);

route.get(
  "/getProjectByProjectId/:projectId",
  checkAuth(),
  validateForm(schema.getProjectByProjectId),
  proposal.getProjectByProjectId
);

route.get(
  "/getProjectByUserId",
  checkAuth(),
  validateForm(schema.getProjectByUserId),
  proposal.getProjectByUserId
);

route.get(
  "/getProposalTopBarData",
  checkAuth(),
  proposal.getProposalTopBarData
);

route.put(
  "/updateProjectByAdmin",
  checkAuth(),
  validateForm(schema.updateProjectByAdmin),
  proposal.updateProjectByAdmin
);

route.get(
  "/getProjectTopBarData",
  // checkAuth("admin"),
  // validateForm(schema.getProjectTopBarData),
  proposal.getProjectTopBarData
);

route.get(
  "/getProjectsForAdmin",
  // checkAuth("admin"),
  validateForm(schema.getProjectsForAdmin),
  proposal.getProjectsForAdmin
);

module.exports = route;
