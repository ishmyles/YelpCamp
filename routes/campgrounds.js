const express = require('express');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds');
const AsyncWrap = require('../utilities/AsyncWrap');
const { loginRequired, isCampAuthor, validateCampground, addImageLinks } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../config/index'); 
const upload = multer({ storage });

router.get('/', AsyncWrap(campgrounds.index));

router.route('/new')
    .all(loginRequired)
    .get(campgrounds.renderNewCampForm)
    .post(upload.array('campground[image]'), validateCampground, addImageLinks, AsyncWrap(campgrounds.createNewCampground));

// Ensure that anything that uses a similar path to this, needs to be above this route (as this catches all).
// As Express will scan the route from top to bottom, if routes that are similar to this end up below it & we access a route similar to this -
// Express will take the that param as an 'ID' that will be used to query the mongoDB for data & will result in an error.
router.route('/:id')
    .get(AsyncWrap(campgrounds.getCampground))
    .delete(loginRequired, isCampAuthor, AsyncWrap(campgrounds.deleteCampground));

router.route('/:id/edit')
    .all(loginRequired, isCampAuthor)
    .get(AsyncWrap(campgrounds.getUpdateCampForm))
    .put(upload.array('campground[image]'), validateCampground, AsyncWrap(campgrounds.updateCampground));

module.exports = router;