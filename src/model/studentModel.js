const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    createdAt: { type: Number },
    createdDate: { type: String },
    expiredAt: { type: Number },
    expiredDate: { type: String },
}, { versionKey: false })

module.exports = mongoose.model('Students', studentSchema)