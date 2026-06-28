import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Modal } from 'antd';
import { Search, RotateCcw, FolderArchive } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const ArchiveVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock archived events database
  const [archivedEvents, setArchivedEvents] = useState([
    { id: 'ARC-881', client: 'Microsoft Tech Conf 2024', date: '2024-11-12', category: 'Conference', value: 350000, owner: 'Alex Johnson' },
    { id: 'ARC-842', client: 'Sanya & Rahul Wedding Reception', date: '2025-01-20', category: 'Wedding', value: 480000, owner: 'Sarah K.' },
    { id: 'ARC-811', client: 'Baker Silver Jubilee Dinner', date: '2025-03-08', category: 'Gala', value: 150000, owner: 'Thomas J.' },
    { id: 'ARC-802', client: 'Goldman Sachs Corporate Mixer', date: '2025-05-15', category: 'Cocktail', value: 220000, owner: 'Elena R.' }
  ]);

  const handleRestoreEvent = (id: string, name: string) => {
    Modal.confirm({
      title: 'Confirm Event Restoration',
      content: `Are you sure you want to restore the archived event "${name}" back to the active booking calendar?`,
      okText: 'Yes, Restore',
      cancelText: 'Cancel',
      onOk() {
        setArchivedEvents(prev => prev.filter(item => item.id !== id));
        showToast.success(`Restored "${name}" successfully. Event is now active on the calendar.`);
      }
    });
  };

  const handleDownloadDoc = (docType: string, name: string) => {
    showToast.success(`Downloading archived ${docType} for ${name}...`);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / Archived Records
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Archived Banquet Vault
          </h1>
        </div>
      </div>

      <Card style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '24px' }}>
        {/* Search bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Input 
            prefix={<Search size={16} color="#64748b" />}
            placeholder="Search archived events by client name..."
            style={{ width: '320px', borderRadius: '8px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <Table 
          dataSource={archivedEvents.filter(e => e.client.toLowerCase().includes(searchTerm.toLowerCase()))}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          columns={[
            { title: 'Archive ID', dataIndex: 'id', key: 'id' },
            { title: 'Client / Event Name', dataIndex: 'client', key: 'client', render: (val) => <span style={{ fontWeight: 600, color: '#475569' }}>{val}</span> },
            { title: 'Event Date', dataIndex: 'date', key: 'date' },
            { title: 'Category', dataIndex: 'category', key: 'category', render: (val) => <Tag color="default">{val}</Tag> },
            { title: 'Closed Contract Value', dataIndex: 'value', key: 'value', render: (val) => <strong style={{ color: '#475569' }}>₹{val.toLocaleString()}</strong> },
            { title: 'Lead Representative', dataIndex: 'owner', key: 'owner' },
            { title: 'Status', key: 'status', render: () => <Tag color="default">ARCHIVED</Tag> },
            { title: 'Actions', key: 'actions', render: (_, record) => (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button size="small" onClick={() => handleDownloadDoc('BEO v1.0', record.client)}>BEO</Button>
                <Button size="small" onClick={() => handleDownloadDoc('Financial Ledger', record.client)}>Ledger</Button>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<RotateCcw size={12} />} 
                  onClick={() => handleRestoreEvent(record.id, record.client)}
                  style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Restore
                </Button>
              </div>
            )}
          ]}
        />
      </Card>
    </div>
  );
};
