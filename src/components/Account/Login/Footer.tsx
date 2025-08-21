import { Twitter, Facebook, Linkedin, Globe } from "lucide-react";
import logo from "@/assets/Vimarsh-logo2.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-t border-white/10 animate-[slideInFromTop_0.8s_cubic-bezier(0.4,0,0.2,1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="space-y-6">
          
          {/* Brand Section - Always full width */}
          <div className="animate-[slideInFromLeft_1.2s_cubic-bezier(0.4,0,0.2,1)]">
            <div className="max-w-sm">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4 group cursor-pointer">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-y-180">
                  <img src={logo} alt="Vimarsh Logo" className="w-8 h-8 " />
                </div>
                                <span 
                  className="text-xl font-bold bg-clip-text text-transparent"
                  style={{
                    background: 'linear-gradient(180deg, #6d7197f3 0%, #002486ec 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  Vimarsh
                </span>
              </div>
              
              {/* Description */}
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                Connecting minds, sharing stories, building communities through meaningful conversations and shared experiences.
              </p>
              
              {/* Social Links - Show on mobile under brand */}
              <div className="flex gap-3 mt-6 sm:hidden">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Globe size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Links Section - 3 columns on mobile, responsive on larger screens */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            
            {/* Product Section */}
            <div className="animate-[slideInFromLeft_1.2s_cubic-bezier(0.4,0,0.2,1)] [animation-delay:0.2s] [animation-fill-mode:both]">
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 relative">
                Product
                <div className="absolute -bottom-1 left-0 w-6 sm:w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                {['Features', 'Pricing', 'API', 'Mobile App'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 text-xs sm:text-sm hover:text-white hover:translate-x-1 transition-all duration-300 relative group block">
                      {item}
                      <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div className="animate-[slideInFromLeft_1.2s_cubic-bezier(0.4,0,0.2,1)] [animation-delay:0.3s] [animation-fill-mode:both]">
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 relative">
                Company
                <div className="absolute -bottom-1 left-0 w-6 sm:w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 text-xs sm:text-sm hover:text-white hover:translate-x-1 transition-all duration-300 relative group block">
                      {item}
                      <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div className="animate-[slideInFromLeft_1.2s_cubic-bezier(0.4,0,0.2,1)] [animation-delay:0.4s] [animation-fill-mode:both]">
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 relative">
                Support
                <div className="absolute -bottom-1 left-0 w-6 sm:w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 text-xs sm:text-sm hover:text-white hover:translate-x-1 transition-all duration-300 relative group block">
                      {item}
                      <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Section - Hidden on mobile (3 cols), shown as 4th col on larger screens */}
            <div className="hidden lg:block animate-[slideInFromLeft_1.2s_cubic-bezier(0.4,0,0.2,1)] [animation-delay:0.5s] [animation-fill-mode:both]">
              <h4 className="text-base font-semibold mb-4 relative">
                Follow Us
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all duration-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm">
                  <Globe size={18} />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center animate-[slideInFromTop_1.4s_cubic-bezier(0.4,0,0.2,1)]">
          <p className="text-white/60 text-sm">
            © 2024 Vimarsh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;