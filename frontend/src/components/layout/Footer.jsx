import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900/70 mt-12 py-6 text-center text-gray-400 text-sm border-t border-glass">
      <div className="space-y-3 mb-4">
        <p className="font-semibold text-gray-300">VRealm Game Zone</p>

        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span className="flex items-center gap-1">
            <FaPhoneAlt /> (+84) 904 262 833
          </span>
          <span className="flex items-center gap-1">
            <FaEnvelope /> nam.nh225213@sis.hust.edu.vn
          </span>
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt /> Hanoi University of Science and Technology
          </span>
        </div>
      </div>

      <p className="text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Designed & Developed by
        <span className="text-vr-blue-2 font-medium"> Nguyen Hoang Nam</span>
      </p>
    </footer>
  );
};

export default Footer;
