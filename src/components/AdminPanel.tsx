import { useState, useEffect } from 'react';
import { User as UserIcon, Check, X, CreditCard, Shield, Users, Clock, IndianRupee } from 'lucide-react';
import { User as UserType } from '../types';

export const AdminPanel = ({ user }: { user: UserType }) => {
  const [stats, setStats] = useState({ totalUsers: 0, pendingApprovals: 0, totalRevenue: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [statsRes, usersRes] = await Promise.all([
      fetch('/api/admin/stats', { headers: { 'x-user-id': user.id.toString() } }),
      fetch('/api/admin/users', { headers: { 'x-user-id': user.id.toString() } })
    ]);
    const statsData = await statsRes.json();
    const usersData = await usersRes.json();
    setStats(statsData);
    setUsers(usersData);
    setLoading(false);
  };

  const handleApprove = async (userId: number, status: string) => {
    const res = await fetch('/api/admin/approve-user', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({ userId, status })
    });
    if (res.ok) {
      fetchData();
    }
  };

  if (loading) return <div className="py-20 text-center">Loading Admin Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary-900">Admin Dashboard</h2>
          <p className="text-primary-700/60">Manage your matrimony platform and users.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchData} className="btn-primary py-2 px-4 text-sm">Refresh Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-card p-8 border-l-4 border-primary-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-primary-700" size={24} />
            <span className="text-[10px] font-bold uppercase text-primary-700/40 tracking-widest">Total Users</span>
          </div>
          <p className="text-4xl font-bold text-primary-900">{stats.totalUsers}</p>
        </div>
        <div className="glass-card p-8 border-l-4 border-accent-500">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-accent-600" size={24} />
            <span className="text-[10px] font-bold uppercase text-accent-600/40 tracking-widest">Pending Approvals</span>
          </div>
          <p className="text-4xl font-bold text-accent-600">{stats.pendingApprovals}</p>
        </div>
        <div className="glass-card p-8 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <IndianRupee className="text-emerald-600" size={24} />
            <span className="text-[10px] font-bold uppercase text-emerald-600/40 tracking-widest">Total Revenue</span>
          </div>
          <p className="text-4xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden border border-accent-500/10">
        <div className="p-6 bg-primary-900 text-accent-500 font-bold uppercase tracking-widest text-sm">User Management</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary-50 text-primary-900 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-6">User / Email</th>
                <th className="p-6">Gender</th>
                <th className="p-6">Status</th>
                <th className="p-6">Payment</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-500/10">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-accent-500/5 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-primary-900">{u.name || 'No Profile'}</div>
                    <div className="text-xs text-primary-700/60">{u.email}</div>
                  </td>
                  <td className="p-6 text-sm text-primary-800">{u.gender || '-'}</td>
                  <td className="p-6">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      u.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      u.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      u.payment_status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.payment_status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {u.status !== 'approved' && (
                        <button 
                          onClick={() => handleApprove(u.id, 'approved')}
                          className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {u.status !== 'rejected' && (
                        <button 
                          onClick={() => handleApprove(u.id, 'rejected')}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
