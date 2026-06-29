import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { venueService } from '../../services/api';
import type { Venue, SpaceType, VenueStatus } from '../../types/banquet';
import { SkeletonLoader } from '../../components/Common/SkeletonLoader';
import { showToast } from '../../components/Feedback/ToastAlerts';
import { useAuth } from '../../context/AuthContext';
import { HasPermission } from '../../components/Auth/HasPermission';
import { Card, Row, Col, Tag, Button, Modal, Input, Select, Checkbox, Upload } from 'antd';
import { Plus, Wrench } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const venueSchema = zod.object({
  name: zod.string().min(3, 'Venue name must be at least 3 characters'),
  maxCapacity: zod.number().min(10, 'Capacity must be at least 10'),
  locationType: zod.enum(['Indoor', 'Outdoor', 'Hybrid']),
  status: zod.enum(['Active', 'Maintenance']),
  features: zod.array(zod.string()).min(1, 'Select at least one feature'),
  image: zod.string().min(1, 'Please upload a photo for this venue'),
  maintenanceNote: zod.string().optional()
});

type VenueFormValues = zod.infer<typeof venueSchema>;

export const VenueConfig: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  
  // Filters State
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('Any');

  const getDefaultValues = (): VenueFormValues => ({
    name: '',
    maxCapacity: 200,
    locationType: 'Indoor',
    status: 'Active',
    features: ['Fiber Wi-Fi'],
    image: '',
    maintenanceNote: ''
  });

  const getVenueFormValues = (venue?: Venue | null): VenueFormValues => ({
    name: venue?.name || '',
    maxCapacity: venue?.maxCapacity || 200,
    locationType: venue?.locationType || 'Indoor',
    status: venue?.status || 'Active',
    features: venue?.features || ['Fiber Wi-Fi'],
    image: venue?.image || '',
    maintenanceNote: venue?.maintenanceNote || ''
  });

  const { data: venuesRes, isLoading } = useQuery({
    queryKey: ['venues', search, type, status],
    queryFn: () => venueService.getVenues(search, type, status)
  });

  const createVenueMutation = useMutation({
    mutationFn: (newVenue: Omit<Venue, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => 
      venueService.createVenue(newVenue, user?.username || 'Unknown'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      showToast.success('New venue space added successfully!');
      handleCloseModal();
    },
    onError: (err: any) => {
      showToast.error(err.message || 'Failed to add venue');
    }
  });

  const updateVenueMutation = useMutation({
    mutationFn: ({ id, updates, actor }: { id: string; updates: Partial<Venue>; actor: string }) =>
      venueService.updateVenue(id, updates, actor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      showToast.success('Venue updated successfully!');
      handleCloseModal();
    },
    onError: (err: any) => {
      showToast.error(err.message || 'Failed to update venue');
    }
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: getDefaultValues()
  });

  const openCreateModal = () => {
    setSelectedVenue(null);
    reset(getDefaultValues());
    setIsModalOpen(true);
  };

  const openEditModal = (venue: Venue) => {
    setSelectedVenue(venue);
    reset(getVenueFormValues(venue));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
    reset(getDefaultValues());
  };

  const handleCreateVenue = (data: VenueFormValues) => {
    createVenueMutation.mutate({
      ...data,
      lastInspection: 'Just now'
    });
  };

  const handleUpdateVenue = (data: VenueFormValues) => {
    if (!selectedVenue) return;

    updateVenueMutation.mutate({
      id: selectedVenue.id,
      updates: {
        ...data,
        lastInspection: selectedVenue.lastInspection || 'Just now'
      },
      actor: user?.username || 'Unknown'
    });
  };

  const venues = venuesRes?.data || [];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>Venue Configuration</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Manage your luxury hall assets, define capacities, and coordinate technical maintenance for seamless event execution.
          </p>
        </div>
        <HasPermission permission="manage_venues">
          <Button 
            type="primary" 
            onClick={openCreateModal}
            icon={<Plus size={16} />}
            style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', borderRadius: '8px', height: '40px', fontWeight: 600 }}
          >
            Add New Venue
          </Button>
        </HasPermission>
      </div>

      {/* Filters Bar */}
      <Card style={{ borderRadius: '12px', marginBottom: '24px', border: '1px solid #eef0f2' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Input.Search
              placeholder="Search venues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} md={5}>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Location Type</span>
            <Select 
              value={type} 
              onChange={setType} 
              style={{ width: '100%' }}
              options={[
                { value: 'All', label: 'All Spaces' },
                { value: 'Indoor', label: 'Indoor Only' },
                { value: 'Outdoor', label: 'Outdoor Only' },
                { value: 'Hybrid', label: 'Hybrid Spaces' },
              ]}
            />
          </Col>
          <Col xs={12} md={5}>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Operational Status</span>
            <Select 
              value={status} 
              onChange={setStatus} 
              style={{ width: '100%' }}
              options={[
                { value: 'Any', label: 'Any Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Maintenance', label: 'Maintenance' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Venues Grid */}
      {isLoading ? (
        <SkeletonLoader type="card" count={4} />
      ) : (
        <Row gutter={[24, 24]}>
          {venues.map((v: Venue) => (
            <Col xs={24} sm={12} md={8} lg={6} key={v.id}>
              <Card
                cover={
                  <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={v.image} 
                      alt={v.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <Tag 
                      color={v.status === 'Active' ? 'green' : 'red'}
                      style={{ position: 'absolute', top: '12px', left: '12px', margin: 0, fontWeight: 600 }}
                    >
                      {v.status}
                    </Tag>
                    <Tag 
                      color="blue"
                      style={{ position: 'absolute', top: '12px', right: '12px', margin: 0, fontWeight: 600 }}
                    >
                      {v.locationType}
                    </Tag>
                  </div>
                }
                style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #eef0f2' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{v.name}</h3>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#a8201a' }}>{v.maxCapacity}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Max Pax</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {v.features.map((f: string) => (
                    <Tag color="default" key={f} style={{ borderRadius: '4px', margin: 0, fontSize: '11px' }}>
                      {f}
                    </Tag>
                  ))}
                </div>

                {v.status === 'Maintenance' && v.maintenanceNote && (
                  <div style={{ padding: '8px 12px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #ffe3e3', fontSize: '12px', color: '#e11d48', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wrench size={14} />
                    <span>{v.maintenanceNote}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b' }}>
                  <span>Last inspected: {v.lastInspection}</span>
                  <Button 
                    type="link" 
                    size="small" 
                    style={{ padding: 0, color: '#a8201a', fontWeight: 600 }}
                    onClick={() => openEditModal(v)}
                  >
                    Edit Config →
                  </Button>
                </div>
              </Card>
            </Col>
          ))}

          {/* Add Space Empty State Card */}
          <HasPermission permission="manage_venues">
            <Col xs={24} sm={12} md={8} lg={6}>
              <div 
                className="add-space-card"
                onClick={openCreateModal}
              >
                <div className="add-space-icon-wrapper">
                  <Plus size={32} color="#a8201a" />
                </div>
                <h4 style={{ margin: '12px 0 4px 0', color: '#1e293b', fontWeight: 600 }}>Add New Space</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>Expand your hotel hall inventory</p>
              </div>
            </Col>
          </HasPermission>
        </Row>
      )}

      {/* Add Space Modal */}
      <Modal
        title={selectedVenue ? 'Edit Venue Space' : 'Add New Venue Space'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={560}
      >
        <form onSubmit={handleSubmit(selectedVenue ? handleUpdateVenue : handleCreateVenue)} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Venue Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="e.g. Grand Ballroom A" />}
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Max Seating Capacity (Pax)</label>
                <Controller
                  name="maxCapacity"
                  control={control}
                  render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />}
                />
                {errors.maxCapacity && <span className="form-error">{errors.maxCapacity.message}</span>}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Space Location Type</label>
                <Controller
                  name="locationType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: '100%' }}>
                      <Select.Option value="Indoor">Indoor</Select.Option>
                      <Select.Option value="Outdoor">Outdoor</Select.Option>
                      <Select.Option value="Hybrid">Hybrid</Select.Option>
                    </Select>
                  )}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Initial Operations Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: '100%' }}>
                      <Select.Option value="Active">Active</Select.Option>
                      <Select.Option value="Maintenance">Maintenance</Select.Option>
                    </Select>
                  )}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Venue Photo</label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            showToast.error('Please upload an image file.');
                            return false;
                          }

                          const reader = new FileReader();
                          reader.onload = () => field.onChange(reader.result as string);
                          reader.readAsDataURL(file);
                          return false;
                        }}
                      >
                        <Button style={{ width: '100%' }}>Upload Saved Photo</Button>
                      </Upload>
                      {field.value ? (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={field.value}
                            alt="Venue preview"
                            style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                />
                {errors.image && <span className="form-error">{errors.image.message}</span>}
              </div>
            </Col>
          </Row>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Amenity Features</label>
            <Controller
              name="features"
              control={control}
              render={({ field }) => (
                <Checkbox.Group 
                  {...field}
                  options={[
                    { label: 'Fiber Wi-Fi', value: 'Fiber Wi-Fi' },
                    { label: 'Atmos Sound', value: 'Atmos Sound' },
                    { label: 'RGB Ceiling', value: 'RGB Ceiling' },
                    { label: 'Bar Setup', value: 'Bar Setup' },
                    { label: 'Private Entry', value: 'Private Entry' },
                    { label: 'Pool View', value: 'Pool View' },
                  ]}
                />
              )}
            />
            {errors.features && <span className="form-error">{errors.features.message}</span>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Maintenance Notes (Optional)</label>
            <Controller
              name="maintenanceNote"
              control={control}
              render={({ field }) => <Input.TextArea {...field} placeholder="e.g. Carpeting repair scheduled next Tuesday" rows={2} />}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={createVenueMutation.isPending || updateVenueMutation.isPending}
              style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b' }}
            >
              {selectedVenue ? 'Save Changes' : 'Add Venue Space'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
