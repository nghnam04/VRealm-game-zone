import formatTime from "../utils/formatTime";
import getRatingStars from "../utils/getRatingStars";

const FeedbackCard = ({ feedback }) => (
  <div className="card-base card-glow border-vr-blue/20">
    <div className="flex justify-between items-start mb-2">
      <span className="text-yellow-400 text-lg">
        {getRatingStars(feedback.rating)}
      </span>
      <span className="text-sm text-gray-500">
        {formatTime(feedback.feedbackDate)}
      </span>
    </div>
    <p className="text-gray-300 italic mb-3">"{feedback.comment}"</p>
    <p className="text-sm text-vr-blue font-semibold">
      Người dùng: {feedback.userName || "Ẩn danh"}
    </p>
  </div>
);

export default FeedbackCard;
