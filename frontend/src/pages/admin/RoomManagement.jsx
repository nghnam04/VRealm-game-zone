import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import RoomForm from "../../components/admin/RoomForm";
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
    case "BOOKED":
      return "bg-blue-500/30 text-blue-300";
    default:
      return "bg-gray-500/30 text-gray-300";
  }
};

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);

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

  const fetchAll = async () => {
    setLoading(true);
    try {
      const roomsRes = await axiosInstance.get("/rooms", {
        params: {
          pageNo: page,
          pageSize,
          name: search || null,
          status: status || null,
          minCapacity: minCapacity || null,
          maxCapacity: maxCapacity || null,
          sortDir,
        },
      });

      const gamesRes = await axiosInstance.get("/games");

      const roomsWithGameNames = roomsRes.data.content.map((r) => ({
        ...r,
        gameNames: r.gameNames || [],
        deviceNames: r.deviceNames || [],
      }));

      setRooms(roomsWithGameNames);
      setAllGames(gamesRes.data);
      setTotalPages(roomsRes.data.totalPages);
      setTotalRooms(roomsRes.data.totalElements);
    } catch (err) {
      alert("Không thể tải danh sách phòng hoặc game");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [page, search, status, minCapacity, maxCapacity, sortDir]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa Room ID: ${id}?`)) return;
    try {
      await axiosInstance.delete(`/rooms/${id}`);
      fetchAll();
    } catch (err) {
      alert("Lỗi khi xóa phòng. Phòng có thể đang được đặt.");
      console.error(err);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) await axiosInstance.put(`/rooms/${editing.id}`, data);
      else await axiosInstance.post("/rooms", data);
      setFormVisible(false);
      setEditing(null);
      fetchAll();
    } catch (err) {
      alert("Lỗi khi lưu phòng!");
      console.error(err);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
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
          <span>Đang tải chi tiết phòng...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-display text-white mb-6">
        Quản lý Phòng ({totalRooms})
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
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
            Tìm kiếm
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 hover:bg-vr-blue/20 ml-auto"
          >
            Bộ lọc {showFilters ? "▲" : "▼"}
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setFormVisible(true);
            }}
            className="btn-primary flex items-center ml-2"
          >
            <PlusCircle size={18} className="mr-2" /> Tạo Phòng Mới
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-900 border border-vr-blue/40 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div className="flex items-start gap-4">
                <span className="w-28 pt-1">Sức chứa</span>
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

              <div className="flex items-center gap-4">
                <span className="w-28 ml-4">Thứ tự</span>
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

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setStatus(statusInput);
                  setMinCapacity(minCapacityInput);
                  setMaxCapacity(maxCapacityInput);
                  setSortDir(sortDirInput);
                  setPage(0);
                }}
                className="px-4 py-2 rounded-lg btn-primary"
              >
                Lọc
              </button>
              <button
                onClick={() => {
                  resetFilters();
                }}
                className="px-4 py-2 rounded-lg bg-red-800"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto card-base p-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Tên Phòng
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Sức chứa
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Game hiện có
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Thiết bị hỗ trợ
              </th>
              <th className="px-6 py-3 text-right text-xs text-gray-300 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rooms.map((r) => (
              <tr key={r.id} className="hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 text-gray-400">{r.id}</td>
                <td className="px-6 py-4 text-white font-medium">{r.name}</td>
                <td className="px-6 py-4 text-gray-400">{r.capacity}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 text-xs rounded-full ${getStatusBadge(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-green-500 truncate">
                  {r.gameNames?.join(", ")}
                </td>
                <td className="px-6 py-4 text-sm text-blue-500 truncate">
                  {r.deviceNames?.join(", ")}
                </td>
                <td className="flex px-6 py-4 justify-end gap-3">
                  <button
                    className="text-indigo-400 hover:text-indigo-300"
                    onClick={() => {
                      setEditing(r);
                      setFormVisible(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(r.id)}
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

      <RoomForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
        allGames={allGames}
      />
    </div>
  );
};

export default RoomManagement;
