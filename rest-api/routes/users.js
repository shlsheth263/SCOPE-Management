const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    // Validate User
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error);

    //Check if existing user
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');


    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }

});


router.post('/login', async (req, res) => {

    // Validate Login
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error);

    // Check if email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email does not exist');

    //Password valid
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    const token = jwt.sign(
        {email : user.email , id :user._id},
        process.env.TOKEN_SECRET,
        {expiresIn:"1h"});

    res.status(200).json({
        token : token
    })
});


module.exports = router;