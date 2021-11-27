const mongoose = require('mongoose')
const Teacher = require('../models/teacher')
const Student = require('../models/student')
const Route = require("../models/route")

module.exports = {
  async getRoutesByIds(req, res, next) {
    await Route.find(req.body)
      .exec()
      .then((items) => res.json(items))
      .catch((error) => res.status(500).json({ error }));
  },

  async getRoutes(req, res, next) {
    await Route.find()
    .populate({path: 'studentId', model: 'Student', select: 'name id'})
    .populate({path: 'teacherId', model: 'Teacher', select: 'name id'})
    .exec()
    .then((items) => res.json(items))
    .catch((error) => res.status(500).json({ error }));
  },

  async createRoute(req, res, next) {
    const route = new Route({
      ...req.body,
      _id: new mongoose.Types.ObjectId()
    });

    await route.save(async function (err, result) {
      if (err) res.status(500).json(err);

      if (res) res.status(200).json(result);
    });
  },

  async editRoute(req, res, next) {
    const { teacherId, studentId } = req.body;

    await Route.findOneAndUpdate(
      { teacherId, studentId },
      req.body,
      {'new': true},
      function (err, result) {
        if (res) res.status(200).json(result);
  
        if (err) res.status(500).json(err);
      });
  },

  async removeRoute(req, res, next) {
    await Route.deleteMany(req.params, async function (err, result) {
      if (err) res.status(500).json(err);

      if (res) res.status(200).json(result);
    })
  },

  async removeAllStudentById(req, res, next) {
    const { studentId } = req.params;

    await Route.deleteMany({studentId}, (err, result) => {
      console.log(err, result)
      if (err) res.status(500).json(err);

      if (result) {
        next();
      }
    })
  },

  async removeAllTeacherById(req, res, next) {
    const { teacherId } = req.params;

    await Route.deleteMany({teacherId : teacherId}, (err, result) => {
      console.log(err, result);
      if (err) res.status(500).json(err);

      next();
    })
  },

  // PAYMENT

  async setPay(req, res, next) {
    await Route.findOneAndUpdate(
      {_id: req.params.id},
      {'$inc': 
        {
          payed: (req.body.payed / 2)
        }
      },
      // {'$addTo': 
      //   { payHistory: 
      //     {
      //       _id: new mongoose.Types.ObjectId(),
      //       pay: req.body.payed,
      //       timestamp: new Date(),
      //       userId: req.body.username
      //     }
      //   }
      // },
      {'new': true},
      (err, result) => {
      if (err) res.status(500).json(err);

      res.status(200).json(result);
    })
  }
};
