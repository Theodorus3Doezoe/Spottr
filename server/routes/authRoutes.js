const express = require('express')
const router = express.Router()
const cors = require('cors')
const {registerUser, loginUser, getProfile, logoutUser,} = require('../controllers/authController')
const {protect, getUserData} = require('../controllers/dataController')

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

// Get requests
router.get('/profile', getProfile)
router.get('/settings', protect, getUserData)


module.exports = router