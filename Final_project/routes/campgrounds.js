const express = require('express');
const router = express.Router({ mergerParms: true });
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const Campground = require('../models/campground');

//campgrounds page
router.get('/', catchAsync(async (req, res) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
}));

//new campground page
router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new');
});
//create new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {

    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}));
//show campground
router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}));
//edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);

    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { camp });
}));
//update campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {

    const { id } = req.params;

    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}));
//delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {

    const camp = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;