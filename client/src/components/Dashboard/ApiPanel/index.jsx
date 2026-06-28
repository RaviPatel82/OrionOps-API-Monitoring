import React, { useState, useEffect, useMemo } from 'react';
import { listClients as fetchClientsApi, listClientApiKeys, createClientApiKey, deleteClientApikey } from '../../../api';
import { SHARED_MOCK_API_KEYS } from "../../../mockData.js";

import TabNavigation from './components/TabNavigation.jsx';
import NotificationBanner from './components/NotificationBanner.jsx';
import OrganizationSelector from './components/OrganizationSelector.jsx';
import ApiKeysList from './components/ApiKeysList.jsx';
import GenerateKeyView from './components/GenerateKeyView.jsx';
import DeleteKeyModal from './components/DeleteKeyModal.jsx';

export default function ApiPanel({ profile }) {
  const [activeTab, setActiveTab] = useState('keys'); // 'keys' or 'generate'
  const [apiKeys, setApiKeys] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [newKeyForm, setNewKeyForm] = useState({ name: '', description: '', environment: 'production' });
  const [generatedKey, setGeneratedKey] = useState(null); 

  const [loading, setLoading] = useState(false);
  const [fetchingKeys, setFetchingKeys] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isGuest = profile?.role === 'GUEST' || profile?.isDemo;
  const isSuperAdmin = profile?.role === 'super_admin';
  const isSystemAdmin = profile?.role === 'system_admin';
  const hasFullAccess = isSuperAdmin || isSystemAdmin || isGuest;

  const activeClientId = hasFullAccess ? (selectedClient?._id || selectedClient?.id) : profile?.clientId;

  useEffect(() => {
    if (hasFullAccess) {
      fetchClients();
    } else if (profile?.clientId) {
      fetchApiKeys(profile.clientId);
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

  const fetchApiKeys = async (id) => {
    if (!id && !isGuest) return;
    setFetchingKeys(true);
    setApiKeys([]);
    try {
      if (isGuest) {
        await new Promise(r => setTimeout(r, 600));
        setApiKeys(SHARED_MOCK_API_KEYS);
      } else {
        const response = await listClientApiKeys(id);
        setApiKeys(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    } finally {
      setFetchingKeys(false);
    }
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    if (!activeClientId) {
      setError('Select an organization first.');
      return;
    }
    setLoading(true); setMessage(''); setError(''); setGeneratedKey(null);
    if (isGuest) {
      const mockKey = {
        keyValue: "apim_demo_" + Math.random().toString(36).substring(2, 15),
        name: newKeyForm.name,
        environment: newKeyForm.environment,
        description: newKeyForm.description
      };
      setGeneratedKey(mockKey);
      setMessage('Guest mode: API Key generation simulated.');
      setNewKeyForm({ name: '', description: '', environment: 'production' });
      setLoading(false);
      return;
    }

    try {
      const response = await createClientApiKey(activeClientId, newKeyForm);
      setGeneratedKey(response.data);
      setMessage('API Key generated successfully.');
      setNewKeyForm({ name: '', description: '', environment: 'production' });
      fetchApiKeys(activeClientId);
    } catch (err) {
      const detailedError = err.payload?.errors?.[0] || err.message;
      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('API Key copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteApiKey = async () => {
    if (!deleteTarget || !activeClientId) return;
    const keyId = deleteTarget.keyId;
    setDeleting(true);
    setError('');
    if (isGuest) {
      setMessage(`Guest mode: API key "${deleteTarget.name}" deletion simulated.`);
      setDeleteTarget(null);
      setDeleting(false);
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    try {
      await deleteClientApikey(activeClientId, keyId);
      setMessage(`API key "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchApiKeys(activeClientId);
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
    fetchApiKeys(client._id || client.id);
    setMessage('');
    setError('');
    setGeneratedKey(null);
  };

  const filteredKeys = useMemo(() => {
    return apiKeys.filter(key => {
      return key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (key.description && key.description.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [apiKeys, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-background">
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setGeneratedKey={setGeneratedKey} 
      />

      <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
        <div className="flex flex-col gap-0.5 border-l-2 border-primary pl-4">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground">
            {activeTab === 'keys' ? 'API Key Management' : 'Generate New API Key'}
          </h1>
          <p className="text-[12px] font-medium text-muted-foreground max-w-2xl">
            {activeTab === 'keys'
              ? 'Manage and view all API keys associated with the organization.'
              : 'Create a new API key. The key will only be shown once.'}
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

        {activeTab === 'keys' ? (
          <ApiKeysList 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            filteredKeys={filteredKeys} 
            fetchingKeys={fetchingKeys} 
            fetchApiKeys={fetchApiKeys} 
            activeClientId={activeClientId} 
            setDeleteTarget={setDeleteTarget} 
          />
        ) : (
          <GenerateKeyView 
            generatedKey={generatedKey}
            setGeneratedKey={setGeneratedKey}
            setActiveTab={setActiveTab}
            copyToClipboard={copyToClipboard}
            selectedClient={selectedClient}
            handleCreateApiKey={handleCreateApiKey}
            newKeyForm={newKeyForm}
            setNewKeyForm={setNewKeyForm}
            loading={loading}
            activeClientId={activeClientId}
          />
        )}
      </div>

      <DeleteKeyModal 
        deleteTarget={deleteTarget} 
        setDeleteTarget={setDeleteTarget} 
        deleting={deleting} 
        handleDeleteApiKey={handleDeleteApiKey} 
      />
    </div>
  );
}
