package vn.edu.hust.vrgamesapp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import vn.edu.hust.vrgamesapp.constant.BookingStatus;
import vn.edu.hust.vrgamesapp.constant.PaymentStatus;
import vn.edu.hust.vrgamesapp.constant.RoomStatus;
import vn.edu.hust.vrgamesapp.dto.DeviceDto;
import vn.edu.hust.vrgamesapp.dto.GameDto;
import vn.edu.hust.vrgamesapp.dto.RoomDto;

import java.util.stream.Collectors;

@Service
public class ChatBotService {

    private static final Logger log = LoggerFactory.getLogger(ChatBotService.class);

    private final ChatClient chatClient;
    private final BookingService bookingService;
    private final StatusService statusService;
    private final UserService userService;
    private final GameService gameService;
    private final RoomService roomService;
    private final DeviceService deviceService;
    private final FeedbackService feedbackService;

    public ChatBotService(ChatClient.Builder builder,
                          BookingService bookingService,
                          StatusService statusService, UserService userService,
                          GameService gameService, RoomService roomService,
                          DeviceService deviceService, FeedbackService feedbackService) {
        this.chatClient = builder.build();
        this.bookingService = bookingService;
        this.statusService = statusService;
        this.userService = userService;
        this.gameService = gameService;
        this.roomService = roomService;
        this.deviceService = deviceService;
        this.feedbackService = feedbackService;
    }

    public String processMessage(String userMessage, Authentication authentication) {
        StringBuilder contextData = new StringBuilder();

        // genral context
        contextData.append(getGeneralContext(userMessage));

        String username = "Khách";
        String role = "GUEST";

        // kiểm tra xác thực và phân quyền
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {

            username = authentication.getName();
            role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst().orElse("GUEST");

            contextData.append("\n--- DỮ LIỆU RIÊNG THEO VAI TRÒ: ").append(role).append(" ---\n");

            switch (role) {
                case "ROLE_CUSTOMER" -> contextData.append(getCustomerContext(username, userMessage));
                case "ROLE_STAFF" -> contextData.append(getStaffContext(userMessage));
                case "ROLE_ADMIN" -> contextData.append(getAdminContext(userMessage));
            }
        } else {
            contextData.append("\n(Người dùng là khách chưa đăng nhập)");
        }

        String prompt = """
                Bạn là trợ lý ảo AI của VRealm Game Zone.
                Hãy sử dụng dữ liệu hệ thống để trả lời người dùng một cách chuyên nghiệp.
                
                QUY TẮC:
                1. Dựa vào "Dữ liệu hệ thống" để trả lời. 
                2. Nếu là khách (GUEST/CUSTOMER): Tư vấn nhiệt tình về dịch vụ, game, phòng, thiết bị, giá cả.
                3. Nếu là Staff: Hỗ trợ tra cứu đơn hàng chưa thanh toán.
                4. Nếu là Customer: Tư vấn nhiệt tình và gợi ý về đơn đặt phòng, phản hồi khách hàng đó
                5. Nếu là Admin: Tư vấn và đưa ra các thông tin về trạng thái hiện tại của hệ thống, cơ sở hạ tầng, các tính năng:
                    - Quản lý người dùng 
                    - Quản lý game, phòng, thiết bị
                    - Quản lý đơn đặt phòng & thanh toán
                    - Quản lý phản hồi khách hàng
                    - Giám sát hạ tầng hệ thống
                6. Tuyệt đối không tự ý xác nhận đã thanh toán hoặc thay đổi dữ liệu.
                
                QUY TẮC TRÌNH BÀY BẮT BUỘC:
                - Các thông tin quan trọng phải được <b>bôi đậm</b>.
                - Mỗi ý PHẢI xuống dòng.
                - KHÔNG gộp nhiều ý vào một đoạn.
                - Danh sách PHẢI dùng dấu "- ".
                - Giữa các phần PHẢI có dòng trống <br/> ở cuối mỗi ý.
                - Luôn kết thúc bằng một lời mời thân thiện.
                
                Thông tin định danh:
                - Vai trò: %s | Tên: %s
                
                Dữ liệu hệ thống:
                %s
                
                Câu hỏi của người dùng:
                "%s"
                
                Trả lời ngắn gọn bằng tiếng Việt (vui lòng trình bày đẹp mắt, có logic):
                """.formatted(role, username, contextData.toString(), userMessage);

        try {
            return chatClient.prompt().user(prompt).call().content();
        } catch (Exception e) {
            log.error("AI Chat error", e);
            return "Trợ lý AI tạm thời không khả dụng. Vui lòng thử lại sau giây lát!";
        }
    }

    private String getGeneralContext(String msg) {
        StringBuilder sb = new StringBuilder("Thông tin chung:\n");
        sb.append("- VRealm Game Zone cung cấp trải nghiệm thực tế ảo (VR) sống động với hệ thống game đa dạng.\n" +
                "- Phù hợp cho gia đình, nhóm bạn, team building và game thủ chuyên nghiệp.\n" +
                "- Không gian hiện đại, an toàn, có nhân viên hỗ trợ trong suốt quá trình chơi.\n");
        sb.append("- Quy trình trải nghiệm gồm 4 bước:\n" +
                "  1. Chọn game và phòng chơi phù hợp với số lượng người.\n" +
                "  2. Chọn khung giờ chơi (slot cố định 2 giờ).\n" +
                "  3. Sau khi đơn được duyệt, thanh toán trực tiếp tại quầy lễ tân.\n" +
                "  4. Đến đúng giờ, vào phòng và bắt đầu trải nghiệm VR.\n");
        sb.append("- Các khung giờ chơi cố định, mỗi slot kéo dài 2 giờ.\n" +
                "- Khung giờ hoạt động từ 08:00 đến 22:00 hằng ngày.\n" +
                "- Có thể đặt nhiều slot liên tiếp để chơi lâu hơn.\n");
        sb.append("- Khuyến khích đặt phòng trước ít nhất 24 giờ, đặc biệt vào cuối tuần.\n" +
                "- Đơn chưa thanh toán có thể hủy trực tiếp trong mục Đặt Phòng.\n" +
                "- Với đơn đã được duyệt và thanh toán, cần liên hệ nhân viên hỗ trợ để hủy hoặc đổi lịch.\n");
        sb.append("- Tổng tiền = Giá game × Số người × Thời lượng chơi (theo giờ).\n" +
                "- Giá phụ thuộc vào từng game và số lượng người tham gia.\n");
        sb.append("- Hệ thống có hơn 50 tựa game VR đa dạng: đua xe, phiêu lưu, thể thao, hành động, giải đố, kinh dị, mô phỏng.\n" +
                "- Hỗ trợ cả chơi đơn và nhiều người.\n" +
                "- Game phù hợp cho nhiều độ tuổi và mục đích giải trí khác nhau.\n");
        sb.append("- Thiết bị VR hiện đại, được bảo trì và cập nhật thường xuyên.\n" +
                "- Đảm bảo vệ sinh, an toàn và trải nghiệm mượt mà.\n" +
                "- Có đầy đủ trang bị bảo hộ và hướng dẫn sử dụng.\n");
        sb.append("- Phòng rộng rãi, cách âm tốt, mát mẻ.\n" +
                "- Mỗi phòng có chủ đề riêng, phù hợp cho nhóm nhỏ, gia đình hoặc sự kiện.\n");
        sb.append("Đối tượng phù hợp:\n" +
                "- Gia đình & trẻ em: game giáo dục, khám phá, nhẹ nhàng.\n" +
                "- Nhóm bạn & đội nhóm: game nhiều người, giải đố, phiêu lưu, kinh dị.\n" +
                "- Game thủ hardcore: game hành động, giả lập phức tạp, eSports VR.\n");
        sb.append("- Hơn 50 tựa game VR.\n" +
                "- Hơn 30 phòng chơi chuyên biệt.\n" +
                "- Trên 5.000 lượt khách đã trải nghiệm.\n" +
                "- Đánh giá trung bình 4.9★ từ người chơi.\n");

        String lowerMsg = msg.toLowerCase();

        // Game Detail
        if (lowerMsg.contains("game") || lowerMsg.contains("giá") || lowerMsg.contains("trò chơi")) {
            try {
                var gamesPage = gameService.getAllGames(
                        0, 50, "id", "asc",
                        null, null, null, null, null, null, null, null
                );

                String gameList = gamesPage.getContent().stream()
                        .map(g -> "- %s: %s VNĐ/giờ (Tối đa %d người)"
                                .formatted(g.getName(), g.getPrice(), g.getMaxPlayers()))
                        .collect(Collectors.joining("\n"));

                sb.append("Danh sách game khả dụng:\n").append(gameList).append("\n\n");
            } catch (Exception e) {
                sb.append("Không lấy được danh sách game hiện tại.\n\n");
            }
        }

        // Room Detail
        if (lowerMsg.contains("phòng") || lowerMsg.contains("room")) {
            try {
                var roomsPage = roomService.getAllRooms(0, 50, "id", "asc", null, null, null, null);

                String roomList = roomsPage.getContent().stream()
                        .map(r -> "- Phòng %s (Sức chứa: %d người)"
                                .formatted(r.getName(), r.getCapacity()))
                        .collect(Collectors.joining("\n"));

                sb.append("Danh sách phòng chơi:\n").append(roomList).append("\n\n");
            } catch (Exception e) {
                sb.append("Không lấy được danh sách phòng hiện tại.\n\n");
            }
        }

        // Device Detail
        if (lowerMsg.contains("thiết bị") || lowerMsg.contains("device")) {
            try {
                var devicesPage = deviceService.getAllDevices(0, 50, "id", "asc", null, null, null, null, null, null);

                String deviceList = devicesPage.getContent().stream()
                        .map(d -> "- %s (%s)"
                                .formatted(d.getName(), d.getStatus()))
                        .collect(Collectors.joining("\n"));

                sb.append("Danh sách thiết bị VR:\n").append(deviceList).append("\n\n");
            } catch (Exception e) {
                sb.append("Không lấy được danh sách thiết bị hiện tại.\n\n");
            }
        }

        // Feedback Detail
        if (lowerMsg.contains("đánh giá") || lowerMsg.contains("feedback") || lowerMsg.contains("phản hồi")) {
            try {
                var feedbacks = feedbackService.getAllFeedbacks(0, 5, "id", "asc", null, null, null, null, null, null);

                String feedbackList = feedbacks.getContent().stream()
                        .map(f -> "- %s⭐: %s"
                                .formatted(f.getRating(), f.getComment()))
                        .collect(Collectors.joining("\n"));

                sb.append("Đánh giá gần đây từ khách hàng:\n")
                        .append(feedbackList).append("\n\n");
            } catch (Exception e) {
                sb.append("Không lấy được phản hồi khách hàng hiện tại.\n\n");
            }
        }

        return sb.toString();
    }

    private String getStaffContext(String msg) {
        StringBuilder sb = new StringBuilder("Dữ liệu cho Nhân viên:\n");
        String lowerMsg = msg.toLowerCase();

        if (lowerMsg.contains("đơn") || lowerMsg.contains("thanh toán") || lowerMsg.contains("thu tiền") || lowerMsg.contains("unpaid")) {
            try {
                var bookingsPage = bookingService.getAllBookings(0, 30, "id", "asc",
                        null, null, null, null, null,
                        null, null, null, null, null, null, null, null);

                // Lọc đơn ACCEPTED và UNPAID
                String unpaidList = bookingsPage.getContent().stream()
                        .filter(b -> b.getStatus() == BookingStatus.ACCEPTED
                                && b.getPaymentStatus() == PaymentStatus.UNPAID)
                        .map(b -> "- Đơn #%d: %s đặt game %s | phòng %s (Chờ thu tiền)".formatted(b.getId(), b.getUserName(), b.getGameName(), b.getRoomName()))
                        .collect(Collectors.joining("\n"));

                sb.append(unpaidList.isEmpty() ? "Không có đơn nào cần thu tiền." : "Đơn hàng đã được duyệt nhưng chưa thanh toán:\n" + unpaidList);
            } catch (Exception e) {
                sb.append("Lỗi tra cứu danh sách đơn hàng.");
            }
        }
        return sb.toString();
    }

    private String getCustomerContext(String username, String msg) {
        StringBuilder sb = new StringBuilder("Dữ liệu dành cho Khách hàng:\n");

        String lowerMsg = msg.toLowerCase();

        // Lịch sử đặt phòng
        if (lowerMsg.contains("booking") || lowerMsg.contains("lịch") || lowerMsg.contains("đơn")) {
            var bookings = bookingService.getUserBookings(username);

            if (bookings.isEmpty()) {
                sb.append("- Bạn chưa có đơn đặt phòng nào.\n");
            } else {
                sb.append("\uD83E\uDDFE  Đơn đặt phòng của bạn:\n");
                bookings.stream().forEach(b ->
                        sb.append("- Đơn #").append(b.getId())
                                .append(": Game ").append(b.getGameName())
                                .append(" | Phòng ").append(b.getRoomName())
                                .append(" | Số người chơi ").append(b.getNumberOfPlayers())
                                .append(" | Thời gian ").append(b.getStartTime())
                                .append(" | Trạng thái ").append(b.getStatus())
                                .append(" | Thanh toán ").append(b.getPaymentStatus())
                                .append("\n")
                );
            }
        }

        // Game / Phòng khả dụng đặt đơn
        if (lowerMsg.contains("game") || lowerMsg.contains("phòng") || lowerMsg.contains("đặt")) {
            try {
                sb.append("🎮 <b>Các tổ hợp Game / Phòng có thể đặt hiện tại:</b>\n");

                var roomsPage = roomService.getAllRooms(
                        0, 30, "id", "asc",
                        null, null, null, null
                );

                var gamesPage = gameService.getAllGames(
                        0, 30, "id", "asc",
                        null, null, null, null, null, null, null, null
                );

                var devicesPage = deviceService.getAllDevices(
                        0, 30, "id", "asc",
                        null, null, null, null, null, null
                );

                boolean found = false;

                for (RoomDto room : roomsPage.getContent()) {

                    // Room phải AVAILABLE
                    if (room.getStatus() != RoomStatus.AVAILABLE) continue;

                    // Tổng thiết bị >= sức chứa phòng
                    int totalDevices = devicesPage.getContent().stream()
                            .filter(d -> room.getId().equals(d.getRoomId()))
                            .mapToInt(DeviceDto::getQuantity)
                            .sum();

                    if (totalDevices < room.getCapacity()) continue;

                    // Duyệt game mà phòng hỗ trợ
                    for (GameDto game : gamesPage.getContent()) {

                        if (room.getGames() == null || !room.getGames().contains(game.getId()))
                            continue;

                        // 4. Số người hợp lệ
                        int maxPlayers = Math.min(room.getCapacity(), game.getMaxPlayers());

                        // 5. Không trùng lịch (game OR room) & booking chưa CANCELLED
                        boolean hasConflict = bookingService
                                .hasActiveBooking(game.getId(), room.getId());

                        if (hasConflict) continue;

                        sb.append("- 🎮 <b>").append(game.getName()).append("</b>")
                                .append(" | 🏠 Phòng <b>").append(room.getName()).append("</b>")
                                .append(" | 👥 Tối đa ").append(maxPlayers).append(" người")
                                .append(" | 💰 ").append(game.getPrice()).append(" VNĐ/giờ\n");

                        found = true;
                    }
                }

                if (!found) {
                    sb.append("- Hiện tại chưa có game/phòng nào đủ điều kiện để đặt.\n\n");
                }
            } catch (Exception e) {
                sb.append("- Hiện tại không còn game/phòng khả dụng để đặt đơn. Do lượng khách quá đông, chúng tôi vô cùng xin lỗi về vấn đề này!\n\n");
            }
        }

        // Lịch sử Feedback
        if (lowerMsg.contains("feedback") || lowerMsg.contains("đánh giá") || lowerMsg.contains("phản hồi")) {
            var feedbacks = feedbackService.getFeedbacksByUser(username);

            if (feedbacks.isEmpty()) {
                sb.append("- Bạn chưa gửi feedback nào.\n");
            } else {
                sb.append("⭐ Lịch sử feedback của bạn:\n");
                feedbacks.stream().forEach(f ->
                        sb.append("- Đơn #").append(f.getBookingId())
                                .append(": ").append(f.getRating()).append("★")
                                .append(" - ").append(f.getComment())
                                .append("\n")
                );
            }
        }

        return sb.toString();
    }


    private String getAdminContext(String msg) {
        StringBuilder sb = new StringBuilder("Dữ liệu cho Quản trị viên:\n");

        String lowerMsg = msg.toLowerCase();

        // User
        if (lowerMsg.contains("người dùng") || lowerMsg.contains("user") || lowerMsg.contains("tài khoản")) {
            try {
                var users = userService.getAllUsers(0, 20, "id", "asc", null, null, null, null);

                sb.append("👤 <b>Quản lý người dùng:</b>\n");
                users.getContent().forEach(u ->
                        sb.append("- ")
                                .append(u.getName())
                                .append(" | ").append(u.getUsername())
                                .append(" | Vai trò: ").append(u.getRole())
                                .append("\n")
                );
                sb.append("\n");
            } catch (Exception e) {
                sb.append("- Không lấy được danh sách người dùng.\n\n");
            }
        }

        // Game
        if (lowerMsg.contains("game") || lowerMsg.contains("trò chơi")) {
            try {
                var games = gameService.getAllGames(
                        0, 30, "id", "asc",
                        null, null, null,
                        null, null, null, null, null
                );

                sb.append("🎮 <b>Quản lý trò chơi VR:</b>\n");
                games.getContent().forEach(g ->
                        sb.append("- ")
                                .append(g.getName())
                                .append(" | ").append(g.getPrice()).append(" VNĐ/giờ")
                                .append(" | Tối đa ").append(g.getMaxPlayers()).append(" người\n")
                );
                sb.append("\n");
            } catch (Exception e) {
                sb.append("- Không lấy được danh sách game.\n\n");
            }
        }

        // Room
        if (lowerMsg.contains("phòng") || lowerMsg.contains("room")) {
            try {
                var rooms = roomService.getAllRooms(0, 30, "id", "asc", null, null, null, null);

                sb.append("🏠 <b>Quản lý phòng chơi:</b>\n");
                rooms.getContent().forEach(r ->
                        sb.append("- ")
                                .append(r.getName())
                                .append(" | Sức chứa: ").append(r.getCapacity())
                                .append(" | Trạng thái: ").append(r.getStatus())
                                .append("\n")
                );
                sb.append("\n");
            } catch (Exception e) {
                sb.append("- Không lấy được danh sách phòng.\n\n");
            }
        }

        // Device
        if (lowerMsg.contains("thiết bị") || lowerMsg.contains("device")) {
            try {
                var devices = deviceService.getAllDevices(
                        0, 30, "id", "asc",
                        null, null, null, null, null, null
                );

                sb.append("🕶️ <b>Quản lý thiết bị VR:</b>\n");
                devices.getContent().forEach(d ->
                        sb.append("- ")
                                .append(d.getName())
                                .append(" | Phòng: ").append(d.getRoomName())
                                .append(" | Số lượng: ").append(d.getQuantity())
                                .append(" | Trạng thái: ").append(d.getStatus())
                                .append("\n")
                );
                sb.append("\n");
            } catch (Exception e) {
                sb.append("- Không lấy được danh sách thiết bị.\n\n");
            }
        }

        // booking
        if (lowerMsg.contains("đơn") || lowerMsg.contains("booking") || lowerMsg.contains("thanh toán")) {
            try {
                var bookings = bookingService.getAllBookings(
                        0, 30, "id", "asc",
                        null, null, null, null, null,
                        null, null, null, null, null, null, null, null
                );

                sb.append("📦 <b>Quản lý đơn đặt phòng & thanh toán:</b>\n");
                bookings.getContent().forEach(b ->
                        sb.append("- Đơn #").append(b.getId())
                                .append(" | ").append(b.getUserName())
                                .append(" | ").append(b.getGameName())
                                .append(" | ").append(b.getRoomName())
                                .append(" | ").append(b.getStatus())
                                .append(" / ").append(b.getPaymentStatus())
                                .append("\n")
                );
                sb.append("\n");
            } catch (Exception e) {
                sb.append("- Không lấy được danh sách đơn đặt phòng.\n\n");
            }
        }

        // feedback
        if (lowerMsg.contains("feedback") || lowerMsg.contains("đánh giá") || lowerMsg.contains("phản hồi")) {
            try {
                var feedbacks = feedbackService.getAllFeedbacks(
                        0, 30, "id", "asc",
                        null, null, null, null, null, null
                );

                sb.append("⭐ <b>Quản lý phản hồi khách hàng:</b>\n");
                feedbacks.getContent().forEach(f ->
                        sb.append("- ")
                                .append(f.getRating()).append("★")
                                .append(" | ").append(f.getUserName())
                                .append(" | ").append(f.getComment())
                                .append("\n")
                );
                sb.append("\n");
            } catch (Exception e) {
                sb.append("- Không lấy được phản hồi khách hàng.\n\n");
            }
        }

        // Quản lý cơ sở hạ tầng
        if (lowerMsg.contains("hệ thống") || lowerMsg.contains("server")
                || lowerMsg.contains("cơ sở") || lowerMsg.contains("hạ tầng")
                || lowerMsg.contains("database") || lowerMsg.contains("redis")
                || lowerMsg.contains("cache")
                || lowerMsg.contains("uptime") || lowerMsg.contains("downtime")
                || lowerMsg.contains("hoạt động") || lowerMsg.contains("sập")) {

            try {
                var status = statusService.checkStatus();

                sb.append("Trạng thái hạ tầng hệ thống:\n")
                        .append("- Server: ").append(status.get("server")).append("\n")
                        .append("- Database: ").append(status.get("database")).append("\n")
                        .append("- Redis: ").append(status.get("redis")).append("\n");

            } catch (Exception e) {
                sb.append("Không lấy được trạng thái hệ thống hiện tại.\n");
            }
        }

        if (lowerMsg.contains("uptime") || lowerMsg.contains("downtime")
                || lowerMsg.contains("tỉ lệ uptime") || lowerMsg.contains("tỉ lệ downtime")
                || lowerMsg.contains("hoạt động") || lowerMsg.contains("sập")) {

            try {
                var stats = statusService.getUptimeStats(30);

                sb.append("""
                        📊 Thống kê hạ tầng hệ thống (30 ngày gần nhất):
                        - Tỉ lệ uptime: %.2f%%
                        - Tỉ lệ downtime: %.2f%%
                        - Tổng số lần ghi nhận: %d
                        """.formatted(
                        stats.get("uptime"),
                        stats.get("downtime"),
                        stats.get("totalLogs")
                ));
                double downtime = (double) stats.get("downtime");

                if (downtime > 10) {
                    sb.append("⚠️ Cảnh báo: Tỉ lệ downtime cao, cần kiểm tra hệ thống!\n");
                }

            } catch (Exception e) {
                sb.append("Không lấy được thống kê uptime/downtime hệ thống.\n");
            }
        }

        // Default
        if (sb.toString().equals("Dữ liệu cho Quản trị viên:\n")) {
            sb.append("""
                    Quyền quản trị hệ thống:
                    - Quản lý người dùng (Customer / Staff)
                    - Quản lý game, phòng, thiết bị
                    - Quản lý đơn đặt phòng & thanh toán
                    - Quản lý phản hồi khách hàng
                    - Giám sát hạ tầng hệ thống
                    """);
        }

        return sb.toString();
    }
}