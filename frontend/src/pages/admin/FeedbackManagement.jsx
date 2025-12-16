import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import formatTime from "../../components/utils/formatTime";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/feedbacks");
      setFeedbacks(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Xác nhận xóa phản hồi ID ${id}?`)) return;

    try {
      await axiosInstance.delete(`/feedbacks/${id}`);
      await fetchFeedbacks();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(
        "Xóa phản hồi không thành công! Kiểm tra server hoặc quyền truy cập."
      );
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải chi tiết phản hồi...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-display text-white mb-6">
        Quản lý Phản hồi ({feedbacks.length})
      </h2>

      <div className="overflow-x-auto card-base p-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Đánh giá
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Nội dung
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs text-gray-300 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {feedbacks.map((f) => (
              <tr key={f.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm text-gray-400">{f.id}</td>
                <td className="px-6 py-4 text-sm text-white">
                  {f.userName || "Người ẩn danh"}
                </td>
                <td className="px-6 py-4 text-sm text-blue-400">
                  {f.bookingId}
                </td>
                <td className="px-6 py-4 text-sm text-yellow-400 flex items-center mt-3">
                  {f.rating}⭐
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs break-words whitespace-normal">
                  {f.comment}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatTime(f.feedbackDate)}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackManagement;
