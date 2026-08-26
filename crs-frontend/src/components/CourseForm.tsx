import { useEffect, useState } from 'react';
import type { Course, CourseFormValues } from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null;
    onSubmit: (values: CourseFormValues) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    serverError: string | null;
}

export default function CourseForm({
                                       editingCourse,
                                       onSubmit,
                                       onCancel,
                                       submitting,
                                       serverError,
                                   }: CourseFormProps) {

    const [values, setValues] =
        useState<CourseFormValues>({
            tenMonHoc: '',
            soTinChi: '',
            soChoToiDa: '',
        });

    const [clientErrors, setClientErrors] =
        useState<Record<string, string>>({});

    useEffect(() => {

        if (editingCourse) {

            setValues({
                tenMonHoc: editingCourse.tenMonHoc,
                soTinChi: editingCourse.soTinChi,
                soChoToiDa: editingCourse.soChoToiDa,
            });

        } else {

            setValues({
                tenMonHoc: '',
                soTinChi: '',
                soChoToiDa: '',
            });

        }

        setClientErrors({});

    }, [editingCourse]);

    const validate = () => {

        const errors: Record<string, string> = {};

        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc =
                'Ten mon hoc khong duoc de trong.';
        }

        const tinChi = Number(values.soTinChi);

        if (
            !values.soTinChi ||
            !Number.isInteger(tinChi) ||
            tinChi <= 0
        ) {
            errors.soTinChi =
                'So tin chi phai la so nguyen duong.';
        }

        const soCho = Number(values.soChoToiDa);

        if (
            !values.soChoToiDa ||
            !Number.isInteger(soCho) ||
            soCho <= 0
        ) {
            errors.soChoToiDa =
                'So cho toi da phai la so nguyen duong.';
        }

        setClientErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        await onSubmit({
            tenMonHoc: values.tenMonHoc.trim(),
            soTinChi: Number(values.soTinChi),
            soChoToiDa: Number(values.soChoToiDa),
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                border: '1px solid #ddd',
                padding: 16,
                borderRadius: 8,
                marginBottom: 16
            }}
        >

            <h3>
                {editingCourse
                    ? 'Sua mon hoc'
                    : 'Them mon hoc moi'}
            </h3>

            <div style={{ marginBottom: 8 }}>

                <label>Ten mon hoc</label>
                <br />

                <input
                    type="text"
                    value={values.tenMonHoc}
                    onChange={(e) =>
                        setValues({
                            ...values,
                            tenMonHoc: e.target.value
                        })
                    }
                />

                {clientErrors.tenMonHoc && (
                    <p style={{ color: '#b91c1c' }}>
                        {clientErrors.tenMonHoc}
                    </p>
                )}

            </div>

            <div style={{ marginBottom: 8 }}>

                <label>So tin chi</label>
                <br />

                <input
                    type="number"
                    value={values.soTinChi}
                    onChange={(e) =>
                        setValues({
                            ...values,
                            soTinChi: e.target.value
                        })
                    }
                />

                {clientErrors.soTinChi && (
                    <p style={{ color: '#b91c1c' }}>
                        {clientErrors.soTinChi}
                    </p>
                )}

            </div>

            <div style={{ marginBottom: 8 }}>

                <label>So cho toi da</label>
                <br />

                <input
                    type="number"
                    value={values.soChoToiDa}
                    onChange={(e) =>
                        setValues({
                            ...values,
                            soChoToiDa: e.target.value
                        })
                    }
                />

                {clientErrors.soChoToiDa && (
                    <p style={{ color: '#b91c1c' }}>
                        {clientErrors.soChoToiDa}
                    </p>
                )}

            </div>

            {serverError && (
                <p style={{ color: '#b91c1c' }}>
                    {serverError}
                </p>
            )}

            <button
                type="submit"
                disabled={submitting}
            >
                {submitting
                    ? 'Dang luu...'
                    : editingCourse
                        ? 'Cap nhat'
                        : 'Them moi'}
            </button>

            {editingCourse && (
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ marginLeft: 8 }}
                >
                    Huy
                </button>
            )}

        </form>
    );
}