const mongoose = require('mongoose')
const {Schema} = mongoose

const personalLabelSchema = new Schema({
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
}, { _id: false });

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

    profileSetup: {
        type: Boolean,
        default: false
    },
    //profile details
    // --- Profiel Velden (toegevoegd aan User) ---
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    lookingFor: {
        type: String,
        enum: ['Friends', 'Workout Partner', 'Relationship', 'Networking'],
        default: 'Friends'
    },
    sportLabels: {
        type: [String],
        validate: [
            { validator: v => v.length <= 2, message: 'Maximaal 2 sportlabels.' },
            { validator: v => new Set(v.map(s => s.toLowerCase())).size === v.length, message: 'Sportlabels moeten uniek zijn.' }
        ],
        default: []
    },
    personalLabels: {
        type: [personalLabelSchema],
        validate: [
            { validator: v => v.length <= 4, message: 'Maximaal 4 persoonlijke labels.' },
            { validator: v => new Set(v.map(item => item.label)).size === v.length, message: 'Persoonlijke label categorieën moeten uniek zijn.' }
        ],
        default: []
    },
    photos: { // Voor later
       type: [String], // Array van foto URLs
       validate: [v => v.length <= 6, 'Maximaal 6 foto\'s toegestaan'],
       default: []
    },


    //matching preferrences
    showMePreference: String,
    maxDistance: Number,
    minAge: Number,
    maxAge: Number,

    // === VELDEN VOOR SWIPE/MATCH DATA ===
    likedUserIds: [{
        type: Schema.Types.ObjectId, // Slaat MongoDB Object ID's op
        ref: 'User',                 // Verwijst naar andere documenten in de 'User' collectie
        default: []                  // Begin altijd met een lege lijst
    }],
    dislikedUserIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    // Optioneel: Als je matches ook direct wilt opslaan
    matchedUserIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    // ===============================
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel