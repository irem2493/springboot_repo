// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header'; // ✅ 경로 별칭 사용

const App: React.FC = () => {
    return (
        <Router>
            {/* 헤더를 모든 페이지에 고정 */}
            <Header />
            <Routes>
                <Route path="/" element={<h1>카페소개 페이지</h1>} />
                <Route path="/menu" element={<h1>메뉴 페이지</h1>} />
                <Route path="/community" element={<h1>커뮤니티 페이지</h1>} />
                <Route path="/signup" element={<h1>회원가입 페이지</h1>} />
                <Route path="/login" element={<h1>로그인 페이지</h1>} />
            </Routes>
        </Router>
    );
};

export default App;
