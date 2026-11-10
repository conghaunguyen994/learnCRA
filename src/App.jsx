import React, { useState } from 'react';
import './App.css';
import { add } from './utils/math';
import _ from 'lodash'

function App() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(prev => add(prev, 1));
  };

  return (
    <div className="container">
      <header className="header">
        <span className="badge">Create React App (Webpack Under the Hood)</span>
        <h1 className="title">Tại Sao Cần Webpack Để Deploy Production?</h1>
        <p className="subtitle">
          Minh họa thực tế sự khác biệt giữa Source Code React lúc dev và Bundle sau khi Webpack tối ưu
        </p>
      </header>

      <div className="grid">
        {/* Cột 1: Không có Webpack */}
        <div className="card danger">
          <h2 className="card-title">❌ Nếu đưa trực tiếp file `src/` lên Server</h2>
          <ul className="list">
            <li>
              <strong>1. Lỗi cú pháp JSX:</strong> Trình duyệt sẽ quăng lỗi <code>Uncaught SyntaxError: Unexpected token '&lt;'</code> vì không hiểu cú pháp JSX.
            </li>
            <li>
              <strong>2. Bare Module Imports:</strong> Trình duyệt không biết <code>import React from 'react'</code> là ở đâu vì không tự tìm trong <code>node_modules</code>.
            </li>
            <li>
              <strong>3. Import CSS/Images trong JS:</strong> Trình duyệt không hỗ trợ <code>import './App.css'</code> bên trong JavaScript file.
            </li>
            <li>
              <strong>4. HTTP Waterfall:</strong> Dự án lớn có hàng trăm/ngàn file, nếu không bundle thì trình duyệt phải gửi hàng ngàn request làm nghẽn mạng.
            </li>
            <li>
              <strong>5. Dung lượng khổng lồ & Lộ code:</strong> File chưa nén (minified), còn nguyên comment, biến dài, và mã dư thừa không dùng.
            </li>
          </ul>
        </div>

        {/* Cột 2: Khi có Webpack qua npm run build */}
        <div className="card success">
          <h2 className="card-title">✅ Khi Webpack xử lý (Production Build)</h2>
          <ul className="list">
            <li>
              <strong>1. Babel Transpilation:</strong> Dịch toàn bộ JSX và JS hiện đại về JavaScript thuần mà 100% trình duyệt đều chạy được.
            </li>
            <li>
              <strong>2. Module Bundling:</strong> Gom hàng trăm file mã nguồn & thư viện thành 1 hoặc vài file JS tối ưu (<code>main.[hash].js</code>).
            </li>
            <li>
              <strong>3. Minification (Terser):</strong> Xóa sạch khoảng trắng, comment, đổi tên biến thành 1 ký tự, giảm dung lượng 70-80%.
            </li>
            <li>
              <strong>4. Tree Shaking:</strong> Tự động phát hiện và xóa bỏ các hàm không bao giờ gọi (hàm <code>unusedHeavyFunction</code> trong demo này bị xóa hoàn toàn).
            </li>
            <li>
              <strong>5. Cache Busting:</strong> Sinh tên file kèm content hash (ví dụ: <code>main.a1b2c3d4.js</code>), code đổi thì hash đổi, tránh lỗi cache cũ.
            </li>
          </ul>
        </div>
      </div>

      <div className="interactive-box">
        <h3>Thử nghiệm tương tác React State:</h3>
        <p style={{ margin: '0.75rem 0', fontSize: '1.2rem' }}>
          Giá trị Counter hiện tại: <strong style={{ color: '#38bdf8' }}>{count}</strong>
        </p>
        <button className="counter-btn" onClick={handleIncrement}>
          Bấm để tăng (+1) qua hàm add()
        </button>
      </div>

      <div className="steps-card">
        <h3>🔍 Cách kiểm chứng Webpack hoạt động:</h3>
        <p style={{ marginTop: '0.5rem', color: '#cbd5e1' }}>
          Hãy chạy lệnh build để xem Webpack đóng gói vào thư mục <code>build/</code>:
        </p>
        <div className="code-block">
          npm run build<br />
          npx serve -s build
        </div>
      </div>
    </div>
  );
}

export default App;
