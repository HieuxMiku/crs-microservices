import { useState } from 'react';
import axios from 'axios';

import { useCourses } from './api/useCourses';
import {
    createCourse,
    updateCourse,
    deleteCourse,
} from './api/courseApi';

import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import CourseForm from './components/CourseForm';

import type { Course, CourseFormValues } from './types/course';
import type { ApiErrorResponse } from './types/apiError';

function App() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);

    const [editingCourse, setEditingCourse] =
        useState<Course | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] =
        useState<string | null>(null);

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch,
    } = useCourses(keyword, page);

    // =========================
    // SEARCH
    // =========================
    const handleSearch = (newKeyword: string) => {
        setKeyword(newKeyword);
        setPage(0);
    };

    // =========================
    // EXTRACT ERROR MESSAGE
    // =========================
    const extractErrorMessage = (err: unknown): string => {
        if (axios.isAxiosError<ApiErrorResponse>(err)) {
            const data = err.response?.data;

            // Server trả về:
            // { message: "..." }
            if (data?.message) {
                return data.message;
            }

            // Server trả về lỗi validation:
            // {
            //     tenMonHoc: "...",
            //     soTinChi: "..."
            // }
            if (data) {
                const firstFieldError = Object.values(data).find(
                    (value) => typeof value === 'string'
                );

                if (firstFieldError) {
                    return firstFieldError;
                }
            }
        }

        return 'Đã xảy ra lỗi, vui lòng thử lại.';
    };

    // =========================
    // CREATE / UPDATE COURSE
    // =========================
    const handleFormSubmit = async (
        values: CourseFormValues
    ) => {
        setSubmitting(true);
        setFormError(null);

        try {
            if (editingCourse) {
                await updateCourse(
                    editingCourse.id,
                    values
                );
            } else {
                await createCourse(values);
            }

            // Đóng form sau khi lưu thành công
            setEditingCourse(null);

            // Load lại danh sách
            refetch();
        } catch (err) {
            setFormError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // DELETE COURSE
    // =========================
    const handleDelete = async (course: Course) => {
        const confirmed = window.confirm(
            `Xóa môn học "${course.tenMonHoc}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCourse(course.id);

            // Load lại danh sách sau khi xóa
            refetch();
        } catch (err) {
            alert(extractErrorMessage(err));
        }
    };

    // =========================
    // RENDER
    // =========================
    return (
        <div
            style={{
                padding: 24,
                fontFamily: 'sans-serif',
                maxWidth: 800,
                margin: '0 auto',
            }}
        >
            <h1>Quản lý môn học (Admin)</h1>

            <CourseForm
                editingCourse={editingCourse}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                    setEditingCourse(null);
                    setFormError(null);
                }}
                submitting={submitting}
                serverError={formError}
            />

            <SearchBox onSearch={handleSearch} />

            <div style={{ marginTop: 16 }}>
                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
                    onEdit={setEditingCourse}
                    onDelete={handleDelete}
                />
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );

}

export default App;