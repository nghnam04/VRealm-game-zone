import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import gameService from "../../services/gameService";
import feedbackService from "../../services/feedBackService";
import GameCard from "../../components/cards/GameCard";
import SectionHeading from "../../components/common/SectionHeading";
import ReviewCard from "../../components/cards/ReviewCard";
import FAQItem from "../../components/common/FAQItem";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import bgImage from "../../assets/vrgame-bg.jpg";
import bgImage1 from "../../assets/vrgame-bg1.jpg";
import bgImage2 from "../../assets/vrgame-bg2.jpg";
import bgImage3 from "../../assets/vrgame-bg3.jpg";
import deviceImage from "../../assets/devices.jpg";
import roomImage from "../../assets/rooms.jpg";

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);

  const bgImages = [bgImage3, bgImage, bgImage1, bgImage2];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchGamesAndReviews = async () => {
      try {
        const gameResponse = await gameService.getAllGames({
          pageNo: 0,
          pageSize: 30,
        });
        const games = Array.isArray(gameResponse.data.content)
          ? gameResponse.data.content
          : [];
        const shuffledGames = games.sort(() => 0.5 - Math.random()).slice(0, 9);
        setFeaturedGames(shuffledGames);

        const feedbackResponse = await feedbackService.getAllFeedbacks({
          pageNo: 0,
          pageSize: 30,
        });
        const allFeedbacks = Array.isArray(feedbackResponse.data.content)
          ? feedbackResponse.data.content
          : [];

        const shuffledFeedbacks = allFeedbacks
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        setReviews(shuffledFeedbacks);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFeaturedGames([]);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGamesAndReviews();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="h-[80vh] min-h-[500px] relative flex items-center justify-center text-center rounded-2xl overflow-hidden p-6">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {bgImages.map((img, i) => {
            const isCurrent = i === bgIndex;
            const isNext = i === (bgIndex + 1) % bgImages.length;
            if (!isCurrent && !isNext) return null;

            return (
              <motion.div
                key={i}
                initial={{ x: isCurrent ? 0 : "100%" }}
                animate={{ x: isCurrent ? "-100%" : 0 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 w-full flex justify-center gap-3 z-20">
          {bgImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setBgIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                bgIndex === i
                  ? "bg-white scale-125"
                  : "bg-gray-500 hover:bg-gray-300"
              }`}
            ></button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-display font-extrabold text-white mb-4 leading-tight">
            <span className="text-vr-blue">BE VREALM</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Cảm nhận thế giới ảo sống động trong từng khoảnh khắc
          </p>
          <Link
            to="/games"
            className="btn-primary text-lg px-8 py-3 transform hover:scale-105"
          >
            Khám Phá Ngay
          </Link>
        </motion.div>
      </section>

      {/* Game nổi bật */}
      <section>
        <SectionHeading>Game Nổi Bật</SectionHeading>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-3 py-4 text-gray-300">
              <LoadingSpinner />
              <span>Đang tải game...</span>
            </div>
          ) : featuredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Không có game nổi bật.
            </div>
          )}
        </motion.div>
      </section>

      {/* Devices */}
      <section className="flex flex-col md:flex-row items-center gap-10 card-base">
        <motion.div
          className="w-full md:w-1/2"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={deviceImage}
            alt="VR Devices"
            className="rounded-xl shadow-2xl w-full"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            Thiết Bị Hiện Đại Nhất
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            Thiết bị VR được cập nhật và bảo trì thường xuyên, đảm bảo trải
            nghiệm sống động, mượt mà và đầy cảm hứng.
          </p>
          <p className="text-lg text-gray-300 mb-8">
            Đảm bảo vệ sinh, bảo hộ đầy đủ và đội ngũ hỗ trợ chuyên nghiệp.
          </p>
          <Link to="/devices" className="btn-primary">
            Xem Thiết Bị
          </Link>
        </motion.div>
      </section>

      {/* Rooms */}
      <section className="flex flex-col md:flex-row items-center gap-10 card-base mt-20">
        <motion.div
          className="w-full md:w-1/2 order-2 md:order-1"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            Phòng Chơi Đỉnh Cao
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            Cách âm, mát mẻ, rộng rãi, hỗ trợ tối đa cho các game VR cần di
            chuyển nhiều.
          </p>
          <p className="text-lg text-gray-300 mb-8">
            Mỗi phòng được thiết kế theo một chủ đề riêng, phù hợp cho từng nhóm
            đối tượng hoặc sự kiện.
          </p>
          <Link to="/rooms" className="btn-primary">
            Xem Các Phòng
          </Link>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 order-1 md:order-2"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={roomImage}
            alt="VR Rooms"
            className="rounded-xl shadow-2xl w-full"
          />
        </motion.div>
      </section>

      {/* Cách thức tham gia */}
      <section>
        <SectionHeading>Cách Thức Tham Gia</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Bước 1 */}
          <motion.div
            className="p-6 card-base"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-5xl text-vr-blue mb-4 font-display font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Chọn Game & Phòng
            </h3>
            <p className="text-gray-400">
              Truy cập <span className="font-bold text-gray-300">Trò chơi</span>{" "}
              hoặc <span className="font-bold text-gray-300">Phòng</span>, chọn
              trò chơi và phòng VR phù hợp với số lượng người chơi.
            </p>
          </motion.div>

          {/* Bước 2 */}
          <motion.div
            className="p-6 card-base"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-5xl text-vr-blue mb-4 font-display font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Chọn Khung Giờ
            </h3>
            <p className="text-gray-400">
              Lựa chọn timeslot phù hợp (cố định 2 giờ/slot) và hoàn tất form
              đặt lịch.
            </p>
          </motion.div>

          {/* Bước 3 */}
          <motion.div
            className="p-6 card-base"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-5xl text-vr-blue mb-4 font-display font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Thanh Toán
            </h3>
            <p className="text-gray-400">
              Sau khi đơn được duyệt, khách hàng thanh toán trực tiếp tại quầy
              lễ tân.
            </p>
          </motion.div>

          {/* Bước 4 */}
          <motion.div
            className="p-6 card-base"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-5xl text-vr-blue mb-4 font-display font-bold">
              4
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Trải Nghiệm
            </h3>
            <p className="text-gray-400">
              Đến đúng phòng, sử dụng thiết bị chuyên dụng và bắt đầu cuộc phiêu
              lưu của bạn!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Phù hợp với ai? */}
      <section>
        <SectionHeading>Phù Hợp Với Ai?</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 card-base border-t-4 border-red-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-display font-bold mb-2 text-white">
              Gia Đình & Trẻ Em
            </h3>
            <p className="text-gray-300">
              Các game giáo dục, mô phỏng nhẹ nhàng và các trải nghiệm khám phá
              thế giới an toàn.
            </p>
          </motion.div>

          <motion.div
            className="p-6 card-base border-t-4 border-green-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-display font-bold mb-2 text-white">
              Nhóm Bạn & Đội Nhóm
            </h3>
            <p className="text-gray-300">
              Các tựa game nhiều người chơi, giải đố kịch tính, game phiêu lưu
              và các game kinh dị cần phối hợp.
            </p>
          </motion.div>

          <motion.div
            className="p-6 card-base border-t-4 border-yellow-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-display font-bold mb-2 text-white">
              Game Thủ Hardcore
            </h3>
            <p className="text-gray-300">
              Các trò chơi hành động, giả lập phức tạp và các giải đấu eSports
              VR chuyên nghiệp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Phản hồi */}
      <section>
        <SectionHeading>Phản Hồi Từ Người Chơi</SectionHeading>
        {loading ? (
          <div className="flex justify-center items-center gap-3 py-4 text-gray-300">
            <LoadingSpinner />
            <span>Đang tải phản hồi...</span>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((feedback) => (
              <ReviewCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            Hiện chưa có phản hồi nào.
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="text-center mt-6">
            <Link
              to="/feedbacks"
              className="italic font-semibold text-vr-blue hover:text-vr-blue-2 hover:underline transition duration-300"
            >
              Xem chi tiết phản hồi
            </Link>
          </div>
        )}
      </section>

      {/* FAQ  */}
      <section>
        <SectionHeading>Câu Hỏi Thường Gặp (FAQ)</SectionHeading>
        <div className="space-y-4 max-w-4xl mx-auto">
          <FAQItem
            question="Tôi cần đặt phòng trước bao lâu?"
            answer="Chúng tôi khuyến khích đặt phòng trước ít nhất 24 giờ, đặc biệt vào cuối tuần. Các khung giờ chơi là cố định (cách nhau 2 giờ), bắt đầu từ 08:00 và kết thúc lúc 22:00."
          />
          <FAQItem
            question="Thời gian chơi tối thiểu là bao lâu?"
            answer="Thời gian chơi có thể linh động tùy theo từng game, tối thiểu là 60 phút. Nếu bạn muốn chơi lâu hơn, vui lòng đặt 2 slot liên tiếp để có trải nghiệm trọn vẹn."
          />
          <FAQItem
            question="Tổng tiền đơn đặt phòng được tính như thế nào?"
            answer="Tổng tiền đơn đặt phòng của bạn được tính dựa trên mức giá của từng game, số lượng người tham gia và thời lượng chơi. Cụ thể: Tổng tiền = Giá game × Số người × (Thời lượng chơi tính theo giờ)."
          />
          <FAQItem
            question="Chính sách hủy/đổi lịch đặt phòng như thế nào?"
            answer="Bạn có thể hủy đặt phòng qua mục 'Đặt Phòng'. Đối với đơn đặt phòng đã được duyệt và thanh toán, việc hủy hoặc đổi lịch cần liên hệ bộ phận hỗ trợ."
          />
        </div>
      </section>

      {/* Statistical */}
      <section>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-base text-center">
            <div className="text-4xl font-display font-bold text-blue-500 mb-2">
              50+
            </div>
            <p className="text-gray-300">Tựa game VR đa dạng</p>
          </div>

          <div className="card-base text-center">
            <div className="text-4xl font-display font-bold text-rose-700 mb-2">
              30+
            </div>
            <p className="text-gray-300">Phòng chơi chuyên biệt</p>
          </div>

          <div className="card-base text-center">
            <div className="text-4xl font-display font-bold text-teal-500 mb-2">
              5.000+
            </div>
            <p className="text-gray-300">Lượt khách trải nghiệm</p>
          </div>

          <div className="card-base text-center">
            <div className="text-4xl font-display font-bold text-yellow-500 mb-2">
              4.9★
            </div>
            <p className="text-gray-300">Đánh giá trung bình</p>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;
