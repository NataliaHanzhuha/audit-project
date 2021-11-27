const express = require('express')
const router = express.Router()
const { 
    getRoutes, 
    createRoute, 
    getRoutesByIds, 
    editRoute, 
    removeRoute,
    setPay
} = require('../utils/routeStorage')
const {addStudent, removeStudent} = require('../utils/teacherStorage');
const {addTeacher, removeTeacher} = require('../utils/studentStorage')
router
    .get('/', getRoutes)
    .post('/filter', getRoutesByIds)
    .post('/', addStudent, addTeacher, createRoute)
    .patch('/', editRoute)
    .delete('/:teacherId/:studentId', removeStudent, removeTeacher, removeRoute)
    .patch('/:id', setPay)

module.exports = router