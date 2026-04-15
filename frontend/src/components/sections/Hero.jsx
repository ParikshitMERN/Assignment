import heroImage from "../../assets/image.jpg";
const Hero = () => {
  return (
    <section className="min-h-screen flex items-center bg-white">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="text-gold-400 font-medium uppercase text-sm">
              Welcome to my portfolio
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-900 mt-4 mb-6">
              Hi, I'm <span className="text-gold-400">Parikshit Maharjan</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              A passionate full-stack developer crafting beautiful and
              functional web experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                className="bg-primary-900 text-white px-8 py-4 hover:bg-primary-800 transition-colors text-center"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="border-2 border-primary-900 text-primary-900 px-8 py-4 hover:bg-primary-900 hover:text-white transition-colors text-center"
              >
                Get In Touch
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-900 to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white text-6xl">
                <img
                  src={heroImage}
                  alt="Parikshit Maharjan"
                  className="w-full h-full object-cover object-top"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
