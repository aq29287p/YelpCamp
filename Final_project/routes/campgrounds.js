const express = require('express');
const router = express.Router({ mergerParms: true });
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
}));


router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});
router.post('/', validateCampground, catchAsync(async (req, res) => {

    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));
router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { camp });
}));
router.get('/:id/edit', catchAsync(async (req, res) => {

    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {

    const camp = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

module.exports = router;