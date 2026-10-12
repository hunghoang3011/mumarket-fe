/*
 * Cờ bật/tắt dữ liệu demo — ĐIỂM DUY NHẤT cần đổi khi đem đi demo
 * hoặc khi nối backend thật.
 *
 * - Mặc định BẬT. Tắt bằng biến môi trường: NEXT_PUBLIC_GALAXY_DEMO=0
 * - Khi tắt: các hàm trong src/demo/index.ts trả về trạng thái trống /
 *   "chưa cấu hình" trung thực, DemoBar không hiển thị.
 */
export const DEMO_ENABLED = process.env.NEXT_PUBLIC_GALAXY_DEMO !== "0";

/** Cookie chọn nhân cách demo (khách / khách hàng / quản trị). */
export const DEMO_ROLE_COOKIE = "ga_demo_role";

/** Khóa localStorage của lớp phủ thao tác demo (báo chuyển khoản, duyệt đơn…). */
export const DEMO_STORAGE_KEY = "ga-demo-v1";
