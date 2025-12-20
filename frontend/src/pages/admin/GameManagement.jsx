import { useState, useEffect } from "react";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import axiosInstance from "../../api/axios";
import GameForm from "../../components/admin/GameForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import formatCurrency from "../../components/utils/formatCurrency";

const getTypeBadge = (genre) => {
  switch (genre?.toUpperCase()) {
    case "SPORTS":
      return "bg-green-500/30 text-green-400 border-green-500";
    case "PUZZLE":
      return "bg-yellow-500/30 text-yellow-400 border-yellow-500";
    case "HORROR":
      return "bg-red-500/30 text-red-400 border-red-500";
    case "ADVENTURE":
      return "bg-blue-500/30 text-blue-400 border-blue-500";
    case "ACTION":
      return "bg-pink-500/30 text-pink-400 border-pink-500";
    case "SIMULATION":
      return "bg-purple-500/30 text-purple-400 border-purple-500";
    case "RACING":
      return "bg-orange-500/30 text-orange-400 border-orange-500";
    default:
      return "bg-gray-500/30 text-gray-400 border-gray-500";
  }
};

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fetchError, setFetchError] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  // Search
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  // Filter inputs
  const [showFilters, setShowFilters] = useState(false);
  const [genreInput, setGenreInput] = useState("");
  const [minPlayersInput, setMinPlayersInput] = useState("");
  const [maxPlayersInput, setMaxPlayersInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [sortDirInput, setSortDirInput] = useState("asc");

  // Applied filters
  const [genre, setGenre] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const gamesRes = await axiosInstance.get("/games", {
        params: {
          pageNo: page,
          pageSize,
          name: search || null,
          genre: genre || null,
          minPlayers: minPlayers || null,
          maxPlayers: maxPlayers || null,
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          sortDir,
        },
      });

      const roomsRes = await axiosInstance.get("/rooms");

      const gamesWithRoomNames = gamesRes.data.content.map((g) => ({
        ...g,
        roomNames: g.roomNames || [],
      }));

      setGames(gamesWithRoomNames);
      setAllRooms(roomsRes.data);
      setTotalPages(gamesRes.data.totalPages);
      setTotalGames(gamesRes.data.totalElements);
      setFetchError("");
    } catch (err) {
      console.error(err);
      setFetchError("Không thể tải danh sách game hoặc phòng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [
    page,
    genre,
    search,
    minPlayers,
    maxPlayers,
    minPrice,
    maxPrice,
    sortDir,
  ]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa game ID: ${id}?`)) return;
    try {
      await axiosInstance.delete(`/games/${id}`);
      fetchAll();
    } catch (err) {
      alert("Lỗi khi xóa game. Game có thể đang được đặt.");
      console.error(err);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) await axiosInstance.put(`/games/${editing.id}`, data);
      else await axiosInstance.post("/games", data);

      setFormVisible(false);
      setEditing(null);
      fetchAll();
    } catch (err) {
      alert("Lỗi khi lưu game!");
      console.error(err);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
    setGenreInput("");
    setMinPlayersInput("");
    setMaxPlayersInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSortDirInput("asc");

    setGenre("");
    setMinPlayers("");
    setMaxPlayers("");
    setMinPrice("");
    setMaxPrice("");
    setSortDir("asc");
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải chi tiết game...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-display text-white mb-6">
        Quản lý Game ({totalGames})
      </h2>

      {fetchError && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded mb-4">
          {fetchError}
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Nhập tên game..."
            className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full md:w-1/3"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
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
            <PlusCircle size={18} className="mr-2" /> Tạo Game Mới
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="relative p-4 bg-gray-900 border border-vr-blue/40 rounded-lg text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-2">
                <span className="w-28">Thể loại</span>
                <select
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1"
                >
                  <option value="">Tất cả</option>
                  <option value="ACTION">ACTION</option>
                  <option value="ADVENTURE">ADVENTURE</option>
                  <option value="HORROR">HORROR</option>
                  <option value="PUZZLE">PUZZLE</option>
                  <option value="RACING">RACING</option>
                  <option value="SPORTS">SPORTS</option>
                  <option value="SIMULATION">SIMULATION</option>
                </select>
              </div>

              {/* Players */}
              <div className="flex items-start gap-2">
                <span className="w-25 pt-1">Số người chơi</span>
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPlayersInput}
                    onChange={(e) => setMinPlayersInput(e.target.value)}
                    className="px-4 py-2 w-3/4 rounded-lg bg-gray-800 border border-vr-blue/40"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPlayersInput}
                    onChange={(e) => setMaxPlayersInput(e.target.value)}
                    className="px-4 py-2 w-3/4 rounded-lg bg-gray-800 border border-vr-blue/40"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-2">
                <span className="w-25 pt-1">Giá tiền (nghìn đồng)</span>
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="px-4 py-2 w-3/4 rounded-lg bg-gray-800 border border-vr-blue/40"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="px-4 py-2 w-3/4 rounded-lg bg-gray-800 border border-vr-blue/40"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
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
                  setGenre(genreInput);
                  setMinPlayers(minPlayersInput);
                  setMaxPlayers(maxPlayersInput);
                  setMinPrice(minPriceInput);
                  setMaxPrice(maxPriceInput);
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
                Tên Game
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Số người tối đa
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Thể loại
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Phòng
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Giá thuê/người/giờ
              </th>
              <th className="px-6 py-3 text-right text-xs text-gray-300 uppercase">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {games.map((g) => (
              <tr
                key={g.id}
                className="hover:bg-gray-700/50 transition duration-150"
              >
                <td className="px-6 py-4 text-gray-400">{g.id}</td>
                <td className="px-6 py-4 text-white font-medium">{g.name}</td>
                <td className="px-6 py-4 text-gray-400">{g.maxPlayers}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadge(
                      g.genre
                    )}`}
                  >
                    {g.genre}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs text-sm text-yellow-400 truncate">
                  {g.roomNames.join(", ")}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-400">
                  {formatCurrency(g.price)}
                </td>
                <td className="flex px-6 py-4 text-right text-sm font-medium space-x-3">
                  <button
                    className="text-indigo-400 hover:text-indigo-300"
                    onClick={() => {
                      setEditing(g);
                      setFormVisible(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(g.id)}
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

      <GameForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
        allRooms={allRooms}
      />
    </>
  );
};

export default GameManagement;
