import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './report.css'; // 필요한 CSS 스타일 가져오기

const Report = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('/api/tasks')
            .then((res) => res.json())
            .then((data) => setTasks(data.tasks));
    }, []);

    const renderTasks = (status) => {
        return tasks
            .filter((task) => task.status === status)
            .map((task) => (
                <tr key={task.id}>
                    <td>{task.goal}</td>
                    <td className={getStatusClass(task.status)}>{task.status}</td>
                    <td>{task.next_action}</td>
                    <td>{task.deadline}</td>
                </tr>
            ));
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Done':
                return 'status-done';
            case 'Blocked':
                return 'status-blocked';
            case 'Waiting':
                return 'status-waiting';
            case 'ToDo':
                return 'status-todo';
            case 'WIP':
                return 'status-wip';
            default:
                return '';
        }
    };

    return (
        <div className="Report">
            <header className="Report-header">
                <Link to="/" className="report-button">메인 페이지로 돌아가기</Link>
                <h1>Report</h1>
            </header>
            <div className="task-list-table">
                <h2>완료한 일</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Goal</th>
                            <th>Status</th>
                            <th>Next Action</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTasks('Done')}
                    </tbody>
                </table>

                <h2>대기중인 일</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Goal</th>
                            <th>Status</th>
                            <th>Next Action</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTasks('Waiting')}
                    </tbody>
                </table>

                <h2>블록된 일</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Goal</th>
                            <th>Status</th>
                            <th>Next Action</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTasks('Blocked')}
                    </tbody>
                </table>

                <h2>진행중인 일</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Goal</th>
                            <th>Status</th>
                            <th>Next Action</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTasks('WIP')}
                    </tbody>
                </table>

                <h2>미착수</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Goal</th>
                            <th>Status</th>
                            <th>Next Action</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTasks('ToDo')}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Report;
