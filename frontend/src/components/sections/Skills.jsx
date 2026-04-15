import { useState, useEffect } from "react";
import { skillsAPI } from "../../services/api";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await skillsAPI.getAll();
      setSkills(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gold-400 font-medium uppercase text-sm">
            My Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mt-2">
            Skills & Technologies
          </h2>
          <div className="w-16 h-1 bg-gold-400 mt-4 mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
          </div>
        ) : skills.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No skills added yet.
          </p>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-medium text-primary-900 capitalize mb-6 flex items-center">
                  <span className="w-8 h-0.5 bg-gold-400 mr-3"></span>
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-gray-50 p-6 text-center hover:bg-primary-900 group transition-all duration-300"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-full flex items-center justify-center text-primary-900 group-hover:bg-gold-400 group-hover:text-white transition-all">
                        <span className="text-xl font-bold">
                          {skill.name.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-medium text-dark group-hover:text-white transition-colors text-sm">
                        {skill.name}
                      </h4>
                      <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-400"
                          style={{ width: `${skill.proficiency || 50}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
