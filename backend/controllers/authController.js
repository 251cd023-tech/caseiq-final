const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users } = require('../data/seedData');
const { JWT_SECRET } = require('../middleware/auth');
const { syncBookmarkWithSavedCases } = require('./savedCasesController');

// Helper to sanitize user object (never return password or hash)
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    fullName: safeUser.name || safeUser.fullName,
    name: safeUser.name || safeUser.fullName
  };
};

// POST /api/auth/register
exports.register = (req, res) => {
  try {
    const { fullName, name, email, password, role, organization } = req.body;
    const userName = (fullName || name || '').trim();

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required.',
        message: 'Full name, email, and password are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format.',
        message: 'Invalid email address format.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
        message: 'Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists.',
        message: 'An account with this email already exists.'
      });
    }

    const newUser = {
      id: 'user-' + Date.now(),
      numericId: users.length + 1,
      name: userName,
      fullName: userName,
      email: cleanEmail,
      password: bcrypt.hashSync(password, 10),
      role: role || 'Lawyer',
      organization: organization || 'Independent Legal Practice',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`,
      bookmarks: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: 'Registration failed'
    });
  }
};

// POST /api/auth/login
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
        message: 'Email and password are required.'
      });
    }

    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid credentials'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Login failed',
      message: 'Login failed'
    });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// GET /api/auth/me
exports.getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthenticated',
      message: 'Authentication required'
    });
  }
  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user)
  });
};

// POST /api/auth/forgot-password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Email is required',
      message: 'Email is required'
    });
  }

  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'No account found with this email address.',
      message: 'No account found with this email address.'
    });
  }

  return res.status(200).json({
    success: true,
    message: `Password reset instructions have been dispatched to ${email}.`
  });
};

// GET /api/profile
exports.getProfile = (req, res) => {
  const user = req.user || users[0];
  return res.status(200).json({
    success: true,
    profile: sanitizeUser(user)
  });
};

// PUT /api/profile
exports.updateProfile = (req, res) => {
  try {
    const user = req.user || users[0];
    const { fullName, name, organization, role, avatar } = req.body;

    if (fullName || name) user.name = (fullName || name).trim();
    if (organization) user.organization = organization.trim();
    if (role) user.role = role.trim();
    if (avatar) user.avatar = avatar.trim();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: 'Failed to update profile'
    });
  }
};

// POST /api/auth/bookmark (toggleBookmark)
exports.toggleBookmark = (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ success: false, message: 'itemId required' });
  }

  const user = req.user || users[0];
  if (!user.bookmarks) user.bookmarks = [];
  const index = user.bookmarks.indexOf(itemId);
  let bookmarked = false;

  if (index > -1) {
    user.bookmarks.splice(index, 1);
    bookmarked = false;
  } else {
    user.bookmarks.push(itemId);
    bookmarked = true;
  }

  // Cross-synchronize with savedCasesStore if itemId is a case
  syncBookmarkWithSavedCases(user.id, itemId, bookmarked);

  return res.status(200).json({
    success: true,
    bookmarked,
    bookmarks: user.bookmarks
  });
};
