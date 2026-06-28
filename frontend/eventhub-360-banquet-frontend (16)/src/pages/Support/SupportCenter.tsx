import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Form, Select, Row, Col, Space, Drawer, List } from 'antd';
import { Plus, Search, MessageSquare, Info, ShieldAlert } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const SupportCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [form] = Form.useForm();

  // Mock support ticket database
  const [tickets, setTickets] = useState([
    { id: 'TKT-102', subject: 'KOT Printer connection dropouts', category: 'Hardware', priority: 'High', status: 'In Progress', date: 'Today, 10:15 AM', desc: 'The kitchen order ticket printer at the Grill Station intermittently stops printing orders, leading to delayed service.' },
    { id: 'TKT-101', subject: 'Custom F&B package pricing discrepancy', category: 'Billing', priority: 'Medium', status: 'Awaiting Staff', date: 'Yesterday', desc: 'When selecting the Platinum Wedding Package with custom overrides, the per-pax final billing shows a variance of ₹85 per head.' },
    { id: 'TKT-100', subject: 'DMX Ballroom lighting panel unresponsive', category: 'AV Equipment', priority: 'High', status: 'Resolved', date: '2 days ago', desc: 'Ballroom ceiling DMX LED light panels are locked in static red and do not respond to scene changes from the coordinator iPad.' }
  ]);

  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({
    'TKT-102': [
      { sender: 'System', text: 'Ticket generated. IT Support team notified.', time: 'Today, 10:15 AM' },
      { sender: 'David M. (AV Tech)', text: 'Checking the network bridge for IP conflicts now. The printer seems to drop lease every 3 hours.', time: 'Today, 10:45 AM' }
    ],
    'TKT-101': [
      { sender: 'System', text: 'Ticket generated. Billing coordinator assigned.', time: 'Yesterday, 2:30 PM' }
    ],
    'TKT-100': [
      { sender: 'System', text: 'Ticket generated.', time: '2 days ago' },
      { sender: 'David M. (AV Tech)', text: 'DMX controller reset. Cable replaced. Panel successfully synchronized.', time: '2 days ago' },
      { sender: 'Thomas J. (Ops)', text: 'Verified working. Thanks for the quick response!', time: 'Yesterday' }
    ]
  });

  const [newMsg, setNewMsg] = useState('');

  const handleCreateTicket = (values: any) => {
    const tktId = `TKT-${100 + tickets.length + 1}`;
    const newTkt = {
      id: tktId,
      date: 'Just now',
      status: 'Awaiting Staff',
      ...values
    };
    setTickets(prev => [newTkt, ...prev]);
    setChatMessages(prev => ({
      ...prev,
      [tktId]: [{ sender: 'System', text: 'Ticket raised successfully.', time: 'Just now' }]
    }));
    form.resetFields();
    showToast.success(`Ticket ${tktId} raised successfully.`);
  };

  const handleOpenTicketDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMsg.trim() || !selectedTicket) return;
    const tktId = selectedTicket.id;
    const newMsgObj = {
      sender: 'Admin (You)',
      text: newMsg,
      time: 'Just now'
    };
    setChatMessages(prev => ({
      ...prev,
      [tktId]: [...(prev[tktId] || []), newMsgObj]
    }));
    setNewMsg('');
    showToast.success('Message sent to IT coordinator.');
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / IT Helpdesk
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Support & SLA Ticket Center
          </h1>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Side: Submit Ticket Form */}
        <Col xs={24} lg={8}>
          <Card title="Submit Support Ticket" style={{ borderRadius: '16px' }}>
            <Form form={form} layout="vertical" onFinish={handleCreateTicket}>
              <Form.Item label="Ticket Subject" name="subject" rules={[{ required: true, message: 'Enter ticket subject' }]}>
                <Input placeholder="e.g. iPad cannot sync layout edits" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Category" name="category" initialValue="Hardware" rules={[{ required: true }]}>
                    <Select options={[
                      { value: 'Hardware', label: 'Hardware / IT' },
                      { value: 'AV Equipment', label: 'AV & Lights' },
                      { value: 'Billing', label: 'Billing / Finance' },
                      { value: 'Catering', label: 'Catering / Kitchen' }
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Priority SLA" name="priority" initialValue="Medium" rules={[{ required: true }]}>
                    <Select options={[
                      { value: 'Low', label: 'Low' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'High', label: 'High' }
                    ]} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Detailed Description" name="desc" rules={[{ required: true, message: 'Enter description' }]}>
                <Input.TextArea placeholder="Describe the fault or system error details..." rows={4} />
              </Form.Item>

              <Form.Item style={{ margin: 0 }}>
                <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', borderRadius: '8px', fontWeight: 600 }}>
                  File Ticket
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right Side: Active Tickets Table */}
        <Col xs={24} lg={16}>
          <Card title="Active Helpdesk Tickets" style={{ borderRadius: '16px' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <Input 
                prefix={<Search size={16} color="#64748b" />}
                placeholder="Search tickets by subject..."
                style={{ width: '320px', borderRadius: '8px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Table 
              dataSource={tickets.filter(t => t.subject.toLowerCase().includes(searchTerm.toLowerCase()))}
              rowKey="id"
              pagination={false}
              columns={[
                { title: 'Ticket ID', dataIndex: 'id', key: 'id' },
                { title: 'Subject', dataIndex: 'subject', key: 'subject', render: (val) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{val}</span> },
                { title: 'Category', dataIndex: 'category', key: 'category', render: (val) => <Tag color="blue">{val}</Tag> },
                { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (priority) => <Tag color={priority === 'High' ? 'red' : 'orange'}>{priority.toUpperCase()}</Tag> },
                { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Resolved' ? 'success' : status === 'In Progress' ? 'processing' : 'warning'}>{status}</Tag> },
                { title: 'Filed Date', dataIndex: 'date', key: 'date' },
                { title: 'Action', key: 'action', render: (_, record) => (
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<MessageSquare size={14} />} 
                    onClick={() => handleOpenTicketDetails(record)}
                    style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', borderRadius: '6px' }}
                  >
                    View Thread
                  </Button>
                )}
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Ticket Details Chat Drawer */}
      <Drawer
        title={selectedTicket ? `Ticket Thread: ${selectedTicket.id}` : 'Ticket details'}
        placement="right"
        width={400}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        {selectedTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card style={{ background: '#f8fafc', marginBottom: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Filed: {selectedTicket.date}</span>
                <Tag color={selectedTicket.priority === 'High' ? 'red' : 'orange'}>{selectedTicket.priority}</Tag>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px 0' }}>{selectedTicket.subject}</h3>
              <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{selectedTicket.desc}</p>
            </Card>

            <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '12px' }}>Communication Log</h4>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
              <List
                dataSource={chatMessages[selectedTicket.id] || []}
                renderItem={msg => (
                  <div style={{
                    background: msg.sender.includes('You') ? '#ffe5e5' : '#f1f5f9',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    alignSelf: msg.sender.includes('You') ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                      <strong>{msg.sender}</strong>
                      <span>{msg.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#1e293b', margin: 0 }}>{msg.text}</p>
                  </div>
                )}
              />
            </div>

            {selectedTicket.status !== 'Resolved' ? (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <Input.TextArea 
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type message to IT technician..."
                  rows={3}
                  style={{ marginBottom: '10px', borderRadius: '8px' }}
                />
                <Button type="primary" onClick={handleSendMessage} style={{ width: '100%', backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', borderRadius: '8px' }}>
                  Send Message
                </Button>
              </div>
            ) : (
              <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', color: '#166534' }}>
                <Info size={16} />
                <span style={{ fontSize: '12px' }}>This ticket has been resolved. Reopen if problem persists.</span>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
