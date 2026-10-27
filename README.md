# NHÂN VẬT BÍ ẨN — bản trực tuyến

## GitHub + Render
1. Giải nén ZIP. Upload **toàn bộ nội dung bên trong thư mục** lên GitHub, giữ nguyên `public/assets`.
2. Trong Render tạo hoặc chỉnh Web Service, chọn repository, nhánh `main`, Root Directory để trống.
3. Build Command: `npm install`; Start Command: `npm start`.
4. Mở URL Render ở máy giáo viên (không thêm `?room`). Phòng và QR được tạo tự động.
5. Học sinh quét QR, nhập tên, giáo viên bấm Bắt đầu / Câu tiếp theo.
6. Kiểm tra `https://TEN-WEB.onrender.com/qr.png?room=123456` phải hiện ảnh QR.

Lưu ý: phòng/điểm lưu trong RAM; khi Render khởi động lại, phòng và điểm sẽ mất. Không triển khai nhiều instance nếu chưa có bộ lưu trạng thái chung.
