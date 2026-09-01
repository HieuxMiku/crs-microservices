import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;

    // Chỉ có AdminCoursesPage mới truyền 2 hàm này
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;
    onRegister?: (course: Course) => void;

    registeringId?: number | null;
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry,
                                       onEdit,
                                       onDelete,
                                       onRegister,
                                       registeringId,
                                   }: CourseListProps) {

    // =========================
    // HIỂN THỊ CỘT THAO TÁC
    // =========================
    const showActions =
        !!onEdit ||
        !!onDelete ||
        !!onRegister;

    // =========================
    // LOADING
    // =========================
    if (state === 'loading') {
        return <p>Đang tải danh sách môn học...</p>;
    }

    // =========================
    // ERROR
    // =========================
    if (state === 'error') {
        return (
            <div style={{ color: '#b91c1c' }}>
                <p>{errorMessage}</p>

                <button onClick={onRetry}>
                    Thử lại
                </button>
            </div>
        );
    }

    // =========================
    // EMPTY
    // =========================
    if (state === 'empty') {
        return <p>Không tìm thấy môn học nào phù hợp.</p>;
    }

    // =========================
    // SUCCESS
    // =========================
    return (
        <table
            style={{
                width: '100%',
                borderCollapse: 'collapse',
            }}
        >
            <thead>
            <tr
                style={{
                    textAlign: 'left',
                    borderBottom: '2px solid #333',
                }}
            >
                {/* Cột thao tác */}
                {showActions && (
                    <th>Thao tác</th>
                )}

                <th>Tên môn học</th>
                <th>Số tín chỉ</th>
                <th>Số chỗ còn lại</th>
            </tr>
            </thead>

            <tbody>
            {courses.map((course) => (
                <tr
                    key={course.id}
                    style={{
                        borderBottom: '1px solid #eee',
                    }}
                >

                    {/* =========================
                        THAO TÁC
                    ========================= */}
                    {showActions && (
                        <td>

                            {/* NÚT SỬA */}
                            {onEdit && (
                                <button
                                    onClick={() =>
                                        onEdit(course)
                                    }
                                >
                                    Sửa
                                </button>
                            )}

                            {/* NÚT XÓA */}
                            {onDelete && (
                                <button
                                    onClick={() =>
                                        onDelete(course)
                                    }
                                    style={{
                                        marginLeft: 8,
                                        color: '#b91c1c',
                                    }}
                                >
                                    Xóa
                                </button>
                            )}

                            {/* NÚT ĐĂNG KÝ */}
                            {onRegister && (
                                <button
                                    onClick={() =>
                                        onRegister(course)
                                    }
                                    disabled={
                                        course.soChoConLai === 0 ||
                                        registeringId === course.id
                                    }
                                    style={{
                                        marginLeft: 8,
                                    }}
                                >
                                    {registeringId === course.id
                                        ? 'Đang đăng ký...'
                                        : course.soChoConLai === 0
                                            ? 'Hết chỗ'
                                            : 'Đăng ký'}
                                </button>
                            )}

                        </td>
                    )}

                    {/* =========================
                        TÊN MÔN HỌC
                    ========================= */}
                    <td>
                        {course.tenMonHoc}
                    </td>

                    {/* =========================
                        SỐ TÍN CHỈ
                    ========================= */}
                    <td>
                        {course.soTinChi}
                    </td>

                    {/* =========================
                        SỐ CHỖ CÒN LẠI
                    ========================= */}
                    <td
                        style={{
                            color:
                                course.soChoConLai === 0
                                    ? '#b91c1c'
                                    : 'inherit',
                        }}
                    >
                        {course.soChoConLai} / {course.soChoToiDa}
                    </td>

                </tr>
            ))}
            </tbody>
        </table>
    );
}