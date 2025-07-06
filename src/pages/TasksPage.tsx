import {useEffect, useState} from 'react';
import axios from 'axios';

interface Task {
    id: number;
    title: string;
    completed: boolean;
    dueDate?: string;
}

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [newTask, setNewTask] = useState('');

    const token = localStorage.getItem('token');

    const fetchTasks = async () => {
        if (!token) {
            alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
            return;
        }

        try {
            const res = await axios.get<Task[]>('http://localhost:5000/api/tasks', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setTasks(res.data);
        } catch (error) {
            alert('Görevler alınamadı. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (!newTask.trim() || !token) return;

        try {
            const res = await axios.post<Task>(
                'http://localhost:5000/api/tasks',
                {title: newTask},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setTasks((prev) => [...prev, res.data]);
            setNewTask('');
        } catch {
            alert('Görev eklenemedi.');
        }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            const res = await axios.put<Task>(
                `http://localhost:5000/api/tasks/${id}`,
                {completed: !current},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setTasks((prev: Task[]) =>
                prev.map((task) => (task.id === id ? res.data : task))
            );
        } catch {
            alert('Görev güncellenemedi.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    if (loading) return <p style={{textAlign: 'center'}}>🔄 Yükleniyor...</p>;

    return (
        <div style={{padding: '2rem', maxWidth: '600px', margin: '0 auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                <h2>📝 Görev Listesi</h2>
                <button onClick={handleLogout} style={{
                    backgroundColor: '#f44336',
                    color: '#fff',
                    padding: '0.4rem 0.8rem',
                    border: 'none',
                    borderRadius: '4px'
                }}>Çıkış Yap
                </button>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <input
                    type="text"
                    placeholder="Yeni görev"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    style={{flexGrow: 1, padding: '0.5rem'}}
                />
                <button onClick={handleAddTask} style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2196f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px'
                }}>Ekle
                </button>
            </div>

            <div style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <button onClick={() => setFilter('all')} style={{padding: '0.4rem 0.8rem'}}>Tümü</button>
                <button onClick={() => setFilter('completed')} style={{padding: '0.4rem 0.8rem'}}>✅ Tamamlanan</button>
                <button onClick={() => setFilter('incomplete')} style={{padding: '0.4rem 0.8rem'}}>❌ Tamamlanmamış
                </button>
            </div>

            {sortedTasks.length === 0 ? (
                <p>Hiç görev bulunamadı.</p>
            ) : (
                <ul style={{listStyle: 'none', padding: 0}}>
                    {sortedTasks.map((task) => (
                        <li
                            key={task.id}
                            onClick={() => handleToggle(task.id, task.completed)}
                            style={{
                                padding: '1rem',
                                marginBottom: '0.8rem',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                backgroundColor: task.completed ? '#e0f7fa' : '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <strong>{task.title}</strong>
                                {task.dueDate && (
                                    <span style={{marginLeft: '1rem', color: '#666'}}>
                    | ⏰ {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                                )}
                            </div>
                            <span>{task.completed ? '✅' : '❌'}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TasksPage;
