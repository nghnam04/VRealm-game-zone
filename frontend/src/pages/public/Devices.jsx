import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DeviceCard from "../../components/cards/DeviceCard";
import deviceService from "../../services/deviceService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("name");

  // Filter inputs
  const [showFilters, setShowFilters] = useState(false);
  const [typeInput, setTypeInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [minQuantityInput, setMinQuantityInput] = useState("");
  const [maxQuantityInput, setMaxQuantityInput] = useState("");
  const [sortDirInput, setSortDirInput] = useState("asc");

  // Applied filters
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const res = await deviceService.getAllDevices({
          pageNo: page,
          pageSize: 9,
          sortBy: "id",
          sortDir: sortDir,
          type: type || null,
          status: status || null,
          [searchField]: search || null,
          minQuantity: minQuantity || null,
          maxQuantity: maxQuantity || null,
        });

        setDevices(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Lỗi tải thiết bị"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [page, search, type, status, minQuantity, maxQuantity, sortDir]);

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
    setTypeInput("");
    setStatusInput("");
    setMinQuantityInput("");
    setMaxQuantityInput("");
    setSortDirInput("asc");
    setType("");
    setStatus("");
    setMinQuantity("");
    setMaxQuantity("");
    setSortDir("asc");
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <LoadingSpinner />
        <span>Đang tải danh sách thiết bị...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-400">
        Lỗi khi tải dữ liệu: {error}
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
        Danh Sách Thiết Bị VR
      </h2>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-white">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
        >
          <option value="name">Tên thiết bị</option>
          <option value="roomName">Tên phòng chứa</option>
        </select>

        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
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
          Tìm kiếm
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
            {/* Type */}
            <div className="flex items-center gap-4">
              <span className="w-28">Loại</span>
              <select
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1"
              >
                <option value="">Tất cả</option>
                <option value="HEADSET">HEADSET</option>
                <option value="CONTROLLER">CONTROLLER</option>
                <option value="HEADPHONE">HEADPHONE</option>
                <option value="SENSOR">SENSOR</option>
                <option value="CAMERA">CAMERA</option>
                <option value="MICROPHONE">MICROPHONE</option>
              </select>
            </div>

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
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="IN_USE">IN_USE</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="flex items-start gap-4">
              <span className="w-28 pt-1">Số lượng</span>
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minQuantityInput}
                  onChange={(e) => setMinQuantityInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxQuantityInput}
                  onChange={(e) => setMaxQuantityInput(e.target.value)}
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
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => {
                setType(typeInput);
                setStatus(statusInput);
                setMinQuantity(minQuantityInput);
                setMaxQuantity(maxQuantityInput);
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

      {/* Devices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {devices.length ? (
          devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            Không tìm thấy thiết bị phù hợp
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

export default Devices;
