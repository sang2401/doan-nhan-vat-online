# NHÂN VẬT BÍ ẨN — kết quả riêng cho học sinh

## Cách hoạt động
- Mỗi học sinh trả lời một lần; ngay sau khi máy chủ chấm câu, học sinh đó thấy ảnh gốc, đúng/sai, điểm và nghe nhạc tương ứng. Các học sinh chưa nộp vẫn tiếp tục thấy bóng đen và bốn đáp án.
- Giáo viên vẫn thấy bóng đen đến khi **hết 30 giây** HOẶC **tất cả học sinh đang có trong phòng đã trả lời**.
- Khi đáp án công bố, màn hình giáo viên và các học sinh chưa trả lời cũng thấy ảnh gốc và nhạc.
- Kết thúc câu 4/4, nút **Chơi lại** trả về màn hình **Bắt đầu** và đặt lại điểm.

## Cập nhật GitHub
Chỉ cần thay `server.js` và `public/index.html` trong repository. Các file hình ảnh và nhạc được giữ nguyên. Deploy lại Render từ commit mới; tạo phòng mới để kiểm tra.

## Kiểm thử gợi ý
1. Ba máy học sinh A, B, C đăng nhập trước khi bấm Bắt đầu.
2. A trả lời sau 3 giây: chỉ A thấy ảnh gốc, B/C vẫn chọn được.
3. B trả lời: B thấy ảnh gốc, C vẫn chọn được. Giáo viên vẫn thấy bóng đen.
4. C trả lời: giáo viên thấy đáp án ngay, không cần chờ đủ 30 giây.
5. Trong lượt khác, một học sinh chưa trả lời: giáo viên chỉ thấy đáp án khi hết 30 giây.

**Chú ý:** Học sinh tham gia muộn sau khi mọi người đã nộp có thể gặp câu đã kết thúc. Cho cả lớp vào phòng trước khi bắt đầu.
