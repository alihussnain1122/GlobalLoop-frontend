import { useState, useEffect } from "react";
import API from "../api/axiosInstance.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, Calendar, Star, Users, ArrowRight, Grid, List } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
        setFilteredProjects(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch projects", err);
        setLoading(false);
      }
    }
    getProjects();
  }, []);

  useEffect(() => {
    let filtered = projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort projects
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
  }, [searchTerm, sortBy, projects]);

  const ProjectCard = ({ project }) => (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
    >
      <div className="relative overflow-hidden">
        {project.image && (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        {project.overallRating && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{project.overallRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h2>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{project.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-yellow-600 font-bold">
            ★ {project.overallRating ? project.overallRating.toFixed(1) : 'N/A'}
          </div>
          <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  const ProjectListItem = ({ project }) => (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex gap-6 cursor-pointer"
    >
      {project.image && (
        <img 
          src={project.image} 
          alt={project.title}
          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
        />
      )}
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h2>
          {project.overallRating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{project.overallRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6 text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{project.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-yellow-600 font-bold">
            ★ {project.overallRating ? project.overallRating.toFixed(1) : 'N/A'}
          </div>
          <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Explore <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GlobalLoop</span> Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing Erasmus-style projects around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects or locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }>
            {filteredProjects.map((project) => (
              viewMode === "grid" 
                ? <ProjectCard key={project._id} project={project} />
                : <ProjectListItem key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;