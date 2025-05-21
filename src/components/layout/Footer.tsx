
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Instagram, Facebook, Twitter, Linkedin, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and company info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-teal-400" />
              <span className="text-xl font-bold text-white font-poppins">
                BRICK<span className="text-teal-400">HIVE</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted partner in finding the perfect home. We help millions
              of people every month find their dream properties.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/apartments" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/villas" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Villas
                </Link>
              </li>
              <li>
                <Link to="/plots" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Plots
                </Link>
              </li>
              <li>
                <Link to="/commercial" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/pg-co-living" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  PG & Co-living
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  1234 Harbor Street, Suite 500<br />
                  San Francisco, CA 94158
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-teal-400 shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-teal-400 shrink-0" />
                <span className="text-gray-400">contact@BRICKHIVE.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BRICKHIVE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
