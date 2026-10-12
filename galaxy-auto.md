# galaxy-auto — Work Plan

## TL;DR (cho người đọc)

**Sẽ có:** Cửa hàng phần mềm GALAXY AUTO tiếng Việt, gồm:
- năm sản phẩm riêng, bảng giá theo từng game;
- mua bằng chuyển khoản VietQR, duyệt thủ công; dùng thử không qua ngân hàng;
- khu khách hàng và quản trị, bản quyền nhiều máy, email giao dịch.

Giao diện công khai theo Golden Immortal Galaxy, có chất kim loại MU/Võ Lâm tiết chế. Khu giao dịch và quản trị phẳng, ưu tiên dữ liệu.

**Vì sao:** Một ứng dụng Next.js chia module, dùng Supabase managed. Giá, giao dịch và quyền sử dụng được kiểm tra phía server. Thiết kế, route và hành trình nằm ở `DESIGN.md`; plan này giữ quy tắc nghiệp vụ, bảo mật, task và QA.

**Không làm:**
- Bịa tính năng, tương thích, giá hoặc đánh giá.
- Tự chuyển tiền hoặc đối soát ngân hàng tự động.
- Sửa client game hoặc vượt cơ chế bảo vệ của game.
- Tự triển khai lên môi trường thật.

**Effort:** XL. **Risk:** High — tiền và bản quyền phải đúng khi có thao tác đồng thời. Dữ liệu thương mại, tài sản hợp pháp và tích hợp client thật là điều kiện mở bán riêng.

**Quyết định đã áp dụng ngày 2026-10-13 theo review — chủ sở hữu nên kiểm tra lại:**
- VietQR động tạo từ snapshot đơn; vẫn duyệt thủ công.
- Xác thực email và đặt lại mật khẩu bằng mã 6 số, nhập trên cùng tab.
- Đã có đơn chờ cho cùng gói thì mở lại đơn đó, không tạo đơn mới. Khách tự hủy được khi chưa báo chuyển khoản.
- Admin xác nhận khoản khớp ngay trên trang đơn; chỉ bắt buộc lý do khi duyệt muộn hoặc số tiền lệch.
- Sau một lần xác nhận mật khẩu, xem lại mã bản quyền trong 10 phút không cần nhập lại.
- Lease 300 giây, cộng thời gian ân hạn 20 phút chỉ khi lỗi mạng.
- Bốn email giao dịch; nhắc hết hạn trước 3 ngày, khách tắt được.
- Khu tài khoản khách gồm bốn mục.
- **Chưa quyết:** bù ngày hàng loạt khi auto ngừng hoạt động (DESIGN §15).

**Bước tiếp theo:** Hiện mới chỉ có tài liệu. Wireframe, font bundle, artwork và ảnh tham chiếu chưa có. Triển khai chỉ bắt đầu khi người dùng yêu cầu riêng.

> Machine summary: XL / high risk; Vietnamese single-merchant software store; 24 tasks in 4 waves + 4 final gates; tests-after; real-client enforcement and production launch gated separately.

---

## Scope

### Authority and workspace

- Planning files: `/Users/hunghoang/Downloads/mumarket-fe/galaxy-auto.md` (this plan) and `/Users/hunghoang/Downloads/mumarket-fe/DESIGN.md`. Implementation destination: `/Users/hunghoang/Downloads/galaxy-auto`.
- **Ownership:**
  - DESIGN.md owns brand, IA and routes, visual language, components, journeys J1–J6, the UI glossary and gates D01–D23.
  - This plan owns business and security rules R2–R12, tasks and QA.
  - A presentation choice never relaxes a rule here. Contradictions are fixed in both documents and their tests first.
- Every code or artifact path below is a NEW planned path inside the destination, not evidence of existing code. No reference image is available; never claim image fidelity.
- **Before writing product files:**
  - Check that the destination exists and its git status. Preserve unknown files; stop on conflicting content.
  - Initialize git only inside the empty destination, never in Downloads.
  - Do not read `/Users/hunghoang/Downloads/.env` or unrelated projects.
- Not authorized by this plan: remotes, pushes, purchases, hosting, production migrations or deployment.

### R1 — Presentation

- DESIGN.md is binding for all UI. Tasks cite it by section (§) and gate (D-ID).
- The seed brand copy (DESIGN §1) is CMS-editable. QA never restores the seed over legitimate edits.
- All user-visible text is Vietnamese — UI, validation, errors, emails and accessibility labels — using the DESIGN §3 glossary.

### R2 — Catalog

- Exactly five immutable categories and slugs (DESIGN §4), with one storefront product slot each.
  - Admins create the product in an empty slot, or edit, archive and re-publish it.
  - No sixth category, no second active product in a slot.
  - This is a single-merchant software store, not a multi-seller market or item auction.
- **Product content:**
  - Artwork: one source image ≥ 1600px plus a focal point, from which 3:4, 1:1 and 16:10 crops are derived.
  - Name, description, features, software version, supported game version, screenshots, ordered install steps, download policy, activation guide.
  - Changelog; releases keep their history.
- **Software status** `operational|updating|paused|unreleased`, with a note and `status_updated_at`, maintained by admins.
  - Informational only; it does not change sales availability.
  - The admin readiness checklist warns when sales are on while status is `paused` or `unreleased`.
  - It is not an automatic game-server compatibility check.
- Prices and compatibility start unknown and are never fabricated. A missing product keeps an honest landing page. “Miễn Phí” in a game name says nothing about price.
- **Starting paid price** = the lowest current purchasable non-trial offer total, shown with that offer’s duration and device cap. Never extrapolate per day or per month.

### R3 — Offers, checkout and orders

- **Money:** integer VND — `bigint` in DB, decimal string in transport, parsed safely. 0 ≤ amount ≤ 1,000,000,000 per order. No floating-point arithmetic.
- **Offers** (per product):
  - Kind `trial|7_day|30_day|90_day|custom`; explicit duration 1–3650 days; device cap 1–100; active window; availability.
  - These are technical guardrails; the production seed has no sale offers.
  - Custom duration requires an explicit price.
- **Promotions:**
  - At most one active automatic promotion per offer/window: percent in basis points 1–9999, or fixed VND. No stacking; overlapping active promotions are rejected; percentages floor to whole VND.
  - Paid offers stay ≥ 1 VND after promotion. Reject 10000bp and fixed ≥ price at both configuration and checkout. Tests: 9999bp vs 10000bp, fixed price−1 vs price.
- **Trials:** zero-charge; need a configured duration and cap; once per verified account per product (account-level, not anti-Sybil). Trials never create an order (R5).
- **Checkout requires:** verified login, `sales` flag on, product sales available, bank config with BIN, owner terms. Single product, one-off license; no cart, no auto-renew.
- **Order snapshot** (immutable, one item): product, offer, terms version, price, promotion, final amount, duration, cap, intent (`purchase`, or `renewal` + target license id), bank snapshot (bank name, BIN, account number, beneficiary), transfer reference, deadline. Archiving an offer never mutates historical orders.
- **Idempotency:** key scoped to customer + request body hash. Same key and body → same order; same key, different body → conflict.
- **Open-order reuse (D22):**
  - If the customer has a `pending_payment` order before its deadline for the same offer and same intent/target, return that order instead of creating a new one.
  - The customer may cancel it only while no payment report exists, then create a new order at the current price.
- **Deadline:** pending orders last 24h (owner-configurable before launch); the server clock is authoritative. A stale price at commit returns the new price and requires reconfirmation.
- **Transfer reference = order code:**
  - Format `GA` + 5 characters from `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (no 0/O/1/I/L). DB-unique; regenerate on collision.
  - Matching: uppercase the bank memo, strip non-alphanumerics, search for the code anywhere in it.
- **VietQR** — an EMVCo merchant-presented payload built from the order snapshot only:
  - Fields: `00`=`01`; `01`=`12` (dynamic); `38` = {`00` `A000000727`, `01` {`00` BIN, `01` account}, `02` `QRIBFTTA`}; `53`=`704`; `54`=final amount; `58`=`VN`; `62` = {`08` transfer reference}; `63` = CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) over everything up to and including `6304`, uppercase hex.
  - A pure domain function with fixed test vectors (CRC of `123456789` = `29B1`) and a round-trip decode test.
  - Rendered to PNG server-side with one pinned QR encoder; owner-only, `no-store`.
  - The QR is a convenience; payment is still confirmed manually (R4).
  - Missing BIN blocks sales readiness. Scanning one QR built from the production bank config in a real bank app (without confirming the transfer) is a launch gate (task 23).
- “Tôi đã chuyển khoản” creates an unverified `payment_report` (a note only); it never settles anything.

### R4 — Receipts, settlement and refunds

- **Order states:** `pending_payment → paid | cancelled | expired`.
  - `cancelled|expired → paid` only through explicit late settlement, with reason, complete bank evidence and step-up (R7).
  - `unresolved` is a receipt condition, never an order state.
- **`bank_receipts`:** money verified by an admin — receiving account, bank reference, positive amount, received_at, memo, verifier. Unique on (receiving_account, bank_reference).
- **`receipt_applications`:** receipt ↔ order, exact amount allocation, unique per order. The exact expected amount is required. Under- or overpayment stays unresolved with no issuance; no silent price override.
- **Admin confirmation paths:**
  - **Order-first (default, D10):**
    - From the order, the admin enters bank reference and received_at. Account and expected amount come from the snapshot; the amount is prefilled.
    - One transaction: create receipt → apply → settle → fulfil.
    - Exact amount before the deadline: reason optional; needs an AAL2 session and a confirmation dialog, no step-up.
  - **Amount differs:** the receipt is recorded as unresolved with no application; reason required.
  - **Past deadline, cancelled or expired:** late settlement; reason and step-up required.
  - **Receipt-first:** capture a receipt without an order. The server suggests orders whose reference appears exactly in the normalized memo; the admin applies explicitly. No fuzzy matching; never auto-apply.
- **Settlement transaction:**
  - Locks the order and receipt (plus the target license for a renewal).
  - Validates MFA-admin identity, state, deadline (by server clock, even if the status still says pending), eligibility and amount.
  - Creates exactly one fulfillment, unique per order: a new license for a purchase OR one extension for a renewal. 20 concurrent retries return the original outcome.
  - Accepted orders may settle after `sales` is turned off, if the target is still eligible.
- **Renewal target ineligible at settlement** (suspended, revoked, or account suspended): receipt stays unresolved, no fulfillment, reason logged, manual return available. After the target resumes, an explicit reattempt may apply an unreturned receipt if it is eligible.
- **Returns and refunds** record completed outbound transfers only; nothing moves money automatically.
  - Type `unresolved_return` (receipt not applied) or `settled_refund` (paid order). Amount ≤ receipt remaining. Outbound reference unique per sending account. Reason, actor and time recorded; partial amounts allowed.
  - Lock the receipt. Cumulative returns ≤ received. An application and a return can never spend the same money. A fully returned receipt cannot be applied.
  - Returns never issue or revoke a license. Refund and revocation are separate explicit actions.
- No invented refund-eligibility policy. Missing owner-approved terms blocks production sales.

### R5 — Licenses, devices, renewals and trials

- **Lifecycle:**
  - A new purchase creates a new license. States `unactivated|active|suspended|revoked`; expired is derived (`expires_at <= now`), not set by a cron.
  - Suspend remembers the prior state; restore does not reset time.
  - Revoke is terminal; a replacement is a separately audited admin grant.
  - Manual grants require product, duration, cap, recipient and reason; no undocumented infinite licenses.
- **Keys:**
  - Random 256-bit key. Lookup by HMAC digest with key version. The recoverable value is AES-GCM encrypted with a dedicated server key and version.
  - Never in plaintext in DB, logs or URLs.
  - The non-secret license reference `BQ-` + 6 characters (alphabet from R3) is used in the UI, support and renewal.
- **Activation:** the first successful activation, under a row lock, sets `activated_at` once and `expires_at = activated_at + duration_days × 86400` (UTC). All devices share that expiry.
- **Devices:**
  - Random installation UUID + device secret, stored as an HMAC digest only. Not a hardware fingerprint; not tamper-proof.
  - Optional `device_label` from the client (hostname; plain text ≤ 64 chars; owner can rename), plus `registered_at` and `last_seen_at` (updated on refresh, written at most every 15 min).
  - The snapshot cap is enforced under lock.
  - Repeat activation of an existing device requires its credential; a leaked key alone cannot evict devices.
  - The registered-device count is not concurrent-session control.
- **Device removal** by owner or admin: step-up, reason and audit; expiry unchanged.
- **Renewal:**
  - Only for an already-activated, non-suspended, non-revoked license of the same product with the same device cap.
  - New expiry = `max(settlement_time, current_expiry) + duration`. A duplicate settlement cannot extend twice.
  - A different cap means a new license (“Mua bản quyền mới”).
  - Creating ANY new renewal order requires `sales=true` and an eligible target. Accepted renewal orders settle per R4.
- **Trial claim:**
  - A narrow idempotent routine: a same-request retry returns the original entitlement.
  - Already used → a clear response, plus a link to the existing entitlement when authorized.
  - No order, no bank data. `trials` and `sales` are independent.

### R6 — Licensing API and downloads

- **API:** versioned `/api/v1/licenses/activate`, `/refresh`, `/deactivate`. JSON schemas and stable machine error codes with Vietnamese messages, documented in `docs/api/license.openapi.yaml`.
- **Activate** takes: key, product, install UUID, optional device_label, a client-generated 256-bit recovery token and an idempotency key. It returns the new device secret once.
- **Enrollment recovery:**
  - The recovery-token hash is bound to the canonical request hash, product, install and license, plus an encrypted initial response kept for 10 min.
  - A retry with the same token and request within that window rechecks eligibility and returns the original secret, without extending the original lease. If that lease has expired, the response carries the credential with `lease:null` and the client must refresh.
  - Wrong token or request, revoked device or license, or an expired window → deny.
  - The encrypted response is purged after the TTL; expired reads are denied regardless of purge timing.
- **Refresh:** uses the device secret; rechecks account, license, device and product; updates `last_seen_at` (throttled).
- **Lease** — signed Ed25519 JWT with `iss,aud,license_id,product_id,device_id,jti,iat,exp,grace_until,kid`:
  - `exp ≤ min(iat+300s, license_expiry)`; rejected at equality.
  - `grace_until = min(iat+1200s, license_expiry)`. The client may keep running until `grace_until` ONLY while refresh fails with a network error, timeout or 5xx.
  - A definitive denial — revoked, suspended, expired, device removed, account suspended — stops the client immediately.
  - Documented revocation latency: ≤ 5 min normally, ≤ 20 min if the client is cut off.
  - Public JWKS with rotation overlap ≥ 300s; an old key never signs after rotation.
- **Device `/deactivate`:** device secret + product + install UUID; removes only that device.
- **Rate limits:** persisted server-side, keyed by endpoint/IP and key or device hash (no raw secrets).
  - Activation: 10/min/IP and 5/min/key. Refresh: 60/min/device and 120/min/IP.
  - Responses: 429 + Retry-After.
  - Trusted-proxy IP parsing is documented; malformed and unknown keys count toward limits.
- **Key rotation:**
  - Lookup checks active and retiring HMAC keys; migration rehashes by decrypting; retire a key only after all rows have migrated.
  - Each ciphertext stores its key version; re-encrypt before retiring.
  - Key material never lives in the DB.
- **Downloads:**
  - Software lives in a private bucket. Verify entitlement, then issue a 60s signed URL.
  - A valid unactivated license may download without activating. Expired, suspended and revoked licenses are denied.
  - Anonymous download only when an admin explicitly marks a release public.
  - Issued links may work until their TTL; never claim instant revocation.
  - External URLs: HTTPS on configured trusted origins only. A protected release uses managed private storage or a verified signed-link adapter.
- No claim of real binary enforcement until each game client integrates and is tested. The contract simulator demonstrates the protocol, not game automation.

### R7 — Accounts, step-up, flags and authorization

- **Auth:** Supabase Auth with email/password and secure-cookie SSR sessions; no homemade password handling.
- **Email codes:**
  - Email verification and password reset use 6-digit codes entered on the same tab (Supabase templates with `{{ .Token }}`, verified with `verifyOtp` using that flow’s type; confirm exact type values against the installed version at bootstrap, S14).
  - Resend allowed after 60s. Errors are generic Vietnamese, with no account enumeration.
- **Admins:**
  - No self-registration. The first admin is provisioned by a documented, authenticated operator script using a user UUID; no public default credential.
  - Admin role comes from a protected table, not user metadata.
  - Admin mutations require a server-side role check plus MFA AAL2, and write an append-only audit entry.
- **Step-up proof:**
  - The server validates the password through a fresh sign-in in an isolated server auth client (plus fresh TOTP for admins), then issues an opaque random proof.
  - The proof is bound to user, current session, purpose and target id; stored only as a digest in `step_up_proofs`; TTL 10 min; RLS denies direct create/read.
  - A refreshed token’s `iat` is not freshness evidence.
  - **Single-use:** device removal, role changes, late settlement, returns, refunds, revocation, manual grants, bank-config changes.
  - **Reusable within the TTL** for the same license and session: `reveal_license` (each reveal audited).
- **Persistent throttles:**
  - Step-up, sign-in, reset and code verification: 5 per 15 min per account hash, and 20 per 15 min per trusted IP.
  - Recovery response: 5 per 10 min per recovery-token hash.
  - Deactivate: 10 per 10 min per device or user, and 30 per 10 min per IP.
  - Also configure Supabase’s native Auth rate limits and bot protection.
  - If the counter store fails → deny with a retriable “unavailable”; never fail open.
- **Customer suspension:** blocks new checkout, activation, refresh and download; keeps read-only history and tickets; resuming does not reset expiry.
- **Flags:**
  - `sales`, `trials`, `support_new_tickets`, `announcements_public`, plus per-product sales availability.
  - A missing flag row disables the new operation.
  - Existing refresh, download, history and ticket replies stay available unless license or account status denies them.
  - `sales` off blocks new purchases and new renewal orders. `trials` off blocks only new claims. `support_new_tickets` off still allows replies. `announcements_public` off hides public updates and removes them from the sitemap.
  - Guards run on server actions, APIs and RPC writes, in the same transaction as authorization.
- **Direct-write authority matrix.** Task 3 writes the exact table/column/function/grant matrix in `docs/contracts/authorization.md`, with real REST/RPC tests, before task 6. A missing row means no permission.
  - **anon:** SELECT published catalog/CMS only; no writes, no privileged RPC.
  - **customer:**
    - SELECT own profile, orders, license metadata, devices, tickets, messages and notification preferences.
    - UPDATE only display name, device label and reminder preference, through validated routines.
    - Orders, reports, cancellation, tickets, trial claims and device requests go only through narrow routines that derive `auth.uid`.
  - **admin browser:** no privileged table DML. A Next server action verifies identity, protected role and AAL2; the DB routine re-verifies.
  - **license API:** a separate server-only credential with EXECUTE on licensing routines only. If managed Supabase requires service_role transport, wrap it in a server-only gateway — never a general SQL/RPC proxy.
- All lists are paginated and scoped server-side.

### R8 — Support, CMS and notifications

- **Tickets:**
  - Subject + plain-text body; states `open|waiting_customer|waiting_admin|resolved`; customer and admin replies.
  - Customers see only their own; admins have a queue; a customer reply reopens the ticket.
  - No internal notes, attachments or chat.
- **CMS:**
  - Announcements, guides, FAQ, homepage banners, legal pages, contact details.
  - Payment-processing note: optional, owner-written, shown on the checkout and order pages; hidden when empty.
  - Draft/published states; preview isolated from the public cache; alt text and per-breakpoint art.
  - Plain-text structured blocks and safe links; no script or embed.
- **Settings:** business and contact details, bank config (bank name, BIN, account, beneficiary), terms, flags. Bank changes affect new orders only.
- **Transactional email (D23):**
  - Written to an outbox in the same DB transaction as the event. A dispatcher sends with idempotency key (event, recipient); retries are bounded; no duplicates.
  - Order created: amount, bank, account, beneficiary, reference, deadline, link.
  - Payment confirmed and license issued.
  - Renewal applied: new actual expiry.
  - Expiry reminder 3 days before expiry: once per (license, expires_at), active licenses only, skipped for suspended/revoked licenses or suspended accounts; customers can opt out in settings.
  - Format: Vietnamese plain text, never containing license keys, linking to the right page. Admins can preview templates.
  - The dispatcher and the daily reminder job are documented periodic commands. Production SMTP and the scheduler are launch gates.

### R9 — Engineering contract

- **Architecture:**
  - A single Next.js modular monolith. React Server Components by default; interactive client leaves only.
  - `src/app/` holds thin routes and layouts.
  - `src/modules/{catalog,commerce,licensing,identity,support,content,settings}/` each have `domain/`, `application/`, `infrastructure/` and `ui/` as needed, with public server/client entrypoints.
  - Shared code: `src/shared/{ui,styles,validation,config,logging}/`. Also `supabase/migrations/`, `tests/{unit,integration,e2e}/`, `scripts/`.
  - Dependencies point inward, from UI and adapters to use cases and domain. No circular or cross-module internal imports.
  - Ports only at the payment, storage, license-signer and mail boundaries. No class factory per entity, no duplicate ORM.
- **Data access and types:**
  - Typed Supabase client, SQL migrations and RPCs; Zod at boundaries; discriminated result unions; exhaustive switches.
  - TS `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`. No explicit `any`, `ts-ignore` or unsafe assertions to silence errors.
- **File size:**
  - Authored `.ts,.tsx,.js,.mjs,.cjs,.css,.sql,.json,.yaml,.yml` files ≤ 500 physical lines; blanks and comments count. Prefer < 250.
  - Lock, build and vendor output are exempt. Generated DB types are split deterministically per table in `src/generated/database/`, each ≤ 500 lines.
- **CSS:**
  - Follows DESIGN §6–§7: one token source → shared primitives → scoped material recipes → page composition.
  - Tailwind uses `@theme { --color-*: initial; … }`, so only semantic tokens exist. CSS modules own M1–M4 and are restricted to their allowed surfaces.
  - No CSS-in-JS, `!important`, `transition: all` or widespread arbitrary values.
  - Use `min-width: 0` for long content and safe-area/scroll padding for sticky UI. Never hide essential overflow to make a screenshot pass.
- **Enforcement:** ESLint with boundaries, a formatter and Stylelint.
- **Caching:**
  - Only public pages are cached.
  - Auth, customer, admin, checkout, order and QR responses are `no-store`.
  - Catalog mutations revalidate precisely.
- **Logging:** structured logs with correlation IDs; audit secrets redacted; no PII, license keys or bank evidence in URLs or telemetry.
- **Secrets:** admin and service secrets are never bundled into the browser. RLS, grants and server auth are each enforced independently.

### R10 — Toolchain and references

- **Versions:**
  - At bootstrap, select current, mutually compatible stable releases of Next, React, Tailwind, TypeScript, Framer Motion and Supabase SSR from official registries.
  - Pin exact versions and commit the npm lockfile. No canary or unconstrained `latest`.
  - Node: the active LTS compatible with Next, exact patch recorded in `.node-version`; npm `packageManager` pinned exactly.
  - This is a reproducible version resolution, not permission to change the stack.
- **Dev tools** (pinned): Vitest, Playwright, axe-core, Supabase CLI.
- **Approved runtime addition:** one QR encoder that outputs PNG on Node (R3). Nothing else is added for ornament.
- **References** (upstream docs, not proof that tests have run; check version-sensitive syntax against installed versions):
  - [S1] https://nextjs.org/docs/app/guides/data-security
  - [S2] https://supabase.com/docs/guides/auth/server-side/nextjs
  - [S3] https://supabase.com/docs/guides/database/postgres/row-level-security
  - [S4] https://supabase.com/docs/guides/storage/serving/downloads
  - [S5] https://tailwindcss.com/docs/theme
  - [S6] https://motion.dev/docs/react-accessibility
  - [S7] https://github.com/google/fonts/tree/main/ofl/notoserifdisplay and https://github.com/google/fonts/tree/main/ofl/bevietnampro
  - [S8] https://supabase.com/docs/guides/local-development
  - [S9] https://playwright.dev/docs/test-assertions
  - [S10] https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html and https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
  - [S11] https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html and https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
  - [S12] https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
  - [S13] VietQR (NAPAS EMVCo profile): obtain the official NAPAS specification at bootstrap. Community field table: https://github.com/vanvixi/vietqr.dart/blob/main/packages/vietqr_core/vietqr_field_definitions_en.md
  - [S14] https://supabase.com/docs/guides/auth/auth-email-passwordless and https://supabase.com/docs/guides/auth/auth-email-templates

### R11 — Data contract

- **Conventions:** UUID primary keys; `timestamptz` timestamps; a category slug constraint for exactly five rows with immutable IDs.
- **Tables:**
  - Catalog: categories; products (`category_id` unique; software_status, status_note, status_updated_at, art source + focal point); product_screenshots; installation_steps; releases; release_artifacts; offers; promotions.
  - Orders: orders (transfer_reference unique, bank snapshot incl. BIN, intent, renewal_target_id, deadline); order_items (single immutable snapshot); payment_reports (unverified).
  - Money: bank_receipts; receipt_applications; settlements; fulfillment_events (order unique); refunds.
  - Licensing: licenses (reference unique); license_devices (device_label, registered_at, last_seen_at); license_renewals (order unique); trial_claims (user + product unique); license_request_receipts; rate_limit_buckets.
  - Identity: profiles (incl. expiry_reminder_enabled); protected user_roles; step_up_proofs.
  - Support and content: tickets; ticket_messages; content_pages; announcements; faqs; homepage_banners; site_settings; feature_flags.
  - Notifications and audit: notification_outbox (unique event + recipient; reminders unique per license + expires_at); audit_events.
- Financial and audit tables are append-only where applicable. No delete cascades on historical records.
- **RLS:** public sees published catalog/CMS only; customers own their private rows; privileged roles are server-owned.
- **Critical functions:** check the authenticated actor and MFA; use a fixed `search_path` and schema-qualified objects; revoke PUBLIC execute. Customer-facing functions use `auth.uid` and never trust a caller-supplied customer id. The license API uses a narrow server-only role.
- **Storage:** public art and private software in separate buckets. Public DTOs never expose private paths or signed URLs.
- Deleting an auth profile is not an admin cleanup shortcut. Historical IDs are preserved; anonymization is documented separately.

### R12 — Test isolation

- **Primitive host:** task 5 uses a separate local-only app, `tests/primitive-host/` — an ephemeral production-like Next build bound to loopback, never deployed. The main app has no `/__showcase` route; assert it returns 404 and that no dev tooling ships.
- **Primitives suite:** `test:e2e -- tests/e2e/primitives.spec.ts` starts the primitive host and the main production host on distinct ports, waits for health and disposes both. Every other suite targets the main production build.
- **Final gates:**
  - F1/F2 are read-only against a frozen artifact snapshot, using `verify:release --read-only` (no DB work).
  - F3 uses its own disposable local Supabase, ports and namespace.
  - F4 reads immutable manifests and screenshots only.
- Mutating suites never share auth, storage or DB. If separate local stacks cannot be allocated, serialize the mutating phases; read-only reviewers may still run in parallel.
- Every lane writes to `$QA_DIR/final/Fn/<run-id>/` and never modifies shared evidence.

### Must NOT have

- **Faking the product:** no static-only landing page, combined five-game product, fake backend success, localStorage authority, unconditional download links or prices baked into components.
- **Invented claims:** no made-up features, compatibility, review counts, sales metrics, uptime, discounts, “official partner”, “ban-safe”, supported-client claims, bestseller labels or payment-review SLA.
- **Scope creep:** no sixth game, multi-seller onboarding, item auction, elaborate search/filters, auto-debit, automated banking/refund, shopping cart, affiliate program, AI features, microservices, real bot/client code or anti-cheat bypass.
- **Visual anti-patterns:** everything in DESIGN §1 “Tránh”, and any material outside its DESIGN §6 surface.
- **Weak verification:** no ignored test failures, `skip`/`only` tests, dummy assertions, destructive production reset, broad service-role client, client-chosen prices or roles, or silently altered user files.
- **Overclaiming:** no production-launch or client-enforcement claims based on the simulator, fixtures or screenshots. Missing credentials, assets or owner terms are launch blockers, not reasons to omit implementation.

## Verification strategy

> All verification is agent-executed.

- **Approach:** tests-after, chosen by the owner. Each task implements, then immediately adds real behavioural tests before dependent work starts.
- **Evidence:**
  - Stored in `artifacts/qa/<run-id>/` inside the implementation project, with `QA_DIR` set to its absolute path.
  - Every command stores its report, stdout/stderr and real exit code in `$QA_DIR/task-N/`.
  - Failures are preserved, never overwritten by a later run.
- **npm scripts** created by task 1 (future acceptance interfaces, not existing commands):
  - `verify:static`: physical-line check, `tsc --noEmit`, lint, boundaries, Stylelint, format.
  - `test:unit -- <file>`, `test:integration -- <file>`, `test:e2e -- <file>`, `test:visual`, `test:performance`, `verify:local`, `verify:release`.
- **Integration tests:** Vitest against a disposable local Supabase over real REST/auth/storage/RPC; no mocked RLS.
- **E2E tests:** Playwright on the production build in Chromium, Firefox and WebKit, with deterministic fixtures and local mail capture (also used to read 6-digit codes).
- **`verify:local`:**
  - Starts and checks local services; resets ONLY an allowlisted loopback test DB; seeds; runs all suites and the build.
  - Propagates child failures and rejects absent or zero-test suites.
  - The test helper refuses remote Supabase URLs and service secrets, with no override flag.
- **Fixtures:**
  - Identities: alice@example.test, bob@example.test, admin@example.test, with local-only randomized passwords and an MFA fixture.
  - Catalog: five categories; one 7-day / two-device paid offer at 123456 VND (test seed only); a separate trial.
  - Bank: a documented sample BIN/account from public VietQR vectors.
  - Licenses: two same-product licenses for renewal selection.
  - Orders and receipts: an open pending order, a reported order, an expired order, and unmatched and returned receipts.
  - Assets: an inert private `.zip` and SVG art.
  - The production seed holds only the category registry and unavailable content states.
  - Time control is injected in pure domain tests; DB expiry cases use test-only transactions. No production clock-override endpoint.
- **Critical concurrency:**
  - 20 settlement retries → one settlement and one license.
  - The same bank transaction against two orders → one conflict.
  - Three simultaneous devices for a cap of two → exactly two.
  - Expiry boundary at 2026-10-19T00:00:00Z for an activation on 2026-10-12.
  - A duplicate renewal changes nothing; concurrent refunds never exceed the received amount; concurrent create-order calls with different keys for the same offer → one open order.
- **Coverage:** ≥ 85% branches on domain and use-case modules; generated code and UI snapshot tests don’t count.
- **Browser assertions:**
  - Accessible locators plus `data-testid`: `game-card-{slug}`, `offer-{id}`, `trial-claim`, `checkout-submit`, `order-status`, `payment-status`, `payment-qr`, `pending-order-banner`, `admin-confirm-payment`, `receipt-workbench`, `renewal-target`, `license-reveal`, `license-device-list`, `ticket-thread`, `module-toggle-{key}`.
  - Widths from DESIGN §12, plus 200% zoom, mobile keyboard and reduced motion.
  - Check actual rendered contrast and 44px primary targets; token presence alone does not pass.
- **Gates:** every DESIGN D-gate is pass/fail with evidence (task 21). No average, axe result or Lighthouse score overrides a failed business task. These are agent-run walkthroughs, not human user research.
- **Performance:**
  - Production build, measured with CDP traces and Lighthouse via Playwright Chromium: 3 mobile + 3 desktop runs per public route; report medians.
  - Budgets from DESIGN §13 are the pass criteria. Lighthouse category scores are diagnostics, not targets.
  - Lab results don’t stand in for field INP. Report actual misses; never hide content to gain a score.
- **Data and security:** migrations verified on a fresh local DB and an upgrade fixture. RLS matrix for anon/Alice/Bob/admin plus disabled and suspended cases. Crawlers never see private orders, QR images, license material or draft CMS. No real payment provider or bank calls in local QA.

## Execution strategy

**Waves:**
- Wave 1 (foundation): tasks 1–6.
- Wave 2 (business core): 7–12.
- Wave 3 (surfaces): 13–18.
- Wave 4 (integration and evidence): 19–24.
- Then the final gates F1–F4.

**Coordination:**
- Within-wave dependencies still apply. Parallel work only on disjoint files and contracts.
- One integrator owns shared manifests, the migration sequence and common primitives. Migration file numbers are allocated before fan-out.
- A wave barrier requires every task’s acceptance results, not self-reported completion.

**Execution notes:**
- Task 2 freezes flag, transaction and projection guards; task 8 implements the guard runtime before tasks 9–11 consume it.
- Task 4 builds wireframes from DESIGN J1–J6 while task 2 runs; task 5 waits for both.
- Task 6 needs task 3’s real local auth and storage identities.
- Task 15’s approval step uses an authenticated AAL2 backend fixture running the real settlement transaction; task 19 later proves the admin browser flow.

| Task | Depends on | Blocks | Parallel with |
| --- | --- | --- | --- |
| 1 | — | 2–6 | — |
| 2 | 1 | 3, 5, 7–12 | 4 |
| 3 | 1, 2 | 6–12 | 4, 5 |
| 4 | 1 | 5, 6 | 2, 3 |
| 5 | 1, 2, 4 | 6, 13–18 | 3 |
| 6 | 1, 3, 4, 5 | 7, 13, 14 | — |
| 7 | 2, 3, 6 | 13, 14, 17 | 8–12 |
| 8 | 2, 3 | 9–11, 13, 16, 18 | 7 |
| 9 | 2, 3, 8 | 10, 11, 14, 15 | 7 |
| 10 | 2, 3, 8, 9 | 11, 15, 17 | 7 |
| 11 | 2, 3, 8, 9, 10 | 12, 14–16 | 7 |
| 12 | 2, 3, 11 | 14, 16, 17 | 7 |
| 13 | 5, 6, 7, 8 | 19, 21, 22 | 14–18 |
| 14 | 5, 6, 7, 9, 11, 12 | 19, 21, 22 | 13, 15–18 |
| 15 | 5, 9, 10, 11 | 19, 20, 22 | 13, 14, 16–18 |
| 16 | 5, 8, 11, 12 | 19–21 | 13–15, 17, 18 |
| 17 | 5, 7, 10, 12 | 19–21 | 13–16, 18 |
| 18 | 5, 8 | 19–21 | 13–17 |
| 19 | 13–18 | 20–24 | — |
| 20 | 15–19 | 24 | 21–23 |
| 21 | 13, 14, 16–19 | 24 | 20, 22, 23 |
| 22 | 13–15, 19 | 24 | 20, 21, 23 |
| 23 | 19 | 24 | 20–22 |
| 24 | 19–23 | F1–F4 | — |

## Todos

> Implementation and its tests are ONE todo. Evidence for each goes to `$QA_DIR/task-N/`.

- [ ] **1. Bootstrap the isolated project and engineering checks** — Wave 1
  - Do:
    - Workspace preflight; create the project; pin the stack per R10 (package.json, `.node-version`, lockfile).
    - Strict tsconfig, ESLint boundaries, Stylelint, formatter, test runners.
    - Physical-line scanner, exit-code-propagating QA wrappers, local-service guard, CONTRIBUTING.md.
    - No app features.
  - Refs: R9, R10, R12; S1, S5, S8, S9; `scripts/check-source.mjs`, `scripts/verify-local.mjs`.
  - Accept: `npm ci`, `npm run verify:static` and `npm run build` pass; versions reproducible; nothing outside the destination touched.
  - QA: `npm run test:unit -- tests/unit/tooling.test.ts`
    - Happy: a 500-line file is accepted.
    - Rejected: a 501-line file, explicit `any`, an illegal import, a failing child command, a non-loopback DB.
  - Commit: `chore(foundation): bootstrap typed isolated marketplace`

- [ ] **2. Encode domain contracts** — Wave 1
  - Do:
    - Zod inputs, domain IDs, money/time/state types and result/error unions in module `domain/` folders.
    - Pure functions: starting paid price, promotion math, renewal expiry, reference generation and memo matching, VietQR payload + CRC.
    - Typed projections for the four status axes (DESIGN §3) and every J3 row; error-code dictionary mapped to Vietnamese.
    - Contracts in `docs/contracts/` (files ≤ 500 lines). Share final names with task 4 before task 5.
  - Refs: R2–R8, R11; DESIGN §3, §8.
  - Accept: exhaustive transitions; `unresolved` not in the order enum; a report never projects as verified; no implicit zero, unlimited or default offers.
  - QA: `npm run test:unit -- tests/unit/contracts.test.ts`
    - Happy: custom offer; exact UTC expiry; paid-only starting price; each J3 row; VietQR vectors (CRC `123456789` → `29B1`, decode round trip); reference alphabet and collision retry; memo matching with bank prefixes.
    - Rejected: negative or missing price, cap 0, unknown category, illegal transition, integer overflow, report treated as receipt, unowned receipt projection.
  - Commit: `feat(domain): define commerce and license contracts`

- [ ] **3. Build DB, RLS, auth and the admin trust boundary** — Wave 1
  - Do:
    - Split migrations for the R11 schema, constraints and grants; deterministic local test seed.
    - Server and browser Supabase clients.
    - Auth routes `/dang-nhap`, `/dang-ky`, `/xac-thuc`, `/quen-mat-khau` with 6-digit codes.
    - Role/MFA guards, step-up proof service, admin provisioning script, audit primitive, `docs/contracts/authorization.md`.
    - Business routines are added by their owning tasks.
  - Refs: R7, R9, R11; S1–S3, S8, S14.
  - Accept: fresh migrations apply; real code verification, password reset and admin MFA work; the public seed has no sale offers or credentials.
  - QA: `npm run test:integration -- tests/integration/access.test.ts`
    - Happy: Alice reads her own data; code verification through local mail capture; an AAL2 admin performs an audited action.
    - Denied: Bob IDOR, anon RPC, forged role metadata, expired auth, AAL1 admin mutation, wrong/expired/replayed code, stale or cross-purpose step-up proof.
  - Commit: `feat(identity): enforce auth roles RLS and audit`

- [ ] **4. Adopt the design contract and produce wireframes** — Wave 1
  - Do:
    - Copy DESIGN.md into the destination root unchanged.
    - Produce the DESIGN §13 deliverables: journeys, mobile + desktop wireframes, D01–D23 → task/test mapping, asset/font ledger with glyph and contrast evidence measured on the actual WOFF2 files.
    - Reconcile names with task 2. Get an independent read-only review before task 5.
    - No components.
  - Refs: R1; DESIGN (all); S7, S10–S12.
  - Accept: every D-gate has an owner task/test and an annotated screen; every denied/next/return action is defined; ledger complete; missing reference image recorded; wireframe approval ≠ final artwork approval.
  - QA: `npm run test:unit -- tests/unit/design-contract.test.ts`
    - Happy: token registry matches DESIGN §6; every D-ID is mapped.
    - Rejected: missing Vietnamese glyph or ₫ in a shipped WOFF2, cream-on-gold text, bronze text, missing semantic or focus token, warning hue within 10° of brand gold, missing journey state.
    - Evidence includes the wireframes and `design-review.md`.
  - Commit: `docs(design): adopt design contract and journey wireframes`

- [ ] **5. Implement primitives and shells** — Wave 1
  - Do:
    - `src/shared/ui` per DESIGN §7: Button (M2 metal), Field, CodeInput, Select, Dialog, Drawer, Dropdown, StatusLabel, Price, CopyValue, DataTable, Pagination, Toast, Empty/Error.
    - Public, customer and admin shells; `tokens.css` with Tailwind `--color-*: initial`.
    - Primitive host per R12; main `/__showcase` returns 404.
  - Refs: R1, R9, R12; DESIGN §6, §7, §11, §12; task 2 DTOs; task 4 review.
  - Accept: every state is accessible at the DESIGN §12 widths and 200% zoom; no texture under critical text; focus never obscured; measured contrast matches DESIGN §6; no dev tooling in the production bundle.
  - QA: `npm run test:e2e -- tests/e2e/primitives.spec.ts`
    - Happy: keyboard dropdown/dialog/drawer/table, copy feedback, pasting a code into CodeInput, reduced motion.
    - Failure cases: long text, validation, loading/disabled, 320px, zoom, mobile keyboard.
    - Evidence: axe.json, screenshots, traces.
  - Commit: `feat(ui): shared controls that keep purchase data legible`

- [ ] **6. Create asset delivery and the release-storage boundary** — Wave 1
  - Do:
    - Public art bucket and private software bucket.
    - Image checks (dimensions, mime, ≤ 10 MiB) and focal-point crops to AVIF/WebP.
    - Release uploads ≤ 250 MiB (server-configurable), SHA-256, immutable metadata; draft/quarantine → available only after a scanner verdict. Scanner port with a local fixture adapter.
    - URL allowlist; the server never fetches arbitrary admin URLs; storage paths never appear in public DTOs.
  - Refs: R2, R6, R11; S3, S4.
  - Accept: unauthorized upload/download denied; an unscanned or failed release is never downloadable; all three crops generated.
  - QA: `npm run test:integration -- tests/integration/storage.test.ts`
    - Happy: admin upload + clean scan.
    - Denied: path traversal, wrong type or size, malicious SVG, untrusted HTTPS host, failed or unavailable scanner, anon private download.
  - Commit: `feat(storage): protect release uploads and asset delivery`

- [ ] **7. Implement catalog, release history and independent pricing** — Wave 2
  - Do: server-only catalog DTOs and admin CRUD; five immutable slots; draft/archive/publish; screenshots, install steps, releases, changelog, software status; offers and promotions per R3; atomic publish; precise public tag revalidation.
  - Refs: R2, R3, R11; tasks 2, 6.
  - Accept: editing game A never changes B–E; unknown ≠ free; starting paid price excludes trials and inactive offers and carries duration/cap; only safe published releases are exposed.
  - QA: `npm run test:integration -- tests/integration/catalog.test.ts`
    - Happy: five independent edits; discount boundaries; trial+paid and trial-only projections; status change.
    - Rejected: sixth category, duplicate slot, overlapping promotions, draft leakage, malformed compatibility, 10000bp or fixed ≥ price (9999bp and price−1 stay valid).
  - Commit: `feat(catalog): administer five products and independent offers`

- [ ] **8. Implement CMS, support, flags and notifications** — Wave 2
  - Do:
    - CMS validation (guides, FAQ, banners, news, legal, contact, payment note) and draft preview.
    - Tickets; flags with audit and a typed guard.
    - Notification outbox, dispatcher, Vietnamese email templates, daily expiry-reminder job, opt-out preference.
  - Refs: R7, R8, R11.
  - Accept: all public editable content is DB-driven; missing flags deny only new actions; drafts never enter the public cache; each email event is sent exactly once.
  - QA: `npm run test:integration -- tests/integration/content-support.test.ts tests/integration/notifications.test.ts`
    - Happy: ticket round trip; publish; disable new tickets; the four events reach local mail capture; dispatcher retry with no duplicate; reminder once per (license, expires_at); opt-out respected.
    - Rejected: Bob replying to Alice’s ticket, script payload, non-admin flag write, new ticket via direct RPC while disabled, reminder for a suspended or revoked license, license key in an email body.
  - Commit: `feat(content): managed content, tickets, flags and email outbox`

- [ ] **9. Implement checkout and order snapshots** — Wave 2
  - Do:
    - Create-order use case: lock offer and flags; idempotency hash; snapshot including bank BIN; promotion math; transfer reference; VietQR payload derived from the snapshot.
    - Open-order reuse; 24h deadline; customer cancel before report; payment report.
    - Emit the order-created event; Vietnamese readiness errors.
  - Refs: R3, R4, R7; tasks 2, 8.
  - Accept: same key+body → same order; different body → conflict; open order reused (D22); stale price requires reconfirmation; a report survives expiry/cancellation and never projects paid; renewal target immutable in the snapshot.
  - QA: `npm run test:integration -- tests/integration/orders.test.ts`
    - Happy: 123456 VND snapshot with promotion; renewal snapshot; reuse of the open order; cancel then a new order; report after expiry; QR payload equals the snapshot.
    - Rejected: manipulated total, sales off, missing bank/BIN/terms, unverified user, expired offer, zero-charge paid discount, concurrent price edit, cancel after report.
  - Commit: `feat(commerce): freeze validated orders and transfer instructions`

- [ ] **10. Implement settlement, returns, refunds and manual grants** — Wave 2
  - Do:
    - Order-first confirmation transaction; receipt-first capture with exact-match suggestions; late settlement; unresolved queue.
    - License issuance (encrypted); return/refund ledger; separate revoke command.
    - Audit inside each transaction; bounded retries on transient DB errors only.
  - Refs: R4, R5, R7, R11.
  - Accept: exactly-once settlement and issuance; audit rolls back with a failed mutation; an exact on-time confirmation needs no reason; a mismatched amount → unresolved with reason; returns never move money or touch licenses.
  - QA: `npm run test:integration -- tests/integration/settlement.test.ts`
    - Happy: 20 concurrent order-first confirmations → one license; receipt-first then apply; partial and full returns.
    - Rejected: the same bank reference on two orders, wrong amount, AAL1 admin, late settlement without reason or step-up, apply-vs-return race, excess concurrent returns, applying a fully returned receipt, a suggestion that auto-applies.
  - Commit: `feat(payments): reconcile transfers and issue licenses atomically`

- [ ] **11. Implement activation, devices, leases, renewals and trials** — Wave 2
  - Do:
    - R5–R6 API and state machines; key management; Ed25519 lease with `grace_until` and JWKS; enrollment recovery.
    - Device cap locking; device label and throttled last-seen; rate limits.
    - Trial claim; renewal path; step-up for device removal; reveal-grant reuse window.
  - Refs: R5–R7, R11; S1–S3; `docs/api/license.openapi.yaml`.
  - Accept: first activation happens once; cap, expiry, 300s and grace bounds enforced; suspended/revoked refresh denied; trial claim creates no order; flags independent; renewal targets one license, keeps its cap and never clears suspension.
  - QA: `npm run test:integration -- tests/integration/licensing.test.ts` and `npm run test:unit -- tests/unit/lease.test.ts`
    - Happy: three devices competing for two slots; same-request trial retry; trial with sales off and trials on; active and expired renewal math; label stored; last_seen throttled; `grace_until` ≤ expiry and ≤ iat+1200.
    - Rejected: wrong product, secret or recovery proof; enrollment replay; unknown-key brute force; second trial; trials off; parallel renewal; suspension before settlement; `exp` equality; reveal grant reused across sessions or licenses.
  - Commit: `feat(licensing): enforce device-bound first-use licenses`

- [ ] **12. Implement entitlements, downloads and admin use cases** — Wave 2
  - Do: customer software/license/order projections; download authorization with 60s signed URLs; customer suspension; admin suspend/restore/revoke/grant; role changes with a last-admin guard; audit queries; signed-URL log redaction; private DTOs never cached.
  - Refs: R5–R7, R11; S1, S3, S4.
  - Accept: an unactivated paid or trial license downloads without starting expiry; expired and suspended are denied; sales-off keeps existing rights; projections tell same-product licenses apart by reference without exposing keys; a paid order stays paid when its license is revoked; the final admin cannot be removed.
  - QA: `npm run test:integration -- tests/integration/entitlements.test.ts`
    - Happy: owner projection, reveal, download, restore, audit.
    - Denied: Bob’s IDs, unassociated receipt data, leaked artifact path, expired link, suspended account, stale role claim.
  - Commit: `feat(access): protect customer downloads and admin actions`

- [ ] **13. Build the storefront and product navigation** — Wave 3
  - Do: homepage in DESIGN §5 order; header with dropdown and drawer; game cards (vertical ≥ 1200px, horizontal below); footer; hero materials per DESIGN §6.
  - Refs: R1, R2; DESIGN §1, §4–§6, §12; tasks 5, 7, 8.
  - Accept: five cards and five menu entries; hero CTAs and the session entry route correctly; the same facts sit in the same positions on every card; a trial never makes the price 0 ₫; CMS edits revalidate; no fabricated recommendations or metrics; hero text is DOM.
  - QA: `npm run test:e2e -- tests/e2e/home.spec.ts`
    - Happy: at the DESIGN §12 widths — discovery, session-aware navigation, header at 1199/1200.
    - Failure cases: empty, unavailable or trial-only products; no news; missing art; long names; reduced motion.
  - Commit: `feat(storefront): make game and package discovery clear without visual clutter`

- [ ] **14. Build product pages, pricing, guides and updates** — Wave 3
  - Do:
    - Five product pages per DESIGN §5: status, versions, `#goi` selector, trial block, pending-order banner, existing-license renewal line, readiness notice.
    - `/bang-gia` as rows with game chips.
    - Guides, news, FAQ, help, legal pages; 404 for invalid slugs; unpublished news unavailable.
  - Refs: R2, R3, R5, R6, R8; DESIGN §5, J1, J2; tasks 7, 9, 11, 12.
  - Accept: offer facts visible without FAQ or horizontal scroll; trial-only shows no fake paid offer; returning from auth keeps product, offer and intent; pending-order banner shown when applicable.
  - QA: `npm run test:e2e -- tests/e2e/product-pages.spec.ts`
    - Happy: five unique pages; trial claim with no transfer screen; code verification returns to the same offer.
    - Failure cases: used or disabled trial, unknown price, unavailable release, missing art, long changelog; sales and trials flags independent.
  - Commit: `feat(products): deliver distinct game landing and pricing pages`

- [ ] **15. Build checkout and the order page** — Wave 3
  - Do:
    - `/thanh-toan` with purchase and renewal variants.
    - `/don-hang/[ma]` with: PaymentQR (PNG; “Lưu ảnh QR” via Web Share or download), CopyValue fields, deadline, report and cancel, three status lines, 30s polling, J3 rows, payment note, renewal estimate vs actual.
  - Refs: R3–R5, R8; DESIGN §5, J1, J3, J4; tasks 5, 9–11.
  - Accept: at 320/375px the essential facts and 44px actions stay usable; QR content equals the text fields; reload resumes the same order; a reported expiry never prompts another transfer; paid leads to Phần mềm của tôi.
  - QA: `npm run test:e2e -- tests/e2e/checkout.spec.ts`
    - Happy: offer → order → decoded QR equals snapshot → report → expiry/reload → late settlement via AAL2 fixture → paid → owned software, with no duplicate order; a second “Mua gói” reopens the open order; an associated unresolved receipt shows a safe reason; renewal estimate vs actual with fixed timestamps.
    - Failure cases: double click, forged paid querystring, stale price, logout, network loss, mobile keyboard covering errors, Web Share unavailable → download fallback.
  - Commit: `feat(checkout): add reliable mobile VietQR transfer flow`

- [ ] **16. Build the customer area** — Wave 3
  - Do:
    - Four-section account (DESIGN §4–§5): Phần mềm của tôi with banners, product groups and license rows.
    - License detail with devices (rename; remove with step-up).
    - Orders; support (prefilled from context); settings (password, reminder toggle).
  - Refs: R5–R8; DESIGN §5, J4; tasks 5, 8, 11, 12.
  - Accept: an unactivated license downloads without starting its term; one of two same-product licenses is renewed unambiguously; device list shows label, registration date and last seen; a reveal within 10 min does not re-prompt; removal always re-prompts.
  - QA: `npm run test:e2e -- tests/e2e/customer.spec.ts`
    - Happy: download without reveal; reveal twice within the window; device removal returns to the same context; renew one of two licenses (DB check that the sibling’s expiry is unchanged); toggle reminder; ticket.
    - Denied: Bob’s URLs, stale step-up, expired session, renewal with sales off, revoked download, changed-cap choice silently renewing the target. An account with no licenses shows a useful empty state.
  - Commit: `feat(account): deliver customer license and support area`

- [ ] **17. Build commerce, catalog and license admin** — Wave 3
  - Do: Việc cần xử lý; order list and detail with PaymentConfirmPanel; Đối soát workbench; licenses; customers; product forms incl. status and crop preview; offers. Plain M0 per DESIGN.
  - Refs: R2–R7; DESIGN §5, J5; tasks 7, 10, 12.
  - Accept: an exact on-time confirmation from the order takes one dialog and no reason; a changed amount becomes an unresolved receipt; receipt-first applies once; returns update the balance without license changes; a fully returned receipt has no Apply; mobile keeps identity, status, amount and actions.
  - QA: `npm run test:e2e -- tests/e2e/admin-commerce.spec.ts`
    - Happy: reported order → confirm → license; mismatched amount → unresolved → partial/full return → no fulfillment; receipt-first suggestion → apply; edit offers, status and crops; suspend/restore/revoke/refund as separate actions.
    - Failure cases: duplicate reference, wrong candidate, invalid days, sixth slot, applying a returned receipt, AAL1, late settlement without step-up, stale concurrent form, double submit.
    - Verify persisted DB state, not only the UI.
  - Commit: `feat(admin): build commerce and licensing console`

- [ ] **18. Build CMS, support, settings and flag admin** — Wave 3
  - Do:
    - Forms for banners, guides, news, FAQ, legal, contact, payment note and bank (incl. BIN); email template preview.
    - Support queue; flag matrix with impact preview and audit.
    - Readiness checklist: bank, BIN, terms, SMTP, scheduler, scanner, art rights, status warnings.
  - Refs: R7, R8; DESIGN §5, J6; task 8.
  - Accept: CMS fields persist and render; bank changes affect new orders only; content cannot inject badges or SLAs; sales and trials effects explained separately; existing threads stay usable when new tickets are disabled.
  - QA: `npm run test:e2e -- tests/e2e/admin-content.spec.ts`
    - Happy: publish banner/FAQ/news; answer a ticket; toggle flags; preview an email.
    - Rejected: script payload, missing alt, direct call to a disabled endpoint, unauthorized flag change, bank change without step-up.
  - Commit: `feat(admin): complete managed content and configuration`

- [ ] **19. Integrate end-to-end journeys** — Wave 4
  - Do: full journeys on the production build with seeded identities/MFA, bank fixtures and the client simulator; resolve contract drift into one canonical domain contract; fixtures never leak into the production seed. The simulator is not a game integration.
  - Refs: R1–R12.
  - Accept, against a real local DB:
    - Main path: register (code) → purchase → QR → report → admin confirm → email → owned software → download → reveal → activate two devices → refresh → renew the selected license → support → refund record → separate revoke.
    - Branches: trial; reported expiry + late approval; open-order reuse; unmatched receipt with partial and full return; grace on network failure vs immediate stop on revoke.
  - QA: `npm run test:e2e -- tests/e2e/full-journey.spec.ts` and `npm run test:integration -- tests/integration/client-contract.test.ts`
    - Failure cases: disconnect/restart, lost activation response, duplicate admin submit, renewal target suspension, stale lease.
    - No orphan fulfillment, duplicate email or duplicate transfer prompt.
  - Commit: `test(integration): prove complete marketplace journeys`

- [ ] **20. Run adversarial security and race verification** — Wave 4
  - Do:
    - Attack matrix: real RLS, storage and SQL grants; CSRF/origin checks; IDOR, privilege escalation and price tampering; auth and code throttling; lease forgery and key rotation; flag cache races; transaction rollback; secrets in JS or logs; upload validation; QR endpoint access.
    - Fix root causes — no allow-all policies, no disabled tests.
    - CSP and security headers; dependency audit triaged; no automatic breaking upgrades.
  - Refs: R3–R11; S1, S3, S4.
  - Accept: every protected endpoint/RPC is mapped to allow and deny tests; 20 parallel settlement/activation/refund/create-order scenarios hold their invariants; no unresolved high/critical exploitable finding.
  - QA: `npm run test:integration -- tests/integration/security-matrix.test.ts tests/integration/races.test.ts`
    - Malicious actors are denied, proven by DB invariants, not just HTTP status.
  - Commit: `fix(security): close authorization and concurrency gaps`

- [ ] **21. Verify usability, materials, Vietnamese type and accessibility** — Wave 4
  - Do:
    - Independent walkthroughs of J1–J6 and every D-gate: DESIGN §12 widths, 200% zoom, mobile keyboard, reduced motion, screen reader, axe.
    - Visual review against DESIGN §6 and the task 4 wireframes; a verdict recorded per iteration. Tasks 13–18 collect their own verdicts before this.
    - Generic decorative drift and confusing labels are defects.
  - Refs: R1, R9; DESIGN (all); `docs/design/ux-acceptance.md`.
  - Accept:
    - Every D-gate has pass/fail evidence. A failed purchase, claim, receipt or renewal task blocks approval regardless of screenshots or scores.
    - axe: no serious or critical issues.
    - The reviewer confirms the Golden Immortal Galaxy identity, M0–M4 restraint and practical account/admin screens, and never claims fidelity to the missing reference.
  - QA: `npm run test:visual`
    - Route/state screenshots plus walkthrough assertions; rendered color pairs; 44px targets; NFC/NFD samples; QR save flow under mobile emulation.
    - Negative cases: absent optional content, empty tables, validation errors, missing images, long names, reported expiry, two same-product licenses, unresolved receipt, mobile keyboard, reduced motion.
    - Evidence: screens, axe.json, gate-matrix.json, reviewer-verdict.md. Missing review tooling is a blocker, not grounds for self-approval.
  - Commit: `fix(design): keep marketplace tasks clear across fantasy branding and devices`

- [ ] **22. Optimize public performance, SEO and private caching** — Wave 4
  - Do:
    - Vietnamese metadata, canonicals, OG; public-only sitemap and robots; structured data only from truthful fields.
    - Responsive images, fonts and chunking.
    - `no-store` + `noindex` for auth, account, admin, checkout, order and QR; cache isolation tested with Alice and Bob.
  - Refs: R1, R9; DESIGN §13; S1, S5–S7, S10–S12; `scripts/audit-browser.mjs`.
  - Accept: DESIGN §13 budgets met, or recorded as an explicit unresolved gate with its report; Lighthouse 3+3 runs per public route recorded as diagnostics; prices agree across card, selector and metadata; shipped fonts keep their Vietnamese glyphs.
  - QA: `npm run test:e2e -- tests/e2e/seo-cache.spec.ts` and `npm run test:performance`
    - Failure cases: crawling a private URL, a draft announcement, a cross-user cached response — none expose private data.
  - Commit: `perf(web): verify fast public pages and private cache isolation`

- [ ] **23. Document operations, readiness and client integration** — Wave 4
  - Do:
    - README; `.env.example` with names only.
    - Runbooks: setup; auth email templates with `{{ .Token }}`; MFA; migrations, backup and restore; key rotation; dispatcher and reminder scheduler; SMTP.
    - Vietnamese admin handbook: order-first confirmation, unmatched receipts, partial/full return vs refund vs revoke, late settlement, stale conflicts.
    - Client integration checklist, including grace semantics.
    - Readiness checks and launch gates: bank config plus one real bank-app QR scan (without confirming the transfer), SMTP, scheduler, terms/policies, art rights, scanner, real-client evidence.
    - Deployment-neutral; no host chosen and no account modified.
  - Refs: R3–R12; S2, S8; `docs/operations/`, `docs/api/`.
  - Accept: clean setup and a disposable restore work from the documented commands; key rotation keeps an old unexpired lease valid within the 300s bound; signing and encryption secrets are separate.
  - QA: `npm run test:integration -- tests/integration/operations.test.ts`
    - Happy: backup/restore and key rotation against local services.
    - Failure cases: missing secrets, scanner, SMTP, bank/BIN or terms produce precise readiness blockers, with no fake success and no secret disclosure.
  - Commit: `docs(operations): add safe launch and client integration runbooks`

- [ ] **24. Run reproducible release verification and hand off** — Wave 4
  - Do:
    - Fresh clone, install and local DB bootstrap; all npm checks, tests and the build.
    - Scan for stubs, skipped tests and unfinished handlers.
    - Compare the five categories, routes, actions, R1–R12 and D01–D23 against the evidence. Record reference-image availability separately from text/UX compliance.
    - Inventory: line limits, boundaries, token/material usage, fonts/assets and their licenses, lockfile, production seed.
    - Manifest: git SHA, commands, exit codes, suite counts, timestamps, screenshots. Distinguish verified code from launch blockers.
  - Refs: R1–R12; DESIGN §14; `scripts/verify-release.mjs`.
  - Accept: `npm ci && npm run verify:local && npm run verify:release` exits 0 in a clean isolated environment; no skipped tests or placeholder code; no missing D-gate evidence; readiness lists every missing external input without passing production launch; read-only mode does no DB work.
  - QA: the command above. The harness must reject a non-loopback DB, a missing suite, a missing task-4 design verdict and a missing D-gate; a clean rerun records fresh evidence.
  - Commit: `chore(release): assemble verified marketplace delivery evidence`

## Final verification wave

> Runs in parallel after ALL tasks; ALL must approve. Surface the results and wait for the user’s explicit okay before declaring the work complete.

- [ ] **F1. Plan compliance.**
  - Who/how: an independent read-only reviewer checks R1–R12, DESIGN.md and D01–D23 traceability against files and task artifacts; runs `npm run verify:release -- --read-only`; inspects all 24 task results without DB mutation.
  - Any missing route, field or unverifiable success rejects.
  - Evidence: `$QA_DIR/final/F1/<run-id>/verdict.md`.
- [ ] **F2. Code quality.**
  - Who/how: an independent reviewer runs read-only `npm run verify:static` and reviews module boundaries, types, SQL authorization and transactions, credentials, CSS token ownership and material scope, font roles, line limits and test quality; compares privileged paths with the task 20 matrix.
  - Skipped tests, unsafe assertions or an RLS bypass blocks.
  - Evidence: `$QA_DIR/final/F2/<run-id>/verdict.md`.
- [ ] **F3. Real manual QA.**
  - Who/how: an independent agent on its own local Supabase and ports (R12) drives the browser interactively, desktop and mobile — not by rereading suite logs.
  - Main walk: sign up with a code → purchase with QR → admin confirmation → download → simulator activation → renewal → ticket → suspend/revoke.
  - Also: trial without a bank step, reported expiry + late approval, open-order reuse, renewal target selection, unresolved receipt return.
  - Inspect material boundaries, price and target clarity, sticky focus and real Vietnamese glyphs. Cross-user navigation and disabled actions must be denied.
  - Afterwards, rerun `npm run test:e2e -- tests/e2e/full-journey.spec.ts` in the same lane.
  - Evidence: `$QA_DIR/final/F3/<run-id>/`.
- [ ] **F4. Scope fidelity.**
  - Who/how: an independent reviewer compares R1–R12 and DESIGN.md with the built routes, data and UI and the immutable release manifest; no DB commands.
  - Confirm: a single-merchant five-game store; independent paid and trial presentation; Golden Immortal Galaxy identity with restrained effects and per-game art; a real backend; no fake claims; no external client implementation or live deployment.
  - Separate missing launch inputs from omitted features. False real-client enforcement or production claims reject.
  - Evidence: `$QA_DIR/final/F4/<run-id>/verdict.md`.

No commits during F1–F4.

## Commit strategy

- **When:** one commit per task, after its tests pass. Never split an implementation from its tests.
- **Message:** an intent-first subject (the task’s `Commit` line is the default), a short rationale, and `Tested:` / `Not-tested:` trailers.
- **Never commit:** secrets, binaries or test customer data. Public licensed artwork may be versioned; software installers live in storage only.
- **Dependencies:** the lockfile goes with the foundation and with approved dependency changes; no dependency is added only for ornament.
- **Boundaries:** planning files are never committed from Downloads. Local commits do not authorize push, PR or deploy.
- **Final gates:** F1–F4 run against a frozen SHA. Fixes invalidate the affected evidence and require reruns; never rebase unrelated work.

## Success criteria

1. All 24 tasks and the four final gates have fresh evidence, and F1–F4 all approve. The owner sees the results before completion is claimed.
2. A multi-page, single-merchant software store (public, customer and admin areas) works against real local Supabase: exactly five game categories, independently editable packages; no cart, no multiple sellers, no item market.
3. VietQR transfer with manual confirmation, open-order reuse, first-use multi-device licensing, the 300s lease with network-only grace, renewals, trials, downloads, refunds, flags and transactional email all pass happy-path and adversarial DB-backed tests.
4. The UI follows DESIGN.md: Golden Immortal Galaxy identity with M0–M4 restraint, the original brand seed, per-game art, and plain, readable checkout, account and admin screens. Every D01–D23 gate passes on its own; scores never approve a failed task, and the missing reference art is never reported as matched.
5. Strict types, module boundaries, file-size limits, CSS conventions, security checks, a clean build and tests-after verification all pass.
6. The production-readiness document truthfully lists outstanding owner inputs: bank config + real QR scan, SMTP, scheduler, policies, licensed artwork and binaries, scanning service, real-client integration. Code completion is never advertised as live commerce or as enforcement in unintegrated game clients.
7. This revision changes only the planning documents. Implementation starts only on a separate, explicit user request.
