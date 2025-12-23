# 🎮 Hệ thống quản lý khu trò chơi thực tế ảo (VRealm Game Zone)

## 🌐 Giới thiệu

Hệ thống quản lý khu trò chơi thực tế ảo giúp quản lý người dùng, phòng chơi, thiết bị, trò chơi, đơn đặt phòng và phản hồi, tối ưu hóa quy trình đặt phòng và thanh toán, đồng thời hỗ trợ phân quyền cho admin, nhân viên và khách hàng.  
Mục tiêu của dự án là cung cấp một hệ thống quản lý trực quan cho admin, nhân viên, nâng cao trải nghiệm khách hàng và hiệu quả vận hành khu trò chơi Vrealm.

## 🚀 Tính năng

| Vai trò           | Chức năng                                                                                                                                                                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Khách hàng**    | - Xem thông tin chi tiết: About Us, Trò chơi, Phòng chơi<br>- Đặt phòng chơi game<br>- Theo dõi trạng thái đơn đặt phòng<br>- Gửi phản hồi cá nhân sau khi trải nghiệm<br>- Tương tác với trợ lý ảo AI                                                                                              |
| **Quản trị viên** | - Quản lý người dùng (khách hàng, nhân viên)<br>- Quản lý trò chơi VR<br>- Quản lý phòng chơi<br>- Quản lý thiết bị chơi<br>- Quản lý đơn đặt phòng<br>- Quản lý phản hồi khách hàng<br>- Xác nhận thanh toán các đơn đặt phòng<br>- Quản lý cơ sở hạ tầng hệ thống<br>- Tương tác với trợ lý ảo AI |
| **Nhân viên**     | - Xác nhận thanh toán các đơn đặt phòng<br>- Tương tác với trợ lý ảo AI                                                                                                                                                                                                                             |

## 🛠️ Tech Stack

| **Component**        | **Technology**                                       |
| -------------------- | ---------------------------------------------------- |
| **Frontend**         | React.js, Vite, Tailwind CSS                         |
| **Backend**          | Java Spring Boot                                     |
| **Database**         | MySQL                                                |
| **Authentication**   | Spring Security, JWT, Redis Blacklist, Rate Limiting |
| **Containerization** | Docker                                               |
| **Deployment**       | Docker Compose                                       |
| **Version Control**  | Git, GitHub                                          |

## 📁 Cấu trúc

```plaintext
VR-game-zone-Management-System/
├── backend/               # Java Spring Boot
│   ├── src/               # Mã nguồn Java
│   └── pom.xml            # Quản lý dependency & build
├── frontend/              # React + Vite
│   ├── src/               # Mã nguồn React
│   └── package.json       # Quản lý dependency frontend
├── docker-compose.yml     # MySQL + Redis container
└── README.md              # Tài liệu dự án
```

## ⚙️ Cài đặt

### I. Cài đặt backend và database (dev):

- Cài đặt [Docker](https://www.docker.com/) và khởi động.
- (Optional) Kiểm tra trạng thái hoạt động của Docker daemon:
  - Windows:
  ```batch
  tasklist | findstr docker
  ```
   <img width="1491" height="210" alt="Screenshot 2025-10-30 212951" src="https://github.com/user-attachments/assets/adc80f38-a140-4a03-90cb-3e6a637d73bb" />
- MySQL và Redis đã được cấu hình để chạy cùng với ứng dụng (có thể dùng MySQL trên server khác).
- Cài đặt [Maven](https://maven.apache.org/download.cgi) và môi trường (Có thể bỏ qua nếu cài IDE IntelliJ Idea vì có Maven tích hợp sẵn).
  - Windows:
  ```batch
  mvn -v
  ```
  <img width="1703" height="237" alt="Screenshot 2025-10-30 213736" src="https://github.com/user-attachments/assets/060549d2-4500-4507-8a3b-a35fb9e0f441" />
- Clone repository về máy và chuyển đến thư mục `backend`:

```batch
git clone https://github.com/nghnam04/VRealm-game-zone.git
cd VRealm-game-zone/backend
```

- Khởi tạo container MySQL + Redis (đối với lần đầu tiên):

```batch
docker-compose up
```

- Khởi chạy ứng dụng (Nếu cài IDE IntelliJ Idea thì có thể bỏ qua bước này và chạy trực tiếp):

```batch
mvn spring-boot:run
```

### II. Cài đặt frontend:

- Cài đặt [NodeJS](https://nodejs.org/en/download) v22.12.0+ (npm đã được kèm theo)
- (Optional) Kiểm tra trạng thái cài đặt NodeJS:

```batch
node -v
```

<img width="2333" height="120" alt="Screenshot 2025-11-09 014417" src="https://github.com/user-attachments/assets/32b7fc20-d5b6-4edd-80bf-ce706e135ecb" />

- Chuyển đến thư mục `frontend`, cài đặt các dependencies:

```batch
npm install
```

- Khởi chạy ứng dụng:

```batch
npm run dev
```

## 🧭 Hướng dẫn sử dụng

1. **Truy cập ứng dụng**

   - Sau khi khởi chạy backend và frontend, mở trình duyệt (khuyến khích **Google Chrome**) và truy cập:
     ```
     http://localhost:5173
     ```

2. **Đăng nhập / Đăng ký**

   - **Khách hàng (CUSTOMER)**: Đăng ký tài khoản mới hoặc đăng nhập để xem các thông tin chi tiết, đặt lịch chơi game và gửi feedback.
   - **Nhân viên (STAFF)**: Xử lý thanh toán.
   - **Quản trị viên (ADMIN)**: Quản lý toàn bộ hệ thống, bao gồm người dùng, phòng, thiết bị, trò chơi, đơn đặt phòng và phản hồi khách hàng.

3. **Đặt phòng**

   - Khách hàng chọn **phòng**, **trò chơi**, **số người chơi** và chọn **thời gian** theo các timeslot có sẵn.
   - Khách hàng xác nhận đặt phòng và chờ admin duyệt đơn.

4. **Thanh toán**

   - Khách hàng tới thanh toán trực tiếp tại quầy lễ tân.
   - Nhân viên xác nhận thanh toán cho các booking của khách hàng.

5. **Quản lý phòng, thiết bị, trò chơi**

   - Admin có thể thêm/sửa/xóa phòng, thiết bị, trò chơi, người dùng (nhân viên và khách hàng).
   - Trạng thái phòng và thiết bị được cập nhật realtime.

6. **Feedback**

   - Khách hàng gửi phản hồi cá nhân sau khi chơi game tại Vrealm.
   - Admin có thể xem và quản lý tất cả feedback.

7. **Tương tác với trợ lý ảo AI**
   - Người dùng mở giao diện khung chat và nhập câu hỏi
   - Trợ lý ảo Chatbot phản hồi câu trả lời thân thiện bằng tiếng Việt

## 🌍 Deployment Links

- 🔗 Frontend (Client): https://vrealm-game-zone.vercel.app

- 🔗 Backend (Server): https://vrealm-game-zone.onrender.com

## 📚 Tài liệu tham khảo

- [React.js Documentation](https://react.dev/) – Thư viện JS xây dựng UI hiện đại.
- [Vite Documentation](https://vitejs.dev/) – Cấu hình và chạy project React.
- [Tailwind CSS](https://tailwindcss.com/docs) – Framework CSS tiện ích.
- [Spring Boot Documentation](https://spring.io/projects/spring-boot) – Java Backend framework.
- [Docker](https://www.docker.com/) – Containerization cho MySQL và Redis.
- [MySQL Documentation](https://dev.mysql.com/doc/) – Quản lý cơ sở dữ liệu.
- [Redis Documentation](https://redis.io/documentation) – Cấu hình cache / session.
- [JSON Web Token (JWT)](https://jwt.io/introduction) – Xác thực và phân quyền người dùng.
- [Spring AI](https://spring.io/projects/spring-ai) - Cấu hình tích hợp trợ lý ảo Chatbot

---

Mọi đóng góp và thắc mắc xin liên hệ:

- ☎ _: (+84) 904 262 833_
- ✉ _: nam.nh225213@sis.hust.edu.vn_
