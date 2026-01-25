const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['StatusUpdate', 'NewComment', 'AdminAlert', 'System'],
        required: true
    },
    concern: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concern'
    },
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy'
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
