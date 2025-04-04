const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema ({
    //account details
    name: String,
    surname: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    birthdate: String,

    //profile details

    //matching preferrences
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel