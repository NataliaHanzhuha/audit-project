const express = require('express')
const router = express.Router()
const { 
    getTeachers, 
    createTeacher, 
    editTeacher, 
    removeTeacher,
} = require('../utils/teacherStorage')
const { removeAllTeacherById } = require('../utils/routeStorage')
const { removeDeletedTeacher } = require('../utils/studentStorage');

router
    .get('/', getTeachers)
    .post('/', createTeacher)
    .patch('/:teacherId', editTeacher)
    .delete('/:teacherId', removeAllTeacherById, removeDeletedTeacher, removeTeacher)

module.exports = router