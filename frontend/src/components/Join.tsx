import React, { useState } from 'react';
import '../assets/css/join.css';

const JoinPage: React.FC = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        birthdate: '',
        gender: '남자',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleGenderSelect = (gender: string) => {
        setFormData({ ...formData, gender });
    };

    return (
        <div className="join-container">
            <h1>회원 가입</h1>
            <h2>개인회원</h2>
            <hr/>

            {/* 프로필 업로드 */}
            <div className="profile-upload">
                <div className="profile-upload-circle">+</div>
            </div>

            {/* 아이디 입력 */}
            <label>
                <span className="required">*</span> 아이디
            </label>
            <div className="input-with-button">
                <input
                    type="text"
                    name="username"
                    placeholder="아이디를 입력하세요"
                    onChange={handleChange}
                />
                <button className="duplicate-check-btn">중복 확인</button>
            </div>

            {/* 비밀번호 입력 */}
            <label>
                <span className="required">*</span> 비밀번호
            </label>
            <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                onChange={handleChange}
            />

            {/* 비밀번호 확인 */}
            <label>
                <span className="required">*</span> 비밀번호 확인
            </label>
            <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호를 재입력하세요"
                onChange={handleChange}
            />

            {/* 이름 입력 */}
            <label>
                <span className="required">*</span> 이름
            </label>
            <input
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                onChange={handleChange}
            />

            {/* 생년월일과 성별을 나란히 정렬 */}
            {/* 생년월일과 성별을 나란히 배치하되, 라벨을 위로 */}
            <div className="form-row">
                {/* 생년월일 입력 */}
                <div className="form-group1">
                    <label>
                        <span className="required">*</span> 생년월일
                    </label>
                    <input
                        type="text"
                        name="birthdate"
                        placeholder="생년월일(예시: 20000131)"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </div>

                {/* 성별 선택 */}
                <div className="form-group2">
                    <label>
                        <span className="required">*</span> 성별
                    </label>
                    <div className="gender-select">
                        <button
                            className={formData.gender === '남자' ? 'active' : 'inactive'}
                            onClick={() => handleGenderSelect('남자')}
                        >
                            남자
                        </button>
                        <button
                            className={formData.gender === '여자' ? 'active' : 'inactive'}
                            onClick={() => handleGenderSelect('여자')}
                        >
                            여자
                        </button>
                    </div>
                </div>
            </div>

            {/* 회원가입 버튼 */}
            <button className="submit-button" type="submit">
                회원가입
            </button>
        </div>
    );
};

export default JoinPage;