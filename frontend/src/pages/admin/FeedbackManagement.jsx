import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import formatTime from "../../components/utils/formatTime";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  // Search
  const [searchField, setSearchField] = useState("gameName"); // gameName | roomName
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [minRatingInput, setMinRatingInput] = useState("");
  const [maxRatingInput, setMaxRatingInput] = useState("");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");

  // Applied filters
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = {
        pageNo: page,
        pageSize,
        minRating: minRating || null,
        maxRating: maxRating || null,
        fromDate: fromDate || null,
        toDate: toDate || null,
      };
      if (search) params[searchField] = search;

      const res = await axiosInstance.get("/feedbacks", { params });
      setFeedbacks(res.data.content || res.data || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalFeedbacks(res.data.totalElements || res.data?.length || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải phản hồi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, search, searchField, minRating, maxRating, fromDate, toDate]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Xác nhận xóa phản hồi ID ${id}?`)) return;
    try {
      await axiosInstance.delete(`/feedbacks/${id}`);
      fetchFeedbacks();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(
        "Xóa phản hồi không thành công! Kiểm tra server hoặc quyền truy cập."
      );
    }
  };

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
    setSearchField("gameName");
    setMinRating("");
    setMaxRating("");
    setMinRatingInput("");
    setMaxRatingInput("");
    setFromDate("");
    setToDate("");
    setFromDateInput("");
    setToDateInput("");
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <LoadingSpinner />
        <span>Đang tải chi tiết phản hồi...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-400">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-display text-white mb-6">
        Quản lý Phản hồi ({totalFeedbacks})
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-white mb-4">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
        >
          <option value="gameName">Tên Game</option>
          <option value="roomName">Tên Phòng</option>
        </select>

        <input
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          placeholder="Nhập từ khóa tìm kiếm..."
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full md:w-1/3"
        />

        <button
          onClick={() => {
            setSearch(inputSearch);
            setPage(0);
          }}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
        >
          Tìm kiếm
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
        >
          Bộ lọc {showFilters ? "▲" : "▼"}
        </button>
      </div>

      {showFilters && (
        <div className="relative p-4 bg-gray-900 border border-vr-blue/40 rounded-lg text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rating */}
            <div className="flex flex-col">
              <label className="mb-1">Rating</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minRatingInput}
                  onChange={(e) => setMinRatingInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1 min-w-0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxRatingInput}
                  onChange={(e) => setMaxRatingInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1 min-w-0"
                />
              </div>
            </div>

            {/* From Date */}
            <div className="flex flex-col">
              <label className="mb-1">Từ ngày</label>
              <input
                type="date"
                value={fromDateInput}
                onChange={(e) => setFromDateInput(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 text-white w-full"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col">
              <label className="mb-1">Đến ngày</label>
              <input
                type="date"
                value={toDateInput}
                onChange={(e) => setToDateInput(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 text-white w-full"
              />
            </div>
          </div>

          {/* Apply & Reset Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => {
                setMinRating(minRatingInput);
                setMaxRating(maxRatingInput);
                setFromDate(fromDateInput);
                setToDate(toDateInput);
                setPage(0);
              }}
              className="px-4 py-2 rounded-lg btn-primary hover:bg-vr-blue-500/50"
            >
              Lọc
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-500/50"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Table */}
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
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Phòng
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
                <td className="px-6 py-4 text-sm text-cyan-400">
                  {f.gameName}
                </td>
                <td className="px-6 py-4 text-sm text-amber-700">
                  {f.roomName}
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 text-white">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded-lg border border-vr-blue/40 ${
            page === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-cyan-500"
          }`}
        >
          Trang trước
        </button>
        <span>
          Trang <strong>{page + 1}</strong> / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded-lg border border-vr-blue/40 ${
            page + 1 >= totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-cyan-500"
          }`}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default FeedbackManagement;
