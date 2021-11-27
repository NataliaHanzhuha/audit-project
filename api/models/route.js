const mongoose = require('mongoose')

const route = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    },
    studentId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student" 
    },
    startDate: { type: String },
    payed: { type: Number },
    classNumber: { type: Number },
    type: { type: Number },

    payHistory: [{
        _id: mongoose.Schema.Types.ObjectId,
        pay: {type: Number},
        timestamp: {type: Date, default: new Date()},
        userId: {type: String}
    }]
})

route.virtual('id').get(function(){
    return this._id.toHexString();
});

route.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Route', route)