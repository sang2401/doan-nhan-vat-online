# Đoán nhân vật qua bóng đen – trò chơi trực tuyến

## Đưa lên Render.com
1. Giải nén ZIP, đưa toàn bộ thư mục dự án lên một repository GitHub (để nguyên `server.js`, `package.json`, `public/`).
2. Vào Render → New → Web Service → kết nối GitHub repository.
3. Runtime: Node; Build Command: `npm install`; Start Command: `npm start`.
4. Chọn gói phù hợp và Deploy. Khi triển khai xong, mở đường dẫn HTTPS do Render cung cấp.
5. Giáo viên chọn **Tạo phòng**, chiếu QR; học sinh dùng điện thoại có Internet quét QR và nhập tên.
6. Bấm **Bắt đầu**. Mỗi câu có 20 giây. Đúng: nhận 500–1000 điểm theo tốc độ; sai: 0 điểm. Khi tất cả đã trả lời hoặc hết giờ, câu được mở đáp án. Giáo viên bấm **Câu tiếp theo** để chuyển.

## Quy tắc và lưu ý
- Xếp hạng: tổng điểm giảm dần, sau đó tổng thời gian tăng dần.
- Âm thanh của giáo viên phát khi mở đáp án; của học sinh phát khi trả lời đúng, cho đến khi sang câu mới. Trình duyệt có thể chặn tự phát âm thanh nếu chưa có thao tác chạm.
- Máy chủ giữ phòng và điểm trong bộ nhớ; khởi động lại server sẽ mất phòng và kết quả. Render free có thể ngủ hoặc khởi động lại; cần dịch vụ ổn định cho tiết học.
- Chỉ giáo viên điều khiển bắt đầu/chuyển câu; giáo viên cần giữ tab phòng mở. Nếu tab giáo viên ngắt kết nối, phòng kết thúc.
- Tên học sinh và điểm hiển thị cho mọi người trong phòng. Không nhập thông tin cá nhân nhạy cảm.
- Mỗi thiết bị nên dùng một tên. Hệ thống chưa chống gian lận nhiều tài khoản hoặc chống can thiệp nâng cao.
- Tài nguyên ảnh/nhạc lấy từ tệp người dùng cung cấp; cần bảo đảm quyền sử dụng khi công khai trên Internet.

## Chạy trên máy tính để thử
Cài Node.js 20+, chạy `npm install`, `npm start`, mở http://localhost:3000. Link localhost không thể dùng từ điện thoại khác; cần triển khai HTTPS công khai để quét QR từ nhiều thiết bị.

## Sửa lỗi khung QR trắng
QR nay được tạo tại `/qr.svg?room=123456` trên chính máy chủ, không phụ thuộc CDN bên ngoài. Triển khai lại sau khi thay `server.js`, `package.json`, `public/index.html`, rồi tải lại trang bằng Ctrl+F5.
