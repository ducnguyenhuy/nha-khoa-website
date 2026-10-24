# Nha Khoa IVY SMILE

Website giới thiệu phòng khám nha khoa, viết bằng HTML/CSS/JavaScript thuần (không framework, không cần build). Bố cục tham khảo từ nhakhoahanoihn.com và đổi sang thương hiệu IVY SMILE.

## Cấu trúc

```
index.html            Trang chủ (toàn bộ nội dung)
assets/css/style.css  Giao diện, responsive
assets/js/main.js     Menu mobile, slider, hiệu ứng cuộn, popup đặt lịch
assets/img/           Logo, banner, ảnh bác sĩ
```

## Các phần trên trang

- Header cố định, menu thả xuống (desktop) và menu trượt (mobile)
- Banner dạng slider (thêm `<div class="slide">` là có nút chuyển ảnh)
- Điểm khác biệt, 12 dịch vụ, giới thiệu, đội ngũ bác sĩ, tin tức
- Footer, nút Zalo / Messenger / gọi điện, nút lên đầu trang
- Popup đặt lịch có kiểm tra họ tên và số điện thoại

## Chạy trên máy

Mở thẳng `index.html` bằng trình duyệt, hoặc chạy server tĩnh:

```bash
npx serve .
```

## Đưa lên GitHub Pages

```bash
git init
git add .
git commit -m "Website Nha Khoa IVY SMILE"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/<ten-repo>.git
git push -u origin main
```

Sau đó vào **Settings → Pages**, chọn *Deploy from a branch*, nhánh `main`, thư mục `/ (root)`. Vài phút sau web chạy ở `https://<tai-khoan>.github.io/<ten-repo>/`.

## Cần thay bằng thông tin thật

Tìm `TODO` trong `index.html`:

- Hotline `0900 000 000` (header, footer, nút gọi, link Zalo)
- Địa chỉ `[Địa chỉ phòng khám]` và giờ mở cửa
- Link fanpage Facebook và Messenger
- Tên, học vị, chuyên môn của bác sĩ trong phần **Đội ngũ**

Form đặt lịch hiện chỉ hiện thông báo cảm ơn. Muốn nhận dữ liệu thật, đặt `BOOKING_ENDPOINT` ở đầu `assets/js/main.js` thành URL của Formspree hoặc Google Apps Script.
