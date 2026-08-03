# Blueprint API - Hệ thống đăng ký học phần

Tài liệu này mô tả các API dự kiến của toàn bộ hệ thống theo kiến trúc Microservices.

---

# 1. Auth Service

**Cổng:** `8081`  
**Tiền tố khi đi qua Gateway:** `/api/auth`

| Method | Endpoint | Mô tả | Yêu cầu |
|--------|----------|------|---------|
| POST | /auth/login | Đăng nhập, trả về JWT | Public |
| POST | /auth/register | Đăng ký tài khoản | Public |
| GET | /auth/me | Lấy thông tin người dùng hiện tại | JWT |
| POST | /auth/validate | Xác thực JWT (dùng nội bộ) | Internal |

### Ví dụ

**POST /api/auth/login**

```json
{
  "username": "student01",
  "password": "123456"
}
```

**Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "STUDENT"
}
```

---

# 2. Course Service

**Cổng:** `8082`  
**Tiền tố:** `/api/courses`

## API công khai

| Method | Endpoint | Mô tả | Yêu cầu |
|--------|----------|------|---------|
| GET | /courses | Danh sách học phần (search + phân trang) | Public |
| GET | /courses/{id} | Chi tiết học phần | Public |
| POST | /courses | Thêm học phần | ADMIN |
| PUT | /courses/{id} | Cập nhật học phần | ADMIN |
| DELETE | /courses/{id} | Xóa học phần | ADMIN |

## API nội bộ (chỉ Registration Service gọi)

**Không đi qua Gateway cho Frontend**

| Method | Endpoint | Mô tả |
|--------|----------|------|
| PATCH | /internal/courses/{id}/reserve-seat | Kiểm tra còn chỗ và giảm số chỗ còn lại (transactional) |
| PATCH | /internal/courses/{id}/release-seat | Hoàn trả 1 chỗ khi hủy đăng ký |

### Ví dụ

**PATCH /internal/courses/101/reserve-seat**

Response

```json
{
  "success": true,
  "remainingSeats": 24
}
```

---

# 3. Registration Service

**Cổng:** `8083`  
**Tiền tố:** `/api/registrations`

| Method | Endpoint | Mô tả | Yêu cầu |
|--------|----------|------|---------|
| POST | /registrations | Đăng ký học phần (gọi ngầm sang course-service) | STUDENT |
| GET | /registrations/my | Danh sách đăng ký của tôi | STUDENT |
| DELETE | /registrations/{id} | Hủy đăng ký (gọi ngầm release-seat) | STUDENT / ADMIN |
| GET | /registrations | Xem toàn bộ đăng ký | ADMIN |
| GET | /registrations/{id} | Chi tiết một đăng ký | ADMIN |

### Ví dụ

**POST /api/registrations**

```json
{
  "courseId": 101
}
```

Response

```json
{
  "registrationId": 15,
  "courseId": 101,
  "status": "REGISTERED"
}
```

---

# 4. Gateway Routing

| Route | Forward tới |
|------|-------------|
| /api/auth/** | http://localhost:8081 |
| /api/courses/** | http://localhost:8082 |
| /api/registrations/** | http://localhost:8083 |
| /api/public/courses | http://localhost:8082 |

---

# 5. Luồng đăng ký học phần

## Đăng nhập

Frontend

→ POST `/api/auth/login`

→ Auth Service

→ JWT

## Xem danh sách môn học

Frontend

→ GET `/api/courses`

→ Course Service

## Đăng ký học phần

Frontend

→ POST `/api/registrations`

→ Registration Service

→ PATCH `/internal/courses/{id}/reserve-seat`

→ Course Service

→ Lưu Registration

→ Trả kết quả

## Hủy đăng ký

Frontend

→ DELETE `/api/registrations/{id}`

→ Registration Service

→ PATCH `/internal/courses/{id}/release-seat`

→ Course Service

→ Xóa Registration

→ Trả kết quả

---

# 6. Quy ước bảo mật

| Vai trò | Quyền |
|---------|------|
| Public | Xem danh sách môn học, chi tiết môn học, đăng nhập, đăng ký tài khoản |
| STUDENT | Đăng ký học phần, xem đăng ký của mình, hủy đăng ký của mình |
| ADMIN | Quản lý môn học, xem toàn bộ đăng ký, hủy đăng ký của bất kỳ sinh viên nào |
| Internal | Chỉ các service nội bộ gọi lẫn nhau (reserve-seat, release-seat, validate token) |
