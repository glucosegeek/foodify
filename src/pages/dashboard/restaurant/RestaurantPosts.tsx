import React, { useState } from 'react';
import { Plus, Megaphone, Calendar, Image, Edit2, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Post {
  id: string;
  type: 'PROMOTION' | 'EVENT' | 'ANNOUNCEMENT' | 'MENU_UPDATE';
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  views: number;
  engagement: number;
}

export function RestaurantPosts() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      type: 'PROMOTION',
      title: 'Weekend Happy Hour Special! 🍷',
      content: 'Join us every Friday-Sunday from 5-7 PM for 20% off all appetizers and wine selections.',
      image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
      created_at: '2024-01-20T10:00:00Z',
      views: 234,
      engagement: 45
    },
    {
      id: '2',
      type: 'MENU_UPDATE',
      title: 'New Spring Menu Available! 🌸',
      content: 'Try our seasonal dishes featuring fresh local ingredients. Available for limited time only.',
      created_at: '2024-01-18T14:30:00Z',
      views: 189,
      engagement: 38
    }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    type: 'PROMOTION' as Post['type'],
    title: '',
    content: ''
  });

  const handleCreatePost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
      views: 0,
      engagement: 0
    };
    setPosts([newPost, ...posts]);
    setFormData({ type: 'PROMOTION', title: '', content: '' });
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PROMOTION': return '🎉';
      case 'EVENT': return '📅';
      case 'MENU_UPDATE': return '🍽️';
      default: return '📢';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promotions & Posts</h1>
            <p className="text-gray-600 mt-2">Share updates with your followers</p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {showDialog && (
        <Card className="mb-6 border-2 border-orange-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Post['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="PROMOTION">Promotion</option>
                <option value="EVENT">Event</option>
                <option value="MENU_UPDATE">Menu Update</option>
                <option value="ANNOUNCEMENT">Announcement</option>
              </select>
            </div>
            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Write your message..."
              />
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleCreatePost} disabled={!formData.title || !formData.content}>
                Publish Post
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-2xl mr-2">{getTypeIcon(post.type)}</span>
                      <span className="text-xs text-gray-500 uppercase">{post.type}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">{post.title}</h3>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} views
                      </span>
                      <span>{post.engagement} interactions</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">Create your first post to engage with followers</p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
