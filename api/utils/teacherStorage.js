const mongoose = require('mongoose')
const Teacher = require('../models/teacher')
const { removeStudent } = require('./studentStorage')

module.exports = {
    getTeachers(req, res, next) {
        Teacher.find()
            .then(result => {
                if (result.length >= 0) {
                    res.status(200).json(result)
                } else {
                    res.status(404).json({ message: 'No enteries found'})
                }
            })
            .catch(error => res.status(500).json(error))
    },

    createTeacher(req, res, next) {
        const { name, students } = req.body
        const teacher = new Teacher({
            _id: new mongoose.Types.ObjectId(),
            name,
            students
        })
        teacher
            .save()
            .then(result => res.status(200).json(result))
            .catch(error => res.status(500).json(error))
    },

    async addStudent(req, res, next) {
        const { teacherId, studentId } = req.body;

        await Teacher.find(
            {_id: teacherId}, 
            async (err, teacher) => {

                if (err) res.status(500).json(err);
                console.log(teacherId, teacher)
                if (teacher.length) {
                    const current = teacher[0];
                    
                    if (!current.students.includes(studentId)) {
                        current.students.push(studentId)
                        current.students = current.students.filter((v, i, a) => a.indexOf(v) === i);
                        console.log(current);
                        await current.save();
                    }
                }

                next();
        })
    },

    async removeStudent(req, res, next) {
        const { teacherId, studentId } = req.params;

        await Teacher.findOneAndUpdate(
            {_id: teacherId},
            {'$pull': {students : studentId}}, 
            async (err, teacher) => {
                if (err) res.status(500).json(err);          
                next()
        })
    },

    async removeDeletedStudent(req, res, next) {
        const { studentId } = req.params;

        await Teacher.updateMany(
            {},
            {'$pull': {students : studentId}},
            (err, teachers) => {
            console.log(err, teachers);

            if (err) res.status(500).json(err);

            next()
          })
    },

   async editTeacher(req, res, next) {
        const { teacherId } = req.params
        const { name } = req.body

        await Teacher
            .findOneAndUpdate(
                { _id: teacherId }, 
                { '$set': { name } }, 
                { 'new': true}
            )
            .exec()
            .then(result => res.status(200).json(result))
            .catch(error => res.status(500).json(error))
    },

    async removeTeacher(req, res, next) {
        const { teacherId } = req.params

        await Teacher.deleteOne({ _id: teacherId },
            (err, result) => {
            console.log(err, result);
            if (err) res.status(500).json(err);
      
            res.status(200).json(result)
          })
       
    }

}