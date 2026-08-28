const { communityPosts, users } = require('../data/seedData');

exports.getPosts = (req, res) => {
  const { category, search, tag } = req.query;
  let results = [...communityPosts];

  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    results = results.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(s) ||
      p.content.toLowerCase().includes(s) ||
      p.authorName.toLowerCase().includes(s)
    );
  }

  return res.json({
    success: true,
    count: results.length,
    posts: results
  });
};

exports.createPost = (req, res) => {
  try {
    const { title, content, category, tags = [] } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const author = req.user || users[0];

    const newPost = {
      id: 'post-' + Date.now(),
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      authorOrg: author.organization || 'Legal Practitioner',
      authorAvatar: author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name)}`,
      title: title.trim(),
      content: content.trim(),
      category: category || 'General Legal Discussion',
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean),
      upvotes: 1,
      upvotedBy: [author.id],
      createdAt: new Date().toISOString(),
      comments: []
    };

    communityPosts.unshift(newPost);

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create post', error: error.message });
  }
};

exports.getPostComments = (req, res) => {
  const { postId } = req.params;
  const post = communityPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  return res.json({
    success: true,
    postId: post.id,
    count: post.comments.length,
    comments: post.comments
  });
};

exports.addComment = (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    const post = communityPosts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const author = req.user || users[0];

    const newComment = {
      id: 'comment-' + Date.now(),
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      authorOrg: author.organization || 'Legal Practitioner',
      authorAvatar: author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name)}`,
      content: content.trim(),
      upvotes: 0,
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
      totalComments: post.comments.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add comment', error: error.message });
  }
};

exports.toggleUpvote = (req, res) => {
  const { postId } = req.params;
  const post = communityPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const userId = req.user ? req.user.id : 'guest-user';
  if (!post.upvotedBy) post.upvotedBy = [];

  const index = post.upvotedBy.indexOf(userId);
  let upvoted = false;

  if (index > -1) {
    post.upvotedBy.splice(index, 1);
    post.upvotes = Math.max(0, post.upvotes - 1);
  } else {
    post.upvotedBy.push(userId);
    post.upvotes += 1;
    upvoted = true;
  }

  return res.json({
    success: true,
    upvoted,
    upvotes: post.upvotes
  });
};
