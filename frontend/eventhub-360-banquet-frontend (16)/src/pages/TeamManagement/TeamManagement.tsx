import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Row, Col, Tabs, Progress, List, Avatar, Badge } from 'antd';
import { Search, Plus, Calendar, CheckSquare, Award, Clock, Users } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const TeamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock employee database
  const [employees] = useState([
    { id: 'EMP-01', name: 'Chef Marco', dept: 'Kitchen', role: 'Executive Chef', team: 'Kitchen Ops', status: 'Active', utilization: 85, rating: 4.8 },
    { id: 'EMP-02', name: 'Sarah K.', dept: 'Kitchen', role: 'Sous Chef', team: 'Kitchen Ops', status: 'Active', utilization: 78, rating: 4.6 },
    { id: 'EMP-03', name: 'Thomas J.', dept: 'Operations', role: 'Event Lead', team: 'Banquet Ops', status: 'Active', utilization: 92, rating: 4.9 },
    { id: 'EMP-04', name: 'David M.', dept: 'Services', role: 'Audio Visual Tech', team: 'AV Support', status: 'Active', utilization: 60, rating: 4.5 },
    { id: 'EMP-05', name: 'Emma Watson', dept: 'Guest Relations', role: 'Guest Relations Host', team: 'Reception', status: 'Active', utilization: 72, rating: 4.7 }
  ]);

  // Reusable Teams
  const [teams] = useState([
    { name: 'Banquet Operations', lead: 'Thomas J.', count: 12, workload: 'High', status: 'Allocated' },
    { name: 'Kitchen Operations', lead: 'Chef Marco', count: 8, workload: 'Medium', status: 'Standby' },
    { name: 'Housekeeping & Clean', lead: 'Sarah K.', count: 15, workload: 'Low', status: 'Available' },
    { name: 'AV & Technical Support', lead: 'David M.', count: 4, workload: 'High', status: 'Allocated' }
  ]);

  // Kanban Tasks
  const [tasks] = useState([
    { id: 't-1', title: 'Arrange Ballroom round-tables', priority: 'High', assigned: 'Thomas J.', progress: 100, status: 'Completed' },
    { id: 't-2', title: 'Prepare slow-roasted Wagyu Rib', priority: 'High', assigned: 'Chef Marco', progress: 50, status: 'In Progress' },
    { id: 't-3', title: 'Soundcheck main DJ system', priority: 'Medium', assigned: 'David M.', progress: 0, status: 'To Do' },
    { id: 't-4', title: 'Clean pool deck exit area', priority: 'Low', assigned: 'Sarah K.', progress: 0, status: 'To Do' }
  ]);

  // Attendance register
  const [attendance] = useState([
    { id: 'EMP-01', name: 'Chef Marco', checkin: '07:55 AM', checkout: '04:00 PM', hours: 8, status: 'On-time' },
    { id: 'EMP-03', name: 'Thomas J.', checkin: '08:15 AM', checkout: 'Pending', hours: 6, status: 'Late' },
    { id: 'EMP-05', name: 'Emma Watson', checkin: '08:02 AM', checkout: '04:02 PM', hours: 8, status: 'On-time' }
  ]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / Human Resources Workspace
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Team Management
          </h1>
        </div>

        <Button 
          type="primary" 
          icon={<Plus size={16} />}
          style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', fontWeight: 600, borderRadius: '8px', height: '40px' }}
          onClick={() => showToast.info(`Create record for ${activeTab} loading...`)}
        >
          Add Staff Member
        </Button>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6} md={4}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TOTAL EMPLOYEES</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: '4px 0' }}>{employees.length}</div>
            <Tag color="blue">All Active</Tag>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>STAFF UTILIZATION</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#22c55e', margin: '4px 0' }}>79%</div>
            <Tag color="green">Healthy</Tag>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ONGOING SHIFTS</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706', margin: '4px 0' }}>3 Shifts</div>
            <Tag color="orange">Day Rotation</Tag>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OVERTIME LOGGED</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#9e2a2b', margin: '4px 0' }}>14 Hrs</div>
            <Tag color="purple">Billing Ready</Tag>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '24px' }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="line"
          tabBarStyle={{ marginBottom: '24px' }}
          items={[
            {
              key: 'directory',
              label: 'Employee Directory',
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Input 
                      prefix={<Search size={16} color="#64748b" />}
                      placeholder="Search employees by name, skills..."
                      style={{ width: '320px', borderRadius: '8px' }}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Table 
                    dataSource={employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.dept.toLowerCase().includes(searchTerm.toLowerCase()))}
                    rowKey="id"
                    pagination={false}
                    columns={[
                      { title: 'Employee ID', dataIndex: 'id', key: 'id', render: (val) => <span style={{ fontWeight: 700, color: '#64748b' }}>{val}</span> },
                      { title: 'Full Name', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{val}</span> },
                      { title: 'Department', dataIndex: 'dept', key: 'dept' },
                      { title: 'Designation / Role', dataIndex: 'role', key: 'role' },
                      { title: 'Assigned Team', dataIndex: 'team', key: 'team', render: (val) => <Tag color="geekblue">{val}</Tag> },
                      { title: 'Current Utilization', dataIndex: 'utilization', key: 'utilization', render: (val) => <Progress percent={val} size="small" strokeColor={val > 80 ? '#ef4444' : '#22c55e'} /> },
                      { title: 'Rating Score', dataIndex: 'rating', key: 'rating', render: (val) => <strong style={{ color: '#d97706' }}>{val} ★</strong> }
                    ]}
                  />
                </div>
              )
            },
            {
              key: 'teams',
              label: 'Teams Directory',
              children: (
                <Row gutter={[16, 16]}>
                  {teams.map((t, idx) => (
                    <Col xs={24} sm={12} md={6} key={idx}>
                      <Card style={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} bodyStyle={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{t.name}</span>
                          <Badge status={t.status === 'Allocated' ? 'error' : 'success'} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0' }}><strong>Lead Chef / Mgr:</strong> {t.lead}</p>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}><strong>Workforce Count:</strong> {t.count} members</p>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tag color={t.workload === 'High' ? 'red' : 'orange'}>{t.workload} Workload</Tag>
                          <Button size="small" onClick={() => showToast.info(`Scheduling details for ${t.name}...`)}>Manage</Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )
            },
            {
              key: 'kanban',
              label: 'Task Board',
              children: (
                <Row gutter={16}>
                  {['To Do', 'In Progress', 'Completed'].map(col => (
                    <Col span={8} key={col}>
                      <Card 
                        title={<div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '14px' }}>{col} <Tag>{tasks.filter(t => t.status === col).length}</Tag></div>}
                        style={{ background: '#f8fafc', borderRadius: '12px' }}
                        bodyStyle={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '300px' }}
                      >
                        {tasks.filter(t => t.status === col).map(t => (
                          <Card key={t.id} style={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '12px' }}>
                            <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{t.title}</h5>
                            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>Assigned: <strong>{t.assigned}</strong></span>
                              <Tag color={t.priority === 'High' ? 'red' : 'blue'}>{t.priority}</Tag>
                            </div>
                          </Card>
                        ))}
                      </Card>
                    </Col>
                  ))}
                </Row>
              )
            },
            {
              key: 'attendance',
              label: 'Attendance & Leaves',
              children: (
                <Table 
                  dataSource={attendance}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: 'Employee ID', dataIndex: 'id', key: 'id' },
                    { title: 'Employee Name', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                    { title: 'Logged Clock-In', dataIndex: 'checkin', key: 'checkin' },
                    { title: 'Logged Clock-Out', dataIndex: 'checkout', key: 'checkout' },
                    { title: 'Total Hours Worked', dataIndex: 'hours', key: 'hours', render: (val) => `${val} hours` },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (val) => <Tag color={val === 'On-time' ? 'success' : 'warning'}>{val}</Tag> }
                  ]}
                />
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};
