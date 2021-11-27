const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        uniq: true
      }]
})

teacherSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

teacherSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Teacher', teacherSchema)