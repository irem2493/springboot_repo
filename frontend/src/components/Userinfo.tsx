import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    name: string;
    email: string;
    role: string;
    registration_date: string;
}

const UserInfo: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 쿠키에서 특정 이름의 값을 가져오는 함수
    const getCookie = (name: string): string | null => {
        const cookieString: string = document.cookie;

        const cookies: string[] = cookieString.split('; ');

        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {

                console.log(value);
                return value;
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 쿠키에서 Authorization 토큰 확인
                const authToken = getCookie('Authorization');

                if (!authToken) {
                    throw new Error('로그인이 필요합니다.');
                }

                const response = await axios.get<User>('http://localhost:8080/api/userinfo', {
                    withCredentials: true // 쿠키 자동 전송
                });

                setUser(response.data);
            } catch (error) {
                console.error('사용자 정보를 불러오는 중 오류 발생:', error);
                setError('사용자 정보를 불러오는 데 실패했습니다.');
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="user-info">
            <h1>회원 정보</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (
                <div>
                    <p>이름: {user.name}</p>
                    <p>이메일: {user.email}</p>
                    <p>역할: {user.role}</p>
                    <p>가입일: {new Date(user.registration_date).toLocaleDateString()}</p>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
        </div>
    );
};

export default UserInfo;
