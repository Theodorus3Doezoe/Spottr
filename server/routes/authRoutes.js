const express = require('express')
const router = express.Router()
const cors = require('cors')
const {registerUser, loginUser, getProfile, logoutUser, updateProfile, getPotentialMatches, matchAction} = require('../controllers/authController')



// Middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

// Post requests
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/matches/action', matchAction)

// Get requests
router.get('/profile', getProfile)
router.get('/matches/potential', getPotentialMatches)

// Put requests
router.put('/updateProfile', updateProfile)

module.exports = router