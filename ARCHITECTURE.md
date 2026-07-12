# SOUL Phygital Platform — prototype architecture

## ขอบเขตปัจจุบัน

ต้นแบบเป็น Next.js App Router บน Node.js runtime พร้อม repository interface ที่สลับ implementation ได้ ข้อมูลทั้งหมดใน `lib/soul/seed.ts` เป็นข้อมูลสมมติ ไม่มีชื่อ อีเมล เบอร์โทร account ID หรือ device ID ของบุคคลจริง การ์ดและผลการรับรางวัลเก็บในหน่วยความจำ จึงเหมาะกับ demo เท่านั้นและอาจหายเมื่อ Vercel function เปลี่ยน instance

API หลัก:

- `GET /api/cards/[token]` คืนข้อมูลการ์ดสาธารณะและข้อจำกัด NFC
- `POST /api/rewards/redeem` บันทึกผล prototype แบบ idempotent ระดับ instance
- `POST|DELETE /api/admin/session` เข้า/ออกระบบผู้ดูแล
- `GET /api/admin/overview` ต้องมี admin session และคืนสถิติรวมที่ไม่มี PII
- `GET /api/health` health check แบบไม่เปิดเผย secret

การแตะ token, การพิสูจน์ชิป, ความเป็นเจ้าของ และสิทธิ์รางวัลเป็นคนละสถานะกัน API นี้กำหนด `ownership.granted=false` และ `productionEntitlementCreated=false` เสมอ การแตะไม่สร้าง ownership หรือ entitlement

## Security ของต้นแบบ

- Admin session เป็น opaque payload ที่เซ็น HMAC-SHA256 ตรวจลายเซ็นและรหัสผ่านด้วย `timingSafeEqual` แล้วเก็บใน cookie `HttpOnly`, `SameSite=Strict`, `Secure` บน production และหมดอายุใน 8 ชั่วโมง
- Production ต้องตั้ง `ADMIN_PASSWORD` อย่างน้อย 12 ตัวอักษรและ `ADMIN_SESSION_SECRET` อย่างน้อย 32 ตัวอักษร หากไม่ครบ endpoint ผู้ดูแลจะ fail closed; `SOUL2026` ใช้ได้เฉพาะ development
- Mutation ตรวจ same-origin, JSON schema ด้วย Zod, จำกัด body size และตั้ง security/no-store headers
- Fixed-window rate limit ปัจจุบันเป็น best-effort ต่อ function instance และเก็บเพียง HMAC fingerprint ชั่วคราว ไม่เก็บ raw IP; production ต้องเปลี่ยนเป็น shared atomic store
- Idempotency key ถูกจำ 24 ชั่วโมงภายใน instance; production ต้องใช้ unique constraint/transaction ในฐานข้อมูล
- Authorization ตรวจใน Route Handler โดยตรง ไม่พึ่ง middleware/proxy เป็นด่านเดียว

## NFC URL ที่ควรใช้ใน production

เขียน URL ที่ไม่มี PII และใช้ opaque random identifier อย่างน้อย 128 บิต เช่น:

```text
https://soul.example/c/{opaqueId}?v=1&sig={base64url(HMAC-SHA256(key, "1\n" + opaqueId))}
```

เก็บเฉพาะ hash ของ `opaqueId` ในฐานข้อมูล, แยก key version สำหรับ rotation, ตรวจ HMAC แบบ constant-time และ revoke รายการที่สูญหายได้ ลายเซ็นป้องกันการปลอม/แก้ URL แต่ **ไม่ป้องกันการคัดลอก static URL**

NTAG216 ไม่มี secure dynamic challenge; URL จึง clone/replay ได้และ browser ไม่ได้รับ UID ที่เชื่อถือได้ หากต้องการ anti-cloning ให้เปลี่ยนเป็นชิปที่รองรับ dynamic secure messaging เช่น NTAG 424 DNA/SUN และตรวจ MAC + counter + replay window ฝั่ง server แม้เช่นนั้น “แตะชิปแท้” ก็ยังไม่เท่ากับ “เป็นเจ้าของ” การโอน ownership ควรใช้ authenticated account และ one-time activation/transfer transaction แยกต่างหาก

## เส้นทางขึ้น Vercel production

1. สร้าง Vercel project และตั้ง Production/Preview secrets แยกกัน; ห้ามใส่ secret ใน `NEXT_PUBLIC_*` หรือ commit ลง Git
2. เปลี่ยน `InMemorySoulRepository` เป็น Postgres implementation (เช่น managed Postgres ผ่าน Vercel Marketplace) พร้อม migrations, foreign keys, row-level constraints และ unique index บน idempotency key
3. ใช้ shared Redis/KV สำหรับ atomic rate limit; เสริม Vercel Firewall/WAF และ bot controls ที่ login/redeem โดยยังคงตรวจ auth ใน handler
4. เก็บ asset ใน object storage/CDN, จำกัด MIME/ขนาด และใช้ signed upload สำหรับ admin; ไม่รับ upload สาธารณะโดยตรง
5. เปลี่ยน password admin เป็น managed identity/SSO หรือ passkey + MFA, session rotation/revocation และ audit events ที่ไม่บันทึก password, cookie, NFC token หรือ request body
6. แยก tap event แบบ aggregate/pseudonymous, ตั้ง retention และ backup/restore test; เพิ่ม monitoring สำหรับ 5xx, login abuse, replay และ database saturation
7. Deploy Preview, ทดสอบ schema/migration และ security headers แล้ว promote deployment เดิมสู่ Production เพื่อให้ artifact ที่ตรวจแล้วเหมือนกัน

## PDPA และ privacy

ก่อนเก็บข้อมูลจริงต้องกำหนดวัตถุประสงค์และฐานกฎหมาย, แสดง privacy notice, เก็บเท่าที่จำเป็น, แยก consent ที่เพิกถอนได้, จำกัด retention, ทำ access control/audit และรองรับคำขอเจ้าของข้อมูล ห้ามฝังชื่อ อีเมล student ID หรือข้อมูลติดตามใน NFC URL ห้ามส่ง PII ไป analytics โดยอัตโนมัติ และควรทำ DPIA หากนำพฤติกรรมการแตะไปสร้างโปรไฟล์บุคคล

สถิติ dashboard ควรเป็น aggregate พร้อม threshold ป้องกันการระบุตัวย้อนกลับ ส่วน account/ownership (หากเพิ่มภายหลัง) ควรใช้ internal pseudonymous ID, encryption in transit/at rest, least privilege และกระบวนการลบ/ส่งออกข้อมูลที่ทดสอบได้

