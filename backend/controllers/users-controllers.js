const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const User = require('../models/user')


const getUsers = async (req, res, next) => {
    
    let users
    try {
        users = await User.find({},'-password')
    } catch (err) {
        const error = new HttpError('Fetching users failed', 500)
        return next(error)    
    } 
    
    res.json({users: users.map(user => user.toObject({getters: true}))})
}

const signup  = async (req, res, next) => {
   const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return next( new HttpError('Invalid inputs',422))
  }
  
    const {name, email, password} = req.body

    let existingUser
    try {
        existingUser = await User.findOne({email: email})
    } catch (err) {
        const error = new HttpError('Sing up fail. Try again', 500)
        return next(error)
    }

    if(existingUser) {
        const error = new HttpError ('User already exists', 422)
        return next(error)
    }

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError(
            'Could not create the user. Please try again', 500
        )
        return next(error)
    }
    

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    })

    try {
        await createdUser.save()
       } catch (err) {
         const error = new HttpError('Signing up failed. Try again', 500)
         return next(error)
       }

       let token 
       try {
        token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            process.env.JWT_KEY, 
            {expiresIn: '1h'}
            )
       } catch (err){
        const error = new HttpError('Signing up failed. Try again', 500)
        return next(error) 
       }
    

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token})
}

const login = async (req, res, next) => {
    const {email, password} = req.body

    let existingUser

    try {
        existingUser = await User.findOne({email: email})
    } catch (err) {
        const error = new HttpError('Logging fail. Try again', 500)
        return next(error)
    }

    if(!existingUser) {
        const error = new HttpError('Invalid credentials', 403)
        return next(error)
    }

    let isValidPassword = false
    
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError(
            'Could not log you in. Please check credentials and try again', 500
        )
        return next(error)
    }

    if(!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log you in'
        ,403
        )
        return next(error)
    }

    let token 
    
       try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            process.env.JWT_KEY, 
            {expiresIn: '1h'}
            )
       } catch (err){
        const error = new HttpError('Logging in failed. Try again', 500)
        return next(error) 
       }
    



    res.json({userId: existingUser.id, email: existingUser.email, token: token})

}


exports.getUsers = getUsers
exports.login = login
exports.signup = signup