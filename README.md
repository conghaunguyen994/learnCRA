# 01-cra-webpack-demo: Tại Sao Cần Webpack Để Deploy Production?

Dự án này sử dụng **Create React App** (`react-scripts` - đóng gói sẵn **Webpack 5** bên trong) nhằm giải thích trực quan và thực tế lý do **tại sao chúng ta không thể đưa trực tiếp source code lên server, mà bắt buộc phải có một Module Bundler như Webpack để build Production**.

---

## 🎯 5 Lý Do Bắt Buộc Cần Webpack Khi Deploy Production

### 1. Trình duyệt KHÔNG hiểu JSX và cú pháp ES6+ nâng cao
- **Thực tế:** Trong thư mục `src/App.js`, ta viết code dạng `<div className="container">...</div>`.
- **Nếu không có Webpack:** Đưa file này trực tiếp lên hosting (như Nginx, Vercel, Netlify), trình duyệt mở lên sẽ báo lỗi đỏ lòm:
  `Uncaught SyntaxError: Unexpected token '<'`
- **Webpack giải quyết:** Webpack sử dụng `babel-loader` để dịch toàn bộ JSX thành `React.createElement(...)` hoặc cú pháp `_jsx(...)` của JavaScript thuần túy.

### 2. Trình duyệt không biết "Bare Module Import" (`node_modules`)
- **Thực tế:** Code viết `import React from 'react';`.
- **Nếu không có Webpack:** Trình duyệt chỉ hỗ trợ import bằng đường dẫn tương đối (VD: `./App.js`) hoặc URL tuyệt đối (`https://...`). Trình duyệt hoàn toàn không biết tìm package `react` trong thư mục `node_modules` ở đâu trên máy chủ.
- **Webpack giải quyết:** Webpack phân tích cây phụ thuộc (Dependency Graph), lần theo các `import`, tìm đúng mã nguồn trong `node_modules` và gom vào bundle.

### 3. Trình duyệt không thể import file non-JS (`.css`, `.png`, `.svg`) trong file JS
- **Thực tế:** Trong `App.js` có dòng `import './App.css';`.
- **Nếu không có Webpack:** Trình duyệt sẽ báo lỗi cú pháp vì file JavaScript không thể import file CSS trực tiếp.
- **Webpack giải quyết:** Nhờ hệ thống Loader (`css-loader`, `mini-css-extract-plugin`), Webpack tách CSS ra thành file `.css` độc lập, tối ưu hóa và chèn thẻ `<link rel="stylesheet">` vào HTML.

### 4. Vấn đề nghẽn mạng (HTTP Waterfall) & Dung lượng file
- **Thực tế:** Một ứng dụng trung bình có thể import hàng chục file code và hàng trăm file thư viện con.
- **Nếu không có Webpack:** Trình duyệt phải gửi hàng trăm requests riêng lẻ để tải từng file, gây tắc nghẽn mạng nghiêm trọng.
- **Webpack giải quyết:**
  - **Bundling:** Gom toàn bộ thành 1 - 2 file JS chính.
  - **Minification (TerserPlugin):** Xoá khoảng trắng, comment, rút gọn tên hàm/biến (từ `handleIncrement` thành `e`).
  - **Tree Shaking:** Trong file `src/utils/math.js` có hàm `unusedHeavyFunctionThatWillBeTreeShaken()`. Khi build, Webpack phát hiện hàm này không ai gọi nên tự động xóa bỏ hoàn toàn khỏi file bundle cuối cùng.

### 5. Vấn đề Cache Invalidation (Cache Busting)
- **Thực tế:** Trình duyệt của người dùng thường lưu cache các file tĩnh (.js, .css). Khi bạn cập nhật tính năng mới hay sửa bug, người dùng sẽ không thấy thay đổi nếu tên file vẫn giữ nguyên (`main.js`).
- **Webpack giải quyết:** Tự động gán mã hash nội dung vào tên file:
  `main.a7b9c12d.js`
  Khi code thay đổi, mã hash thay đổi -> Trình duyệt bắt buộc tải file mới. Khi code không đổi, trình duyệt tận dụng cache 100%.

---

## 🚀 Hướng Dẫn Thực Hành & Kiểm Chứng

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Chạy ở môi trường Development
```bash
npm start
```
*Lúc này Webpack Dev Server chạy ở bộ nhớ RAM (In-Memory), phục vụ cho việc lập trình nhanh.*

### Bước 3: Build ra bản Production (Đây là lúc Webpack thực hiện phép màu!)
```bash
npm run build
```
Quan sát thư mục **`build/`** vừa được sinh ra:
```text
build/
├── static/
│   ├── css/
│   │   └── main.[hash].css      <-- CSS đã được tách và nén cực nhỏ
│   └── js/
│       └── main.[hash].js       <-- Toàn bộ React + Code của bạn đã được nén, Tree-shake
└── index.html                   <-- Webpack đã tự động chèn đúng link file có hash vào đây
```

### Bước 4: Preview môi trường Production trên máy local
```bash
npx serve -s build
```
Mở đường link hiện ra trên trình duyệt và mở **DevTools (F12) -> Network / Sources**: Bạn sẽ thấy ứng dụng tải cực nhanh chỉ với 1 file JS nén duy nhất!
