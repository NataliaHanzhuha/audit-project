const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    teachers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        uniq: true
    }],
})

studentSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

studentSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Student', studentSchema)