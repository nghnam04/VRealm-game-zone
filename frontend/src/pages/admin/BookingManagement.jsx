import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import BookingItem from "../../components/admin/BookingItem";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  // Search
  const [searchField, setSearchField] = useState("userName");
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  // Filter inputs
  const [showFilters, setShowFilters] = useState(false);
  const [minGameDurationInput, setMinGameDurationInput] = useState("");
  const [maxGameDurationInput, setMaxGameDurationInput] = useState("");
  const [minPlayersInput, setMinPlayersInput] = useState("");
  const [maxPlayersInput, setMaxPlayersInput] = useState("");
  const [minTotalAmountInput, setMinTotalAmountInput] = useState("");
  const [maxTotalAmountInput, setMaxTotalAmountInput] = useState("");
  const [minStartTimeInput, setMinStartTimeInput] = useState("");
  const [maxStartTimeInput, setMaxStartTimeInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [paymentStatusInput, setPaymentStatusInput] = useState("");

  // Applied filters
  const [minGameDuration, setMinGameDuration] = useState("");
  const [maxGameDuration, setMaxGameDuration] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [minTotalAmount, setMinTotalAmount] = useState("");
  const [maxTotalAmount, setMaxTotalAmount] = useState("");
  const [minStartTime, setMinStartTime] = useState("");
  const [maxStartTime, setMaxStartTime] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {
        pageNo: page,
        pageSize,
        minGameDuration: minGameDuration || null,
        maxGameDuration: maxGameDuration || null,
        minPlayers: minPlayers || null,
        maxPlayers: maxPlayers || null,
        minTotalAmount: minTotalAmount || null,
        maxTotalAmount: maxTotalAmount || null,
        minStartTime: minStartTime || null,
        maxStartTime: maxStartTime || null,
        status: status || null,
        paymentStatus: paymentStatus || null,
      };
      if (search) params[searchField] = search;

      const res = await axiosInstance.get("/bookings", { params });
      setBookings(res.data.content || res.data || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalBookings(res.data.totalElements || res.data?.length || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách Đặt phòng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [
    page,
    search,
    searchField,
    minGameDuration,
    maxGameDuration,
    minPlayers,
    maxPlayers,
    minTotalAmount,
    maxTotalAmount,
    minStartTime,
    maxStartTime,
    status,
    paymentStatus,
  ]);

  const handleAction = async (bookingId, action, endpoint) => {
    const actionName = action === "accept" ? "Duyệt" : "Hủy";
    if (
      !window.confirm(
        `Bạn có chắc muốn ${actionName} Booking ID: ${bookingId}?`
      )
    )
      return;

    try {
      await axiosInstance.patch(`/bookings/${bookingId}/${endpoint}`);
      alert(`${actionName} Booking thành công!`);
      fetchBookings();
    } catch (err) {
      alert(`Lỗi khi ${actionName.toLowerCase()} Booking.`);
      console.error(`Lỗi ${actionName.toLowerCase()} Booking:`, err);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa Booking ID: ${bookingId}?`))
      return;

    try {
      await axiosInstance.delete(`/bookings/${bookingId}`);
      alert("Xóa Booking thành công!");
      fetchBookings();
    } catch (err) {
      alert(
        "Lỗi khi xóa Booking. Không thể xóa Booking ACCEPTED có trạng thái thanh toán PAID."
      );
      console.error("Lỗi xóa Booking:", err);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
    setSearchField("userName");

    setMinGameDuration("");
    setMaxGameDuration("");
    setMinPlayers("");
    setMaxPlayers("");
    setMinTotalAmount("");
    setMaxTotalAmount("");
    setMinStartTime("");
    setMaxStartTime("");
    setStatus("");
    setPaymentStatus("");

    setMinGameDurationInput("");
    setMaxGameDurationInput("");
    setMinPlayersInput("");
    setMaxPlayersInput("");
    setMinTotalAmountInput("");
    setMaxTotalAmountInput("");
    setMinStartTimeInput("");
    setMaxStartTimeInput("");
    setStatusInput("");
    setPaymentStatusInput("");

    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải chi tiết đơn đặt phòng...</span>
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
        Quản lý Đặt phòng ({totalBookings})
      </h2>

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
          >
            <option value="userName">Khách hàng</option>
            <option value="gameName">Game</option>
            <option value="roomName">Phòng</option>
          </select>

          <input
            type="text"
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
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="relative p-4 bg-gray-900 border border-vr-blue/40 rounded-lg text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Status */}
              <div className="flex flex-col">
                <label>Trạng thái</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                >
                  <option value="">Tất cả</option>
                  <option value="PENDING">PENDING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="flex flex-col">
                <label>Thanh toán</label>
                <select
                  value={paymentStatusInput}
                  onChange={(e) => setPaymentStatusInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                >
                  <option value="">Tất cả</option>
                  <option value="PAID">PAID</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </div>

              {/* Game Duration */}
              <div className="flex flex-col">
                <label>Thời lượng chơi (phút)</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minGameDurationInput}
                    onChange={(e) => setMinGameDurationInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxGameDurationInput}
                    onChange={(e) => setMaxGameDurationInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-col">
                <label>Ngày chơi</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="date"
                    value={minStartTimeInput}
                    onChange={(e) => setMinStartTimeInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                  <input
                    type="date"
                    value={maxStartTimeInput}
                    onChange={(e) => setMaxStartTimeInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                </div>
              </div>

              {/* Players */}
              <div className="flex flex-col">
                <label>Số người chơi</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPlayersInput}
                    onChange={(e) => setMinPlayersInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPlayersInput}
                    onChange={(e) => setMaxPlayersInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex flex-col">
                <label>Tổng tiền (nghìn đồng)</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minTotalAmountInput}
                    onChange={(e) => setMinTotalAmountInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxTotalAmountInput}
                    onChange={(e) => setMaxTotalAmountInput(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 flex-wrap mt-4">
              <button
                onClick={() => {
                  setMinGameDuration(minGameDurationInput);
                  setMaxGameDuration(maxGameDurationInput);
                  setMinPlayers(minPlayersInput);
                  setMaxPlayers(maxPlayersInput);
                  setMinTotalAmount(minTotalAmountInput);
                  setMaxTotalAmount(maxTotalAmountInput);
                  setMinStartTime(minStartTimeInput);
                  setMaxStartTime(maxStartTimeInput);
                  setStatus(statusInput);
                  setPaymentStatus(paymentStatusInput);
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Game
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Phòng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Thanh toán
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {bookings.map((b) => (
              <BookingItem
                key={b.id}
                booking={b}
                handleAction={handleAction}
                handleDelete={handleDelete}
              />
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
    </div>
  );
};

export default BookingManagement;
