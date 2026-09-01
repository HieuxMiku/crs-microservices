import {
    Link,
    useNavigate
} from 'react-router-dom';

import {
    useAuth
} from '../context/AuthContext';

export default function Navbar() {

    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            style={{
                display: 'flex',
                gap: 16,
                padding: 12,
                borderBottom: '1px solid #ddd',
                alignItems: 'center'
            }}
        >

            <Link to="/courses">
                Danh sach mon hoc
            </Link>

            {isAuthenticated &&
                user?.role === 'ADMIN' && (
                    <Link to="/admin/courses">
                        Quan tri mon hoc
                    </Link>
                )}

            {isAuthenticated &&
                user?.role === 'STUDENT' && (
                    <>
                        <Link to="/register-course">
                            Đăng ký học phần
                        </Link>

                        <Link to="/my-registrations">
                            Môn học đã đăng ký
                        </Link>
                    </>
                )}

            <div style={{ marginLeft: 'auto' }}>

                {isAuthenticated ? (
                    <>
            <span style={{ marginRight: 12 }}>
              Xin chao, {user?.username}
                ({user?.role})
            </span>

                        <button
                            onClick={handleLogout}
                        >
                            Dang xuat
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        Dang nhap
                    </Link>
                )}

            </div>

        </nav>
    );
}