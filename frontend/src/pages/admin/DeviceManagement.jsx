import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import DeviceForm from "../../components/admin/DeviceForm";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const getStatusBadge = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-500/30 text-green-300";
    case "IN_USE":
      return "bg-yellow-500/30 text-yellow-300";
    case "MAINTENANCE":
      return "bg-red-500/30 text-red-300";
    default:
      return "bg-gray-500/30 text-gray-300";
  }
};

const getTypeBadge = (type) => {
  switch (type) {
    case "HEADSET":
      return "text-cyan-300";
    case "CONTROLLER":
      return "text-indigo-300";
    case "HEADPHONE":
      return "text-pink-300";
    case "SENSOR":
      return "text-yellow-300";
    case "CAMERA":
      return "text-orange-300";
    case "MICROPHONE":
      return "text-lime-300";
    default:
      return "text-gray-300";
  }
};

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);

  // Search
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("name");

  // Filter input
  const [showFilters, setShowFilters] = useState(false);
  const [typeInput, setTypeInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [minQuantityInput, setMinQuantityInput] = useState("");
  const [maxQuantityInput, setMaxQuantityInput] = useState("");
  const [sortDirInput, setSortDirInput] = useState("asc");

  // Applied filter
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const [devicesRes, roomsRes] = await Promise.all([
        axiosInstance.get("/devices", {
          params: {
            pageNo: page,
            pageSize: 10,
            sortBy: "id",
            sortDir,
            type: type || null,
            status: status || null,
            minQuantity: minQuantity || null,
            maxQuantity: maxQuantity || null,
            [searchField]: search || null,
          },
        }),
        axiosInstance.get("/rooms"),
      ]);

      setDevices(devicesRes.data.content || []);
      setTotalPages(devicesRes.data.totalPages || 0);
      setTotalDevices(devicesRes.data.totalElements || 0);
      setRooms(roomsRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách thiết bị.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thiết bị ID: ${id}?`))
      return;
    try {
      await axiosInstance.delete(`/devices/${id}`);
      fetchDevices();
    } catch {
      alert("Chỉ xóa được thiết bị có trạng thái AVAILABLE.");
    }
  };

  const handleSave = async (payload) => {
    try {
      if (editing) await axiosInstance.put(`/devices/${editing.id}`, payload);
      else await axiosInstance.post("/devices", payload);

      setFormVisible(false);
      setEditing(null);
      fetchDevices();
    } catch {
      alert("Chỉ thiết bị AVAILABLE mới có thể chỉnh sửa.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải chi tiết thiết bị...</span>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="text-red-400 p-4 bg-red-900/30 rounded">{error}</div>
    );

  return (
    <div>
      <h2 className="text-3xl font-display text-white mb-6">
        Quản lý Thiết bị ({totalDevices})
      </h2>

      {/* Search + Actions */}
      <div className="flex flex-col md:flex-row items-center gap-3 text-white mb-4">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
        >
          <option value="name">Tên thiết bị</option>
          <option value="roomName">Tên phòng</option>
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
          className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 hover:bg-vr-blue/20 ml-auto"
        >
          Bộ lọc {showFilters ? "▲" : "▼"}
        </button>

        {/* ✅ NÚT THÊM THIẾT BỊ */}
        <button
          onClick={() => {
            setEditing(null);
            setFormVisible(true);
          }}
          className="btn-primary flex items-center ml-2"
        >
          <PlusCircle size={18} className="mr-2" />
          Thêm thiết bị
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="relative p-4 bg-gray-900 border border-vr-blue/40 rounded-lg text-white mb-4">
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
                <option value="IN_USE">IN_USE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="flex items-start gap-4">
              <span className="w-28 pt-8">Số lượng</span>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
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

            {/* Sort */}
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

          {/* Apply & Reset */}
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

      {/* Table */}
      <div className="overflow-x-auto card-base p-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Phòng
              </th>
              <th className="px-6 py-3 text-right text-xs text-gray-300 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {devices.map((d) => (
              <tr key={d.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-gray-400">{d.id}</td>
                <td className="px-6 py-4 text-white">{d.name}</td>
                <td
                  className={`px-6 py-4 font-semibold ${getTypeBadge(d.type)}`}
                >
                  {d.type}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(
                      d.status
                    )}`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{d.quantity}</td>
                <td className="px-6 py-4 text-yellow-300">
                  {d.roomName || "Chưa gắn phòng"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setEditing(d);
                        setFormVisible(true);
                      }}
                      className="text-indigo-400 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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

      <DeviceForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
        rooms={rooms}
      />
    </div>
  );
};

export default DeviceManagement;
