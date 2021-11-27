const express = require('express')
const router = express.Router()
const {
    createStudent,
    editStudent,
    removeStudent, 
    getAllStudents,
} = require('../utils/studentStorage')
const { removeAllStudentById } = require('../utils/routeStorage');
const { removeDeletedStudent } = require('../utils/teacherStorage');

router
    .get('/', getAllStudents)
    .post('/', createStudent)
    .patch('/:studentId', editStudent)
    .delete('/:studentId', removeAllStudentById, removeDeletedStudent, removeStudent)

module.exports = router