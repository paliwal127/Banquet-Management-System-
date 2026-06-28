import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AppShell } from './layouts/AppShell';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { VenueConfig } from './pages/VenueConfig/VenueConfig';
import { Availability } from './pages/Availability/Availability';
import { BEOGenerator } from './pages/BEOGenerator/BEOGenerator';
import { LayoutConfigurator } from './pages/LayoutConfigurator/LayoutConfigurator';
import { Coordination } from './pages/Coordination/Coordination';
import { FBPackages } from './pages/FBPackages/FBPackages';
import { AuditLogViewer } from './pages/AuditLog/AuditLog';
import { NotificationCenter } from './pages/NotificationCenter/NotificationCenter';
import { BIAnalytics } from './pages/Analytics/Analytics';
import { GuestManagement } from './pages/GuestManagement/GuestManagement';
import { ApprovalWorkflow } from './pages/ApprovalWorkflow/ApprovalWorkflow';
import { DocumentCenter } from './pages/DocumentCenter/DocumentCenter';

// Additional Enterprise pages
import { OperationsControlTower } from './pages/OperationsControlTower/OperationsControlTower';
import { FinanceDashboard } from './pages/FinanceDashboard/FinanceDashboard';
import { ClientPortal } from './pages/ClientPortal/ClientPortal';
import { AIAssistant } from './components/AIAssistant/AIAssistant';

// Missing view imports
import { CRM } from './pages/CRM/CRM';
import { Masters } from './pages/Masters/Masters';
import { PlatformAdmin } from './pages/PlatformAdmin/PlatformAdmin';
import { ReportsCenter } from './pages/Reports/ReportsCenter';
import { Inventory } from './pages/Inventory/Inventory';
import { Maintenance } from './pages/Maintenance/Maintenance';
import { TeamManagement } from './pages/TeamManagement/TeamManagement';

// Support, Archive and Settings Pages
import { SupportCenter } from './pages/Support/SupportCenter';
import { ArchiveVault } from './pages/Archive/ArchiveVault';
import { SettingsPanel } from './pages/Settings/SettingsPanel';

import { bookingService } from './services/api';
import { showToast } from './components/Feedback/ToastAlerts';

import { Modal, Input, Select, DatePicker, Row, Col, Button, List, Tag, Card } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import dayjs from 'dayjs';
import { Search, Sparkles, Lock, User as UserIcon } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const bookingSchema = zod.object({
  clientName: zod.string().min(3, 'Client name must be at least 3 characters'),
  eventType: zod.string().min(1, 'Select an event type'),
  guestCount: zod.number().min(1, 'Guests must be greater than 0'),
  venueId: zod.string().min(1, 'Select a venue'),
  startDate: zod.any().refine(val => !!val, 'Select a start date'),
  endDate: zod.any().refine(val => !!val, 'Select an end date'),
  startTime: zod.string().min(1, 'Select a start time'),
  endTime: zod.string().min(1, 'Select an end time'),
  billingAmount: zod.number().min(100, 'Minimum charge is ₹100')
}).refine(data => {
  if (data.startDate && data.endDate) {
    return dayjs(data.endDate).isAfter(dayjs(data.startDate)) || dayjs(data.endDate).isSame(dayjs(data.startDate), 'day');
  }
  return true;
}, {
  message: 'End date must be on or after start date',
  path: ['endDate']
});

type BookingFormValues = zod.infer<typeof bookingSchema>;

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('Alex Johnson');
  const [chosenRole, setChosenRole] = useState('Banquet Mgr');

  const handleLoginSubmit = () => {
    if (!username.trim()) {
      showToast.error('Please enter a username');
      return;
    }
    login(username, chosenRole);
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #4c1112 0%, #9e2a2b 100%)',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <Card 
        style={{ 
          width: 400, 
          borderRadius: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '12px', 
            background: 'rgba(158, 42, 43, 0.1)', 
            borderRadius: '16px',
            color: '#9e2a2b',
            marginBottom: '16px'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>EventHub 360</h2>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            Banquet Management Portal
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Username</label>
            <Input 
              prefix={<UserIcon size={16} color="#64748b" />}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              size="large"
              style={{ borderRadius: '10px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Select Workspace Role</label>
            <Select 
              value={chosenRole}
              onChange={setChosenRole}
              size="large"
              style={{ width: '100%' }}
              dropdownStyle={{ borderRadius: '12px' }}
              options={[
                { value: 'Banquet Mgr', label: 'Banquet Manager' },
                { value: 'Sales Mgr', label: 'Sales Manager' },
                { value: 'Kitchen Mgr', label: 'Kitchen Manager' },
                { value: 'Finance', label: 'Finance Officer' }
              ]}
            />
          </div>

          <Button 
            type="primary" 
            size="large" 
            icon={<Sparkles size={16} />}
            onClick={handleLoginSubmit}
            style={{ 
              backgroundColor: '#9e2a2b', 
              borderColor: '#9e2a2b', 
              borderRadius: '10px',
              height: '46px',
              fontWeight: 700,
              marginTop: '10px',
              boxShadow: '0 4px 6px -1px rgba(158, 42, 43, 0.2)'
            }}
          >
            Sign In to Workspace
          </Button>
        </div>
      </Card>
    </div>
  );
};

const MainAppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Inactivity timeout state
  const [isInactivityModalOpen, setIsInactivityModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const { user, role, logout } = useAuth();

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientName: '',
      eventType: 'Wedding',
      guestCount: 150,
      venueId: 'venue-1',
      startDate: null,
      endDate: null,
      startTime: '18:00',
      endTime: '22:00',
      billingAmount: 12750
    }
  });

  const guestCountWatch = watch('guestCount');

  // React to guest counts to estimate billing (₹85 per guest default)
  React.useEffect(() => {
    setValue('billingAmount', (guestCountWatch || 0) * 85);
  }, [guestCountWatch, setValue]);

  // Global Ctrl + K search command center shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Inactivity Timer tracking
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: any;
    const INACTIVITY_LIMIT = 120 * 1000; // 2 minutes

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      
      // If warning modal is already open, do not schedule the timeout again
      if (isInactivityModalOpen) return;

      inactivityTimer = setTimeout(() => {
        setIsInactivityModalOpen(true);
        setCountdown(30);
      }, INACTIVITY_LIMIT);
    };

    // Track standard interactions
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Start timer on mount
    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [user, isInactivityModalOpen]);

  // Active warning countdown handler
  useEffect(() => {
    let interval: any;
    if (isInactivityModalOpen && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isInactivityModalOpen && countdown === 0) {
      setIsInactivityModalOpen(false);
      showToast.warning('Logged out automatically due to inactivity.');
      logout();
    }
    return () => clearInterval(interval);
  }, [isInactivityModalOpen, countdown, logout]);

  const handleStayLoggedIn = () => {
    setIsInactivityModalOpen(false);
    setCountdown(30);
    showToast.success('Session extended successfully.');
  };

  const handleLogoutImmediately = () => {
    setIsInactivityModalOpen(false);
    logout();
  };

  // Search filter query logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: any[] = [];

    // All available views categorized
    const views = [
      { name: 'Dashboard Command Center', viewKey: 'dashboard', category: 'Pages' },
      { name: 'Operations Tower Overview', viewKey: 'operations-tower', category: 'Pages' },
      { name: 'Finance Invoices & Inflow', viewKey: 'finance-dashboard', category: 'Pages' },
      { name: 'Client Event Status Portal', viewKey: 'client-portal', category: 'Pages' },
      { name: 'Availability Calendar schedule', viewKey: 'availability', category: 'Pages' },
      { name: 'BEO Draft Generator sheets', viewKey: 'beo-generator', category: 'Pages' },
      { name: 'Layout 2D designer config', viewKey: 'layout-configurator', category: 'Pages' },
      { name: 'KOT Kitchen coordination tracker', viewKey: 'coordination', category: 'Pages' },
      { name: 'F&B Packages catalogue', viewKey: 'fb-packages', category: 'Pages' },
      { name: 'Audits trail history logs', viewKey: 'audit-log', category: 'Pages' },
      { name: 'Guest allocations register', viewKey: 'guests', category: 'Pages' },
      { name: 'Documents vault contracts', viewKey: 'documents', category: 'Pages' },
      { name: 'CRM Pipeline Leads', viewKey: 'crm', category: 'Pages' },
      { name: 'Masters Configuration databases', viewKey: 'masters', category: 'Pages' },
      { name: 'Platform Admin settings', viewKey: 'platform-admin', category: 'Pages' },
      { name: 'Reports Center analytics', viewKey: 'reports', category: 'Pages' },
      { name: 'Inventory Stock ledger', viewKey: 'inventory', category: 'Pages' },
      { name: 'Facility logs & maintenance', viewKey: 'maintenance', category: 'Pages' },
      { name: 'Team Management HR', viewKey: 'team-management', category: 'Pages' },
      { name: 'Support Helpdesk Center', viewKey: 'support', category: 'Pages' },
      { name: 'Archive Banquet Vault documents', viewKey: 'archive', category: 'Pages' },
      { name: 'System Settings configuration', viewKey: 'settings', category: 'Pages' }
    ];

    views.forEach(v => {
      if (v.name.toLowerCase().includes(query)) {
        results.push(v);
      }
    });

    setSearchResults(results);
  }, [searchQuery]);

  const createBookingMutation = useMutation({
    mutationFn: (newBooking: any) => bookingService.createBooking(newBooking, user?.username || 'Unknown'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      showToast.success('Booking successfully placed on calendar.');
      setIsBookingModalOpen(false);
      reset();
    },
    onError: (err: any) => {
      showToast.error(err.message || 'Failed to place booking');
    }
  });

  const handleCreateBooking = (data: any) => {
    const formattedStartDate = dayjs(data.startDate).format('YYYY-MM-DD');
    const formattedEndDate = dayjs(data.endDate).format('YYYY-MM-DD');
    const venueNameMap: Record<string, string> = {
      'venue-1': 'Imperial Grand Ballroom',
      'venue-2': 'Zenith Sky Terrace',
      'venue-3': 'Royal Dining Wing',
      'venue-4': 'Emerald Pavilion'
    };

    const payload = {
      clientName: data.clientName,
      eventType: data.eventType,
      guestCount: data.guestCount,
      venueId: data.venueId,
      venueName: venueNameMap[data.venueId] || 'Imperial Grand Ballroom',
      date: formattedStartDate,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'Confirmed' as const,
      billingAmount: data.billingAmount,
      paidAmount: 0
    };

    createBookingMutation.mutate(payload);
  };

  const handleSearchResultClick = (item: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveView(item.viewKey);
    showToast.info(`Navigating to: ${item.name}`);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <ProtectedRoute><Dashboard /></ProtectedRoute>;
      case 'operations-tower':
        return <ProtectedRoute><OperationsControlTower /></ProtectedRoute>;
      case 'finance-dashboard':
        return <ProtectedRoute><FinanceDashboard /></ProtectedRoute>;
      case 'client-portal':
        return <ProtectedRoute><ClientPortal /></ProtectedRoute>;
      case 'venue-config':
        return <ProtectedRoute><VenueConfig /></ProtectedRoute>;
      case 'availability':
        return <ProtectedRoute><Availability /></ProtectedRoute>;
      case 'beo-generator':
        return <ProtectedRoute><BEOGenerator /></ProtectedRoute>;
      case 'layout-configurator':
        return <ProtectedRoute><LayoutConfigurator /></ProtectedRoute>;
      case 'coordination':
        return <ProtectedRoute><ProtectedRoute><Coordination /></ProtectedRoute></ProtectedRoute>;
      case 'fb-packages':
        return <ProtectedRoute><FBPackages /></ProtectedRoute>;
      case 'audit-log':
        return <ProtectedRoute><AuditLogViewer /></ProtectedRoute>;
      case 'notifications':
        return <ProtectedRoute><NotificationCenter /></ProtectedRoute>;
      case 'analytics':
        return <ProtectedRoute><BIAnalytics /></ProtectedRoute>;
      case 'guests':
        return <ProtectedRoute><GuestManagement /></ProtectedRoute>;
      case 'beo-approvals':
        return <ProtectedRoute><ApprovalWorkflow /></ProtectedRoute>;
      case 'documents':
        return <ProtectedRoute><DocumentCenter /></ProtectedRoute>;
      
      // Mount Phase 2/3 and Masters pages
      case 'crm':
        return <ProtectedRoute><CRM /></ProtectedRoute>;
      case 'masters':
        return <ProtectedRoute><Masters /></ProtectedRoute>;
      case 'platform-admin':
        return <ProtectedRoute><PlatformAdmin /></ProtectedRoute>;
      case 'reports':
        return <ProtectedRoute><ReportsCenter /></ProtectedRoute>;
      case 'inventory':
        return <ProtectedRoute><Inventory /></ProtectedRoute>;
      case 'maintenance':
        return <ProtectedRoute><Maintenance /></ProtectedRoute>;
      case 'team-management':
        return <ProtectedRoute><TeamManagement /></ProtectedRoute>;
      case 'support':
        return <ProtectedRoute><SupportCenter /></ProtectedRoute>;
      case 'archive':
        return <ProtectedRoute><ArchiveVault /></ProtectedRoute>;
      case 'settings':
        return <ProtectedRoute><SettingsPanel /></ProtectedRoute>;

      default:
        return <ProtectedRoute><Dashboard /></ProtectedRoute>;
    }
  };

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      <AppShell 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenNewBookingModal={() => setIsBookingModalOpen(true)}
      >
        {renderView()}
      </AppShell>

      {/* Floating AI assistant copilot */}
      <AIAssistant />

      {/* Inactivity Session Guard Warning Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
            <Lock size={18} />
            <strong>Inactivity Session Warning</strong>
          </div>
        }
        open={isInactivityModalOpen}
        closable={false}
        maskClosable={false}
        footer={[
          <Button key="logout" danger onClick={handleLogoutImmediately} style={{ borderRadius: '8px' }}>
            Logout Now
          </Button>,
          <Button key="stay" type="primary" onClick={handleStayLoggedIn} style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', borderRadius: '8px' }}>
            Stay Logged In
          </Button>
        ]}
      >
        <p style={{ fontSize: '14px', color: 'var(--color-text-dark)', margin: '12px 0' }}>
          You have been inactive. For your security, you will be automatically signed out of the workspace in{' '}
          <strong style={{ color: '#ef4444', fontSize: '16px' }}>{countdown} seconds</strong>.
        </p>
      </Modal>

      {/* Ctrl + K Universal Command Center Search Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
            <Search size={18} color="#64748b" />
            <strong style={{ fontSize: '15px' }}>Global Search & Command Center</strong>
          </div>
        }
        open={isSearchOpen}
        onCancel={() => { setIsSearchOpen(false); setSearchQuery(''); }}
        footer={null}
        width={500}
        bodyStyle={{ padding: '8px 0 0 0' }}
      >
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search views, bookings or clients... (e.g. Finance, BEO)"
          style={{ width: '100%', height: '40px', borderRadius: '8px', marginBottom: '16px' }}
          autoFocus
        />

        {searchResults.length > 0 ? (
          <List
            dataSource={searchResults}
            renderItem={item => (
              <List.Item 
                onClick={() => handleSearchResultClick(item)}
                style={{ 
                  padding: '12px 16px', 
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9'
                }}
                className="search-item-hover"
              >
                <div>
                  <strong>{item.name}</strong>
                  <br />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Category: {item.category}</span>
                </div>
                <Tag color="blue">GO TO VIEW</Tag>
              </List.Item>
            )}
          />
        ) : (
          searchQuery.trim() && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
              No matches found for "{searchQuery}"
            </div>
          )
        )}

        {!searchQuery.trim() && (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Recent Workspace Views</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button size="small" onClick={() => { setIsSearchOpen(false); setActiveView('operations-tower'); }}>Operations Tower</Button>
              <Button size="small" onClick={() => { setIsSearchOpen(false); setActiveView('finance-dashboard'); }}>Finance Dashboard</Button>
              <Button size="small" onClick={() => { setIsSearchOpen(false); setActiveView('beo-generator'); }}>BEO Generator</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Global New Booking Modal */}
      <Modal
        title="Place New Banquet Booking"
        open={isBookingModalOpen}
        onCancel={() => setIsBookingModalOpen(false)}
        footer={null}
        width={560}
      >
        <form onSubmit={handleSubmit(handleCreateBooking)} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Client / Couple Name</label>
            <Controller
              name="clientName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="e.g. Miller Wedding reception" />}
            />
            {errors.clientName && <span className="form-error">{(errors.clientName as any).message}</span>}
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Event Category</label>
                <Controller
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: '100%' }}>
                      <Select.Option value="Wedding">Wedding Banquet</Select.Option>
                      <Select.Option value="Gala">Gala Ceremony</Select.Option>
                      <Select.Option value="Brunch">Brunch / Luncheon</Select.Option>
                      <Select.Option value="Cocktail">Cocktail Mixer</Select.Option>
                      <Select.Option value="Dinner">Corporate Dinner</Select.Option>
                      <Select.Option value="Conference">Seminar/Conf</Select.Option>
                    </Select>
                  )}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Expected Guest Count</label>
                <Controller
                  name="guestCount"
                  control={control}
                  render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />}
                />
                {errors.guestCount && <span className="form-error">{(errors.guestCount as any).message}</span>}
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Select Room / Venue</label>
                <Controller
                  name="venueId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: '100%' }}>
                      <Select.Option value="venue-1">Imperial Grand Ballroom</Select.Option>
                      <Select.Option value="venue-2">Zenith Sky Terrace</Select.Option>
                      <Select.Option value="venue-3">Royal Dining Wing</Select.Option>
                      <Select.Option value="venue-4">Emerald Pavilion</Select.Option>
                    </Select>
                  )}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Start Date</label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} />}
                />
                {errors.startDate && <span className="form-error">{(errors.startDate as any).message}</span>}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">End Date</label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} />}
                />
                {errors.endDate && <span className="form-error">{(errors.endDate as any).message}</span>}
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Start Time</label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: '100%' }}>
                      <Select.Option value="08:00">08:00 AM</Select.Option>
                      <Select.Option value="10:00">10:00 AM</Select.Option>
                      <Select.Option value="12:00">12:00 PM</Select.Option>
                      <Select.Option value="14:00">02:00 PM</Select.Option>
                      <Select.Option value="17:00">05:00 PM</Select.Option>
                      <Select.Option value="18:00">06:00 PM</Select.Option>
                      <Select.Option value="19:00">07:00 PM</Select.Option>
                    </Select>
                  )}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">End Time</label>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: '100%' }}>
                      <Select.Option value="15:00">03:00 PM</Select.Option>
                      <Select.Option value="17:00">05:00 PM</Select.Option>
                      <Select.Option value="21:00">09:00 PM</Select.Option>
                      <Select.Option value="22:00">10:00 PM</Select.Option>
                      <Select.Option value="23:00">11:00 PM</Select.Option>
                      <Select.Option value="00:00">12:00 AM</Select.Option>
                    </Select>
                  )}
                />
              </div>
            </Col>
          </Row>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Estimated Bill (₹)</label>
            <Controller
              name="billingAmount"
              control={control}
              render={({ field }) => <Input {...field} disabled style={{ background: '#f8fafc', color: '#a8201a', fontWeight: 700 }} />}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={createBookingMutation.isPending}
              style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b' }}
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <MainAppContent />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
