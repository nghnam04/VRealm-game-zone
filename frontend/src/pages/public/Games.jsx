import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GameCard from "../../components/cards/GameCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import gameService from "../../services/gameService";

const Games = () => {
  const [games, setGames] = useState([]);
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
  const [genreInput, setGenreInput] = useState("");
  const [minDurationInput, setMinDurationInput] = useState("");
  const [maxDurationInput, setMaxDurationInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [minPlayersInput, setMinPlayersInput] = useState("");
  const [maxPlayersInput, setMaxPlayersInput] = useState("");
  const [sortDirInput, setSortDirInput] = useState("asc");

  // Applied filters
  const [genre, setGenre] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await gameService.getAllGames({
          pageNo: page,
          pageSize: 9,
          sortBy: "id",
          sortDir: sortDir,
          genre: genre || null,
          name: search || null,
          minDuration: minDuration || null,
          maxDuration: maxDuration || null,
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          minPlayers: minPlayers || null,
          maxPlayers: maxPlayers || null,
        });

        setGames(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Lỗi tải game");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [
    page,
    genre,
    search,
    minDuration,
    maxDuration,
    minPrice,
    maxPrice,
    minPlayers,
    maxPlayers,
    sortDir,
  ]);

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
    setGenreInput("");
    setMinDurationInput("");
    setMaxDurationInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinPlayersInput("");
    setMaxPlayersInput("");
    setSortDirInput("asc");
    setGenre("");
    setMinDuration("");
    setMaxDuration("");
    setMinPrice("");
    setMaxPrice("");
    setMinPlayers("");
    setMaxPlayers("");
    setSortDir("asc");
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải thư viện game...</span>
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
        Thư Viện Game
      </h2>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-white">
        <input
          type="text"
          placeholder="Nhập tên game..."
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
          Tìm kiếm game
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
            {/* Genre */}
            <div className="flex items-center gap-4">
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

            {/* Duration */}
            <div className="flex items-start gap-4">
              <span className="w-28 pt-1">Thời lượng (phút)</span>
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minDurationInput}
                  onChange={(e) => setMinDurationInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxDurationInput}
                  onChange={(e) => setMaxDurationInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-start gap-4">
              <span className="w-28 pt-1">Giá tiền (nghìn đồng)</span>
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
              </div>
            </div>

            {/* Players */}
            <div className="flex items-start gap-4">
              <span className="w-28 pt-1">Số người chơi</span>
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPlayersInput}
                  onChange={(e) => setMinPlayersInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPlayersInput}
                  onChange={(e) => setMaxPlayersInput(e.target.value)}
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
                setGenre(genreInput);
                setMinDuration(minDurationInput);
                setMaxDuration(maxDurationInput);
                setMinPrice(minPriceInput);
                setMaxPrice(maxPriceInput);
                setMinPlayers(minPlayersInput);
                setMaxPlayers(maxPlayersInput);
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

      {/* Games List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {games.length ? (
          games.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            Không tìm thấy game phù hợp
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

export default Games;
