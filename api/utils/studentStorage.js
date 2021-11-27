const mongoose = require('mongoose')

const Student = require('../models/student')

module.exports = {
    getAllStudents(req, res, next) {
        Student.find({})
        .exec()
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json({error}))
    },

    createStudent(req, res, next) {
        const { name, teachers } = req.body
        const student = new Student({
            _id: new mongoose.Types.ObjectId(),
            name,
            teachers
        })

        student
            .save()
            .then(result => res.status(200).json(result))
            .catch(error => res.status(500).json({ error })
            )

    },

    async addTeacher(req, res, next) {
        const { teacherId, studentId } = req.body;

        await Student.find(
            {_id: studentId}, 
            async (err, student) => {
                console.log(student, err);

                if (err) res.status(500).json(err);

                if (student.length) {
                    const current = student[0];
                    
                    if (!current.teachers.includes(teacherId)) {
                        current.teachers.push(teacherId)
                        current.teachers = current.teachers.filter((v, i, a) => a.indexOf(v) === i);
                        console.log(current);
                        await student[0].save();
                    }
                }

                next();
        })
    },

    async removeTeacher(req, res, next) {
        const { teacherId, studentId } = req.params;

        await Student.findOneAndUpdate(
            {_id: studentId},
            {'$pull': {teachers : teacherId}},
            (err, student) => {
                if (err) res.status(500).json(err);
                next()
          })
    },

    async removeDeletedTeacher(req, res, next) {
        const { teacherId } = req.params;

        await Student.updateMany({}, 
            {'$pull': {teachers : teacherId}},
            (err, students) => {
                console.log(err, students);

                if (err) res.status(500).json(err);
                next()
          })
    },

    async editStudent(req, res, next) {
        const { studentId } = req.params
        const { name } = req.body

        await Student
            .findOneAndUpdate(
                { _id: studentId }, 
                { '$set': { name } }, 
                { 'new': true}
            )
            .select('name students _id')
            .exec()
            .then(result => res.status(200).json(result))
            .catch(error => res.status(500).json(error))
    },

    removeStudent(req, res, next) {
        const { studentId } = req.params;

        Student
            .deleteOne({ _id: studentId })
            .exec()
            .then(result => res.status(200).json(result))
            .catch(error => res.status(500).json({error}))
    }
}