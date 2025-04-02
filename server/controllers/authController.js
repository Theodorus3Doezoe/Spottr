const User = require('../models/user')
const { hashPassword, comparePassword } = require ('../helpers/auth')
const jwt = require('jsonwebtoken')

// Register endpoint
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body

        // Check if name was entered
        if(!name) {
            return res.json({
                error: 'name is required'
            })
        }

        // Check if password is strong enough
        if(!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be atleast 6 characters long'
            })
        }

        // Check email
        const exist = await User.findOne({email})
        if(exist) {
            return res.json ({
                error: 'Email is already taken'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        // Check if user exists
        const user = await User.findOne({email})

        if(!user) {
            return res.json({
                error: 'No user found'
            })
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password)

        if(match) {
            jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET, {}, (err, token) => {
                if(err) throw err
                res.cookie('token', token).json({user: user, token: token})
            })
        }
        if(!match) {
            res.json({
                error: 'Passwords do not match'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const getProfile = (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) throw err
            res.json(user)
        })
    } else {
        res.json(null)
    }
}

const logoutUser = (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({error: 'Failed to logout'})
            } else {
                res.clearCookie('token', {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                })
                res.status(200).json("Logout successfull")
            }
        })
    } else {
        res.status(400).json({error: 'No session found'})
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
}