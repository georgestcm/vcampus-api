const mongoose = require('mongoose')
const schema = mongoose.Schema;

//schema for message.

const messageSchema = new schema({
    created: {
        type: String,
        default: (new Date()).toString()
    },
    text: {
        type: String,
        default: null
    },
    read_flag: {
        type: Boolean,
        default: false
    },
    receiver: {
        nickname: {
            type: String,
            default: null
        },
        id: {
            type: String,
            default: null
        },
        role_type: {
            type: String,
            default: null
        }
    },
    sender: {
        nickname: {
            type: String,
            default: null
        },
        id: {
            type: String,
            default: null
        },
        role_type: {
            type: String,
            default: null
        }
    }
})

module.exports = mongoose.model('message', messageSchema, 'messages')
