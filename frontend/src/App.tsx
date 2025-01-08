import { useState, useEffect } from 'react';

// Product 타입 정의 (TypeScript)
type TestDto = {
    id: number;
    name: string;
};

function App() {
    const [products, setProducts] = useState<TestDto[]>([]); // products 상태 관리
    const [count, setCount] = useState<number>(0); // count 상태 관리

    // Spring Boot API 호출
    useEffect(() => {
        fetch('http://localhost:8080/api/products')  // Spring Boot 서버의 API 엔드포인트
            .then((response) => response.json()) // JSON 응답 받기
            .then((data) => setProducts(data)) // 받은 데이터를 상태에 저장
            .catch((error) => console.error('Error fetching products:', error)); // 오류 처리
    }, []); // 컴포넌트가 처음 렌더링될 때만 호출

    return (
        <div>
            <h1>Vite + React</h1>

            {/* Product 목록 표시 */}
            <div className="product-list">
                <h2>Product List</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>{product.name}</li>
                    ))}
                </ul>
            </div>

            {/* 카운트 버튼 */}
            <div className="card">
                <button onClick={() => setCount((prevCount) => prevCount + 1)}>
                    count is {count}
                </button>
            </div>
        </div>
    );
}

export default App;