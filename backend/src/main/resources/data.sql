-- Clear existing data
-- TRUNCATE TABLE feedbacks, payments, bookings, room_games, devices, games, rooms, users, roles;

-- Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'ADMIN'),
(2, 'STAFF'),
(3, 'CUSTOMER');

-- Insert Users (BCrypt encoded password)
INSERT INTO users (id, name, email, username, password, role_id) VALUES
(1, 'Admin', 'admin@vrgame.com', 'admin', '$2a$10$R7gzoTI72JpmhVsp2WZZZO3vlPSj/Tju/TwQQl7XL8vTQt8yk7DAa', 1),
(2, 'Staff', 'staff@vrgame.com', 'staff', '$2a$10$FXG963Jyz9nwCr5WxoRsgOSZP4PXwFTys.uN45X/w27PtLDvlUfL.', 2),
(3, 'Customer', 'customer@vrgame.com', 'customer', '$2a$10$7Iiw5zPyxep7Q63lXmvF5eC7ALQb9ZfgREZB81uRMAzGPcu7dDCdu', 3),
(4, 'Diana Pham', 'diana.admin@vrgame.com', 'diana_pham', '$2a$10$QdSIktrKpnBVlWAe4KFUkedIjKCopNNQvs2ITOu7UxdrzbI44rIXi', 1),
(5, 'Ethan Vu', 'ethan.staff@vrgame.com', 'ethan_vu', '$2a$10$h3iH4PE47i3l3Mz0nm/tJ.09J3/a.0gIdhx3mm5OFF.3FT5den2PK', 2),
(6, 'Fiona Hoang', 'fiona.customer@vrgame.com', 'fiona_hoang', '$2a$10$jZK7mDKSRyCs8XueB8d0.O2h9RwMA9KUDwbZWJELIAClRExGGbGbm', 3),
(7, 'George Ngo', 'george.admin@vrgame.com', 'george_ngo', '$2a$10$ti3SlJpAJWftzHwZp/WaEuBHx4PtF2jxnIXqbwQvw7fZ0vykd3wSa', 1),
(8, 'Hannah Dao', 'hannah.staff@vrgame.com', 'hannah_dao', '$2a$10$PYXtRxP3xQ3iAyQI74At/u0SPZZi9SoSkhkBrenvw4nL8W8zNiZXS', 2),
(9, 'Ian Bui', 'ian.customer@vrgame.com', 'ian_bui', '$2a$10$frQ0hpQp9D5Rn88u2bKBq.aemkHGYuOfwOQ3w98uXp4Qk51WYbX36', 3),
(10, 'Julia Tran', 'julia.customer@vrgame.com', 'julia_tran', '$2a$10$AEk44axOCDg14bdpeajf.u2B8BMhB0CjWp.HTeVELmBN2hLPW4QyS', 3),
(11, 'Kevin Le', 'kevin.le@vrgame.com', 'kevin_le', '$2a$10$dMn3lCfXSscr7Vb1xc03W.ZHR1nQSCb6XfuvCliua09lM/UuF6CGu', 3),
(12, 'Luna Nguyen', 'luna.nguyen@vrgame.com', 'luna_nguyen', '$2a$10$9yqG1Rrkj/ZjGavWNTgv.eehJxGuyvzpi0xUb2IRGbbbwXjCniNQy', 3),
(13, 'Minh Tran', 'minh.tran@vrgame.com', 'minh_tran', '$2a$10$ifKqUat0h.cRTk3l62Ki..XduoCH.rKLJJKkl1W8zJM4tW0qfbv4q', 3),
(14, 'Nina Vo', 'nina.vo@vrgame.com', 'nina_vo', '$2a$10$65.VO02OkQU66XAGhbtJVOD74hmtaYWYuLt.vG2iw/ZfrxwZqtG/.', 3),
(15, 'Oscar Pham', 'oscar.pham@vrgame.com', 'oscar_pham', '$2a$10$kdjAWyDnH1q03SDYwbisAuqcUo.T3wvb/jSxfdh649bfGeeR6yP0W', 3),
(16, 'Phuong Do', 'phuong.do@vrgame.com', 'phuong_do', '$2a$10$7eFTmWr00zJo95vomfzq0u.doOZYpFedE0.8ESeb9niDfVjkWROnu', 3),
(17, 'Quang Truong', 'quang.truong@vrgame.com', 'quang_truong', '$2a$10$ZmUg.8tMEYWSyLb7vvOPo.afF0bvSew82tOJ8i65Ussnn/RnFYoBi', 3),
(18, 'Rita Dang', 'rita.dang@vrgame.com', 'rita_dang', '$2a$10$.lk4aeKEXIV.ddMDirB7cu0RMJXBCHhMxqSj0NnrCk8hELDg4v63O', 3),
(19, 'Sam Vo', 'sam.vo@vrgame.com', 'sam_vo', '$2a$10$gZYRhW4JPb8OBjq4INsnN.smw/xTgwPDe0s9/FXEQCEK1GQiJVV.O', 3),
(20, 'Tina Ha', 'tina.ha@vrgame.com', 'tina_ha', '$2a$10$qijcxYnODfX6jfl5x2eCYeb0gLzTHyKFD3o45UgUfyiGKPYA1TiIG', 3);

-- Insert Games
INSERT INTO games (id, name, genre, description, duration, price, max_players, image_url) VALUES
(1, 'Zombie Apocalypse VR', 'HORROR', 'Survive waves of zombies', 60, 120.00, 4, 'https://images.unsplash.com/photo-1679590060902-3556e64a676f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2664'),
(2, 'Space Adventure VR', 'ADVENTURE', 'Explore distant galaxies', 90, 150.00, 5, 'https://plus.unsplash.com/premium_photo-1682124752476-40db22034a58?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160'),
(3, 'VR Racing Challenge', 'RACING', 'High-speed racing simulator', 70, 100.00, 2, 'https://images.unsplash.com/photo-1755591410048-acb997488ccd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470'),
(4, 'Mystery Puzzle VR', 'PUZZLE', 'Solve mind-bending puzzles', 75, 130.00, 3, 'https://images.unsplash.com/photo-1732780769402-b4ca6455ded0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1328'),
(5, 'VR Sports Arena', 'SPORTS', 'Play virtual sports', 60, 110.00, 6, 'https://plus.unsplash.com/premium_photo-1684713510655-e6e31536168d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470'),
(6, 'Warrior Quest VR', 'ADVENTURE', 'Epic RPG quest in VR', 120, 200.00, 4, 'https://images.unsplash.com/photo-1698450998458-0bc1045788a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1528'),
(7, 'Action Shooter VR', 'ACTION', 'Multiplayer shooting action', 65, 140.00, 5, 'https://images.unsplash.com/photo-1646063152596-fdc70092b1e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1414'),
(8, 'Haunted Mansion VR', 'HORROR', 'Explore the haunted house', 60, 120.00, 3, 'https://images.unsplash.com/photo-1639326605644-ffbfce9fe3df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1472'),
(9, 'Simulation City VR', 'SIMULATION', 'Build and manage a city', 80, 250.00, 1, 'https://images.unsplash.com/photo-1701497429720-a8c202753f9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470'),
(10, 'Underwater Explorer VR', 'ADVENTURE', 'Dive and discover ocean life', 80, 160.00, 4, 'https://images.unsplash.com/photo-1608209957132-587daea098f3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374');

-- Insert Rooms
INSERT INTO rooms (id, name, capacity, status, image_url) VALUES
(1, 'Ocean Room', 4, 'AVAILABLE', 'https://images.unsplash.com/photo-1530053969600-caed2596d242?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374'),
(2, 'Sky Room', 6, 'AVAILABLE', 'https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2t5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=800'),
(3, 'Dungeon Room', 3, 'IN_USE', 'https://images.unsplash.com/photo-1648372349535-99ddedd05ca4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RHVuZ2VvbiUyMHJvb218ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=800'),
(4, 'Space Room', 4, 'AVAILABLE', 'https://plus.unsplash.com/premium_photo-1669839137069-4166d6ea11f4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=800'),
(5, 'Racing Room', 6, 'BOOKED', 'https://images.unsplash.com/photo-1489731007795-388eee095ff6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHJhY2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=800'),
(6, 'Haunted Room', 5, 'MAINTENANCE', 'https://images.unsplash.com/photo-1481018085669-2bc6e4f00eed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGF1bnRlZCUyMGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=800'),
(7, 'Fantasy Room', 4, 'AVAILABLE', 'https://images.unsplash.com/photo-1514539079130-25950c84af65?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1469'),
(8, 'Action Room', 6, 'IN_USE', 'https://images.unsplash.com/photo-1639932068669-9dccd9531338?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374'),
(9, 'Puzzle Room', 4, 'AVAILABLE', 'https://images.unsplash.com/photo-1590146758147-74a80644616a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1471'),
(10, 'Simulation Room', 5, 'BOOKED', 'https://plus.unsplash.com/premium_photo-1709845562321-2779276b5e65?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1457');

-- Insert Room_Games
INSERT INTO room_games (room_id, game_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- Insert Devices
INSERT INTO devices (id, room_id, name, type, status, quantity, image_url) VALUES
-- Gắn phòng
(1, 1, 'Oculus Quest 2', 'HEADSET', 'AVAILABLE', 5, 'https://images-cdn.ubuy.ae/633aaa81549a314c872ace0e-oculus-quest-2-advanced-all-in-one.jpg'),
(2, 1, 'Steam Controller', 'CONTROLLER', 'MAINTENANCE', 2, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/353370/ss_d2f5e7325666df6119ff1d42be73bac9594c5b1e.1920x1080.jpg?t=1576276946'),
(3, 2, 'Sony VR Headphones', 'HEADPHONE', 'AVAILABLE', 3, 'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-ch520_Primary_image?$S7Product$&fmt=png-alpha'),
(4, 2, 'HTC Base Station 2.0', 'SENSOR', 'AVAILABLE', 2, 'https://vortexvr.de/cdn/shop/products/valve-index-steam-vr-base-station-20-base-station-20-866509.jpg?v=1667030014'),
(5, 3, 'Logitech C920 HD Pro', 'CAMERA', 'IN_USE', 3, 'https://microthuam.com/Uploadimage/product/webcam-ghi-hinh-logitech-c922-full-hd-thongaudio-hang-chinh-hang.jpg'),
(6, 3, 'Blue Yeti Mic', 'MICROPHONE', 'MAINTENANCE', 2, 'https://img.lazcdn.com/g/p/0c2c4140964ed69b1a78752d95622963.jpg_720x720q80.jpg'),
(7, 4, 'Oculus Rift S', 'HEADSET', 'AVAILABLE', 4, 'https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2019/03/oculus-rift-s-1-1.jpg'),
(8, 4, 'Valve Controller', 'CONTROLLER', 'AVAILABLE', 3, 'https://hi-tech.ua/wp-content/uploads/2024/06/horipad.jpg'),
(9, 5, 'HyperX Cloud II', 'HEADPHONE', 'IN_USE', 3, 'https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/VuTT29/Tai%20nghe%20HyperX%20Cloud%20II%20wireless%20-%20Red%201.jpg'),
(10, 5, 'Valve Lighthouse', 'SENSOR', 'AVAILABLE', 3, 'https://cdn.fastly.steamstatic.com/valvesoftware/images/index/BS_3.jpg'),
-- Không gắn phòng(dự phòng)
(11, null, 'Oculus Quest Pro', 'HEADSET', 'IN_USE', 2, 'https://www.droidshop.vn/wp-content/uploads/2022/09/Kinh-thuc-te-ao-Meta-Quest-Pro-3.jpg'),
(12, null, 'HTC Controller', 'CONTROLLER', 'IN_USE', 4, 'https://guide-images.cdn.ifixit.com/igi/YmfW1LDpjqqIIEcP.medium'),
(13, null, 'Razer Kraken 7.1', 'HEADPHONE', 'AVAILABLE', 3, 'https://songphuong.vn/Content/uploads/2018/07/6363.jpg'),
(14, null, 'Oculus Tracking Sensor', 'SENSOR', 'IN_USE', 2, 'https://www.amvrshop.com/cdn/shop/files/22.png?v=1723628226'),
(15, null, 'Sony PS Eye Camera', 'CAMERA', 'AVAILABLE', 1, 'https://upload.wikimedia.org/wikipedia/commons/4/42/Sony-PlayStation-3-Eye.png'),
(16, null, 'Razer Seiren X', 'MICROPHONE', 'AVAILABLE', 2, 'https://nvs.tn-cdn.net/2020/03/Mic-Razer-Seiren-X-Mercury-2.jpg'),
(17, null, 'Valve Index', 'HEADSET', 'IN_USE', 3, 'https://cdn.fastly.steamstatic.com/valvesoftware/images/index/HMD_3.jpg'),
(18, null, 'Xbox One Controller', 'CONTROLLER', 'MAINTENANCE', 3, 'https://product.hstatic.net/200000637319/product/bdf1a7e3-261a-49dc-a863-0af85f145b8d_4d954dada4174811953abc06a0ce3a98.jpg'),
(19, null, 'SteelSeries Arctis Pro', 'HEADPHONE', 'AVAILABLE', 2, 'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lqleudhpz842b7@resize_w900_nl.webp'),
(20, null, 'Pico Eye Tracking Cam', 'CAMERA', 'IN_USE', 1, 'https://lf16-statics.picovr.com/obj/pico-fe-sg/pico/pico_website/image/connect_1.88626afd.jpg');

-- Insert Bookings
INSERT INTO bookings (id, user_id, game_id, room_id, start_time, end_time, status, number_of_players, total_amount, payment_status) VALUES
(1, 3, 3, 3, DATE(NOW() - INTERVAL 2 DAY) + INTERVAL 8 HOUR, DATE(NOW() - INTERVAL 2 DAY) + INTERVAL 9 HOUR + INTERVAL 10 MINUTE, 'ACCEPTED', 2, 233.00, 'PAID'),
(2, 6, 6, 6, DATE(NOW() - INTERVAL 5 DAY) + INTERVAL 10 HOUR, DATE(NOW() - INTERVAL 5 DAY) + INTERVAL 12 HOUR, 'CANCELLED', 4, 1600.00, 'UNPAID'),
(3, 9, 9, 9, DATE(NOW() - INTERVAL 8 DAY) + INTERVAL 12 HOUR, DATE(NOW() - INTERVAL 8 DAY) + INTERVAL 13 HOUR + INTERVAL 20 MINUTE, 'CANCELLED', 1, 333.00, 'UNPAID'),
(4, 10, 10, 10, DATE(NOW() - INTERVAL 9 DAY) + INTERVAL 14 HOUR, DATE(NOW() - INTERVAL 9 DAY) + INTERVAL 15 HOUR + INTERVAL 20 MINUTE, 'PENDING', 4, 853.00, 'UNPAID'),
(5, 11, 1, 1, DATE(NOW()) + INTERVAL 16 HOUR, DATE(NOW()) + INTERVAL 17 HOUR, 'PENDING', 3, 360.00, 'UNPAID'),
(6, 12, 2, 2, DATE(NOW() - INTERVAL 1 DAY) + INTERVAL 18 HOUR, DATE(NOW() - INTERVAL 1 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE, 'ACCEPTED', 4, 900.00, 'PAID'),
(7, 13, 4, 4, DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 20 HOUR, DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 21 HOUR + INTERVAL 15 MINUTE, 'PENDING', 3, 488.00, 'UNPAID'),
(8, 14, 5, 5, DATE(NOW() - INTERVAL 4 DAY) + INTERVAL 8 HOUR, DATE(NOW() - INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'ACCEPTED', 5, 550.00, 'PAID'),
(9, 15, 7, 7, DATE(NOW() - INTERVAL 6 DAY) + INTERVAL 10 HOUR, DATE(NOW() - INTERVAL 6 DAY) + INTERVAL 11 HOUR + INTERVAL 5 MINUTE, 'PENDING', 5, 758.00, 'UNPAID'),
(10, 16, 8, 8, DATE(NOW() - INTERVAL 7 DAY) + INTERVAL 12 HOUR, DATE(NOW() - INTERVAL 7 DAY) + INTERVAL 13 HOUR, 'ACCEPTED', 3, 360.00, 'PAID');

-- Insert Feedbacks
INSERT INTO feedbacks (id, user_id, booking_id, rating, comment, feedback_date) VALUES
(1, 3, 1, 2, 'Too short and not realistic', NOW() - INTERVAL 2 DAY),
(2, 6, 2, 5, 'Fantasy world is immersive', NOW() - INTERVAL 5 DAY),
(3, 9, 3, 3, 'City simulation was interesting', NOW() - INTERVAL 8 DAY),
(4, 10, 4, 4, 'Underwater exploration was breathtaking', NOW() - INTERVAL 9 DAY),
(5, 11, 5, 4, 'Good experience but could be longer', NOW() - INTERVAL 1 DAY),
(6, 12, 6, 5, 'Incredible graphics and fun gameplay', NOW() - INTERVAL 1 DAY),
(7, 13, 7, 3, 'Average experience, needs improvement', NOW() - INTERVAL 3 DAY),
(8, 14, 8, 3, 'Loved every moment in the sports arena', NOW() - INTERVAL 4 DAY),
(9, 15, 9, 4, 'Nice adventure, headset was smooth', NOW() - INTERVAL 6 DAY),
(10, 16, 10, 4, 'Excellent quality and thrilling session!', NOW() - INTERVAL 7 DAY);

-- Mock status logs trong 30 ngày
INSERT INTO status_logs (component, status, timestamp, message) VALUES
('server', 'UP', DATE(NOW() - INTERVAL 1 DAY) + INTERVAL 4 HOUR, 'Server initialized after successful deployment'),
('database', 'OK', DATE(NOW() - INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Database connection pool check successful'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 1 DAY) + INTERVAL 14 HOUR, 'Redis cache high memory usage alert'),
('server', 'DOWN', DATE(NOW() - INTERVAL 1 DAY) + INTERVAL 21 HOUR, 'Graceful shutdown initiated by admin'),

('database', 'OK', DATE(NOW() - INTERVAL 2 DAY) + INTERVAL 7 HOUR, 'Daily database backup completed'),
('redis', 'OK', DATE(NOW() - INTERVAL 2 DAY) + INTERVAL 13 HOUR, 'Redis replication status healthy'),
('server', 'UP', DATE(NOW() - INTERVAL 2 DAY) + INTERVAL 19 HOUR, 'Application server re-deployed and running'),

('server', 'DOWN', DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 1 HOUR, 'Unexpected process crash on main server'),
('database', 'ERROR', DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 5 HOUR, 'Failed to acquire database connection'),
('database', 'OK', DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Database connection issue resolved'),
('redis', 'OK', DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 15 HOUR, 'Redis health check passed'),
('server', 'UP', DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 22 HOUR, 'Server stable after critical fix'),

('database', 'OK', DATE(NOW() - INTERVAL 4 DAY) + INTERVAL 2 HOUR, 'DB read/write speed normal'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 4 DAY) + INTERVAL 8 HOUR, 'Redis instance failure, attempting failover'),
('redis', 'OK', DATE(NOW() - INTERVAL 4 DAY) + INTERVAL 13 HOUR, 'Redis failover complete, new primary online'),
('server', 'UP', DATE(NOW() - INTERVAL 4 DAY) + INTERVAL 18 HOUR, 'Server processing routine traffic'),

('database', 'ERROR', DATE(NOW() - INTERVAL 5 DAY) + INTERVAL 6 HOUR, 'Too many concurrent connections to DB'),
('server', 'DOWN', DATE(NOW() - INTERVAL 5 DAY) + INTERVAL 11 HOUR, 'Server automatically scaled down'),
('redis', 'OK', DATE(NOW() - INTERVAL 5 DAY) + INTERVAL 15 HOUR, 'Redis operating normally'),
('database', 'OK', DATE(NOW() - INTERVAL 5 DAY) + INTERVAL 20 HOUR, 'DB connection limit restored'),

('server', 'UP', DATE(NOW() - INTERVAL 6 DAY) + INTERVAL 0 HOUR, 'New server instance spun up'),
('database', 'OK', DATE(NOW() - INTERVAL 6 DAY) + INTERVAL 5 HOUR, 'Database health check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 6 DAY) + INTERVAL 14 HOUR, 'Redis cache hit ratio stable'),
('server', 'DOWN', DATE(NOW() - INTERVAL 6 DAY) + INTERVAL 23 HOUR, 'Server started scheduled maintenance'),

('database', 'OK', DATE(NOW() - INTERVAL 7 DAY) + INTERVAL 3 HOUR, 'Maintenance finished: Database ready'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 7 DAY) + INTERVAL 10 HOUR, 'Redis network latency spike'),
('redis', 'OK', DATE(NOW() - INTERVAL 7 DAY) + INTERVAL 12 HOUR, 'Redis latency normalized'),
('server', 'UP', DATE(NOW() - INTERVAL 7 DAY) + INTERVAL 18 HOUR, 'Maintenance finished: Server live'),

('database', 'ERROR', DATE(NOW() - INTERVAL 8 DAY) + INTERVAL 1 HOUR, 'Critical error: DB storage full'),
('server', 'DOWN', DATE(NOW() - INTERVAL 8 DAY) + INTERVAL 7 HOUR, 'Server shut down due to DB dependency'),
('database', 'OK', DATE(NOW() - INTERVAL 8 DAY) + INTERVAL 15 HOUR, 'DB storage expanded, service restored'),
('redis', 'OK', DATE(NOW() - INTERVAL 8 DAY) + INTERVAL 21 HOUR, 'Redis OK'),
('server', 'UP', DATE(NOW() - INTERVAL 8 DAY) + INTERVAL 23 HOUR, 'Server restarted after DB fix'),

('database', 'OK', DATE(NOW() - INTERVAL 9 DAY) + INTERVAL 2 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 9 DAY) + INTERVAL 8 HOUR, 'Redis OK'),
('server', 'UP', DATE(NOW() - INTERVAL 9 DAY) + INTERVAL 15 HOUR, 'Server processing requests'),

('database', 'OK', DATE(NOW() - INTERVAL 10 DAY) + INTERVAL 4 HOUR, 'DB check OK'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 10 DAY) + INTERVAL 11 HOUR, 'Redis connection failure'),
('redis', 'OK', DATE(NOW() - INTERVAL 10 DAY) + INTERVAL 16 HOUR, 'Redis connection restored'),
('server', 'DOWN', DATE(NOW() - INTERVAL 10 DAY) + INTERVAL 20 HOUR, 'Unexpected server termination'),

('database', 'OK', DATE(NOW() - INTERVAL 11 DAY) + INTERVAL 6 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 11 DAY) + INTERVAL 13 HOUR, 'Redis OK'),
('server', 'UP', DATE(NOW() - INTERVAL 11 DAY) + INTERVAL 18 HOUR, 'Server started manually'),

('server', 'UP', DATE(NOW() - INTERVAL 12 DAY) + INTERVAL 1 HOUR, 'Server fully operational'),
('database', 'ERROR', DATE(NOW() - INTERVAL 12 DAY) + INTERVAL 9 HOUR, 'DB indexing task failed'),
('database', 'OK', DATE(NOW() - INTERVAL 12 DAY) + INTERVAL 15 HOUR, 'DB indexing successfully recovered'),
('redis', 'OK', DATE(NOW() - INTERVAL 12 DAY) + INTERVAL 22 HOUR, 'Redis OK'),

('database', 'OK', DATE(NOW() - INTERVAL 13 DAY) + INTERVAL 2 HOUR, 'DB check OK'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 13 DAY) + INTERVAL 8 HOUR, 'Redis authentication failure'),
('redis', 'OK', DATE(NOW() - INTERVAL 13 DAY) + INTERVAL 14 HOUR, 'Redis auth fixed'),
('server', 'DOWN', DATE(NOW() - INTERVAL 13 DAY) + INTERVAL 20 HOUR, 'Server memory leak detected'),

('server', 'UP', DATE(NOW() - INTERVAL 14 DAY) + INTERVAL 4 HOUR, 'Server restarted after memory optimization'),
('database', 'OK', DATE(NOW() - INTERVAL 14 DAY) + INTERVAL 11 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 14 DAY) + INTERVAL 17 HOUR, 'Redis OK'),

('database', 'OK', DATE(NOW() - INTERVAL 15 DAY) + INTERVAL 6 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 15 DAY) + INTERVAL 13 HOUR, 'Redis OK'),
('server', 'UP', DATE(NOW() - INTERVAL 15 DAY) + INTERVAL 20 HOUR, 'Server processing requests'),

('server', 'DOWN', DATE(NOW() - INTERVAL 16 DAY) + INTERVAL 1 HOUR, 'Network partition detected on server'),
('database', 'ERROR', DATE(NOW() - INTERVAL 16 DAY) + INTERVAL 8 HOUR, 'DB connection lost due to network'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 16 DAY) + INTERVAL 11 HOUR, 'Redis disconnected'),
('server', 'UP', DATE(NOW() - INTERVAL 16 DAY) + INTERVAL 17 HOUR, 'Network restored, Server back online'),
('database', 'OK', DATE(NOW() - INTERVAL 16 DAY) + INTERVAL 22 HOUR, 'DB connection restored'),

('database', 'OK', DATE(NOW() - INTERVAL 17 DAY) + INTERVAL 3 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 17 DAY) + INTERVAL 10 HOUR, 'Redis OK'),
('server', 'DOWN', DATE(NOW() - INTERVAL 17 DAY) + INTERVAL 16 HOUR, 'Server load balancer failure'),

('server', 'UP', DATE(NOW() - INTERVAL 18 DAY) + INTERVAL 0 HOUR, 'Load balancer fixed, Server accessible'),
('database', 'OK', DATE(NOW() - INTERVAL 18 DAY) + INTERVAL 8 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 18 DAY) + INTERVAL 15 HOUR, 'Redis OK'),
('database', 'ERROR', DATE(NOW() - INTERVAL 18 DAY) + INTERVAL 22 HOUR, 'DB replication lag alert'),

('database', 'OK', DATE(NOW() - INTERVAL 19 DAY) + INTERVAL 4 HOUR, 'DB replication lag cleared'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 19 DAY) + INTERVAL 10 HOUR, 'Redis cache flush failure'),
('redis', 'OK', DATE(NOW() - INTERVAL 19 DAY) + INTERVAL 14 HOUR, 'Redis cache manually cleared'),
('server', 'UP', DATE(NOW() - INTERVAL 19 DAY) + INTERVAL 20 HOUR, 'Server processing requests'),

('database', 'ERROR', DATE(NOW() - INTERVAL 20 DAY) + INTERVAL 1 HOUR, 'DB query timeout detected'),
('server', 'DOWN', DATE(NOW() - INTERVAL 20 DAY) + INTERVAL 7 HOUR, 'Server instance terminated by mistake'),
('server', 'UP', DATE(NOW() - INTERVAL 20 DAY) + INTERVAL 13 HOUR, 'New server instance launched'),
('redis', 'OK', DATE(NOW() - INTERVAL 20 DAY) + INTERVAL 19 HOUR, 'Redis OK'),

('database', 'OK', DATE(NOW() - INTERVAL 21 DAY) + INTERVAL 2 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 21 DAY) + INTERVAL 11 HOUR, 'Redis OK'),
('server', 'UP', DATE(NOW() - INTERVAL 21 DAY) + INTERVAL 20 HOUR, 'Server running smoothly'),

('database', 'OK', DATE(NOW() - INTERVAL 22 DAY) + INTERVAL 6 HOUR, 'DB check OK'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 22 DAY) + INTERVAL 12 HOUR, 'Redis out of sync error'),
('server', 'DOWN', DATE(NOW() - INTERVAL 22 DAY) + INTERVAL 17 HOUR, 'Scheduled server restart for patch'),
('redis', 'OK', DATE(NOW() - INTERVAL 22 DAY) + INTERVAL 23 HOUR, 'Redis sync repaired'),

('server', 'UP', DATE(NOW() - INTERVAL 23 DAY) + INTERVAL 3 HOUR, 'Server patch applied, UP'),
('database', 'ERROR', DATE(NOW() - INTERVAL 23 DAY) + INTERVAL 10 HOUR, 'DB slow query detected'),
('database', 'OK', DATE(NOW() - INTERVAL 23 DAY) + INTERVAL 15 HOUR, 'DB query optimized, performance OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 23 DAY) + INTERVAL 21 HOUR, 'Redis OK'),

('database', 'OK', DATE(NOW() - INTERVAL 24 DAY) + INTERVAL 1 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 24 DAY) + INTERVAL 9 HOUR, 'Redis OK'),
('server', 'DOWN', DATE(NOW() - INTERVAL 24 DAY) + INTERVAL 16 HOUR, 'Server maintenance mode activated'),
('server', 'UP', DATE(NOW() - INTERVAL 24 DAY) + INTERVAL 23 HOUR, 'Server maintenance completed'),

('database', 'ERROR', DATE(NOW() - INTERVAL 25 DAY) + INTERVAL 4 HOUR, 'DB transaction rollback failure'),
('redis', 'OK', DATE(NOW() - INTERVAL 25 DAY) + INTERVAL 12 HOUR, 'Redis OK'),
('database', 'OK', DATE(NOW() - INTERVAL 25 DAY) + INTERVAL 18 HOUR, 'DB issue resolved'),
('server', 'UP', DATE(NOW() - INTERVAL 25 DAY) + INTERVAL 22 HOUR, 'Server OK'),

('server', 'DOWN', DATE(NOW() - INTERVAL 26 DAY) + INTERVAL 2 HOUR, 'Server auto-scaling failure'),
('database', 'OK', DATE(NOW() - INTERVAL 26 DAY) + INTERVAL 9 HOUR, 'DB check OK'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 26 DAY) + INTERVAL 15 HOUR, 'Redis configuration mismatch'),
('redis', 'OK', DATE(NOW() - INTERVAL 26 DAY) + INTERVAL 20 HOUR, 'Redis config updated'),

('database', 'OK', DATE(NOW() - INTERVAL 27 DAY) + INTERVAL 5 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 27 DAY) + INTERVAL 13 HOUR, 'Redis OK'),
('server', 'UP', DATE(NOW() - INTERVAL 27 DAY) + INTERVAL 19 HOUR, 'Server scaled up'),

('server', 'UP', DATE(NOW() - INTERVAL 28 DAY) + INTERVAL 1 HOUR, 'Server fully operational'),
('database', 'ERROR', DATE(NOW() - INTERVAL 28 DAY) + INTERVAL 7 HOUR, 'DB deadlocks detected'),
('redis', 'ERROR', DATE(NOW() - INTERVAL 28 DAY) + INTERVAL 14 HOUR, 'Redis connection failure'),
('database', 'OK', DATE(NOW() - INTERVAL 28 DAY) + INTERVAL 21 HOUR, 'DB deadlocks resolved'),

('database', 'OK', DATE(NOW() - INTERVAL 29 DAY) + INTERVAL 4 HOUR, 'DB check OK'),
('redis', 'OK', DATE(NOW() - INTERVAL 29 DAY) + INTERVAL 11 HOUR, 'Redis OK'),
('server', 'DOWN', DATE(NOW() - INTERVAL 29 DAY) + INTERVAL 16 HOUR, 'Server shutdown for security patch'),
('server', 'UP', DATE(NOW() - INTERVAL 29 DAY) + INTERVAL 23 HOUR, 'Server security patch applied'),

('database', 'ERROR', DATE(NOW() - INTERVAL 30 DAY) + INTERVAL 2 HOUR, 'DB file system error'),
('redis', 'OK', DATE(NOW() - INTERVAL 30 DAY) + INTERVAL 10 HOUR, 'Redis OK'),
('server', 'UP', DATE(NOW() - INTERVAL 30 DAY) + INTERVAL 15 HOUR, 'Server OK'),
('database', 'OK', DATE(NOW() - INTERVAL 30 DAY) + INTERVAL 20 HOUR, 'DB file system fixed');





