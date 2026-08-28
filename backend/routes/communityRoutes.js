const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

router.get('/posts', communityController.getPosts);
router.post('/posts', optionalAuth, communityController.createPost);
router.get('/posts/:postId/comments', communityController.getPostComments);
router.post('/posts/:postId/comments', optionalAuth, communityController.addComment);
router.post('/posts/:postId/upvote', optionalAuth, communityController.toggleUpvote);

module.exports = router;
