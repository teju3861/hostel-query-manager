import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp, LogOut } from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [queries, setQueries] = useState([]);
    const [newQuery, setNewQuery] = useState({ title: '', description: '', category: 'Water' });

    const fetchQueries = async () => {
        try {
            const { data } = await API.get('/queries');
            setQueries(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchQueries(); }, []);

    const handleCreateQuery = async (e) => {
        e.preventDefault();
        await API.post('/queries', newQuery);
        setNewQuery({ title: '', description: '', category: 'Water' });
        fetchQueries();
    };

    const handleVote = async (id) => {
        try {
            await API.put(`/queries/${id}/vote`);
            fetchQueries();
        } catch (err) { alert(err.response.data.message); }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
                <button onClick={logout} className="flex items-center text-red-600"><LogOut size={18} /> Logout</button>
            </div>

            {/* Raise Query Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Raise a New Query</h2>
                <form onSubmit={handleCreateQuery} className="grid gap-4">
                    <input type="text" placeholder="Title" value={newQuery.title} required
                        onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })} className="border p-2" />
                    <select value={newQuery.category} onChange={(e) => setNewQuery({ ...newQuery, category: e.target.value })} className="border p-2">
                        <option>Water</option><option>Electricity</option><option>Food</option><option>Hygiene</option>
                    </select>
                    <textarea placeholder="Describe the issue..." value={newQuery.description}
                        onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })} className="border p-2" />
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded">Submit Query</button>
                </form>
            </div>

            {/* Query List */}
            <h2 className="text-lg font-semibold mb-4">Recent Queries</h2>
            <div className="grid gap-4">
                {queries.map(q => (
                    <div key={q._id} className="bg-white p-4 rounded shadow flex justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase text-gray-500">{q.category}</span>
                            <h3 className="font-bold text-lg">{q.title}</h3>
                            <p className="text-gray-600">{q.description}</p>
                            <div className="mt-2 flex items-center gap-4 text-sm">
                                <span className={`px-2 py-1 rounded ${q.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {q.status}
                                </span>
                                <span className="flex items-center gap-1"><ThumbsUp size={14} /> {q.votes.length} Votes</span>
                            </div>
                        </div>
                        <button onClick={() => handleVote(q._id)} className="self-center p-2 hover:bg-gray-100 rounded text-indigo-600">
                            <ThumbsUp size={24} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;