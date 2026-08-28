import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Tag,
  Search,
  Filter,
  Sparkles,
  User,
  Plus,
  X,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CommunityView = () => {
  const { user, addToast } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // New Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Landmark Analysis');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');

  // Active Comment State
  const [activePostComments, setActivePostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getCommunityPosts();
      if (res.success) {
        setPosts(res.posts || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load community discussions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const res = await api.toggleUpvote(postId);
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return { ...p, upvotes: res.upvotes };
          }
          return p;
        }));
        addToast(res.upvoted ? 'Upvoted discussion' : 'Removed upvote', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to register upvote', 'error');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      addToast('Please enter a post title and content', 'warning');
      return;
    }

    setCreating(true);
    try {
      const tagsArray = postTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await api.createCommunityPost({
        title: postTitle.trim(),
        category: postCategory,
        content: postContent.trim(),
        tags: tagsArray
      });

      if (res.success) {
        setPosts(prev => [res.post, ...prev]);
        setShowCreateModal(false);
        setPostTitle('');
        setPostContent('');
        setPostTags('');
        addToast('Discussion posted to CaseIQ Legal Community!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to create discussion', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleAddComment = async (postId) => {
    const text = newCommentText[postId];
    if (!text || !text.trim()) return;

    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await api.addComment(postId, text.trim());
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), res.comment]
            };
          }
          return p;
        }));
        setNewCommentText(prev => ({ ...prev, [postId]: '' }));
        addToast('Comment added', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit comment', 'error');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const filteredPosts = posts.filter(p => {
    const s = searchQuery.toLowerCase();
    const matchesSearch = !s ||
      p.title.toLowerCase().includes(s) ||
      p.content.toLowerCase().includes(s) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(s)));

    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Verified Jurists & Practitioner Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              CaseIQ Legal Community & Case Insights
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Collaborative discussion forum for lawyers, researchers, law students, and corporate counsel on recent judgments, criminal reforms, and litigation tactics.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Start Legal Discussion</span>
          </button>
        </div>

        {/* Search & Category Filter Tabs */}
        <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions by topic, section, or author..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'Landmark Analysis', 'Legal Reform', 'Case Discussion', 'Q&A'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Topics' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-5">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading community insights...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400 text-xs">
            No discussions found for current filter. Be the first to start one!
          </div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-slate-700 transition-all shadow-xl"
            >
              {/* Author & Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=Legal'}
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-2xl bg-slate-800 object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{post.author?.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {post.author?.role || 'Advocate'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{post.author?.organization || 'Legal Practitioner'}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                  {post.category}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white hover:text-blue-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-blue-400 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-blue-400 transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-bold">{post.upvotes || 0}</span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">Upvotes</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{(post.comments || []).length} Comments</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Comments Stream */}
              <div className="pt-2 space-y-3">
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    {post.comments.map(c => (
                      <div key={c.id} className="text-xs space-y-1 border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{c.author?.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCommentText[post.id] || ''}
                    onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    placeholder="Contribute your legal opinion or statutory precedent..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={submittingComment[post.id]}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Create Legal Discussion</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Discussion Title / Legal Subject</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Mandatory Certificate Standard under Section 63 BSA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Landmark Analysis">Landmark Analysis</option>
                    <option value="Legal Reform">Legal Reform</option>
                    <option value="Case Discussion">Case Discussion</option>
                    <option value="Q&A">Q&A</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="BSA 63, Evidence, Supreme Court"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Legal Content / Case Analysis</label>
                <textarea
                  required
                  rows={5}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share facts, statutory arguments, judicial observations, or trial questions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {creating ? 'Publishing...' : 'Publish to Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
