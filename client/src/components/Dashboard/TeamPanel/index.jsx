import React, { useState, useEffect, useMemo } from 'react';
import { listClients as fetchClientsApi, listClientUsers, createClientUser, deleteClientUser } from '../../../api';
import { SHARED_MOCK_USERS } from "../../../mockData.js";
import TabNavigation from './components/TabNavigation.jsx';
import NotificationBanner from './components/NotificationBanner.jsx';
import OrganizationSelector from './components/OrganizationSelector.jsx';
import MemberList from './components/MemberList.jsx';
import AddMemberView from './components/AddMemberView.jsx';
import DeleteUserModal from './components/DeleteUserModal.jsx';

export default function TeamPanel({ profile }) {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' or 'provisioning'
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'client_viewer' });
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'client_admin', 'client_viewer'

  const isGuest = profile?.role === 'GUEST' || profile?.isDemo;
  const isSuperAdmin = profile?.role === 'super_admin';
  const isSystemAdmin = profile?.role === 'system_admin';
  const hasFullAccess = isSuperAdmin || isSystemAdmin || isGuest;

  const activeClientId = hasFullAccess ? (selectedClient?._id || selectedClient?.id) : profile?.clientId;

  useEffect(() => {
    if (hasFullAccess) {
      fetchClients();
    } else if (profile?.clientId) {
      fetchUsers(profile.clientId);
    }
  }, []);

  const fetchClients = async () => {
    try {
      if (isGuest) {
        const demoClients = [{ _id: 'demo_client_1', name: 'Demo Organization' }];
        setClients(demoClients);
        if (!selectedClient && hasFullAccess) {
          selectClient(demoClients[0]);
        }
        return;
      }
      const response = await fetchClientsApi();
      const clientList = response.data || [];
      setClients(clientList);
      if (clientList.length > 0 && !selectedClient && hasFullAccess) {
        selectClient(clientList[0]);
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  };

  const fetchUsers = async (id) => {
    if (!id && !isGuest) return;
    setFetchingUsers(true);
    setUsers([]);
    try {
      if (isGuest) {
        await new Promise(r => setTimeout(r, 600));
        setUsers(SHARED_MOCK_USERS);
      } else {
        const response = await listClientUsers(id);
        setUsers(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch team roster:', err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!newUser.username || newUser.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(newUser.username)) {
      errors.username = 'Username can only contain letters, numbers, dots, underscores, and hyphens.';
    }

    // Email validation
    if (!newUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Password validation (matches backend SecurityUtils)
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'password123', 'admin123', '12345678', 'welcome'];
    if (!newUser.password) {
      errors.password = 'Password is required.';
    } else if (newUser.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(newUser.password)) {
      errors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(newUser.password)) {
      errors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(newUser.password)) {
      errors.password = 'Password must contain at least one number.';
    } else if (!/[^A-Za-z0-9]/.test(newUser.password)) {
      errors.password = 'Password must contain at least one special character.';
    } else if (weakPasswords.includes(newUser.password.toLowerCase())) {
      errors.password = 'Password is too common and easily guessable.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!activeClientId) {
      setError('Select an organization first.');
      return;
    }
    if (!validateForm()) return;
    setLoading(true); setMessage(''); setError(''); setFieldErrors({});
    if (isGuest) {
      setMessage('Guest mode: operation simulated successfully.');
      setNewUser({ username: '', email: '', password: '', role: 'client_viewer' });
      fetchUsers(activeClientId);
      setActiveTab('roster');
      setLoading(false);
      return;
    }

    try {
      await createClientUser(activeClientId, newUser);
      setMessage('Member added successfully.');
      setNewUser({ username: '', email: '', password: '', role: 'client_viewer' });
      fetchUsers(activeClientId);
      setActiveTab('roster');
    } catch (err) {
      // Extract detailed validation errors if available
      const detailedError = err.payload?.errors?.[0] || err.message;
      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget || !activeClientId) return;
    const userId = deleteTarget._id || deleteTarget.id;
    setDeleting(true);
    setError('');
    if (isGuest) {
      setMessage(`Guest mode: User "${deleteTarget.username}" removal simulated.`);
      setDeleteTarget(null);
      setDeleting(false);
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    try {
      await deleteClientUser(activeClientId, userId);
      setMessage(`User "${deleteTarget.username}" removed successfully.`);
      setDeleteTarget(null);
      fetchUsers(activeClientId);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      const detailedError = err.payload?.errors?.[0] || err.message;
      setError(detailedError);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const selectClient = (client) => {
    setSelectedClient(client);
    fetchUsers(client._id || client.id);
    setMessage('');
    setError('');
  };

  // Filtered Roster Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);


  return (
    <div className="flex flex-col h-full bg-background">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
        <div className="flex flex-col gap-0.5 border-l-2 border-primary pl-4">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground">
            {activeTab === 'roster' ? 'Team Management' : 'Add New Member'}
          </h1>
          <p className="text-[12px] font-medium text-muted-foreground max-w-2xl">
            {activeTab === 'roster'
              ? 'Search and manage existing team members and their roles.'
              : 'Add a new member to the organization and set their access level.'}
          </p>
        </div>

        <NotificationBanner message={message} error={error} />

        {hasFullAccess && (
          <OrganizationSelector
            clients={clients}
            selectedClient={selectedClient}
            selectClient={selectClient}
          />
        )}

        {activeTab === 'roster' ? (
          <MemberList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            filteredUsers={filteredUsers}
            fetchingUsers={fetchingUsers}
            fetchUsers={fetchUsers}
            activeClientId={activeClientId}
            setDeleteTarget={setDeleteTarget}
          />
        ) : (
          <AddMemberView
            selectedClient={selectedClient}
            handleAddUser={handleAddUser}
            newUser={newUser}
            setNewUser={setNewUser}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            activeClientId={activeClientId}
          />
        )}
      </div>

      <DeleteUserModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        deleting={deleting}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
