const router = require('express').Router();


// Get List of courses
router.get('/',(req,res)=>{
    res.send('Courses Route');
});

module.exports = router;