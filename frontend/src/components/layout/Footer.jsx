const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: "github" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
  ];

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-heading font-bold">
              Port<span className="text-gold-400">folio</span>
            </span>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6 mb-6 md:mb-0">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gold-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © 2026 All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
