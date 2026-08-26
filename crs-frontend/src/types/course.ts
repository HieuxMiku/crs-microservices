export interface Course {
    id: number;
    tenMonHoc: string;
    soTinChi: number;
    soChoToiDa: number;
    soChoConLai: number;
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
export interface CourseFormValues {
    tenMonHoc: string;
    soTinChi: number | string;
    soChoToiDa: number | string;
}