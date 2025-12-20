import { motion } from "framer-motion";
import getRatingStars from "../utils/getRatingStars";

const ReviewCard = ({ feedback }) => (
  <motion.div
    className="card-base p-6 border border-vr-blue/30 backdrop-blur-md"
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-4">
      <div className="text-yellow-400 text-lg">
        {getRatingStars(feedback.rating)}
      </div>

      <p className="ml-3 text-sm text-gray-400">
        Bởi:{" "}
        <span className="font-medium text-gray-200">
          {feedback.userName || "Người ẩn danh"}
        </span>
      </p>
    </div>
    <p className="text-sm text-white font-semibold mb-3">
      {feedback.gameName}
    </p>
    <p className="text-gray-200 italic">"{feedback.comment}"</p>
  </motion.div>
);

export default ReviewCard;
