import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Tabs, Select, InputNumber, Switch, Space, Row, Col } from 'antd';
import { Settings, Shield, Globe, Mail, Save } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const SettingsPanel: React.FC = () => {
  const [form] = Form.useForm();

  // Load settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('eh_system_settings');
    return saved ? JSON.parse(saved) : {
      propertyName: 'Imperial Grand Palace & Convention Center',
      defaultCurrency: 'INR',
      sessionTimeout: 30,
      autoSaveInterval: 60,
      stripeKey: 'pk_test_51O2883f39291',
      whatsappKey: 'wa_biz_secret_8832a104f',
      smtpHost: 'smtp.eventhub360.com',
      smtpPort: 587,
      smtpUser: 'notifications@eventhub360.com',
      smtpPass: '••••••••••••••••'
    };
  });

  const handleSaveSettings = (values: any) => {
    const updatedSettings = { ...settings, ...values };
    setSettings(updatedSettings);
    localStorage.setItem('eh_system_settings', JSON.stringify(updatedSettings));
    showToast.success('System configurations successfully saved.');
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / System Administration
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            System Settings
          </h1>
        </div>
      </div>

      <Card style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <Form 
          form={form} 
          layout="vertical" 
          initialValues={settings} 
          onFinish={handleSaveSettings}
        >
          <Tabs 
            type="line"
            tabBarStyle={{ marginBottom: '24px' }}
            items={[
              {
                key: 'general',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} />
                    General Settings
                  </span>
                ),
                children: (
                  <div style={{ maxWidth: '500px' }}>
                    <Form.Item label="Property / Venue Business Name" name="propertyName" rules={[{ required: true, message: 'Enter property name' }]}>
                      <Input placeholder="e.g. Imperial Palace Resort" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Default Billing Currency" name="defaultCurrency" rules={[{ required: true }]}>
                          <Select options={[
                            { value: 'INR', label: 'Rupees (₹)' },
                            { value: 'USD', label: 'Dollars ($)' },
                            { value: 'EUR', label: 'Euros (€)' }
                          ]} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Session Timeout (Minutes)" name="sessionTimeout" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} min={5} max={180} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="Enable Automatic BEO Autosaving" name="enableAutosave" valuePropName="checked" initialValue={true}>
                      <Switch />
                    </Form.Item>
                  </div>
                )
              },
              {
                key: 'integrations',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} />
                    Third-Party Integrations
                  </span>
                ),
                children: (
                  <div style={{ maxWidth: '500px' }}>
                    <Form.Item label="Stripe Publishable Key" name="stripeKey" rules={[{ required: true, message: 'Enter key' }]}>
                      <Input.Password placeholder="pk_test_..." />
                    </Form.Item>

                    <Form.Item label="WhatsApp Business API Key" name="whatsappKey" rules={[{ required: true, message: 'Enter key' }]}>
                      <Input.Password placeholder="wa_biz_..." />
                    </Form.Item>

                    <Form.Item label="Enable Real-Time WhatsApp Notifications" name="enableWA" valuePropName="checked" initialValue={true}>
                      <Switch />
                    </Form.Item>
                  </div>
                )
              },
              {
                key: 'smtp',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} />
                    SMTP Mail Configurations
                  </span>
                ),
                children: (
                  <div style={{ maxWidth: '500px' }}>
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item label="SMTP Server Host" name="smtpHost" rules={[{ required: true, message: 'Enter host' }]}>
                          <Input placeholder="smtp.mailtrap.io" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="SMTP Port" name="smtpPort" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} min={25} max={9999} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="SMTP Username" name="smtpUser" rules={[{ required: true, message: 'Enter user' }]}>
                      <Input placeholder="notifications@domain.com" />
                    </Form.Item>

                    <Form.Item label="SMTP Password" name="smtpPass" rules={[{ required: true, message: 'Enter password' }]}>
                      <Input.Password placeholder="Password secret" />
                    </Form.Item>

                    <Form.Item label="Use Secure SSL/TLS Connection" name="smtpSSL" valuePropName="checked" initialValue={true}>
                      <Switch />
                    </Form.Item>
                  </div>
                )
              }
            ]}
          />

          <Form.Item style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', margin: '20px 0 0 0' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<Save size={16} />}
              style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', borderRadius: '8px', height: '40px', fontWeight: 600 }}
            >
              Save Configurations
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
