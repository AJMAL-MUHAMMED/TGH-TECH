const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELED','DELETED'],
        default: "PENDING"
    },
    todo: {
        type: String,
        required: [true, "please ente a todo."]
    },
    date: {
        type: Date,
    },
    priority: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        default: 9
    }
}, {
    timestamp: true
})

module.exports = mongoose.model("Todo", todoSchema)