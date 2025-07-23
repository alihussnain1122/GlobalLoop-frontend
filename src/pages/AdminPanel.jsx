import { useState, useEffect, useContext } from 'react';
import { Users, FolderOpen, MessageSquare, Star, Plus, Edit2, Trash2, Check, X, Shield, UserCheck, Calendar, MapPin, Tag } from 'lucide-react';
import API from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('projects');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', location: '', startDate: '', endDate: '', keys: '', image: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [u, p, r, q] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/projects'),
        API.get('/admin/reviews'),
        API.get('/admin/questions'),
      ]);
      setUsers(u.data);
      setProjects(p.data);
      setReviews(r.data);
      setQuestions(q.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  const approveUser = async (id) => {
    try {
      await API.put(`/admin/users/${id}/approve`);
      toast.success('Reviewer approved successfully');
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve user');
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user');
    }
  };

  const createUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await API.post('/admin/users', userForm);
      toast.success('User created successfully');
      setUserForm({ name: '', email: '', password: '', role: 'viewer' });
      setShowUserForm(false);
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create user');
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role: newRole });
      if (newRole === 'reviewer') {
        toast.success('User role changed to reviewer - awaiting approval');
      } else {
        toast.success('User role updated');
      }
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user role');
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/admin/projects/${id}`);
      toast.success('Project deleted');
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete project');
    }
  };

  const createProject = async () => {
    const projectData = {
      ...form,
      keys: form.keys ? form.keys.split(',').map(key => key.trim()) : []
    };
    try {
      await API.post('/admin/projects', projectData);
      toast.success('Project created');
      setForm({ title: '', description: '', location: '', startDate: '', endDate: '', keys: '', image: '' });
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create project');
    }
  };

  const updateProject = async () => {
    const projectData = {
      ...form,
      keys: form.keys ? form.keys.split(',').map(key => key.trim()) : []
    };
    try {
      await API.put(`/admin/projects/${editingProject._id}`, projectData);
      toast.success('Project updated');
      setForm({ title: '', description: '', location: '', startDate: '', endDate: '', keys: '', image: '' });
      setEditingProject(null);
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update project');
    }
  };

  const startEditProject = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      location: project.location,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      keys: project.keys ? project.keys.join(', ') : '',
      image: project.image || ''
    });
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setForm({ title: '', description: '', location: '', startDate: '', endDate: '', keys: '', image: '' });
  };

  const deleteReview = async (id) => {
    try {
      await API.delete(`/admin/reviews/${id}`);
      toast.success('Review deleted');
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete review');
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await API.delete(`/admin/questions/${id}`);
      toast.success('Question deleted');
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete question');
    }
  };

  const updateReview = async (reviewId, updatedData) => {
    try {
      await API.put(`/admin/reviews/${reviewId}`, updatedData);
      toast.success('Review updated');
      setEditingReview(null);
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update review');
    }
  };

  const startEditReview = (review) => {
    setEditingReview(review);
  };

  const cancelEditReview = () => {
    setEditingReview(null);
  };

  const tabs = [
    { key: 'projects', label: 'Projects', icon: FolderOpen, count: projects.length },
    { key: 'users', label: 'Users', icon: Users, count: users.length },
    { key: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
    { key: 'questions', label: 'Q&A', icon: MessageSquare, count: questions.length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your volunteer programs with ease</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 flex-1 justify-center ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Project Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input 
                    placeholder="Enter project title" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      placeholder="Project location" 
                      value={form.location} 
                      onChange={(e) => setForm({ ...form, location: e.target.value })} 
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input 
                    placeholder="Project image URL" 
                    value={form.image} 
                    onChange={(e) => setForm({ ...form, image: e.target.value })} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  />
                </div>
                
                <div>
                  <ImageUpload 
                    currentImage={form.image}
                    onImageChange={(imageUrl) => setForm({ ...form, image: imageUrl })}
                    label="Upload Project Image"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="date" 
                      value={form.startDate} 
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="date" 
                      value={form.endDate} 
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Tags</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      placeholder="accommodation, food, learning, social" 
                      value={form.keys} 
                      onChange={(e) => setForm({ ...form, keys: e.target.value })} 
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  placeholder="Describe the project in detail..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32 resize-none" 
                />
              </div>

              <div className="flex items-center space-x-4 mt-6">
                {editingProject ? (
                  <>
                    <button 
                      onClick={updateProject} 
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <Check className="w-4 h-4" />
                      <span>Update Project</span>
                    </button>
                    <button 
                      onClick={cancelEditProject} 
                      className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={createProject} 
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                  </button>
                )}
              </div>
            </div>

            {/* Existing Projects */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Projects</h2>
              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {project.image && (
                            <img 
                              src={project.image} 
                              alt={project.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{project.location}</span>
                              <span className="mx-2">•</span>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            {project.keys && project.keys.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {project.keys.map((key, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {key}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-gray-600 text-sm">{project.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          onClick={() => startEditProject(project)} 
                          className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => deleteProject(project._id)} 
                          className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                </div>
                <button 
                  onClick={() => setShowUserForm(!showUserForm)} 
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showUserForm ? 'Cancel' : 'Create New User'}</span>
                </button>
              </div>

              {showUserForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      placeholder="Full Name" 
                      value={userForm.name} 
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                    <input 
                      placeholder="Email Address" 
                      type="email" 
                      value={userForm.email} 
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                    <input 
                      placeholder="Password" 
                      type="password" 
                      value={userForm.password} 
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                    <select 
                      value={userForm.role} 
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} 
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button 
                    onClick={createUser} 
                    className="mt-4 flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Create User</span>
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                          user.role === 'admin' ? 'bg-purple-600' : user.role === 'reviewer' ? 'bg-blue-600' : 'bg-gray-600'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'reviewer' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                            {user.role === 'reviewer' && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.isApproved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {user.isApproved ? '✅ Approved' : '⏳ Pending'}
                              </span>
                            )}
                            {user.role === 'admin' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✅ Approved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select 
                          value={user.role} 
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={!user.isApproved && user.role === 'reviewer'}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="admin">Admin</option>
                        </select>
                        {!user.isApproved && user.role === 'reviewer' && (
                          <button 
                            onClick={() => approveUser(user._id)} 
                            className="flex items-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                        )}
                        <button 
                          onClick={() => deleteUser(user._id)} 
                          className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">All Reviews</h2>
            </div>
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-6">
                  {editingReview && editingReview._id === review._id ? (
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600"><strong>Reviewer:</strong> {review.reviewer?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600"><strong>Project:</strong> {review.project?.title || 'N/A'}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="5" 
                            defaultValue={review.rating || review.overallRating} 
                            className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={(e) => setEditingReview({...editingReview, rating: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Review Content</label>
                          <textarea 
                            defaultValue={review.content || review.comment} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            onChange={(e) => setEditingReview({...editingReview, content: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-4">
                        <button 
                          onClick={() => updateReview(review._id, {
                            content: editingReview.content || review.content || review.comment,
                            rating: editingReview.rating || review.rating || review.overallRating
                          })} 
                          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                        <button 
                          onClick={cancelEditReview} 
                          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Reviewer:</strong> {review.reviewer?.name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Project:</strong> {review.project?.title || 'N/A'}
                          </p>
                          <div className="flex items-center space-x-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < (review.rating || review.overallRating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">
                              ({review.rating || review.overallRating}/5)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => startEditReview(review)} 
                            className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => deleteReview(review._id)} 
                            className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{review.content || review.comment}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Questions & Answers</h2>
            </div>
            
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {question.askedBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {question.askedBy?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500">Asked a question</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-800 font-medium">{question.question}</p>
                      </div>
                      {question.answer && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <p className="text-sm font-medium text-green-800">Admin Answer</p>
                          </div>
                          <p className="text-gray-700">{question.answer}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => deleteQuestion(question._id)} 
                        className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {questions.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
                  <p className="text-gray-600">Questions from users will appear here when they're submitted.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;