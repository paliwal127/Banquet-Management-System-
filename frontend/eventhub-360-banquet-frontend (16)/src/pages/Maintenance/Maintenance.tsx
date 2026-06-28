import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input } from 'antd';
import { Search, Plus } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const Maintenance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [tickets] = useState([
    { id: 'MNT-01', facility: 'Imperial Grand Ballroom AC Unit 3', task: 'Compressor servicing & refrigerant gas top-up', tech: 'David M.', cost: 12000, status: 'In Progress' },
    { id: 'MNT-02', facility: 'Zenith Sky Terrace elevator', task: 'Safety break check & sensor calibration', tech: 'Taj Lift Services', cost: 24500, status: 'Completed' },
    { id: 'MNT-03', facility: 'Ballroom RGB Ceiling Light Panel', task: 'DMX controller mapping and replacement', tech: 'David M.', cost: 3500, status: 'Pending' }
  ]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / Facility Maintenance
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Maintenance & Service
          </h1>
        </div>

        <Button 
          type="primary" 
          icon={<Plus size={16} />}
          style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', fontWeight: 600, borderRadius: '8px', height: '40px' }}
          onClick={() => showToast.info('Logging new maintenance ticket...')}
        >
          Create Ticket
        </Button>
      </div>

      <Card style={{ borderRadius: '16px' }} bodyStyle={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Input 
            prefix={<Search size={16} color="#64748b" />}
            placeholder="Search tickets by facility name, task..."
            style={{ width: '320px', borderRadius: '8px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Table 
          dataSource={tickets.filter(t => t.facility.toLowerCase().includes(searchTerm.toLowerCase()) || t.task.toLowerCase().includes(searchTerm.toLowerCase()))}
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Ticket ID', dataIndex: 'id', key: 'id' },
            { title: 'Asset / Facility', dataIndex: 'facility', key: 'facility', render: (val) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{val}</span> },
            { title: 'Task Details', dataIndex: 'task', key: 'task' },
            { title: 'Assigned tech', dataIndex: 'tech', key: 'tech' },
            { title: 'Cost', dataIndex: 'cost', key: 'cost', render: (val) => `₹${val.toLocaleString()}` },
            { title: 'Ticket Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Completed' ? 'success' : status === 'In Progress' ? 'blue' : 'warning'}>{status.toUpperCase()}</Tag> }
          ]}
        />
      </Card>
    </div>
  );
};
