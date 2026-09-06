import React, { useState } from 'react';
import { Users, Shield, UserCheck, UserX, AlertTriangle, Search, Filter, CheckCircle2 } from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';
import { normalizeRole } from '../lib/security';

interface Props {
  users: User[];
  currentUser: User;
  onUpdateRole: (userId: string, role: UserRole) => void;
  onUpdateStatus: (userId: string, status: UserStatus) => void;
}

export const UserManagementSection: React.FC<Props> = ({
  users,
  currentUser,
  onUpdateRole,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.rollNumber && user.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const normRole = normalizeRole(user.role);
    const matchesRole = roleFilter === 'ALL' || normRole === roleFilter;

    const userStatus = user.status || 'ACTIVE';
    const matchesStatus = statusFilter === 'ALL' || userStatus === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = (userId: string, targetUser: User, newRole: UserRole) => {
    // Safety check: Prevent Admin from demoting themselves if they are the logged in user
    if (targetUser.id === currentUser.id && normalizeRole(newRole) !== 'ADMIN') {
      setNotification({
        message: 'Security Guard: You cannot demote your own active Admin account.',
        type: 'error'
      });
      return;
    }

    onUpdateRole(userId, newRole);
    setNotification({
      message: `Successfully updated ${targetUser.name}'s role to ${newRole}.`,
      type: 'success'
    });
  };

  const handleStatusToggle = (targetUser: User) => {
    const currentStatus = targetUser.status || 'ACTIVE';
    const nextStatus: UserStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    // Safety check: Prevent Admin from deactivating their own logged-in account
    if (targetUser.id === currentUser.id && nextStatus === 'INACTIVE') {
      setNotification({
        message: 'Security Guard: You cannot deactivate your own active Admin account session.',
        type: 'error'
      });
      return;
    }

    onUpdateStatus(targetUser.id, nextStatus);
    setNotification({
      message: `Account status for ${targetUser.name} changed to ${nextStatus}.`,
      type: 'success'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={22} style={{ color: 'var(--uipath-orange)' }} /> Admin User & Role Management
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage identity profiles, role permissions, and active/deactivated account status across the organization.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="badge badge-orange" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
            Total Users: {users.length}
          </span>
          <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
            Active: {users.filter((u) => (u.status || 'ACTIVE') === 'ACTIVE').length}
          </span>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: notification.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${notification.type === 'success' ? '#22C55E' : '#EF4444'}`,
          color: notification.type === 'success' ? '#86EFAC' : '#FCA5A5',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {notification.message}
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem 0.6rem 2.4rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFF',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Role Filter */}
        <div style={{ position: 'relative' }}>
          <Filter size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem 0.6rem 2.4rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFF',
              fontSize: '0.875rem'
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="CORE_TEAM">Core Team</option>
            <option value="ADMIN">Admin OS</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFF',
              fontSize: '0.875rem'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="glass-panel table-responsive" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>User Profile</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Email Address</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Role Privilege</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Account Status</th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No registered users match the current search filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const normRole = normalizeRole(u.role);
                const status = u.status || 'ACTIVE';
                const isSelf = u.id === currentUser.id;

                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s' }}>
                    {/* User Profile */}
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFF' }}>
                            {u.name} {isSelf && <span style={{ fontSize: '0.7rem', color: 'var(--uipath-orange)', marginLeft: '0.35rem' }}>(You)</span>}
                          </div>
                          {u.rollNumber && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.rollNumber} • {u.branch || 'Engineering'}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {u.email}
                    </td>

                    {/* Role Dropdown */}
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <select
                        value={normRole}
                        onChange={(e) => handleRoleChange(u.id, u, e.target.value as UserRole)}
                        disabled={isSelf}
                        style={{
                          padding: '0.35rem 0.65rem',
                          background: normRole === 'ADMIN' ? 'rgba(250, 70, 22, 0.15)' : normRole === 'CORE_TEAM' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${normRole === 'ADMIN' ? 'rgba(250, 70, 22, 0.4)' : normRole === 'CORE_TEAM' ? 'rgba(255, 255, 255, 0.18)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-sm)',
                          color: normRole === 'ADMIN' ? '#FA4616' : normRole === 'CORE_TEAM' ? '#FFFFFF' : '#E2E8F0',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          outline: 'none',
                          cursor: isSelf ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="STUDENT" style={{ background: '#111111', color: '#FFF' }}>STUDENT</option>
                        <option value="CORE_TEAM" style={{ background: '#111111', color: '#FFF' }}>CORE_TEAM</option>
                        <option value="ADMIN" style={{ background: '#111111', color: '#FFF' }}>ADMIN</option>
                      </select>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span className={`badge ${status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                        {status === 'ACTIVE' ? '🟢 ACTIVE' : '🔴 INACTIVE'}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleStatusToggle(u)}
                        disabled={isSelf}
                        className={`btn btn-sm ${status === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.35rem 0.65rem',
                          gap: '0.35rem',
                          opacity: isSelf ? 0.5 : 1,
                          cursor: isSelf ? 'not-allowed' : 'pointer'
                        }}
                        title={isSelf ? 'Cannot deactivate your own logged-in admin account' : status === 'ACTIVE' ? 'Deactivate user access' : 'Activate user access'}
                      >
                        {status === 'ACTIVE' ? (
                          <>
                            <UserX size={14} /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} /> Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
