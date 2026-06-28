import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Timeline, Row, Col, Select, Modal, Form, InputNumber, Space } from 'antd';
import { Phone, Search, Plus, MessageCircle, Mail } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const CRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Leads pipeline state
  const [leads, setLeads] = useState([
    { id: 'LD-01', client: 'Miller Wedding reception', category: 'Wedding', value: 180000, stage: 'Negotiation', contact: '+1 (555) 0192', source: 'Web Referral', owner: 'Alex Johnson' },
    { id: 'LD-02', client: 'Google APAC Summit Hold', category: 'Corporate', value: 500000, stage: 'Quotation', contact: '+1 (555) 8829', source: 'Direct Sales', owner: 'Thomas J.' },
    { id: 'LD-03', client: 'Baker Birthday Banquet', category: 'Birthday', value: 75000, stage: 'Inquiry', contact: '+1 (555) 4381', source: 'Walk-In', owner: 'Elena R.' },
    { id: 'LD-04', client: 'State Dental Conf Wing', category: 'Conference', value: 120000, stage: 'Site Visit', contact: '+1 (555) 9012', source: 'Email Campaign', owner: 'Sarah K.' }
  ]);

  // Lead stages timeline notes
  const [activities, setActivities] = useState([
    { id: 'act-1', time: '10:00 AM - Today', user: 'Alex Johnson', action: 'Called client', details: 'Discussed buffet options for Miller Wedding. Client requested Jain options.' },
    { id: 'act-2', time: 'Yesterday', user: 'Thomas J.', action: 'Conducted Site Visit', details: 'Showed Google Summit planners the Imperial Ballroom and pool deck area.' },
    { id: 'act-3', time: '3 days ago', user: 'Elena R.', action: 'Drafted Quotation v1.2', details: 'Sent updated pricing sheet for Baker Birthday Banquet.' }
  ]);

  // Lead reassignment handler
  const handleReassignLead = (leadId: string, newOwner: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        showToast.success(`Reassigned lead for "${lead.client}" to ${newOwner}`);
        
        // Log the reassignment inside the recent activities feed
        const newActivity = {
          id: `act-${Date.now()}`,
          time: 'Just now',
          user: 'Admin',
          action: 'Reassigned Lead Assignee',
          details: `Reassigned lead "${lead.client}" ownership to ${newOwner}.`
        };
        setActivities(acts => [newActivity, ...acts]);
        
        return { ...lead, owner: newOwner };
      }
      return lead;
    }));
  };

  const handleFormFinish = (values: any) => {
    const newId = `LD-0${leads.length + 1}`;
    const newLead = {
      id: newId,
      contact: '+1 (555) 0000',
      ...values
    };

    setLeads(prev => [...prev, newLead]);
    
    // Add to activity timeline
    const newActivity = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      user: values.owner,
      action: 'Created Sales Lead',
      details: `Added lead for "${values.client}" with estimated value of ₹${values.value.toLocaleString()}.`
    };
    setActivities(acts => [newActivity, ...acts]);

    setIsModalOpen(false);
    form.resetFields();
    showToast.success(`Lead successfully registered for ${values.client}.`);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / CRM & Sales Dashboard
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            CRM & Lead Tracker
          </h1>
        </div>

        <Button 
          type="primary" 
          icon={<Plus size={16} />}
          style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', fontWeight: 600, borderRadius: '8px', height: '40px' }}
          onClick={() => {
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Sales Lead
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Sales Pipeline & Inquiries" style={{ borderRadius: '16px' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <Input 
                prefix={<Search size={16} color="#64748b" />}
                placeholder="Search leads by client name, category..."
                style={{ width: '320px', borderRadius: '8px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Table 
              dataSource={leads.filter(l => l.client.toLowerCase().includes(searchTerm.toLowerCase()) || l.category.toLowerCase().includes(searchTerm.toLowerCase()))}
              rowKey="id"
              pagination={{ pageSize: 6 }}
              columns={[
                { title: 'Lead ID', dataIndex: 'id', key: 'id' },
                { title: 'Client / Event Couple', dataIndex: 'client', key: 'client', render: (val) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{val}</span> },
                { title: 'Category', dataIndex: 'category', key: 'category', render: (val) => <Tag color="orange">{val}</Tag> },
                { title: 'Contract Value', dataIndex: 'value', key: 'value', render: (val) => <strong style={{ color: '#9e2a2b' }}>₹{val.toLocaleString()}</strong> },
                { title: 'Funnel Stage', dataIndex: 'stage', key: 'stage', render: (stage) => <Tag color={stage === 'Negotiation' ? 'purple' : stage === 'Quotation' ? 'blue' : 'orange'}>{stage.toUpperCase()}</Tag> },
                { 
                  title: 'Sales Assignee', 
                  dataIndex: 'owner', 
                  key: 'owner',
                  render: (owner, record) => (
                    <Select
                      value={owner}
                      style={{ width: 140 }}
                      size="small"
                      onChange={(newOwner) => handleReassignLead(record.id, newOwner)}
                      options={[
                        { value: 'Alex Johnson', label: 'Alex Johnson' },
                        { value: 'Thomas J.', label: 'Thomas J.' },
                        { value: 'Elena R.', label: 'Elena R.' },
                        { value: 'Sarah K.', label: 'Sarah K.' }
                      ]}
                    />
                  )
                },
                { title: 'Actions', key: 'actions', render: (_, record) => (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="small" shape="circle" icon={<Phone size={12} />} onClick={() => showToast.info(`Calling: ${record.contact}`)} />
                    <Button size="small" shape="circle" icon={<MessageCircle size={12} />} onClick={() => showToast.info(`Opening WhatsApp thread...`)} />
                    <Button size="small" shape="circle" icon={<Mail size={12} />} onClick={() => showToast.info(`Drafting email...`)} />
                  </div>
                )}
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Customer Follow-up timeline */}
          <Card title="Recent Customer Interactions" style={{ borderRadius: '16px', height: '100%' }}>
            <Timeline 
              mode="left" 
              style={{ marginTop: '12px' }}
              items={activities.map((a, idx) => ({
                color: idx === 0 ? 'red' : 'gray',
                children: (
                  <div key={a.id}>
                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>{a.time}</span>
                      <span>By: {a.user}</span>
                    </div>
                    <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '4px' }}>{a.action}</strong>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{a.details}</p>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Sales Lead registration modal */}
      <Modal
        title="Register New Sales Lead"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFormFinish} 
          style={{ marginTop: '16px' }}
        >
          <Form.Item label="Client / Event Name" name="client" rules={[{ required: true, message: 'Enter client/event description' }]}>
            <Input placeholder="e.g. Miller Wedding reception" />
          </Form.Item>
          
          <Form.Item label="Category" name="category" initialValue="Wedding" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Wedding', label: 'Wedding' },
              { value: 'Corporate', label: 'Corporate Gala' },
              { value: 'Birthday', label: 'Birthday Party' },
              { value: 'Conference', label: 'Conference / Seminar' }
            ]} />
          </Form.Item>

          <Form.Item label="Estimated Value (₹)" name="value" rules={[{ required: true, message: 'Enter estimated value' }]}>
            <InputNumber style={{ width: '100%' }} min={100} placeholder="e.g. 150000" />
          </Form.Item>

          <Form.Item label="Funnel Stage" name="stage" initialValue="Inquiry" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Inquiry', label: 'Inquiry' },
              { value: 'Site Visit', label: 'Site Visit' },
              { value: 'Quotation', label: 'Quotation' },
              { value: 'Negotiation', label: 'Negotiation' }
            ]} />
          </Form.Item>

          <Form.Item label="Marketing Source" name="source" initialValue="Web Referral" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Web Referral', label: 'Web Referral' },
              { value: 'Direct Sales', label: 'Direct Sales' },
              { value: 'Walk-In', label: 'Walk-In' },
              { value: 'Email Campaign', label: 'Email Campaign' }
            ]} />
          </Form.Item>

          <Form.Item label="Assign Sales Representative" name="owner" initialValue="Alex Johnson" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Alex Johnson', label: 'Alex Johnson' },
              { value: 'Thomas J.', label: 'Thomas J.' },
              { value: 'Elena R.', label: 'Elena R.' },
              { value: 'Sarah K.', label: 'Sarah K.' }
            ]} />
          </Form.Item>
          
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0 0 0' }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b' }}>
                Create Lead
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
