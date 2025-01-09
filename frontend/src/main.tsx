import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/assets/css/header.css'; // ✅ 글로벌 스타일 적용

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);