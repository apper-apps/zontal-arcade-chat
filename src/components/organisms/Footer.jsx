import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const footerSections = [
    {
      title: "Games",
      links: [
        { label: "Action Games", path: "/category/action" },
        { label: "Puzzle Games", path: "/category/puzzle" },
        { label: "Racing Games", path: "/category/racing" },
        { label: "Adventure Games", path: "/category/adventure" },
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Blog", path: "/blog" },
        { label: "Latest News", path: "/blog" },
        { label: "Game Reviews", path: "/blog" },
        { label: "Featured Games", path: "/" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", path: "#" },
        { label: "Contact Us", path: "#" },
        { label: "Report Issues", path: "#" },
        { label: "Feedback", path: "#" },
      ]
    }
  ];

  const socialLinks = [
    { icon: "Facebook", href: "#", label: "Facebook" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "Instagram", href: "#", label: "Instagram" },
    { icon: "Youtube", href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-surface border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Gamepad2" size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold gradient-text">Zontal Arcade</h2>
            </div>
            <p className="text-gray-400 text-sm">
              The ultimate HTML5 gaming portal with over 1200+ games. 
              Play, discover, and enjoy the best web games all in one place.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all duration-200"
                >
                  <ApperIcon name={social.icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Zontal Arcade. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;