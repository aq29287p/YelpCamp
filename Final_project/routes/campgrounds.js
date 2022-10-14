const express = require('express');
const router = express.Router({ mergerParms: true });
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const Campground = require('../models/campground');


router.route('/')
    //campgrounds page
    .get(catchAsync(campgrounds.index))
    //create new campground
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

//new campground page
//this route must be before /:id because /new will be interpreted as an id
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    //show campground
    .get(catchAsync(campgrounds.showCampground))
    //update campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    //delete campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));




//edit campground
router.get('/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm));



module.exports = router;