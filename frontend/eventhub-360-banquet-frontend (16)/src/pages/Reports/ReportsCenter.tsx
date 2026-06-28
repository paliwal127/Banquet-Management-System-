import React, { useState } from 'react';
import { Card, Table, Tag, Button, DatePicker, Select, List, Row, Col } from 'antd';
import { FileText, Download, Printer, Settings } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const ReportsCenter: React.FC = () => {
  const [reportType, setReportType] = useState('revenue');

  const [availableReports] = useState([
    { id: 'R-01', title: 'Monthly Revenue Realization Report', category: 'Finance', generated: 'Just now', size: '2.4 MB' },
    { id: 'R-02', title: 'Seasonal Booking & Occupancy Forecast', category: 'Operations', generated: '1 hour ago', size: '1.8 MB' },
    { id: 'R-03', title: 'Catering Ingredient & Food Cost Analysis', category: 'Kitchen', generated: 'Yesterday', size: '840 KB' },
    { id: 'R-04', title: 'Staff Utilization & Overtime Schedule Log', category: 'HR', generated: '2 days ago', size: '1.2 MB' }
  ]);

  const handleExport = (type: string, format: string) => {
    showToast.success(`Exporting ${type} report as ${format.toUpperCase()}...`);
    setTimeout(() => {
      showToast.success(`${format.toUpperCase()} file generated successfully!`);
    }, 1200);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / Platform Reporting Center
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Executive Reports Center
          </h1>
        </div>

        <Button 
          type="primary" 
          icon={<Settings size={16} />}
          style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', fontWeight: 600, borderRadius: '8px', height: '40px' }}
          onClick={() => showToast.info('Opening scheduler configurations...')}
        >
          Scheduled Reports
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          {/* Quick Generator */}
          <Card title="Compile Custom Data Log" style={{ borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Report Category</label>
                <Select 
                  value={reportType}
                  onChange={setReportType}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'revenue', label: 'Revenue Projections & GST Ledger' },
                    { value: 'occupancy', label: 'Occupancy & Room Utilization' },
                    { value: 'food', label: 'F&B Food Costing & Waste Audits' },
                    { value: 'staff', label: 'Staff Shift Logs & Overtime Bills' }
                  ]}
                />
              </div>

              <div>
                <label className="form-label">Select Date Range</label>
                <DatePicker.RangePicker style={{ width: '100%', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <Button 
                  type="primary" 
                  icon={<Download size={16} />} 
                  style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', flex: 1 }}
                  onClick={() => handleExport(reportType, 'pdf')}
                >
                  PDF
                </Button>
                <Button 
                  icon={<Download size={16} />} 
                  style={{ flex: 1 }}
                  onClick={() => handleExport(reportType, 'excel')}
                >
                  Excel
                </Button>
                <Button 
                  icon={<Download size={16} />} 
                  style={{ flex: 1 }}
                  onClick={() => handleExport(reportType, 'csv')}
                >
                  CSV
                </Button>
                <Button 
                  icon={<Printer size={16} />}
                  onClick={() => showToast.info('Preparing print viewport...')}
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          {/* Generated Reports list */}
          <Card title="Recently Generated Reports Vault" style={{ borderRadius: '16px' }}>
            <List
              itemLayout="horizontal"
              dataSource={availableReports}
              renderItem={item => (
                <List.Item actions={[
                  <Button size="small" icon={<Download size={12} />} onClick={() => handleExport(item.title, 'pdf')}>Download</Button>,
                  <Button size="small" shape="circle" icon={<Printer size={12} />} onClick={() => showToast.info('Connecting to server printer...')} />
                ]}>
                  <List.Item.Meta 
                    avatar={<FileText size={24} color="#a8201a" style={{ marginTop: '8px' }} />}
                    title={<span style={{ fontWeight: 600, fontSize: '13px' }}>{item.title}</span>}
                    description={<span style={{ fontSize: '11px', color: '#64748b' }}>Category: {item.category} • Generated: {item.generated} • Size: {item.size}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
