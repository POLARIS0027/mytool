const express = require('express');
const app = express();
const db = require('./database'); // 데이터베이스 파일을 가져옴
const PORT = 5000;

app.use(express.json());

app.get('/api', (req, res) => {
    res.send({ message: 'Hello from server!' });
});

// 모든 태스크 가져오기
app.get('/api/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send({ tasks: rows });
    });
});

// 새로운 태스크 추가하기
app.post('/api/tasks', (req, res) => {
    const { created_at, goal, status, next_action, deadline, folder } = req.body;
    db.run("INSERT INTO tasks (created_at, goal, status, next_action, deadline, folder) VALUES (?, ?, ?, ?, ?, ?)",
        [created_at, goal, status, next_action, deadline, folder], function (err) {
            if (err) {
                return console.log(err.message);
            }
            res.status(201).send({ id: this.lastID });
        });
});

// 태스크 업데이트하기
app.put('/api/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const { created_at, goal, status, next_action, deadline, folder } = req.body;
    db.run("UPDATE tasks SET created_at = ?, goal = ?, status = ?, next_action = ?, deadline = ?, folder = ? WHERE id = ?",
        [created_at, goal, status, next_action, deadline, folder, taskId], function (err) {
            if (err) {
                return console.log(err.message);
            }
            res.send({ changes: this.changes });
        });
});

// 태스크 삭제하기
app.delete('/api/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
        if (err) {
            return console.log(err.message);
        }
        res.send({ changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
