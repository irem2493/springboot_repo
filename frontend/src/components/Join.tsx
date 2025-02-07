import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import '../assets/css/join.css';

interface FormData {
    username: string;
    password: string;
    confirmPassword: string;
    name: string;
    birth: string;
    gender: 'M' | 'F';
}

const JoinPage: React.FC = () => {

    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        birth: '',
        gender: 'M',
    });

    // 성별 버튼의 ref 생성
    const genderButtonRef = useRef<HTMLDivElement>(null);

    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const[birth] = useState('');


    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setIsAvailable(null); // 입력할 때마다 초기화
    };

    const checkDuplicate = async () => {
        if (!username.trim()) {
            alert('아이디를 입력하세요.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/user/${username}`);
            console.log(response.data.available);
            if (response.data.available) {
                setIsAvailable(true);
                setIsChecked(true);
            } else {
                setIsAvailable(false);
            }
        } catch (error) {
            console.error('아이디 중복 체크 오류:', error);
            setIsAvailable(false);
        }
    };

// 현재 포커스를 줄 필드의 이름을 저장하는 상태
    const [focusField, setFocusField] = useState<string | null>(null);
    // 각 입력 필드에 대한 ref 생성
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const birthRef = useRef<HTMLInputElement>(null);

    // focusField 값이 변경될 때 해당 입력 필드로 포커스 이동
    useEffect(() => {
        if (focusField === 'username' && usernameRef.current) {
            usernameRef.current.focus();
        } else if (focusField === 'password' && passwordRef.current) {
            passwordRef.current.focus();
        } else if (focusField === 'name' && nameRef.current) {
            nameRef.current.focus();
        } else if (focusField === 'birth' && birthRef.current) {
            birthRef.current.focus();
        }
    }, [focusField]);

    // ✅ 모든 입력 필드의 값을 업데이트하는 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name === 'birth'+'---------');
        if (name === 'birth') {
            if (value.length === 8) {
                if (!validateBirthdate(value)) {
                    return; // 유효성 검사 실패 시 상태 업데이트 방지
                }
            } else {
                setError(null);
            }
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validateBirthdate = (dateStr: string): boolean => {
        setError(null);

        if (!/^\d{8}$/.test(dateStr)) {
            setError('생년월일은 8자리 숫자여야 합니다. (예: 20000101)');
            console.log('Error: 8자리 숫자가 아닙니다.');
            return false;
        }

        const year = parseInt(dateStr.substring(0, 4), 10);
        const month = parseInt(dateStr.substring(4, 6), 10);
        const day = parseInt(dateStr.substring(6, 8), 10);

        const currentYear = new Date().getFullYear();

        if (year < 1900 || year > currentYear) {
            setError(`연도는 1900년부터 ${currentYear}년까지 가능합니다.`);
            console.log('Error: 연도 범위 초과');
            return false;
        }

        if (month < 1 || month > 12) {
            setError('월은 01부터 12까지의 숫자여야 합니다.');
            console.log('Error: 잘못된 월 입력');
            return false;
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            setError(`${year}년 ${month}월은 ${daysInMonth}일까지 있습니다.`);
            console.log(`Error: ${year}년 ${month}월은 ${daysInMonth}일까지`);
            return false;
        }

        console.log('생년월일이 유효합니다.');
        return true;
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

        // 필수 필드 확인 (FormData의 get() 메서드 사용)
        if (!formData.get('username') || !(formData.get('username') as string).trim()) {
            alert('아이디를 입력하세요.');
            setFocusField('username');
            return;
        }
        if (!formData.get('password') || !(formData.get('password') as string).trim()) {
            alert('비밀번호를 입력하세요.');
            setFocusField('password');
            return;
        }
        if (formData.get('password') !== formData.get('confirmPassword')) {
            alert('비밀번호가 일치하지 않습니다.');
            setFocusField('confirmPassword');
            return;
        }
        if (!formData.get('name') || !(formData.get('name') as string).trim()) {
            alert('이름을 입력하세요.');
            setFocusField('name');
            return;
        }
        if (!formData.get('birth') || (formData.get('birth') as string).length !== 8 || !validateBirthdate(formData.get('birth') as string)) {
            alert('올바른 생년월일을 입력하세요.');
            setFocusField('birth');
            return;
        }

        if (formData.get('gender') === null) {
            alert('성별을 선택하세요.');
            genderButtonRef.current?.focus();
            return;
        }

        if(!isChecked){
            alert('아이디 중복 확인을 해주세요');
            return ;
        }

        if(isAvailable === false){
            alert('이미 사용중인 아이디입니다. 다른 아이디를 입력해주세요.');
            return;
        }


        try {
            const response = await axios.post('http://localhost:8080/api/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // ✅ FormData 전송
                },
            });
            console.log('서버 응답:', response.data);
            alert('회원가입 성공!');
            location.href='/';
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
                    ref={usernameRef}
                    type="text"
                    name="username"
                    placeholder="아이디를 입력하세요"
                    autoFocus={focusField === 'username'} // 상태 기반 포커스
                    onChange={(e) => {
                        handleChange(e);
                        handleUsernameChange(e);
                    }}
                />
                <button className="duplicate-check-btn"
                        disabled={isAvailable === true}
                        onClick={(e)=>{
                                e.preventDefault();
                                    checkDuplicate();

                        }
                }>중복 확인</button>

            </div>
            <div className="flex-box">
                {isAvailable === true && <p style={{color: 'green'}}>사용 가능한 아이디입니다.</p>}
                {isAvailable === false && <p style={{color: 'red'}}>이미 사용 중인 아이디입니다.</p>}
            </div>
            {/* 비밀번호 입력 */}
            <label>
                <span className="required">*</span> 비밀번호
            </label>
            <input
                ref={passwordRef}
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                autoFocus={focusField === 'password'}
                onChange={handleChange}
            />

            {/* 비밀번호 확인 */}
            <label>
                <span className="required">*</span> 비밀번호 확인
            </label>
            <input
                ref={confirmPasswordRef}
                type="password"
                name="confirmPassword"
                placeholder="비밀번호를 재입력하세요"
                autoFocus={focusField === 'confirmPassword'}
                onChange={handleChange}
            />

            {/* 이름 입력 */}
            <label>
                <span className="required">*</span> 이름
            </label>
            <input
                ref={nameRef}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                onChange={handleChange}
                autoFocus={focusField === 'name'}
            />

            {/* 생년월일과 성별을 나란히 배치하되, 라벨을 위로 */}
            <div className="form-row">
                {/* 생년월일 입력 */}
                <div className="form-group1">
                    <label>
                        <span className="required">*</span> 생년월일
                    </label>
                    <input
                        ref={birthRef}
                        type="text"
                        name="birth"
                        placeholder="생년월일(예시: 20000101)"
                        value={formData.birth}
                        onChange={handleChange}
                        autoFocus={focusField === 'birth'}
                        maxLength={8}
                    />
                </div>

                {/* 성별 선택 */}
                <div className="form-group2">
                    <label>
                        <span className="required">*</span> 성별
                    </label>
                    <div className="gender-select" ref={genderButtonRef} tabIndex={-1}>
                        {/* ✅ hidden input 추가 */}
                        <input type="hidden" name="gender" value={formData.gender.toString()}/>
                        <button
                            type="button"
                            className={formData.gender === 'M' ? 'active' : 'inactive'}
                            onClick={(e) => {
                                e.preventDefault();
                                setFormData((prevData) => ({...prevData, gender: 'M'}));
                            }}
                        >
                            남자
                        </button>

                        <button
                            type="button"
                            className={formData.gender === 'F' ? 'active' : 'inactive'}
                            onClick={(e) => {
                                e.preventDefault();
                                setFormData((prevData) => ({...prevData, gender: 'F'}));
                            }}
                        >
                            여자
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex-box">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!error && birth.length === 8 && <p style={{ color: 'green' }}>올바른 형식입니다.</p>}

            </div>

            {/* 회원가입 버튼 */}
            <input className="submit-button" type="submit" value="회원가입"/>

        </form>
    );
};

export default JoinPage;