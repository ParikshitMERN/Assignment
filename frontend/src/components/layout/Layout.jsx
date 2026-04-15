const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold text-primary-900">
            Port<span className="text-gold-400">folio</span>
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-primary-900">
              About
            </a>
            <a
              href="#projects"
              className="text-gray-600 hover:text-primary-900"
            >
              Projects
            </a>
            <a href="#skills" className="text-gray-600 hover:text-primary-900">
              Skills
            </a>
            <a href="#contact" className="text-gray-600 hover:text-primary-900">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">{children}</main>

      {/* Simple Footer */}
      <footer className="bg-primary-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-xl font-bold">
            Port<span className="text-gold-400">folio</span>
          </span>
          <p className="text-gray-400 mt-2">© 2024 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
