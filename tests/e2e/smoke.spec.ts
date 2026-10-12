import { expect, test } from "@playwright/test";

/*
 * E2E smoke cho bản demo FE: mọi nhóm route render đúng nội dung chính,
 * flow demo (đăng nhập → mua → báo chuyển khoản → admin duyệt) chạy được,
 * điều hướng bàn phím cơ bản hoạt động. Chạy trên 3 viewport (config).
 */

test.beforeEach(async ({ page }) => {
  // Mọi test bắt đầu ở trạng thái khách, overlay trống
  await page.goto("/");
  await page.evaluate(() => {
    document.cookie = "ga_demo_role=guest; path=/; max-age=31536000";
    window.localStorage.removeItem("ga-demo-v1");
  });
});

test.describe("Khu công khai", () => {
  test("trang chủ: hero, 5 thẻ game, lợi ích, bước mua, cập nhật", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /THẦN BINH CÔNG NGHỆ/i,
      }),
    ).toBeVisible();
    for (const slug of [
      "vo-lam-mien-phi",
      "vo-lam-mobile-1",
      "kiem-the-origin",
      "mu-luc-dia-vng",
      "vo-lam-2-pc",
    ]) {
      // Mỗi slug có 3 bản layout trong DOM (dọc/2 cột/1 cột) — chỉ cần bản
      // phù hợp viewport hiện ra.
      await expect(
        page.getByTestId(`game-card-${slug}`).filter({ visible: true }).first(),
      ).toBeVisible();
    }
    await expect(
      page.getByRole("heading", { name: /ĐỒNG HÀNH CÙNG HÀNH TRÌNH/i }),
    ).toBeVisible();
    await expect(page.getByText("Thanh toán và nhận License")).toBeVisible();
    await expect(
      page.getByText("Bản quyền được cấp sau khi khoản chuyển được xác nhận."),
    ).toBeVisible();
    await expect(page.getByText("Dùng thử không cần chuyển khoản.")).toBeVisible();
    // đúng một h1
    expect(await page.locator("h1").count()).toBe(1);
  });

  test("trang sản phẩm: gói không chọn sẵn, giá khớp, CTA yêu cầu chọn gói", async ({
    page,
  }) => {
    await page.goto("/phan-mem/vo-lam-mobile-1");
    await expect(
      page.getByRole("heading", { level: 1, name: "Auto Võ Lâm Mobile 1" }),
    ).toBeVisible();
    // radio gói hiển thị và không có gói nào được chọn sẵn (3 gói)
    const radios = page.getByRole("radio");
    expect(await radios.count()).toBe(3);
    expect(await page.getByRole("radio", { checked: true }).count()).toBe(0);
    await expect(page.getByText("Chọn một gói")).toBeVisible();
    // giá khuyến mãi: 100.000 ₫ với giá gốc 123.456 ₫
    await expect(page.getByText("100.000 ₫").first()).toBeVisible();
    // chọn gói 30 ngày → CTA hoạt động
    await page.getByRole("radio").nth(1).check();
    const cta = page.getByRole("link", { name: /Mua gói|Mua bản quyền mới/ }).last();
    await expect(cta).toBeVisible();
  });

  test("trang sản phẩm tạm ngừng: Chưa mở bán", async ({ page }) => {
    await page.goto("/phan-mem/vo-lam-2-pc");
    await expect(page.getByText("Chưa mở bán").first()).toBeVisible();
  });

  test("slug lạ → trang 404 tiếng Việt", async ({ page }) => {
    await page.goto("/phan-mem/game-khong-ton-tai");
    await expect(
      page.getByRole("heading", { level: 1, name: /Không tìm thấy trang/ }),
    ).toBeVisible();
  });

  test("bảng giá: chip game, hàng gói, dùng thử là hàng riêng", async ({
    page,
  }) => {
    await page.goto("/bang-gia");
    await expect(
      page.getByRole("heading", { level: 1, name: "Bảng giá" }),
    ).toBeVisible();
    await expect(page.getByText("Dùng thử").first()).toBeVisible();
    // không bao giờ hiển thị giá 0 ₫ (khớp nguyên ô, tránh "100.000 ₫")
    expect(await page.getByText(/^0\s*₫$/).count()).toBe(0);
  });

  test("hướng dẫn, cập nhật, hỗ trợ, chính sách render", async ({ page }) => {
    for (const path of [
      "/huong-dan",
      "/huong-dan/cai-dat-va-kich-hoat",
      "/cap-nhat",
      "/cap-nhat/mu-5-0-3-theo-kip-ban-12-2",
      "/ho-tro",
      "/dieu-khoan",
      "/quyen-rieng-tu",
      "/chinh-sach-hoan-tien",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("header: dropdown Phần Mềm mở bằng Enter, đóng bằng Escape", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "menu đầy đủ chỉ ≥1200px");
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /Phần Mềm/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("menuitem", { name: /Auto MU Lục Địa VNG/ }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("menuitem", { name: /Auto MU Lục Địa VNG/ }),
    ).toBeHidden();
    // focus trả về nút đã mở
    await expect(trigger).toBeFocused();
  });
});

test.describe("Đăng nhập demo và khu khách hàng", () => {
  test("đăng nhập → Phần mềm của tôi hiển thị bản quyền và banner đơn chờ", async ({
    page,
  }) => {
    await page.goto("/dang-nhap");
    await page.getByLabel(/Email/).fill("alice@example.test");
    await page.getByLabel(/Mật khẩu/).fill("demo-password");
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForURL("**/tai-khoan**");
    await expect(
      page.getByRole("heading", { level: 1, name: /Phần mềm của tôi/ }),
    ).toBeVisible();
    // hai banner đơn chờ
    await expect(page.getByTestId("pending-order-banner").first()).toBeVisible();
    // hai bản quyền cùng MU Lục Địa VNG phân biệt được
    await expect(page.getByText("BQ-7K3M2Q").first()).toBeVisible();
    await expect(page.getByText("BQ-9X2P4D").first()).toBeVisible();
    // cảnh báo sắp hết hạn
    await expect(page.getByText(/còn 2 ngày/)).toBeVisible();
  });

  test("khu khách hàng chặn khách: redirect đăng nhập giữ next", async ({
    page,
  }) => {
    await page.goto("/tai-khoan");
    await page.waitForURL(/\/dang-nhap\?next=/);
  });
});

test.describe("Đơn hàng — các trạng thái J3", () => {
  test("đơn chờ chưa báo: QR, trường sao chép, nút báo chuyển khoản", async ({
    page,
  }) => {
    await page.goto("/don-hang/GA7K3MQ");
    await expect(page.getByTestId("order-status")).toBeVisible();
    await expect(page.getByTestId("payment-qr")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Tôi đã chuyển khoản" }),
    ).toBeVisible();
    await expect(page.getByText("Hủy đơn")).toBeVisible();
    await expect(
      page.getByText(/Giữ nguyên nội dung GA7K3MQ/),
    ).toBeVisible();
    // báo chuyển khoản → thông báo ghi nhận, mất nút hủy
    await page.getByRole("button", { name: "Tôi đã chuyển khoản" }).click();
    await expect(
      page.getByText(/Đã ghi nhận thông báo chuyển khoản/).first(),
    ).toBeVisible();
    await expect(page.getByText("Hủy đơn")).toBeHidden();
  });

  test("đơn hết hạn đã báo: không thúc chuyển lại", async ({ page }) => {
    await page.goto("/don-hang/GA4T7QW");
    await expect(
      page.getByText(
        "Không chuyển lại chỉ vì đơn đã hết hạn. Liên hệ hỗ trợ để kiểm tra khoản đã chuyển.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Tôi đã chuyển khoản" }),
    ).toHaveCount(0);
  });

  test("đơn đã thanh toán: hiển thị bản quyền và bước tiếp", async ({
    page,
  }) => {
    await page.goto("/don-hang/GA8H3ND");
    await expect(page.getByText(/Đã thanh toán lúc/).first()).toBeVisible();
    await expect(page.getByText("BQ-7K3M2Q").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Đến Phần mềm của tôi" }),
    ).toBeVisible();
    await expect(page.getByText(/Đã hoàn trả 50\.000\s*₫/)).toBeVisible();
  });
});

test.describe("Khu quản trị", () => {
  test("đổi vai trò admin qua DemoBar → Việc cần xử lý", async ({ page }) => {
    await page.goto("/");
    await page
      .evaluate(() => {
        document.cookie = "ga_demo_role=admin; path=/; max-age=31536000";
      })
      .then(() => page.goto("/quan-tri"));
    await expect(
      page.getByRole("heading", { level: 1, name: /Việc cần xử lý/ }),
    ).toBeVisible();
    await expect(page.getByText(/Khoản tiền cần đối soát/)).toBeVisible();
  });

  test("quản trị chặn khách", async ({ page }) => {
    await page.goto("/quan-tri");
    await page.waitForURL(/\/dang-nhap\?next=/);
  });
});
