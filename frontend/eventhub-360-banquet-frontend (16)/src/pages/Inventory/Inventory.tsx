import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Progress } from 'antd';
import { Search, Plus } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [stock] = useState([
    { id: 'ST-01', item: 'Platinum Round Table Runners (White Silk)', category: 'Linen', qty: 15, min: 20, status: 'Low Stock' },
    { id: 'ST-02', item: 'Gold Chiavari Chairs', category: 'Furniture', qty: 250, min: 100, status: 'Healthy' },
    { id: 'ST-03', item: 'Chardonnay Wine Bottles', category: 'Beverages', qty: 45, min: 50, status: 'Low Stock' },
    { id: 'ST-04', item: 'Silver Dinner Plates (4-course set)', category: 'Crockery', qty: 800, min: 500, status: 'Healthy' }
  ]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / Store Inventory
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Inventory Management
          </h1>
        </div>

        <Button 
          type="primary" 
          icon={<Plus size={16} />}
          style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', fontWeight: 600, borderRadius: '8px', height: '40px' }}
          onClick={() => showToast.info('Adding inventory procurement item...')}
        >
          Procure Stock
        </Button>
      </div>

      <Card style={{ borderRadius: '16px' }} bodyStyle={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Input 
            prefix={<Search size={16} color="#64748b" />}
            placeholder="Search items by name, category..."
            style={{ width: '320px', borderRadius: '8px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Table 
          dataSource={stock.filter(s => s.item.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase()))}
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Item ID', dataIndex: 'id', key: 'id' },
            { title: 'Item Name', dataIndex: 'item', key: 'item', render: (val) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{val}</span> },
            { title: 'Category', dataIndex: 'category', key: 'category' },
            { title: 'Stock Available', dataIndex: 'qty', key: 'qty' },
            { title: 'Threshold Limit', dataIndex: 'min', key: 'min' },
            { title: 'Stock Ratio', key: 'ratio', render: (_, record) => <Progress percent={Math.round((record.qty / record.min) * 100)} size="small" strokeColor={record.qty < record.min ? '#ef4444' : '#22c55e'} /> },
            { title: 'Alert Status', dataIndex: 'status', key: 'status', render: (val) => <Tag color={val === 'Low Stock' ? 'red' : 'green'}>{val.toUpperCase()}</Tag> }
          ]}
        />
      </Card>
    </div>
  );
};
