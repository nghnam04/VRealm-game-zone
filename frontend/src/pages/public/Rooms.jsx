import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomCard from "../../components/cards/RoomCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import roomService from "../../services/roomService";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  // Filter inputs
  const [showFilters, setShowFilters] = useState(false);
  const [statusInput, setStatusInput] = useState("");
  const [minCapacityInput, setMinCapacityInput] = useState("");
  const [maxCapacityInput, setMaxCapacityInput] = useState("");
  const [sortDirInput, setSortDirInput] = useState("asc");

  // Applied filters
  const [status, setStatus] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await roomService.getAllRooms({
          pageNo: page,
          pageSize: 9,
          sortBy: "id",
          sortDir,
          name: search || null,
          status: status || null,
          minCapacity: minCapacity || null,
          maxCapacity: maxCapacity || null,
        });

        setRooms(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi tải phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [page, search, status, minCapacity, maxCapacity, sortDir]);

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
    setStatusInput("");
    setMinCapacityInput("");
    setMaxCapacityInput("");
    setSortDirInput("asc");

    setStatus("");
    setMinCapacity("");
    setMaxCapacity("");
    setSortDir("asc");
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải danh sách phòng...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-400">
        Đã xảy ra lỗi: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <h2 className="text-5xl font-display font-bold text-white border-b border-vr-blue/50 pb-4">
        Hệ Thống Phòng VR
      </h2>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-white">
        <input
          type="text"
          placeholder="Nhập tên phòng..."
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full md:w-1/3"
        />
        <button
          onClick={() => {
            setSearch(inputSearch);
            setPage(0);
          }}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 hover:bg-vr-blue/20"
        >
          Tìm kiếm phòng
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 hover:bg-vr-blue/20"
        >
          Bộ lọc {showFilters ? "▲" : "▼"}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="relative p-4 bg-gray-900 border border-vr-blue/40 rounded-lg text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status */}
            <div className="flex items-center gap-4">
              <span className="w-28">Trạng thái</span>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1"
              >
                <option value="">Tất cả</option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="IN_USE">IN_USE</option>
                <option value="BOOKED">BOOKED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>

            {/* Capacity */}
            <div className="flex items-start gap-4">
              <span className="w-28 pt-1">Sức chứa (người)</span>
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minCapacityInput}
                  onChange={(e) => setMinCapacityInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxCapacityInput}
                  onChange={(e) => setMaxCapacityInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
              </div>
            </div>

            {/* Sort Direction */}
            <div className="flex items-center gap-4">
              <span className="w-28">Thứ tự</span>
              <select
                value={sortDirInput}
                onChange={(e) => setSortDirInput(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
          </div>

          {/* Apply & Reset Buttons */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => {
                setStatus(statusInput);
                setMinCapacity(minCapacityInput);
                setMaxCapacity(maxCapacityInput);
                setSortDir(sortDirInput);
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
      <div className="grid md:grid-cols-3 gap-8">
        {rooms.length ? (
          rooms.map((r) => <RoomCard key={r.id} room={r} />)
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            Không tìm thấy phòng phù hợp
          </p>
        )}
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

export default Rooms;
