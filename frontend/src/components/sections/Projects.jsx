import { useState, useEffect } from "react";
import { projectsAPI } from "../../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectsAPI.getFeatured();
      setProjects(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gold-400 font-medium uppercase text-sm">
            My Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mt-2">
            Featured Projects
          </h2>
          <div className="w-16 h-1 bg-gold-400 mt-4 mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {project.image?.url ? (
                    <img
                      src={project.image.url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="text-gold-400 text-sm uppercase">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-primary-900 mt-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {project.shortDescription || project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies?.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-900 hover:text-gold-400 text-sm font-medium"
                      >
                        Live Demo →
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-900 hover:text-gold-400 text-sm font-medium"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
