import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/login.css';
import kakao from '../assets/images/kakao_logo.png';
import naver from '../assets/images/naver_logo.png';
import google from '../assets/images/google_logo.png';

const LoginPage: React.FC = () => {

    const [activeTab, setActiveTab] = useState('user');

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError('아이디와 비밀번호를 모두 입력하세요.');
            return;
        }

        setError(null);  // 기존 오류 초기화

        const userType = activeTab === 'manager' ? 'MANAGER' : 'USER_OR_ADMIN';

        try {
            const response = await axios.post(
                'http://localhost:8080/login',
                {
                    username: formData.username,
                    password: formData.password,
                    userType: userType,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,  // 쿠키 허용 설정
                }
            );

            if (response.status === 200) {

                // 로그인 성공 시 사용자 정보를 세션에 저장
                sessionStorage.setItem('username', response.data.body.username);
                sessionStorage.setItem('role', response.data.body.role);
                sessionStorage.setItem('name', response.data.body.name);
                alert('로그인 성공!');


                // 역할에 따른 페이지 이동
                if (response.data.body.role === 'ROLE_MANAGER') {
                    window.location.href = '/manager';
                } else if (response.data.body.role === 'ROLE_USER' || response.data.role === 'ROLE_ADMIN') {
                    window.location.href = '/userinfo';
                } else {
                    throw new Error('올바르지 않은 역할');
                }
            } else {
                setError('로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="login-container">
            <h1>로그인</h1>
            <div className="tabs">
                <span
                    className={activeTab === 'user' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('user')}
                >
                    개인회원
                </span>
                <span
                    className={activeTab === 'manager' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('manager')}
                >
                    카페 관리자
                </span>
            </div>

            <hr className="tab-divider"/>

            {activeTab === 'user' ? (
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="required">* 아이디</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="아이디를 입력하세요"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <label className="required">* 패스워드</label>
                    <input type="password"
                           name="password"
                           placeholder="패스워드를 입력하세요"
                           value={formData.password}
                           onChange={handleChange}
                    />

                    <button type="submit" className="login-btn">로그인</button>
                </form>
            ) : (
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="required">* 관리자 아이디</label>
                    <input type="text" placeholder="관리자 아이디를 입력하세요"/>

                    <label className="required">* 관리자 패스워드</label>
                    <input type="password" placeholder="관리자 패스워드를 입력하세요"/>

                    <button type="submit" className="login-btn">로그인</button>
                </form>
            )}

        <div className="login-links">
            <a href="/join">회원가입</a>
            <span>
            <a href="/find-id">아이디 찾기</a>
            <span style={{padding : '10px'}}>|</span>
            <a href="/find-password">비밀번호 찾기</a>
            </span>
        </div>

        <div className="separator">
            <span>또는</span>
        </div>

        {/* 소셜 로그인 이미지 버튼 */}
        <div className="social-login">
            <div className="social-login">
                <button className="kakao-btn">
                    <img src={kakao} alt="카카오 로고"/>
                    카카오 로그인
                </button>
                <button className="naver-btn">
                    <img src={naver} alt="네이버 로고"/>
                    네이버 로그인
                </button>
                <button className="google-btn">
                    <img src={google} alt="구글 로고"/>
                    Google 로그인
                </button>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;
