'use client';

import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  Search, 
  Send, 
  Sparkles, 
  Tag, 
  CheckCircle2,
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CommunityPost } from '../../types';

export const CommunityPage: React.FC = () => {
  const { 
    communityPosts, 
    alumniProfiles, 
    addCommunityPost, 
    likeCommunityPost, 
    addCommunityComment,
    currentUser 
  } = useApp();

  const [activeCircle, setActiveCircle] = useState<'all' | 'alumni' | 'careers' | 'academics'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Create Post Form
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCircle, setPostCircle] = useState<'general' | 'alumni' | 'careers' | 'academics'>('general');
  const [postTags, setPostTags] = useState('AlumniNetwork, Careers');

  const filteredPosts = communityPosts.filter(p => {
    const matchesCircle = activeCircle === 'all' ? true : p.circle === activeCircle;
    const matchesSearch = `${p.title} ${p.content} ${p.authorName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCircle && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addCommunityPost({
      authorName: currentUser?.name || 'Community Member',
      authorRole: (currentUser?.role as string) === 'student' ? 'Current Scholar' : ((currentUser?.role as string) === 'parent' ? 'Parent / Guardian' : 'Verified Member'),
      authorAvatar: currentUser?.avatar,
      isAlumni: (currentUser?.role as string) !== 'student',
      circle: postCircle,
      title: postTitle,
      content: postContent,
      tags: postTags.split(',').map(t => t.trim().replace(/^#/, ''))
    });

    setShowCreateModal(false);
    setPostTitle('');
    setPostContent('');
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addCommunityComment(postId, commentInput);
    setCommentInput('');
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              EduSphere Connect — Student & Alumni Network
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lifelong peer communication, graduating set circles, career mentorship, and alumni reunions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-violet-700/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Start Discussion / Share Opportunity</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Feeds & Circles */}
        <div className="lg:col-span-2 space-y-4">
          {/* Circle Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'All Community Feeds' },
              { id: 'alumni', label: '🎓 Alumni Sets & Reunions' },
              { id: 'careers', label: '💼 Jobs & SIWES Internships' },
              { id: 'academics', label: '📚 Study Circles & Past Qs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCircle(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCircle === tab.id
                    ? 'bg-violet-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Post Prompt Bar */}
          <div 
            onClick={() => setShowCreateModal(true)}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3 cursor-pointer hover:border-violet-300 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0">
              {currentUser?.name ? currentUser.name[0] : 'U'}
            </div>
            <div className="flex-1 bg-slate-50 px-4 py-2 rounded-xl text-xs text-slate-400 border border-slate-100">
              Share career advice, organize an alumni set meeting, or ask for academic assistance...
            </div>
            <button className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold hover:bg-violet-100">
              Post
            </button>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div 
                key={post.id} 
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:shadow-sm transition-all"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-violet-700 bg-violet-50">
                          {post.authorName[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{post.authorName}</span>
                        {post.isAlumni && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full flex items-center space-x-1">
                            <GraduationCap className="w-3 h-3" />
                            <span>Verified Alumnus</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {post.authorRole} • {post.createdAt}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                    {post.circle}
                  </span>
                </div>

                {/* Post Content */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{post.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engagement Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => likeCommunityPost(post.id)}
                      className={`flex items-center space-x-1.5 font-semibold transition-colors ${
                        post.hasLiked ? 'text-rose-600' : 'hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center space-x-1.5 font-semibold hover:text-violet-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments.length} {post.comments.length === 1 ? 'Reply' : 'Replies'}</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => alert('Post link copied to clipboard!')}
                    className="flex items-center space-x-1 hover:text-slate-800"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Comments List */}
                    {post.comments.map(c => (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <strong className="text-slate-900">{c.authorName}</strong>
                            <span className="text-[10px] text-slate-500">({c.authorRole})</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{c.content}</p>
                      </div>
                    ))}

                    {/* Add Comment Input */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(post.id); }}
                        placeholder="Write a reply or message..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="p-2 bg-violet-700 text-white rounded-xl hover:bg-violet-800"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Distinguished Alumni Directory & Mentorship Hub */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-violet-800">
                <GraduationCap className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">Distinguished Alumni</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Connect with graduates from past sets for career guidance, university recommendations, and internships.
            </p>

            <div className="space-y-3">
              {alumniProfiles.map(alumnus => (
                <div key={alumnus.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      {alumnus.avatarUrl ? (
                        <img src={alumnus.avatarUrl} alt={alumnus.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                          {alumnus.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{alumnus.name}</div>
                      <div className="text-[10px] text-violet-700 font-bold">{alumnus.graduatingYear}</div>
                      <div className="text-[11px] text-slate-600 truncate">{alumnus.currentRole}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500">{alumnus.location}</span>
                    {alumnus.mentorshipAvailable ? (
                      <button 
                        onClick={() => alert(`Mentorship request sent to ${alumnus.name}!`)}
                        className="text-xs text-emerald-700 font-bold hover:underline"
                      >
                        Request Mentorship
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Alumni Member</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graduating Sets & Reunions Card */}
          <div className="bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center space-x-2 text-violet-300 text-xs font-bold mb-2">
              <Calendar className="w-4 h-4" />
              <span>Alumni Association Chapters</span>
            </div>
            <h4 className="text-sm font-bold">2026 Annual Alumni Convention</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Theme: "Building Generational Legacies & Supporting Future Scholars."
            </p>
            <div className="mt-3 text-[11px] text-violet-200 font-mono">
              Date: 12th December 2026 • College Auditorium
            </div>
          </div>
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-violet-50 border-b border-violet-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-violet-800">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Post to EduSphere Community</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Community Circle / Category
                </label>
                <select
                  value={postCircle}
                  onChange={(e) => setPostCircle(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-600"
                >
                  <option value="general">General Campus Buzz & Lounge</option>
                  <option value="alumni">Alumni Sets, Reunions & Homecoming</option>
                  <option value="careers">Jobs, SIWES Internships & Career Advice</option>
                  <option value="academics">Academic Study Group & Past Questions</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Discussion Title
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Guidance for graduating students taking JAMB/WAEC..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Post Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share details, advice, or announcement..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="Alumni, Mentorship, Tech"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-semibold shadow-md shadow-violet-700/20"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
