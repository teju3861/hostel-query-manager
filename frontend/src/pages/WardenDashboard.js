import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, List, LogOut, UserCheck } from 'lucide-react';

const WardenDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [queries, setQueries] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [view, setView] = useState('queries');

    const fetchData = async () => {
        try {
            // Fetch Queries
            const qRes = await API.get('/queries');
            setQueries(qRes.data);

            // Fetch Pending Students (Now this will work!)
            const sRes = await API.get('/admin/pending-students');
            setPendingStudents(sRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleApproveStudent = async (id) => {
        try {
            await API.put(`/admin/approve-student/${id}`);
            alert("Student Approved Successfully!");
            fetchData(); // Refresh list immediately
        } catch (err) {
            alert("Approval failed");
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await API.put(`/admin/query-status/${id}`, { status: newStatus, remarks: "Updated by Warden" });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-indigo-900">Warden Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user?.fullName}</p>
                </div>
                <button onClick={logout} className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6">
                <button onClick={() => setView('queries')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${view === 'queries' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                    <List size={20} /> Manage Queries
                </button>
                <button onClick={() => setView('approvals')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${view === 'approvals' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                    <UserCheck size={20} />
                    Student Approvals
                    {pendingStudents.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingStudents.length}</span>
                    )}
                </button>
            </div>

            {view === 'approvals' ? (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Pending Registrations</h2>
                    {pendingStudents.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No students waiting for approval.</div>
                    ) : (
                        pendingStudents.map(s => (
                            <div key={s._id} className="flex justify-between items-center border-b border-gray-100 py-4 last:border-0 hover:bg-gray-50 px-2 rounded transition">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                        {s.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{s.fullName}</p>
                                        <p className="text-sm text-gray-500">@{s.username} • Student Role</p>
                                    </div>
                                </div>
                                <button onClick={() => handleApproveStudent(s._id)} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-sm transition flex items-center gap-2 font-medium">
                                    <CheckCircle size={16} /> Approve
                                </button>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="grid gap-6">
                    {queries.map(q => (
                        <div key={q._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-md ${q.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {q.status}
                                        </span>
                                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{q.category}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{q.title}</h3>
                                    <p className="text-gray-600 mb-4 text-sm">{q.description}</p>
                                    <p className="text-xs text-gray-400">Raised by: {q.student?.fullName || 'Student'} • {new Date(q.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {q.status !== 'Resolved' && (
                                        <>
                                            <button onClick={() => handleUpdateStatus(q._id, 'In Progress')} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition text-left">
                                                Mark In Progress
                                            </button>
                                            <button onClick={() => handleUpdateStatus(q._id, 'Resolved')} className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-medium transition text-left">
                                                Mark Resolved
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WardenDashboard;