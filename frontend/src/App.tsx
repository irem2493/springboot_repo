// src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '../src/components/Header'; // ✅ 경로 별칭 사용
import HomePage from '../src/components/HomePage';
import JoinPage from '../src/components/Join';

const App: React.FC = () => {
    return (
        <BrowserRouter basename="/"> {/* ✅ BrowserRouter와 basename 설정 */}
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/intro" element={<h1>카페소개 페이지</h1>} />
                <Route path="/menu" element={<h1>메뉴 페이지</h1>} />
                <Route path="/community" element={<h1>커뮤니티 페이지</h1>} />
                <Route path="/join" element={<JoinPage />} />{/* ✅ /join 경로 추가 */}
                <Route path="/login" element={<h1>로그인 페이지</h1>} />
                {/* ✅ 없는 경로에 대한 처리를 추가 */}
                <Route path="*" element={<h1>404 페이지를 찾을 수 없습니다.</h1>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
