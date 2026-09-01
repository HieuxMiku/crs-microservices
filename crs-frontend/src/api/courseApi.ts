import axiosClient from './axiosClient';
import type { Course, PagedResponse } from '../types/course';
export const getCourses = (keyword?: string, page = 0, size = 10) =>
{
    return axiosClient.get<PagedResponse<Course>>('/api/courses', {
        params: { keyword, page, size },
    });
};
import type {
    CourseFormValues
} from '../types/course';

export const createCourse = (
    data: CourseFormValues
) => {
    return axiosClient.post(
        '/api/courses',
        data
    );
};

export const updateCourse = (
    id: number,
    data: CourseFormValues
) => {
    return axiosClient.put(
        `/api/courses/${id}`,
        data
    );
};

export const deleteCourse = (
    id: number
) => {
    return axiosClient.delete(
        `/api/courses/${id}`
    );
};
export const getCourseById = (
    id: number
) => {
    return axiosClient.get<Course>(
        `/api/courses/${id}`
    );
};