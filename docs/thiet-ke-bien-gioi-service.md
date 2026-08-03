### 1. Danh sách Service
| api-gateway | 8080 | Không có DB | Điểm vào duy nhất của hệ thống, định tuyến      request, xác thực sơ bộ JWT, CORS, giới hạn truy cập |
| auth-service | 8081 | auth_db | Quản lý người dùng, sinh viên, đăng nhập, đăng ký tài khoản, sinh và xác thực JWT |
| course-service | 8082 | course_db | Quản lý học phần, tìm kiếm học phần, phân trang, quản lý số lượng chỗ còn lại |
| registration-service | 8083 | registration_db | Quản lý đăng ký học phần, kiểm tra điều kiện đăng ký, gọi sang course-service để xác nhận học phần và cập nhật số chỗ |

---

## 2. Nguyên tắc sở hữu dữ liệu (Data Ownership)

Trong kiến trúc Microservices, **mỗi service sở hữu một database riêng** và chỉ service đó được quyền truy cập trực tiếp dữ liệu của mình.

### Nguyên tắc

- `auth-service` chỉ truy cập `auth_db`
- `course-service` chỉ truy cập `course_db`
- `registration-service` chỉ truy cập `registration_db`
- Không service nào được truy cập trực tiếp database của service khác.

### Trao đổi dữ liệu

Khi cần dữ liệu từ service khác, service phải gọi **REST API**.

Ví dụ:

- `registration-service` cần kiểm tra học phần còn chỗ hay không.
- `registration-service` gửi request đến `course-service`.
- `course-service` trả về thông tin học phần và số chỗ còn lại.
- Nếu hợp lệ, `registration-service` lưu đăng ký và yêu cầu `course-service` giảm số chỗ.

### Ví dụ lưu trữ

Bảng `Registration` trong `registration_db`

| id | studentId | courseId  | registerTime |
|----|-----------|---------- |--------------|
| 1  | 1001 | 205| 2026-08-03 10:00 |

Trong bảng này **không có khóa ngoại thật** đến bảng `Course`, chỉ lưu `courseId`.

---

## 3. Bảng định tuyến Gateway (dự kiến)

|     Route    | Forward tới | Ghi chú |
|--------------|-------------|--------|
| /api/auth/** | http://localhost:8081 | API đăng nhập là Public, các API khác yêu cầu JWT |
| /api/courses/** | http://localhost:8082 | GET là Public, POST/PUT/DELETE yêu cầu role ADMIN |
| /api/registrations/** | http://localhost:8083 | Yêu cầu JWT (STUDENT hoặc ADMIN) |
| /api/public/courses | http://localhost:8082 | Sử dụng API Key, dành cho đối tác bên ngoài |

---

## Luồng đăng ký học phần

1. Sinh viên đăng nhập qua `/api/auth/login`.
2. `auth-service` xác thực tài khoản và trả về **JWT**.
3. Sinh viên gửi yêu cầu đăng ký qua `/api/registrations`.
4. `api-gateway` kiểm tra JWT.
5. `registration-service` gọi `course-service` để:
    - kiểm tra học phần tồn tại,
    - kiểm tra còn chỗ.
6. Nếu hợp lệ:
    - `registration-service` lưu bản ghi đăng ký,
    - `course-service` cập nhật số chỗ còn lại.
7. Kết quả đăng ký được trả về cho sinh viên thông qua `api-gateway`.

---