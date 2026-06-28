import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Tag, Button, Input, Rate, Modal, Form, Select, InputNumber, Space } from 'antd';
import { Plus, Search, Trash2 } from 'lucide-react';
import { showToast } from '../../components/Feedback/ToastAlerts';

export const Masters: React.FC = () => {
  const [activeTab, setActiveTab] = useState('venues');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 1. Venue Master state
  const [venues, setVenues] = useState<any[]>(() => {
    const saved = localStorage.getItem('eh_master_venues');
    return saved ? JSON.parse(saved) : [
      { id: 'v-1', name: 'Imperial Grand Ballroom', capacity: 1200, type: 'Indoor', price: 180000, amenities: 'Sound, Stage, LED Screen', status: 'Active' },
      { id: 'v-2', name: 'Zenith Sky Terrace', capacity: 450, type: 'Outdoor', price: 95000, amenities: 'Bar Setup, BBQ Grill', status: 'Maintenance' },
      { id: 'v-3', name: 'Royal Dining Wing', capacity: 120, type: 'Indoor', price: 45000, amenities: 'PA System, Stage', status: 'Active' },
      { id: 'v-4', name: 'Emerald Pavilion', capacity: 250, type: 'Hybrid', price: 75000, amenities: 'Pool View, Ambient Lighting', status: 'Active' }
    ];
  });

  // 2. Customer Master state
  const [customers, setCustomers] = useState<any[]>(() => {
    const saved = localStorage.getItem('eh_master_customers');
    return saved ? JSON.parse(saved) : [
      { id: 'c-1', name: 'Mr. & Mrs. Miller', company: 'None', gst: 'Unregistered', contact: '+1 (555) 0192', limit: 50000, notes: 'Prefer outdoor catering' },
      { id: 'c-2', name: 'TechConf Corp', company: 'TechConf Solutions Ltd', gst: '27AAACT1029B1ZX', contact: '+1 (555) 8829', limit: 250000, notes: 'Corporate accounts' },
      { id: 'c-3', name: 'Arts Foundation', company: 'Global Arts Council', gst: '27AABBG2929K2ZA', contact: '+1 (555) 4381', limit: 100000, notes: 'Tax exempt certificate attached' }
    ];
  });

  // 3. Vendor Master state
  const [vendors, setVendors] = useState<any[]>(() => {
    const saved = localStorage.getItem('eh_master_vendors');
    return saved ? JSON.parse(saved) : [
      { id: 'vd-1', name: 'Royal Florals & Decor', category: 'Decorators', rating: 4.8, contact: '+1 (555) 0128', pricing: 'Standard', performance: 'Excellent' },
      { id: 'vd-2', name: 'Gourmet Banquet Catering', category: 'Caterers', rating: 4.9, contact: '+1 (555) 9012', pricing: 'Premium', performance: 'Outstanding' },
      { id: 'vd-3', name: 'DJ Sound Blast', category: 'DJs', rating: 4.5, contact: '+1 (555) 8872', pricing: 'Economy', performance: 'Good' },
      { id: 'vd-4', name: 'Stellar Photos', category: 'Photographers', rating: 4.7, contact: '+1 (555) 3042', pricing: 'Standard', performance: 'Excellent' }
    ];
  });

  // 4. Staff Master state
  const [staff, setStaff] = useState<any[]>(() => {
    const saved = localStorage.getItem('eh_master_staff');
    return saved ? JSON.parse(saved) : [
      { id: 's-1', name: 'Chef Marco', dept: 'Kitchen', role: 'Exec Chef', shift: 'Morning', skills: 'Plated Banquet, Buffet', status: 'Active' },
      { id: 's-2', name: 'Sarah K.', dept: 'Kitchen', role: 'Sous Chef', shift: 'Evening', skills: 'Pastry, Entree Prep', status: 'Active' },
      { id: 's-3', name: 'Thomas J.', dept: 'Operations', role: 'Event Coordinator', shift: 'Flexible', skills: 'Layout Coordination', status: 'Active' },
      { id: 's-4', name: 'Elena R.', dept: 'Finance', role: 'Finance Executive', shift: 'Morning', skills: 'Ledger Audit, Invoice', status: 'Active' }
    ];
  });

  // 5. Menu Master state
  const [menu, setMenu] = useState<any[]>(() => {
    const saved = localStorage.getItem('eh_master_menu');
    return saved ? JSON.parse(saved) : [
      { id: 'm-1', name: 'Truffle Arancini', category: 'Hors D\'oeuvres', veg: 'Veg', price: 9.00, diet: 'Vegetarian' },
      { id: 'm-2', name: 'Smoked Salmon Blinis', category: 'Hors D\'oeuvres', veg: 'Non-Veg', price: 14.00, diet: 'Pescatarian' },
      { id: 'm-3', name: 'Slow-Roasted Wagyu Rib', category: 'Main Entrees', veg: 'Non-Veg', price: 38.00, diet: 'Gluten-Free' },
      { id: 'm-4', name: 'Truffle Gnocchi', category: 'Main Entrees', veg: 'Veg', price: 18.00, diet: 'Jain/Vegan Available' },
      { id: 'm-5', name: 'Chocolate Lava Fondant', category: 'Desserts', veg: 'Veg', price: 9.50, diet: 'Vegetarian' }
    ];
  });

  // 6. Package Master state
  const [packages, setPackages] = useState<any[]>(() => {
    const saved = localStorage.getItem('eh_master_packages');
    return saved ? JSON.parse(saved) : [
      { id: 'p-1', name: 'Platinum Wedding Package', type: 'Wedding', pax: 150, inclusions: 'Gold Decor, 4-Course Dinner, DJ', price: 450000 },
      { id: 'p-2', name: 'Executive Corporate Gala', type: 'Corporate', pax: 300, inclusions: 'Tech AV, Premium Catering, Security', price: 750000 },
      { id: 'p-3', name: 'Grand Birthday Ceremony', type: 'Birthday', pax: 80, inclusions: 'Lounge Decor, Buffet Menu, Photo Booth', price: 180000 }
    ];
  });

  // Synchronize master databases to localStorage
  useEffect(() => {
    localStorage.setItem('eh_master_venues', JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem('eh_master_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('eh_master_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('eh_master_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('eh_master_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('eh_master_packages', JSON.stringify(packages));
  }, [packages]);

  // Handle row deletion
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to remove this master record?',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        if (activeTab === 'venues') {
          setVenues(prev => prev.filter(v => v.id !== id));
        } else if (activeTab === 'customers') {
          setCustomers(prev => prev.filter(c => c.id !== id));
        } else if (activeTab === 'vendors') {
          setVendors(prev => prev.filter(v => v.id !== id));
        } else if (activeTab === 'staff') {
          setStaff(prev => prev.filter(s => s.id !== id));
        } else if (activeTab === 'menu') {
          setMenu(prev => prev.filter(m => m.id !== id));
        } else if (activeTab === 'packages') {
          setPackages(prev => prev.filter(p => p.id !== id));
        }
        showToast.info('Master record removed.');
      }
    });
  };

  // Form submission handler
  const handleFormFinish = (values: any) => {
    const newId = `${activeTab.substring(0, 2)}-${Date.now()}`;
    const record = { id: newId, ...values };

    if (activeTab === 'venues') {
      setVenues(prev => [...prev, record]);
    } else if (activeTab === 'customers') {
      setCustomers(prev => [...prev, record]);
    } else if (activeTab === 'vendors') {
      setVendors(prev => [...prev, record]);
    } else if (activeTab === 'staff') {
      setStaff(prev => [...prev, record]);
    } else if (activeTab === 'menu') {
      setMenu(prev => [...prev, record]);
    } else if (activeTab === 'packages') {
      setPackages(prev => [...prev, record]);
    }

    setIsModalOpen(false);
    form.resetFields();
    showToast.success('Master record added successfully.');
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'venues':
        return (
          <>
            <Form.Item label="Venue Name" name="name" rules={[{ required: true, message: 'Enter venue name' }]}>
              <Input placeholder="e.g. Sapphire Banquet Room" />
            </Form.Item>
            <Form.Item label="Pax Capacity" name="capacity" rules={[{ required: true, message: 'Enter capacity' }]}>
              <InputNumber style={{ width: '100%' }} min={10} max={5000} placeholder="e.g. 500" />
            </Form.Item>
            <Form.Item label="Type" name="type" initialValue="Indoor" rules={[{ required: true }]}>
              <Select options={[{ value: 'Indoor', label: 'Indoor' }, { value: 'Outdoor', label: 'Outdoor' }, { value: 'Hybrid', label: 'Hybrid' }]} />
            </Form.Item>
            <Form.Item label="Base Price (₹)" name="price" rules={[{ required: true, message: 'Enter rental price' }]}>
              <InputNumber style={{ width: '100%' }} min={1000} placeholder="e.g. 120000" />
            </Form.Item>
            <Form.Item label="Amenities" name="amenities" rules={[{ required: true, message: 'Enter amenities' }]}>
              <Input placeholder="e.g. AC, Sound System, LED Walls" />
            </Form.Item>
            <Form.Item label="Status" name="status" initialValue="Active" rules={[{ required: true }]}>
              <Select options={[{ value: 'Active', label: 'Active' }, { value: 'Maintenance', label: 'Maintenance' }]} />
            </Form.Item>
          </>
        );
      case 'customers':
        return (
          <>
            <Form.Item label="Contact Name" name="name" rules={[{ required: true, message: 'Enter customer name' }]}>
              <Input placeholder="e.g. Jane Doe" />
            </Form.Item>
            <Form.Item label="Associated Corporation" name="company" initialValue="None">
              <Input placeholder="e.g. Google India Pvt Ltd" />
            </Form.Item>
            <Form.Item label="GSTIN Number" name="gst" initialValue="Unregistered">
              <Input placeholder="e.g. 27AAACT1029B1ZX" />
            </Form.Item>
            <Form.Item label="Phone/Mobile" name="contact" rules={[{ required: true, message: 'Enter mobile number' }]}>
              <Input placeholder="e.g. +91 98765 43210" />
            </Form.Item>
            <Form.Item label="Credit Limit (₹)" name="limit" initialValue={50000} rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item label="Notes" name="notes" initialValue="">
              <Input.TextArea placeholder="e.g. Corporate discounts or billing instructions" rows={3} />
            </Form.Item>
          </>
        );
      case 'vendors':
        return (
          <>
            <Form.Item label="Vendor Agency" name="name" rules={[{ required: true, message: 'Enter vendor name' }]}>
              <Input placeholder="e.g. Bright Stage Lights" />
            </Form.Item>
            <Form.Item label="Category" name="category" initialValue="Decorators" rules={[{ required: true }]}>
              <Select options={[
                { value: 'Decorators', label: 'Decorators' },
                { value: 'Caterers', label: 'Caterers' },
                { value: 'DJs', label: 'DJs & Sounds' },
                { value: 'Photographers', label: 'Photographers' }
              ]} />
            </Form.Item>
            <Form.Item label="Initial Rating" name="rating" initialValue={4.5} rules={[{ required: true }]}>
              <Rate allowHalf />
            </Form.Item>
            <Form.Item label="Contact No" name="contact" rules={[{ required: true, message: 'Enter contact phone' }]}>
              <Input placeholder="e.g. +91 99999 88888" />
            </Form.Item>
            <Form.Item label="Costing Tier" name="pricing" initialValue="Standard" rules={[{ required: true }]}>
              <Select options={[{ value: 'Economy', label: 'Economy' }, { value: 'Standard', label: 'Standard' }, { value: 'Premium', label: 'Premium' }]} />
            </Form.Item>
            <Form.Item label="Performance SLA" name="performance" initialValue="Excellent" rules={[{ required: true }]}>
              <Select options={[{ value: 'Outstanding', label: 'Outstanding' }, { value: 'Excellent', label: 'Excellent' }, { value: 'Good', label: 'Good' }, { value: 'Standard', label: 'Standard' }]} />
            </Form.Item>
          </>
        );
      case 'staff':
        return (
          <>
            <Form.Item label="Staff Member Name" name="name" rules={[{ required: true, message: 'Enter employee name' }]}>
              <Input placeholder="e.g. Chef Ronald" />
            </Form.Item>
            <Form.Item label="Department" name="dept" initialValue="Kitchen" rules={[{ required: true }]}>
              <Select options={[{ value: 'Kitchen', label: 'Kitchen' }, { value: 'Operations', label: 'Operations' }, { value: 'Finance', label: 'Finance' }, { value: 'Services', label: 'Services' }]} />
            </Form.Item>
            <Form.Item label="Designation / Role" name="role" rules={[{ required: true, message: 'Enter designation role' }]}>
              <Input placeholder="e.g. Pastry Chef" />
            </Form.Item>
            <Form.Item label="Shift Schedule" name="shift" initialValue="Morning" rules={[{ required: true }]}>
              <Select options={[{ value: 'Morning', label: 'Morning' }, { value: 'Evening', label: 'Evening' }, { value: 'Flexible', label: 'Flexible' }]} />
            </Form.Item>
            <Form.Item label="Skillsets" name="skills" rules={[{ required: true, message: 'Enter primary skills' }]}>
              <Input placeholder="e.g. French Desserts, Baking" />
            </Form.Item>
            <Form.Item label="Status" name="status" initialValue="Active" rules={[{ required: true }]}>
              <Select options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
            </Form.Item>
          </>
        );
      case 'menu':
        return (
          <>
            <Form.Item label="Dish / Item Name" name="name" rules={[{ required: true, message: 'Enter item name' }]}>
              <Input placeholder="e.g. Baked Lobster Thermidor" />
            </Form.Item>
            <Form.Item label="Course Category" name="category" initialValue="Main Entrees" rules={[{ required: true }]}>
              <Select options={[
                { value: 'Hors D\'oeuvres', label: 'Hors D\'oeuvres' },
                { value: 'Main Entrees', label: 'Main Entrees' },
                { value: 'Desserts', label: 'Desserts' },
                { value: 'Beverages', label: 'Beverages' }
              ]} />
            </Form.Item>
            <Form.Item label="Veg / Non-Veg" name="veg" initialValue="Veg" rules={[{ required: true }]}>
              <Select options={[{ value: 'Veg', label: 'Veg (Green)' }, { value: 'Non-Veg', label: 'Non-Veg (Red)' }]} />
            </Form.Item>
            <Form.Item label="Dietary Notes" name="diet" initialValue="Standard">
              <Input placeholder="e.g. Gluten-Free, Nut-Free, Jain Available" />
            </Form.Item>
            <Form.Item label="Price per Pax (₹)" name="price" rules={[{ required: true, message: 'Enter price' }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="e.g. 45.00" />
            </Form.Item>
          </>
        );
      case 'packages':
        return (
          <>
            <Form.Item label="Package Tier Name" name="name" rules={[{ required: true, message: 'Enter package name' }]}>
              <Input placeholder="e.g. Silver Banquet Gala" />
            </Form.Item>
            <Form.Item label="Event Classification" name="type" initialValue="Wedding" rules={[{ required: true }]}>
              <Select options={[
                { value: 'Wedding', label: 'Wedding' },
                { value: 'Corporate', label: 'Corporate' },
                { value: 'Birthday', label: 'Birthday' },
                { value: 'Social', label: 'Social Gathering' }
              ]} />
            </Form.Item>
            <Form.Item label="Inclusions Summary" name="inclusions" rules={[{ required: true, message: 'Enter package inclusions' }]}>
              <Input placeholder="e.g. Basic Decor, Standard Buffet, DJ Sound System" />
            </Form.Item>
            <Form.Item label="Included Pax Base" name="pax" rules={[{ required: true, message: 'Enter base guests' }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="e.g. 100" />
            </Form.Item>
            <Form.Item label="Base Package Price (₹)" name="price" rules={[{ required: true, message: 'Enter base cost' }]}>
              <InputNumber style={{ width: '100%' }} min={1000} placeholder="e.g. 250000" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  // Build tables actions column
  const actionsColumn = {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: (_: any, record: any) => (
      <Button 
        type="text" 
        danger 
        icon={<Trash2 size={16} />}
        onClick={() => handleDelete(record.id)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
      />
    )
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            EventHub 360 / Master Databases
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Masters Configuration
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
          Add Master Record
        </Button>
      </div>

      <Card style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '24px' }}>
        {/* Search bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Input 
            prefix={<Search size={16} color="#64748b" />}
            placeholder={`Search ${activeTab}...`}
            style={{ width: '320px', borderRadius: '8px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => {
            setActiveTab(key);
            setSearchTerm('');
          }}
          type="line"
          tabBarStyle={{ marginBottom: '24px' }}
          items={[
            {
              key: 'venues',
              label: 'Venue Master',
              children: (
                <Table 
                  dataSource={venues.filter((v: any) => v.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'Venue Name', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{val}</span> },
                    { title: 'Pax Capacity', dataIndex: 'capacity', key: 'capacity', render: (val) => `${val} guests max` },
                    { title: 'Indoor/Outdoor', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'Indoor' ? 'blue' : type === 'Outdoor' ? 'green' : 'orange'}>{type}</Tag> },
                    { title: 'Amenities Configured', dataIndex: 'amenities', key: 'amenities' },
                    { title: 'Base Rent', dataIndex: 'price', key: 'price', render: (val) => <strong style={{ color: '#9e2a2b' }}>₹{val.toLocaleString()}</strong> },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Active' ? 'success' : 'warning'}>{status}</Tag> },
                    actionsColumn
                  ]}
                />
              )
            },
            {
              key: 'customers',
              label: 'Customer Master',
              children: (
                <Table 
                  dataSource={customers.filter((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.company.toLowerCase().includes(searchTerm.toLowerCase()))}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'Contact Person', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                    { title: 'Associated Corporation', dataIndex: 'company', key: 'company' },
                    { title: 'GSTIN Number', dataIndex: 'gst', key: 'gst', render: (gst) => gst === 'Unregistered' ? <Tag color="default">UNREGISTERED</Tag> : <Tag color="geekblue">{gst}</Tag> },
                    { title: 'Phone/Mobile', dataIndex: 'contact', key: 'contact' },
                    { title: 'Credit Limit', dataIndex: 'limit', key: 'limit', render: (val) => `₹${val.toLocaleString()}` },
                    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
                    actionsColumn
                  ]}
                />
              )
            },
            {
              key: 'vendors',
              label: 'Vendor Master',
              children: (
                <Table 
                  dataSource={vendors.filter((v: any) => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.category.toLowerCase().includes(searchTerm.toLowerCase()))}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'Vendor Agency', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                    { title: 'Category', dataIndex: 'category', key: 'category' },
                    { title: 'Performance Rating', dataIndex: 'rating', key: 'rating', render: (val) => <Rate disabled defaultValue={val} style={{ fontSize: '12px' }} /> },
                    { title: 'Contact No', dataIndex: 'contact', key: 'contact' },
                    { title: 'Service Costing', dataIndex: 'pricing', key: 'pricing', render: (val) => <Tag color="purple">{val}</Tag> },
                    { title: 'Delivery SLA Status', dataIndex: 'performance', key: 'performance', render: (val) => <Tag color={val === 'Outstanding' || val === 'Excellent' ? 'success' : 'blue'}>{val}</Tag> },
                    actionsColumn
                  ]}
                />
              )
            },
            {
              key: 'staff',
              label: 'Staff Master',
              children: (
                <Table 
                  dataSource={staff.filter((s: any) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.dept.toLowerCase().includes(searchTerm.toLowerCase()))}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'Staff Member', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                    { title: 'Department', dataIndex: 'dept', key: 'dept' },
                    { title: 'Designation / Role', dataIndex: 'role', key: 'role' },
                    { title: 'Shift Schedule', dataIndex: 'shift', key: 'shift' },
                    { title: 'Skillsets', dataIndex: 'skills', key: 'skills' },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (val) => <Tag color={val === 'Active' ? 'success' : 'warning'}>{val}</Tag> },
                    actionsColumn
                  ]}
                />
              )
            },
            {
              key: 'menu',
              label: 'Menu Master',
              children: (
                <Table 
                  dataSource={menu.filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.category.toLowerCase().includes(searchTerm.toLowerCase()))}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'Dish / Item Name', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                    { title: 'Course Category', dataIndex: 'category', key: 'category' },
                    { title: 'Veg / Non-Veg', dataIndex: 'veg', key: 'veg', render: (val) => <Tag color={val === 'Veg' ? 'green' : 'red'}>{val}</Tag> },
                    { title: 'Dietary Notes', dataIndex: 'diet', key: 'diet' },
                    { title: 'Price per Pax', dataIndex: 'price', key: 'price', render: (val) => <strong style={{ color: '#9e2a2b' }}>₹{val.toFixed(2)}</strong> },
                    actionsColumn
                  ]}
                />
              )
            },
            {
              key: 'packages',
              label: 'Package Master',
              children: (
                <Table 
                  dataSource={packages.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.type.toLowerCase().includes(searchTerm.toLowerCase()))}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'Package Tier', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                    { title: 'Event Classification', dataIndex: 'type', key: 'type', render: (val) => <Tag color="orange">{val}</Tag> },
                    { title: 'Inclusions Summary', dataIndex: 'inclusions', key: 'inclusions' },
                    { title: 'Included Pax Base', dataIndex: 'pax', key: 'pax' },
                    { title: 'Base Package Price', dataIndex: 'price', key: 'price', render: (val) => <strong style={{ color: '#d97706', fontSize: '15px' }}>₹{val.toLocaleString()}</strong> },
                    actionsColumn
                  ]}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Dynamic Creation Modal Form */}
      <Modal
        title={`Add Master ${activeTab.substring(0, activeTab.length - 1).toUpperCase()} Record`}
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
          {renderFormFields()}
          
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0 0 0' }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b' }}>
                Save Record
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
