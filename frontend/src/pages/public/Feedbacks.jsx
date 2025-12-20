import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeedbackCard from "../../components/cards/FeedbackCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import feedbackService from "../../services/feedBackService";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search
  const [searchField, setSearchField] = useState("gameName"); // gameName | roomName
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  // Filter inputs
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

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const params = {
          pageNo: page,
          pageSize: 8,
          minRating: minRating || null,
          maxRating: maxRating || null,
          fromDate: fromDate || null,
          toDate: toDate || null,
        };
        if (search) params[searchField] = search;

        const res = await feedbackService.getAllFeedbacks(params);
        setFeedbacks(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setError(null);
      } catch (err) {
        setError("Không thể tải phản hồi");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [page, search, searchField, minRating, maxRating, fromDate, toDate]);

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
        <span>Đang tải phản hồi khách hàng...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-400">{error}</div>;
  }

  return (
    <motion.div className="space-y-8">
      <h2 className="text-5xl font-display font-bold text-white border-b border-vr-blue/50 pb-4">
        Phản Hồi Khách Hàng
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-white">
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {feedbacks.map((f) => (
          <FeedbackCard key={f.id} feedback={f} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 text-white">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
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
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded-lg border border-vr-blue/40 ${
            page + 1 >= totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-cyan-500"
          }`}
        >
          Trang sau
        </button>
      </div>
    </motion.div>
  );
};

export default Feedbacks;
