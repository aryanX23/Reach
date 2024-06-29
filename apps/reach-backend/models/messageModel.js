const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    data: {
        type: Array
    }
});

module.exports = { Message: mongoose.model('Messages', messageSchema) };