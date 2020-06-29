const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const sectionModel = require("../../../models/school/course/section.model");

exports.saveSection = async (req, res) => {
    const sectionQuery = {};
    sectionQuery.sectionName = req.body.sectionName;
    sectionQuery.school="5ecb96bb6bea73042c34e061";
     try {
      const result = await sectionModel.create(sectionQuery);
      res.send({ success: true, message: "Section saved successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send({ success: false, message: "Section could not saved, "+error });
    }
  };
