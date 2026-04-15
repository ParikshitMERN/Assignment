import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/slug/${slug}`,
      );
      const data = await response.json();
      setProject(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-primary-900 mb-4">
            Project Not Found
          </h1>
          <Link to="/" className="text-gold-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/#projects"
            className="text-gold-400 hover:text-primary-900 mb-8 inline-block"
          >
            ← Back to Projects
          </Link>

          <div className="aspect-video bg-gray-100 mb-8 overflow-hidden">
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

          <span className="text-gold-400 text-sm uppercase font-medium">
            {project.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mt-2 mb-6">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies?.map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4 mb-8">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-900 text-white px-6 py-3 hover:bg-primary-800 transition-colors"
              >
                View Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-primary-900 text-primary-900 px-6 py-3 hover:bg-primary-900 hover:text-white transition-colors"
              >
                View on GitHub
              </a>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              About This Project
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {project.images?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-primary-900 mb-6">
                Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`${project.title} ${i + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
