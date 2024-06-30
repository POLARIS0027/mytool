const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // 메모리 내 데이터베이스

db.serialize(() => {
    // Tasks 테이블 생성
    db.run(`CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        goal TEXT NOT NULL,
        status TEXT NOT NULL,
        next_action TEXT NOT NULL,
        deadline TEXT
    )`);

    // 예시 데이터 삽입 (옵션)
    db.run("INSERT INTO tasks (created_at, goal, status, next_action, deadline) VALUES (?, ?, ?, ?, ?)",
        ["2024-06-30-15:30", "First task goal", "ToDo", "Next action for first task", "2024-07-10"]);
});

module.exports = db;
