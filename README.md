# Nhân vật bí ẩn — Bản sửa thi đấu nhiều học sinh

## Lỗi đã sửa
Ở bản trước, khi học sinh đầu tiên chọn đúng, `r.revealed=true` khiến máy chủ mở đáp án cho cả phòng ngay lập tức và khóa các học sinh khác. Bản này chỉ mở đáp án khi **tất cả học sinh đã trả lời** hoặc **20 giây đã kết thúc**.

- Mỗi học sinh trả lời một lần mỗi câu.
- Trả lời đúng được cộng điểm dựa trên thời gian; trả lời sai 0 điểm.
- Thứ hạng xếp theo tổng điểm, rồi tổng thời gian trả lời.
- Giáo viên có thể bấm câu tiếp theo, hủy đồng hồ của câu cũ.
- Ảnh, nhạc, QR và giao diện giữ nguyên.

## Triển khai
Giải nén và tải nội dung thư mục lên repository GitHub (giữ đúng `server.js`, `package.json`, `public/`). Với lỗi này, bạn có thể **chỉ cần thay `server.js`**. Sau đó trong Render chọn **Manual Deploy → Deploy latest commit**.

Cài đặt Render: Build Command `npm install`, Start Command `npm start`.

> Lưu ý: dịch vụ đang dùng bộ nhớ RAM để giữ phòng và kết quả, vì vậy Render khởi động lại sẽ xóa phòng đang chơi. Bản này chưa được kiểm thử trực tiếp trên Render.
