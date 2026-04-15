import aboutImage from "../../assets/photo.jpg";
const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square bg-white flex items-center justify-center">
              <span className="text-gray-400 text-lg">
                <img
                  src={aboutImage}
                  alt="About Image"
                  className="w-full h-full object-cover object-top m-auto p-auto"
                />
              </span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-gold-400 -z-10 hidden lg:block"></div>
          </div>

          <div>
            <span className="text-gold-400 font-medium uppercase text-sm">
              About Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mt-2 mb-4">
              Who I Am
            </h2>
            <div className="w-16 h-1 bg-gold-400 mb-6"></div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              I'm a passionate full-stack developer with expertise in building
              modern web applications. I love turning complex problems into
              simple, beautiful solutions.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              With experience in both frontend and backend technologies, I
              create seamless user experiences that drive results. I'm
              constantly learning and staying up-to-date with the latest
              industry trends.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gold-400"></div>
                <span className="text-gray-500">Name:</span>
                <span className="text-dark font-medium">
                  Parikshit Maharjan
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gold-400"></div>
                <span className="text-gray-500">Email:</span>
                <span className="text-dark font-medium">
                  pariks2345@email.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gold-400"></div>
                <span className="text-gray-500">Location:</span>
                <span className="text-dark font-medium">Kathmandu, Nepali</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gold-400"></div>
                <span className="text-gray-500">Availability:</span>
                <span className="text-dark font-medium">Working</span>
              </div>
            </div>

            <a
              href="#contact"
              className="bg-primary-900 text-white px-8 py-4 hover:bg-primary-800 transition-colors inline-block"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
