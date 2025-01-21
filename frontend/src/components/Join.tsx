import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import '../assets/css/join.css';

interface FormData {
    username: string;
    password: string;
    confirmPassword: string;
    name: string;
    birth: string;
    gender: 0 | 1;
}

const JoinPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        birth: '',
        gender: 0,
    });

    // ✅ 모든 입력 필드의 값을 업데이트하는 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    // 클릭 시 파일 선택창을 여는 함수
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // ✅ 선택된 파일 저장
    // 클릭 시 파일 선택창을 여는 함수
    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 파일 입력 필드 클릭 트리거
        }
    };

    // 파일 선택 시 실행되는 함수
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file); // ✅ 선택된 파일 저장

            const reader = new FileReader();

            reader.onload = () => {
                setImageSrc(reader.result as string); // 이미지를 state에 저장
            };

            reader.readAsDataURL(file); // 파일을 Data URL로 변환
        }
    };

    // ✅ 상태 변경 감지 및 디버깅
    useEffect(() => {
        console.log('현재 선택된 성별:', formData.gender);
    }, [formData.gender]); // ✅ gender가 변경될 때만 실행


    // ✅ 폼 제출 핸들러 (axios 사용)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // ✅ 기본 제출 방지

        const formElement = e.currentTarget;
        const formData = new FormData(formElement); // ✅ FormData 객체 생성

        if(selectedFile){
            formData.append('file', selectedFile);
        }

        try {
            const response = await axios.post('http://localhost:8080/api/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // ✅ FormData 전송
                },
            });
            alert('회원가입 성공!');
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패했습니다.');
        }
    };

    return (
        <form className="join-container" encType="multipart/form-data" onSubmit={handleSubmit}>
            <h1>회원 가입</h1>
            <h2>개인회원</h2>
            <hr/>

            {/* 프로필 업로드 */}
            <div className="profile">
                <div className="profile-upload" onClick={handleDivClick}>
                    {imageSrc ? (
                        <img src={imageSrc} alt="미리보기"/>
                    ) : (
                        <div className="profile-upload-circle">+</div>
                    )}
                    <input
                        type="file"
                        name="file"
                        ref={fileInputRef}
                        style={{display: 'none'}}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
            </div>

            {/* 아이디 입력 */
            }
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

            {/* 생년월일과 성별을 나란히 배치하되, 라벨을 위로 */}
            <div className="form-row">
                {/* 생년월일 입력 */}
                <div className="form-group1">
                    <label>
                        <span className="required">*</span> 생년월일
                    </label>
                    <input
                        type="text"
                        name="birth"
                        placeholder="생년월일(예시: 20000101)"
                        value={formData.birth}
                        onChange={handleChange}
                    />
                </div>

                {/* 성별 선택 */}
                <div className="form-group2">
                    <label>
                        <span className="required">*</span> 성별
                    </label>
                    <div className="gender-select">
                        {/* ✅ hidden input 추가 */}
                        <input type="hidden" name="gender" value={formData.gender.toString()}/>
                        <button
                            type="button"
                            className={formData.gender === 0 ? 'active' : 'inactive'}
                            onClick={(e) => {
                                e.preventDefault();
                                setFormData((prevData) => ({...prevData, gender: 0}));
                            }}
                        >
                            남자
                        </button>

                        <button
                            type="button"
                            className={formData.gender === 1 ? 'active' : 'inactive'}
                            onClick={(e) => {
                                e.preventDefault();
                                setFormData((prevData) => ({...prevData, gender: 1}));
                            }}
                        >
                            여자
                        </button>
                    </div>
                </div>
            </div>

            {/* 회원가입 버튼 */}
            <input className="submit-button" type="submit" value="회원가입"/>

        </form>
    );
};

export default JoinPage;