const express = require('express')
const router = express.Router()
const {signUp, signIn} = require('../utils/auth.js')

router
    .post('/register', signUp)
    .post('/login', signIn);

module.exports = router