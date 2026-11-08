// Hàm này ĐƯỢC sử dụng trong App.js -> Sẽ có mặt trong bundle production
export function add(a, b) {
  console.log("Thực hiện phép cộng:", a, b);
  return a + b;
}

// Hàm này KHÔNG ĐƯỢC sử dụng ở bất kỳ đâu -> Webpack sẽ Tree-Shake (loại bỏ hoàn toàn) khi build production!
export function unusedHeavyFunctionThatWillBeTreeShaken() {
  const bigArray = new Array(100000).fill("Dữ liệu dư thừa không bao giờ gọi");
  console.log("Hàm này chỉ làm phình to code nếu không có Webpack Tree Shaking!", bigArray);
  return bigArray;
}
