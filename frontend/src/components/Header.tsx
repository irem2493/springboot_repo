import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/header.css';
import logo from '../assets/images/logo2.png';

const Header: React.FC = () => {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState<string | null>(null);

    const handleMouseEnter = (menu: string) => setIsHovered(menu);
    const handleMouseLeave = () => setIsHovered(null);

    const getLinkStyle = (menu: string) => {
        if (location.pathname === menu) {
            return { color: '#00C853', fontWeight: 'bold' };
        }
        if (isHovered === menu) {
            return { color: '#00C853' };
        }
        return { color: '#666' };
    };

    return (
        <header className="header">
            {/* ✅ 로고와 메뉴를 묶는 새로운 컨테이너 추가 */}
            <div className="logo-nav-container">
                <div className="logo">
                    <img src={logo} alt="Green Cafe Logo" />
                </div>
                <nav className="nav">
                    <Link
                        to="/"
                        style={getLinkStyle('/')}
                        onMouseEnter={() => handleMouseEnter('/')}
                        onMouseLeave={handleMouseLeave}
                    >
                        카페소개
                    </Link>
                    <Link
                        to="/menu"
                        style={getLinkStyle('/menu')}
                        onMouseEnter={() => handleMouseEnter('/menu')}
                        onMouseLeave={handleMouseLeave}
                    >
                        메뉴
                    </Link>
                    <Link
                        to="/community"
                        style={getLinkStyle('/community')}
                        onMouseEnter={() => handleMouseEnter('/community')}
                        onMouseLeave={handleMouseLeave}
                    >
                        커뮤니티
                    </Link>
                </nav>
            </div>
            <div className="user-menu">
                <Link to="/signup">회원가입</Link> | <Link to="/login">로그인</Link>
                <button className="dropdown-button">회원 서비스 ▾</button>
            </div>
        </header>
    );
};

export default Header;