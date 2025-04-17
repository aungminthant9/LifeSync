import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Community = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content: newPost,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
        likes: 0,
        comments: []
      });

      setNewPost('');
      // Refresh posts
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Add comment handler
  const handleAddComment = async (postId) => {
    if (!newComments[postId]?.trim()) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const updatedComments = [...(posts.find(p => p.id === postId).comments || []), {
        content: newComments[postId],
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString()
      }];

      await updateDoc(postRef, { comments: updatedComments });
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: updatedComments }
          : post
      ));
      setNewComments({ ...newComments, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Delete post handler
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  // Edit post handler
  const handleEditPost = async (postId) => {
    if (!editContent.trim()) return;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { content: editContent });
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, content: editContent }
          : post
      ));
      setEditingPost(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  // Update the posts feed section
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-20">
      {/* Hero Section */}
      <section className="relative py-16 bg-emerald-600 mb-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800 opacity-90"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: '0.1'
          }}></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Fitness Community
            </h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Share your journey, connect with others, and inspire each other to reach new heights in fitness and wellness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Create Post Section */}
      <section className="py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100"
          >
            <form onSubmit={handleCreatePost}>
              <textarea
                className="w-full p-4 border rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[120px] text-gray-700"
                placeholder="Share your fitness journey, achievements, or ask for advice..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-500">
                  <span className="text-sm">Be inspiring, be supportive! 💪</span>
                </div>
                <motion.button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Share Post</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Posts Feed */}
      <section className="py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-md">
                        {post.authorName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                        <p className="text-sm text-gray-500">
                          {post.createdAt?.toDate().toLocaleDateString()} • {post.createdAt?.toDate().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {user && post.authorId === user.uid && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingPost(post.id);
                            setEditContent(post.content);
                          }}
                          className="text-gray-600 hover:text-emerald-600"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>

                  {editingPost === post.id ? (
                    <div className="mb-4">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => handleEditPost(post.id)}
                          className="px-4 py-1 bg-emerald-600 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingPost(null);
                            setEditContent('');
                          }}
                          className="px-4 py-1 bg-gray-300 text-gray-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <p className="text-gray-700 text-lg leading-relaxed">{post.content}</p>
                    </div>
                  )}

                  {/* Remove the duplicate Post Content section */}
                  {/* Interaction Buttons */}
                  <div className="flex items-center space-x-6 text-gray-500 border-t pt-4">
                    <button className="flex items-center space-x-2 hover:text-emerald-600 transition-colors">
                      <span className="text-2xl">❤️</span>
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setExpandedComments({
                        ...expandedComments,
                        [post.id]: !expandedComments[post.id]
                      })}
                      className="flex items-center space-x-2 hover:text-emerald-600 transition-colors"
                    >
                      <span className="text-2xl">💬</span>
                      <span className="font-medium">{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments[post.id] && (
                    <div className="mt-6 space-y-4 bg-gray-50 rounded-xl p-4">
                      <div className="space-y-4">
                        {post.comments?.map((comment, index) => (
                          <div key={index} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                              {comment.authorName[0]}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{comment.authorName}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newComments[post.id] || ''}
                            onChange={(e) => setNewComments({
                              ...newComments,
                              [post.id]: e.target.value
                            })}
                            placeholder="Add a supportive comment..."
                            className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          <motion.button
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Post
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;