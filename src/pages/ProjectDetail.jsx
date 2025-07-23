import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Star, MapPin, Calendar, Users, Award, MessageCircle, ImageIcon, Clock, ChevronRight } from 'lucide-react';
import API from '../api/axiosInstance.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [newReview, setNewReview] = useState({ 
    comment: '', 
    overallRating: 5,
    keyRatings: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await API.get(`/projects/${id}`);
        const projectData = projectRes.data;
        
        // Ensure keys is always an array (matching AdminPanel format)
        if (projectData.keys && typeof projectData.keys === 'string') {
          projectData.keys = projectData.keys.split(',').map(key => key.trim());
        } else if (!projectData.keys) {
          projectData.keys = [];
        }
        
        setProject(projectData);
        
        // Initialize key ratings for the review form
        if (projectData.keys && projectData.keys.length > 0) {
          const initialKeyRatings = {};
          projectData.keys.forEach(key => {
            initialKeyRatings[key] = 5;
          });
          setNewReview(prev => ({ ...prev, keyRatings: initialKeyRatings }));
        }

        const reviewsRes = await API.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
        
        const questionsRes = await API.get(`/questions/${id}`);
        setQuestions(questionsRes.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAsk = async () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      await API.post('/questions', { projectId: id, question: newQuestion });
      toast.success('Question submitted');
      setNewQuestion('');
      const updated = await API.get(`/questions/${id}`);
      setQuestions(updated.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error('You need viewer or admin privileges to ask questions');
      } else if (err.response?.status === 401) {
        toast.error('Please log in to ask questions');
      } else {
        toast.error('Ask failed');
      }
    }
  };

  const handleReview = async () => {
    if (!newReview.comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    try {
      await API.post('/reviews', { ...newReview, projectId: id });
      toast.success('Review posted');
      setNewReview({ 
        comment: '', 
        overallRating: 5,
        keyRatings: project.keys ? project.keys.reduce((acc, key) => ({ ...acc, [key]: 5 }), {}) : {}
      });
      const updated = await API.get(`/reviews/${id}`);
      setReviews(updated.data);
      setActiveTab('reviews');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error('You need reviewer privileges to submit reviews');
      } else if (err.response?.status === 401) {
        toast.error('Please log in to submit reviews');
      } else {
        toast.error('Review failed');
      }
    }
  };

  const handleAnswer = async (questionId) => {
    if (!newAnswer.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    try {
      await API.put(`/questions/${questionId}`, { answer: newAnswer });
      toast.success('Answer submitted');
      setNewAnswer('');
      setAnsweringQuestionId(null);
      const updated = await API.get(`/questions/${id}`);
      setQuestions(updated.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error('You need reviewer or admin privileges to answer questions');
      } else if (err.response?.status === 401) {
        toast.error('Please log in to answer questions');
      } else {
        toast.error('Answer submission failed');
      }
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.overallRating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating, size = 'md', interactive = false, onClick = null) => {
    const stars = [];
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    };

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onClick && onClick(i)}
          disabled={!interactive}
          className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : ''} focus:outline-none`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              i <= rating 
                ? 'fill-amber-400 text-amber-400' 
                : interactive 
                  ? 'text-gray-300 hover:text-amber-300' 
                  : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      );
    }
    
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-3/4"></div>
            <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">Project not found</p>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100 backdrop-blur-sm">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          
          {project.image && (
            <div className="relative">
              <img 
                src={project.image.startsWith('http') ? project.image : `/uploads/${project.image}`} 
                alt={project.title}
                className="w-full h-72 md:h-96 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Floating Rating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
                <div className="flex items-center space-x-2">
                  {renderStars(averageRating, 'sm')}
                  <span className="font-semibold text-gray-800 text-sm">
                    {averageRating} <span className="text-gray-500">({reviews.length})</span>
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                  {project.title}
                </h1>
                
                <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">{project.location || 'Location not specified'}</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="font-medium">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Start date TBD'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'End date TBD'}
                    </span>
                  </div>
                  
                  {project.keys && project.keys.length > 0 && (
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full">
                      <span className="text-sm font-medium text-gray-700">{project.keys.length} Key Areas</span>
                    </div>
                  )}
                </div>
                
                {/* Project Tags/Keys Display */}
                {project.keys && project.keys.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.keys.map((key, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {key}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-48">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
                      <p className="text-sm text-blue-500 font-medium">Reviews</p>
                    </div>
                    <Award className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{questions.length}</p>
                      <p className="text-sm text-purple-500 font-medium">Questions</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: Award },
                  { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
                  { id: 'questions', label: `Q&A (${questions.length})`, icon: MessageCircle }
                ].map(({ id, label, icon }) => {
                  const IconComponent = icon;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`group py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                        activeTab === id 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`w-4 h-4 transition-colors ${
                          activeTab === id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`} />
                        <span>{label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                    About this project
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {reviews.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No reviews yet</h3>
                    <p className="text-gray-500">Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="group bg-gradient-to-r from-white to-gray-50/30 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {review.reviewer?.name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {review.reviewer?.name || 'Anonymous'}
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
                            {renderStars(review.overallRating, 'sm')}
                            <span className="ml-2 text-sm font-semibold text-gray-700">
                              {review.overallRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                        
                        {review.keyRatings && Object.keys(review.keyRatings).length > 0 && (
                          <div className="border-t border-gray-100 pt-4">
                            <h5 className="text-sm font-semibold text-gray-600 mb-3">Detailed Ratings</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {Object.entries(review.keyRatings).map(([key, rating]) => (
                                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                  <span className="text-sm capitalize text-gray-700 font-medium">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <div className="flex items-center">
                                    {renderStars(rating, 'sm')}
                                    <span className="ml-2 text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Enhanced Review Form */}
                {(user?.role === 'reviewer' || user?.role === 'admin') && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <Star className="w-6 h-6 mr-2 text-amber-500" />
                      Write a Review
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Your Review</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          rows="4"
                          placeholder="Share your experience with this project..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Overall Rating</label>
                        <div className="flex items-center space-x-4">
                          {renderStars(newReview.overallRating, 'lg', true, (rating) => 
                            setNewReview({ ...newReview, overallRating: rating })
                          )}
                          <span className="text-lg font-semibold text-gray-700">
                            {newReview.overallRating} star{newReview.overallRating !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {project.keys && project.keys.length > 0 && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-4">Rate Key Aspects</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.keys.map((key) => (
                              <div key={key} className="bg-white/60 p-4 rounded-xl border border-gray-200/50">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm capitalize text-gray-700 font-medium">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <span className="text-xs text-gray-500 font-medium">
                                    {newReview.keyRatings[key] || 0}/5
                                  </span>
                                </div>
                                {renderStars(newReview.keyRatings[key] || 0, 'md', true, (rating) =>
                                  setNewReview({
                                    ...newReview,
                                    keyRatings: {
                                      ...newReview.keyRatings,
                                      [key]: rating
                                    }
                                  })
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleReview}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                      >
                        Submit Review
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Message for viewers about reviewing */}
                {user?.role === 'viewer' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <span className="text-yellow-600 mr-2">ℹ️</span>
                      <p className="text-yellow-800 text-sm">
                        Only reviewers can submit reviews. If you have experience with this project, 
                        please contact an admin to request reviewer status.
                      </p>
                    </div>
                  </div>
                )}

                {/* Message for non-logged-in users */}
                {!user && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">🔒</span>
                      <p className="text-gray-700 text-sm">
                        Please log in to submit reviews.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {questions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No questions yet</h3>
                    <p className="text-gray-500">Ask the first question about this project!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <div key={question._id} className="bg-gradient-to-r from-white to-gray-50/30 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mt-0.5">
                              <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-2">{question.question}</h4>
                              <p className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Asked by {question.asker?.name || 'Anonymous'} • {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Recently'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Display all answers */}
                        {question.answers && question.answers.length > 0 ? (
                          <div className="space-y-3 ml-11">
                            {question.answers.map((answer, answerIndex) => (
                              <div key={answerIndex} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50">
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mt-0.5">
                                    <ChevronRight className="w-3 h-3 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-gray-700 mb-2">{answer.answer}</p>
                                    <p className="text-xs text-gray-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Answered by {answer.answerer?.name || 'Admin'} • {answer.answeredAt ? new Date(answer.answeredAt).toLocaleDateString() : 'Recently'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Fallback for old single answer format
                          question.answer ? (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50 ml-11">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mt-0.5">
                                  <ChevronRight className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-700 mb-2">{question.answer}</p>
                                  <p className="text-xs text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Answered by {question.answerer?.name || 'Admin'} • {question.answeredAt ? new Date(question.answeredAt).toLocaleDateString() : 'Recently'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="ml-11 text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                              No answers yet - we'll respond soon!
                            </div>
                          )
                        )}

                        {/* Answer form for reviewers and admins */}
                        {(user?.role === 'reviewer' || user?.role === 'admin') && (
                          <div className="mt-4 ml-11">
                            {answeringQuestionId === question._id ? (
                              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                <textarea
                                  value={newAnswer}
                                  onChange={(e) => setNewAnswer(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  rows="3"
                                  placeholder="Write your answer..."
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAnswer(question._id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                  >
                                    Submit Answer
                                  </button>
                                  <button
                                    onClick={() => {
                                      setAnsweringQuestionId(null);
                                      setNewAnswer('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setAnsweringQuestionId(question._id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Add Answer</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Enhanced Question Form */}
                {(user?.role === 'viewer' || user?.role === 'admin') && (
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200/50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <MessageCircle className="w-6 h-6 mr-2 text-green-600" />
                      Ask a Question
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <textarea
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          rows="3"
                          placeholder="What would you like to know about this project?"
                        />
                      </div>
                      <button
                        onClick={handleAsk}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                      >
                        Ask Question
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Message for reviewers about asking questions */}
                {user?.role === 'reviewer' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">💡</span>
                      <p className="text-blue-800 text-sm">
                        As a reviewer, you can answer questions by clicking "Add Answer" on any question above. 
                        Multiple answers are welcome to provide different perspectives!
                      </p>
                    </div>
                  </div>
                )}

                {/* Message for non-logged-in users */}
                {!user && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">🔒</span>
                      <p className="text-gray-700 text-sm">
                        Please log in to ask questions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;