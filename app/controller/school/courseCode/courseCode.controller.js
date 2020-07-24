
const courseCodeModel = require("../../../models/school/course/courseCode.model");
const cryptoRandomString = require('crypto-random-string');

exports.saveCourseCode = async (req,res) =>{
    const query = {};
    query.courseCode = cryptoRandomString({length: 7, type: 'base64'});
    query.courseCodeNote = req.body.courseCodeNote;
    query.courseCodeValidFrom = req.body.courseCodeValidFrom;
    query.courseCodeValidTo = req.body.courseCodeValidTo;
    query.school = req.body.schoolId;
    try 
    {
    const result = await courseCodeModel.create(query);
    res.status(200).json({ message: "CourseCode saved successfully!", _id :result._id });
    }
    catch(err){
        return res.status(405).json({error : err});
    }
}
exports.getAllCourseCode = async (req, res) =>{
    try {
        const result = await courseCodeModel.find({isDeleted : false});
        res.status(200).json(result);
    } catch (error) {
        return res.status(405).json({error : error});
    }   
}
exports.getCourseCodeById = async (req, res) =>{
    try {
        const result = await courseCodeModel.find({isDeleted : false, _id : req.params.id});
        res.status(200).json(result);
    } catch (error) {
        return res.status(405).json({error : error});
    }   
}
exports.updateCourseCode = async (req,res) =>{
    try {
        const query = {};
        query.courseCodeNote = req.body.courseCodeNote;
        query.courseCodeValidFrom = req.body.courseCodeValidFrom;
        query.courseCodeValidTo = req.body.courseCodeValidTo;
        await courseCodeModel.update({_id: req.params.id},query);
        res.status(200).json({ message: "CourseCode Updated successfully!" });
    } catch (error) {
        return res.status(405).json({error : error});
    }
}
exports.deleteCourseCode = async (req,res) =>{
    try {
        await courseCodeModel.update({_id : req.params.id},{isDeleted :true});
        res.status(200).json({ message: "CourseCode Deleted successfully!" });
    } catch (error) {
        return res.status(405).json({error : error});
    }
}