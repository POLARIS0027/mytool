import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // useState훅을 사용해서 data라는 상태 변수를 선언하고 초기값을 null로 설정
  const [data, setData] = useState(null);

  // useEffect훅은 컴포넌트가 랜더링 될때 fetch함수를 사용해서
  // 서버의 /api 엔드포인트로 HTTP get을 보냄.
  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{data ? data : 'Loading...'}</p>
      </header>
    </div>
  );
}

export default App;
