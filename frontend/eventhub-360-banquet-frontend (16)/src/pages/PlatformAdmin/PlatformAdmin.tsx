import React, { useState } from 'react';
import { Card, Table, Tag, Button, Switch, List, Input, Divider, Row, Col } from 'antd';
import { ShieldCheck, Plus, Check } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const PlatformAdmin: React.FC = () => {
  const [tenants] = useState([
    { id: 'T-01', name: 'Grand Hyatt Convention', users: 18, storage: '12 GB / 50 GB', billing: 'Active', renewal: '2026-12-01', plan: 'Enterprise Gold' },
    { id: 'T-02', name: 'Taj Mahal Palace Hall', users: 35, storage: '45 GB / 100 GB', billing: 'Active', renewal: '2027-01-15', plan: 'Enterprise VIP' },
    { id: 'T-03', name: 'Emerald Wedding Resort', users: 8, storage: '4 GB / 20 GB', billing: 'Grace Period', renewal: '2026-07-10', plan: 'SaaS Standard' }
  ]);

  const [activeSessions, setActiveSessions] = useState([
    { token: 'token-8832a', user: 'Alex Johnson', role: 'Banquet Mgr', ip: '192.168.1.12', browser: 'Chrome v120', device: 'Windows Desktop' },
    { token: 'token-4421b', user: 'Chef Marco', role: 'Kitchen Mgr', ip: '192.168.1.18', browser: 'Safari Mobile', device: 'iOS Mobile' },
    { token: 'token-9912z', user: 'Sarah K.', role: 'Finance Officer', ip: '10.0.12.8', browser: 'Firefox Quantum', device: 'macOS Laptop' }
  ]);

  const handleTerminateSession = (token: string) => {
    setActiveSessions(prev => prev.filter(s => s.token !== token));
    showToast.info('Terminated selected session. Action logged in global audits.');
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / SaaS Super Administration
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Platform Administration
          </h1>
        </div>

        <Button 
          type="primary" 
          icon={<Plus size={16} />}
          style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', fontWeight: 600, borderRadius: '8px', height: '40px' }}
          onClick={() => showToast.info('Provisioning new tenant workspace...')}
        >
          Provision Tenant
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Tenant Grids */}
          <Card title="Active Tenants (Branches & Companies)" style={{ borderRadius: '16px', marginBottom: '24px' }}>
            <Table 
              dataSource={tenants}
              rowKey="id"
              pagination={false}
              columns={[
                { title: 'Tenant ID', dataIndex: 'id', key: 'id' },
                { title: 'Company Name', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                { title: 'Active License Plan', dataIndex: 'plan', key: 'plan', render: (val) => <Tag color="purple">{val}</Tag> },
                { title: 'Active Users', dataIndex: 'users', key: 'users' },
                { title: 'Storage Usage', dataIndex: 'storage', key: 'storage' },
                { title: 'Billing Status', dataIndex: 'billing', key: 'billing', render: (val) => <Tag color={val === 'Active' ? 'success' : 'warning'}>{val}</Tag> }
              ]}
            />
          </Card>

          {/* Active Sessions */}
          <Card title="Active Session Sync Monitor" style={{ borderRadius: '16px' }}>
            <Table 
              dataSource={activeSessions}
              rowKey="token"
              pagination={false}
              columns={[
                { title: 'Logged User', dataIndex: 'user', key: 'user', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                { title: 'Role Context', dataIndex: 'role', key: 'role' },
                { title: 'Device Info', dataIndex: 'device', key: 'device' },
                { title: 'Browser Client', dataIndex: 'browser', key: 'browser' },
                { title: 'IP Address', dataIndex: 'ip', key: 'ip', render: (val) => <code style={{ fontSize: '11px' }}>{val}</code> },
                { title: 'Action', key: 'action', render: (_, record) => <Button size="small" type="primary" danger onClick={() => handleTerminateSession(record.token)}>Terminate</Button> }
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Feature Flags */}
          <Card title="Feature Flags & Modules Configuration" style={{ borderRadius: '16px', marginBottom: '24px' }}>
            <List
              itemLayout="horizontal"
              dataSource={[
                { key: 'ff-1', title: 'Interactive floor plan designer', desc: 'Enable canvas dragging & rotation controls', active: true },
                { key: 'ff-2', title: 'AI budget estimation generator', desc: 'Enable quick pricing formulas via copilot', active: true },
                { key: 'ff-3', title: 'Real-time kitchen order timelines', desc: 'Sync chef preparation status cards instantly', active: true },
                { key: 'ff-4', title: 'Customer self-service payments', desc: 'Allow client payments via sandbox portals', active: false }
              ]}
              renderItem={item => (
                <List.Item actions={[<Switch defaultChecked={item.active} onChange={(checked) => showToast.info(`${item.title} toggled: ${checked}`)} />]}>
                  <List.Item.Meta 
                    title={<span style={{ fontWeight: 600, fontSize: '13px' }}>{item.title}</span>}
                    description={<span style={{ fontSize: '11px', color: '#64748b' }}>{item.desc}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* API Keys */}
          <Card title="Mock Third-Party API Credentials" style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>STRIPE PAYMENT PORTAL GATEWAY</span>
                <Input value="pk_test_51O2883f39291" readOnly suffix={<Check size={14} color="#22c55e" />} style={{ fontFamily: 'monospace', fontSize: '12px' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>WHATSAPP BUSINESS API KEY</span>
                <Input value="wa_biz_secret_8832a104f" readOnly suffix={<Check size={14} color="#22c55e" />} style={{ fontFamily: 'monospace', fontSize: '12px' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>GOOGLE CALENDAR OAUTH CLIENT ID</span>
                <Input value="google_cal_oauth_99212.apps.google" readOnly suffix={<Check size={14} color="#22c55e" />} style={{ fontFamily: 'monospace', fontSize: '12px' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
