import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import gameService from "../../services/gameService";
import roomService from "../../services/roomService";
import bookingService from "../../services/bookingService";
import BookingSlots from "../../components/customer/BookingSlots";
import formatCurrency from "../../components/utils/formatCurrency";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const BookingForm = () => {
  const { bookingId, gameId, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedGameId, setSelectedGameId] = useState(gameId || "");
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [numPlayers, setNumPlayers] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(!!bookingId);

  useEffect(() => {
    if (!bookingId) return;
    setLoadingBooking(true);
    bookingService
      .getBookingById(bookingId)
      .then((res) => {
        const b = res.data;
        setSelectedGameId(String(b.gameId));
        setSelectedRoomId(String(b.roomId));
        setDate(b.startTime.split("T")[0]);
        setSelectedSlot(b.startTime.split("T")[1].slice(0, 5));
        setNumPlayers(b.numberOfPlayers);
        setTotalAmount(b.totalAmount);
      })
      .finally(() => setLoadingBooking(false));
  }, [bookingId]);

  const { data: game, loading: gameLoading } = useFetch(
    selectedGameId ? () => gameService.getGameById(selectedGameId) : null,
    [selectedGameId]
  );

  const { data: room, loading: roomLoading } = useFetch(
    selectedRoomId ? () => roomService.getRoomById(selectedRoomId) : null,
    [selectedRoomId]
  );

  const { data: gamesPage, loading: gamesLoading } = useFetch(
    !gameId ? () => gameService.getAllGames({ pageNo: 0, pageSize: 50 }) : null,
    []
  );

  const { data: roomsPage, loading: roomsLoading } = useFetch(
    () => roomService.getAllRooms({ pageNo: 0, pageSize: 50 }),
    []
  );

  const games = gamesPage?.content || [];
  const rooms = roomsPage?.content || [];

  useEffect(() => {
    if (!game) return;
    setNumPlayers((prev) => Math.min(prev, game.maxPlayers));
    setTotalAmount(Math.round(game.price * numPlayers * (game.duration / 60)));
  }, [game, numPlayers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGameId || !selectedRoomId || !selectedSlot) {
      setError("Vui lòng chọn đầy đủ thông tin.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    const bookingData = {
      userId: user.id,
      gameId: Number(selectedGameId),
      roomId: Number(selectedRoomId),
      startTime: `${date}T${selectedSlot}:00`,
      numberOfPlayers: numPlayers,
      totalAmount,
    };

    try {
      bookingId
        ? await bookingService.updateBooking(bookingId, bookingData)
        : await bookingService.createBooking(bookingData);

      setSuccess(
        "Đặt phòng thành công! Đang quay về trang lịch sử đặt phòng..."
      );
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu đơn đặt phòng.");
    } finally {
      setSubmitting(false);
    }
  };

  if (
    loadingBooking ||
    gameLoading ||
    roomLoading ||
    roomsLoading ||
    (!gameId && gamesLoading)
  ) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang xử lý...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="card-base card-glow w-full max-w-2xl p-8 space-y-6"
      >
        <h2 className="text-4xl font-display text-center text-vr-blue mb-6">
          {bookingId ? "Cập Nhật Lịch Chơi Game" : "Đặt Lịch Chơi Game"}
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 text-green-400 p-3 rounded-lg text-center">
            {success}
          </div>
        )}

        {/* Game */}
        {!gameId && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chọn Game
            </label>
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="input-base"
              required
            >
              <option value="">-- Chọn game --</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {game && (
          <div className="p-4 border border-glass rounded-lg">
            <h3 className="text-2xl font-display text-vr-blue-2">
              {game.name}
            </h3>
            <p className="text-gray-400">
              {game.duration} phút | {formatCurrency(game.price)} |{" "}
              {game.maxPlayers} người chơi tối đa
            </p>
          </div>
        )}

        {/* Room */}
        {!roomId && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chọn Phòng
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="input-base"
              required
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {room && (
          <div className="p-4 border border-glass rounded-lg">
            <h3 className="text-2xl font-display text-vr-blue-2">
              {room.name}
            </h3>
            <p className="text-gray-400">
              {room.status} | Sức chứa {room.capacity} người
            </p>
          </div>
        )}

        {/* Date / Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-base"
            min={new Date().toISOString().split("T")[0]}
          />
          <input
            type="number"
            value={numPlayers}
            onChange={(e) =>
              setNumPlayers(
                Math.min(Number(e.target.value), game?.maxPlayers || 10)
              )
            }
            className="input-base"
            min="1"
            max={game?.maxPlayers || 10}
          />
        </div>

        <BookingSlots
          date={date}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />

        <div className="border-t border-glass pt-6 space-y-4">
          <div className="flex justify-between text-2xl font-bold">
            <span className="text-gray-300">TỔNG CỘNG:</span>
            <span className="text-vr-blue-2">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <button
            type="submit"
            className="btn-primary w-full text-lg"
            disabled={submitting}
          >
            {submitting
              ? "Đang xử lý..."
              : bookingId
              ? "Cập Nhật Lịch"
              : "Xác Nhận Đặt Lịch"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
