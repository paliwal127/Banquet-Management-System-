import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { venueService } from '../../services/api';
import { SkeletonLoader } from '../../components/Common/SkeletonLoader';
import { showToast } from '../../components/Feedback/ToastAlerts';
import { Card, Row, Col, Button, Alert, Modal, Space } from 'antd';
import { Layers, Trash2, ShieldAlert, Printer, Copy, RotateCcw, Move, Eye } from 'lucide-react';

interface LayoutItem {
  id: string;
  name: string;
  type: 'round-table' | 'stage' | 'dance-floor' | 'buffet-station';
  x: number;
  y: number;
  seats?: number;
  rotation?: number;
  scale?: number;
}

export const LayoutConfigurator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d');
  
  // Set default workspace to Imperial Grand Ballroom (Max Cap: 1200)
  const { data: venuesRes, isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueService.getVenues()
  });

  const venues = venuesRes?.data || [];
  const activeVenue = venues[0] || { name: 'Grand Ballroom C', maxCapacity: 120 };

  // Set default layout elements with initial rotation and scale
  const [elements, setElements] = useState<LayoutItem[]>([
    { id: 't-1', name: 'T01', type: 'round-table', x: 180, y: 160, seats: 10, rotation: 0, scale: 1 },
    { id: 't-2', name: 'T02', type: 'round-table', x: 300, y: 160, seats: 10, rotation: 0, scale: 1 },
    { id: 't-3', name: 'T03', type: 'round-table', x: 420, y: 160, seats: 10, rotation: 0, scale: 1 },
    { id: 't-4', name: 'T04', type: 'round-table', x: 180, y: 280, seats: 10, rotation: 0, scale: 1 },
    { id: 't-5', name: 'T05', type: 'round-table', x: 300, y: 280, seats: 10, rotation: 0, scale: 1 },
    { id: 't-6', name: 'T06', type: 'round-table', x: 420, y: 280, seats: 10, rotation: 0, scale: 1 },
    { id: 'stage-1', name: 'MAIN STAGE (24\' x 8\')', type: 'stage', x: 300, y: 50, rotation: 0, scale: 1 },
    { id: 'dance-1', name: 'DANCE FLOOR', type: 'dance-floor', x: 300, y: 390, rotation: 0, scale: 1 },
    { id: 'buffet-1', name: 'BUFFET STATION - HOT', type: 'buffet-station', x: 120, y: 390, rotation: 0, scale: 1 },
    { id: 'buffet-2', name: 'BUFFET STATION - COLD', type: 'buffet-station', x: 480, y: 390, rotation: 0, scale: 1 }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number } | null>(null);

  // 3D Engine Rotation States
  const [yaw, setYaw] = useState<number>(-0.6);
  const [pitch, setPitch] = useState<number>(0.5);
  const [dragStart3d, setDragStart3d] = useState<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // VR Immersive states
  const [isVROpen, setIsVROpen] = useState(false);
  const [vrYaw, setVrYaw] = useState(0.0);
  const vrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic capacity calculations
  const totalSeating = elements
    .filter(el => el.type === 'round-table')
    .reduce((sum, el) => sum + (el.seats || 0), 0);

  const capacityExceeded = totalSeating > activeVenue.maxCapacity;

  const handleAddElement = (type: LayoutItem['type']) => {
    let newItem: LayoutItem;
    const offset = elements.length * 15;
    
    if (type === 'round-table') {
      const tableNum = elements.filter(e => e.type === 'round-table').length + 1;
      const formattedNum = tableNum < 10 ? `T0${tableNum}` : `T${tableNum}`;
      newItem = {
        id: `t-${Date.now()}`,
        name: formattedNum,
        type: 'round-table',
        x: 100 + (offset % 300),
        y: 180 + (offset % 200),
        seats: 10,
        rotation: 0,
        scale: 1
      };
    } else if (type === 'stage') {
      newItem = { id: `stage-${Date.now()}`, name: 'STAGE ADD-ON', type: 'stage', x: 150, y: 80, rotation: 0, scale: 1 };
    } else if (type === 'dance-floor') {
      newItem = { id: `dance-${Date.now()}`, name: 'DANCE FLOOR', type: 'dance-floor', x: 220, y: 140, rotation: 0, scale: 1 };
    } else {
      newItem = { id: `buffet-${Date.now()}`, name: 'BUFFET LINE', type: 'buffet-station', x: 180, y: 420, rotation: 0, scale: 1 };
    }

    setElements([...elements, newItem]);
    setSelectedId(newItem.id);
    showToast.success(`Added ${newItem.name} to layout.`);
  };

  const handleDeleteElement = (id: string) => {
    const item = elements.find(el => el.id === id);
    if (!item) return;
    setElements(elements.filter(el => el.id !== id));
    setSelectedId(null);
    showToast.info(`Removed ${item.name} from layout.`);
  };

  const handleUpdateElement = (field: 'rotation' | 'scale', value: number) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el => {
      if (el.id === selectedId) {
        return { ...el, [field]: value };
      }
      return el;
    }));
  };

  const handleDuplicateElement = () => {
    if (!selectedId) return;
    const item = elements.find(el => el.id === selectedId);
    if (!item) return;
    const newItem: LayoutItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      name: `${item.name} (Copy)`,
      x: item.x + 30,
      y: item.y + 30
    };
    setElements([...elements, newItem]);
    setSelectedId(newItem.id);
    showToast.success(`Duplicated item: ${item.name}`);
  };

  const handlePrintLayout = () => {
    window.print();
  };

  const handleSaveLayout = () => {
    if (capacityExceeded) {
      showToast.error(`Capacity Exception: Seating count (${totalSeating}) exceeds hall maximum capacity (${activeVenue.maxCapacity})!`);
      return;
    }
    showToast.success('Layout configuration saved successfully.');
  };

  // 2D Drag handlers
  const handleMouseDown = (e: React.MouseEvent, el: LayoutItem) => {
    e.stopPropagation();
    setSelectedId(el.id);
    setDraggingId(el.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elX: el.x,
      elY: el.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setElements(prev => prev.map(el => {
      if (el.id === draggingId) {
        return {
          ...el,
          x: Math.max(10, Math.min(560, dragStart.elX + dx)),
          y: Math.max(10, Math.min(450, dragStart.elY + dy))
        };
      }
      return el;
    }));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setDragStart(null);
  };

  // 3D Canvas Drag & Draw logic
  const handleMouseDown3d = (e: React.MouseEvent) => {
    setDragStart3d({
      x: e.clientX,
      y: e.clientY,
      yaw: yaw,
      pitch: pitch
    });
  };

  const handleMouseMove3d = (e: React.MouseEvent) => {
    if (!dragStart3d) return;
    const dx = e.clientX - dragStart3d.x;
    const dy = e.clientY - dragStart3d.y;
    setYaw(dragStart3d.yaw + dx * 0.007);
    setPitch(Math.max(0.1, Math.min(1.4, dragStart3d.pitch + dy * 0.007)));
  };

  const handleMouseUp3d = () => {
    setDragStart3d(null);
  };

  // Render Loop for 3D Perspective Canvas
  useEffect(() => {
    if (activeTab !== '3d' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Projection mapping
    const project = (x3d: number, y3d: number, z3d: number) => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const rx = x3d * cosY - y3d * sinY;
      const ry = x3d * sinY + y3d * cosY;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const ry2 = ry * cosP - z3d * sinP;
      const rz2 = ry * sinP + z3d * cosP;

      const distance = 500;
      const scaleFactor = distance / (distance + ry2);
      const screenX = 350 + rx * scaleFactor;
      const screenY = 220 - rz2 * scaleFactor;

      return { x: screenX, y: screenY, depth: ry2 };
    };

    // Draw frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floor lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let gx = -300; gx <= 300; gx += 50) {
      ctx.beginPath();
      let first = true;
      for (let gy = -200; gy <= 200; gy += 20) {
        const pt = project(gx, gy, -40);
        if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    for (let gy = -200; gy <= 200; gy += 50) {
      ctx.beginPath();
      let first = true;
      for (let gx = -300; gx <= 300; gx += 20) {
        const pt = project(gx, gy, -40);
        if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // Walls
    const wallPts = [
      project(-300, -200, -40),
      project(300, -200, -40),
      project(300, 200, -40),
      project(-300, 200, -40),
      project(-300, -200, 60),
      project(300, -200, 60),
      project(300, 200, 60),
      project(-300, 200, 60)
    ];

    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(wallPts[0].x, wallPts[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(wallPts[i].x, wallPts[i].y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(wallPts[4].x, wallPts[4].y);
    for (let i = 5; i < 8; i++) ctx.lineTo(wallPts[i].x, wallPts[i].y);
    ctx.closePath();
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(wallPts[i].x, wallPts[i].y);
      ctx.lineTo(wallPts[i+4].x, wallPts[i+4].y);
      ctx.stroke();
    }

    // Map 2D coordinate positions to 3D room centers (canvas center is x=300, y=220)
    const elements3D = elements.map(el => {
      const x3d = (el.x - 300);
      const y3d = (el.y - 220);
      const proj = project(x3d, y3d, 0);
      return { el, x3d, y3d, proj };
    });

    // Sort by depth (painters algorithm)
    elements3D.sort((a, b) => b.proj.depth - a.proj.depth);

    // Draw elements
    elements3D.forEach(({ el, x3d, y3d, proj }) => {
      if (el.type === 'round-table') {
        const radius3D = 22 * (el.scale || 1);
        const topPt = project(x3d, y3d, 12);
        const botPt = project(x3d, y3d, -40);
        
        const rPt = project(x3d + radius3D, y3d, 12);
        const screenR = Math.abs(rPt.x - topPt.x);

        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(topPt.x - screenR, topPt.y);
        ctx.lineTo(botPt.x - screenR, botPt.y);
        ctx.lineTo(botPt.x + screenR, botPt.y);
        ctx.lineTo(topPt.x + screenR, topPt.y);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(topPt.x, topPt.y, screenR, screenR * 0.5, 0, 0, 2 * Math.PI);
        ctx.fillStyle = '#fef3c7';
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.name, topPt.x, topPt.y);
      }
      else if (el.type === 'stage') {
        const w = 70;
        const h = 25;
        const ht = 15;
        const box = [
          project(x3d - w, y3d - h, -40),
          project(x3d + w, y3d - h, -40),
          project(x3d + w, y3d + h, -40),
          project(x3d - w, y3d + h, -40),
          project(x3d - w, y3d - h, ht),
          project(x3d + w, y3d - h, ht),
          project(x3d + w, y3d + h, ht),
          project(x3d - w, y3d + h, ht)
        ];

        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(box[0].x, box[0].y);
        ctx.lineTo(box[4].x, box[4].y);
        ctx.lineTo(box[5].x, box[5].y);
        ctx.lineTo(box[1].x, box[1].y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(box[4].x, box[4].y);
        for (let i = 5; i < 8; i++) ctx.lineTo(box[i].x, box[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#93c5fd';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        const centerTop = project(x3d, y3d, ht);
        ctx.fillText(el.name, centerTop.x, centerTop.y);
      }
      else if (el.type === 'dance-floor') {
        const radius3D = 50;
        const p1 = project(x3d - radius3D, y3d - radius3D, -38);
        const p2 = project(x3d + radius3D, y3d - radius3D, -38);
        const p3 = project(x3d + radius3D, y3d + radius3D, -38);
        const p4 = project(x3d - radius3D, y3d + radius3D, -38);

        ctx.fillStyle = 'rgba(203, 213, 225, 0.3)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(el.name, proj.x, proj.y);
      }
      else {
        const w = 60;
        const h = 18;
        const ht = 10;
        const box = [
          project(x3d - w, y3d - h, -40),
          project(x3d + w, y3d - h, -40),
          project(x3d + w, y3d + h, -40),
          project(x3d - w, y3d + h, -40),
          project(x3d - w, y3d - h, ht),
          project(x3d + w, y3d - h, ht),
          project(x3d + w, y3d + h, ht),
          project(x3d - w, y3d + h, ht)
        ];

        ctx.fillStyle = '#6d28d9';
        ctx.beginPath();
        ctx.moveTo(box[0].x, box[0].y);
        ctx.lineTo(box[4].x, box[4].y);
        ctx.lineTo(box[5].x, box[5].y);
        ctx.lineTo(box[1].x, box[1].y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.moveTo(box[4].x, box[4].y);
        for (let i = 5; i < 8; i++) ctx.lineTo(box[i].x, box[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ddd6fe';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        const centerTop = project(x3d, y3d, ht);
        ctx.fillText(el.name, centerTop.x, centerTop.y);
      }
    });

  }, [activeTab, elements, yaw, pitch]);

  // VR Immersive Animation Loop
  useEffect(() => {
    if (!isVROpen || !vrCanvasRef.current) return;
    const canvas = vrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderVR = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Orbital view simulation coordinates
      const eyeX = 200 * Math.sin(vrYaw);
      const eyeY = 200 * Math.cos(vrYaw);
      const eyeZ = 50;

      const projectVR = (x3d: number, y3d: number, z3d: number) => {
        // Translation relative to camera eye
        const dx = x3d - eyeX;
        const dy = y3d - eyeY;
        const dz = z3d - eyeZ;

        // Yaw rotation
        const rx = dx * Math.cos(-vrYaw) - dy * Math.sin(-vrYaw);
        const ry = dx * Math.sin(-vrYaw) + dy * Math.cos(-vrYaw);

        const distance = 400;
        const scaleFactor = distance / (distance + ry);
        const screenX = 350 + rx * scaleFactor;
        const screenY = 200 - dz * scaleFactor;

        return { x: screenX, y: screenY, depth: ry };
      };

      // Draw VR pillars
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 4) {
        const px = 280 * Math.cos(ang);
        const py = 180 * Math.sin(ang);
        const b = projectVR(px, py, -40);
        const t = projectVR(px, py, 60);
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }

      // Draw Floor circles in VR
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
      for (let r = 80; r < 300; r += 60) {
        ctx.beginPath();
        let first = true;
        for (let th = 0; th <= Math.PI * 2; th += 0.1) {
          const px = r * Math.cos(th);
          const py = r * Math.sin(th);
          const pt = projectVR(px, py, -40);
          if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      const elementsVR = elements.map(el => {
        const x3d = (el.x - 300);
        const y3d = (el.y - 220);
        const proj = projectVR(x3d, y3d, 0);
        return { el, x3d, y3d, proj };
      });

      elementsVR.sort((a, b) => b.proj.depth - a.proj.depth);

      elementsVR.forEach(({ el, x3d, y3d, proj }) => {
        if (el.type === 'round-table') {
          const topPt = projectVR(x3d, y3d, 12);
          const botPt = projectVR(x3d, y3d, -40);
          const rPt = projectVR(x3d + 20, y3d, 12);
          const screenR = Math.abs(rPt.x - topPt.x);

          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(topPt.x, topPt.y, screenR, screenR * 0.4, 0, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#fef3c7';
          ctx.stroke();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 7px sans-serif';
          ctx.fillText(el.name, topPt.x, topPt.y);
        } else if (el.type === 'stage') {
          const w = 60;
          const h = 20;
          const box = [
            projectVR(x3d - w, y3d - h, -40),
            projectVR(x3d + w, y3d - h, -40),
            projectVR(x3d + w, y3d + h, -40),
            projectVR(x3d - w, y3d + h, -40),
            projectVR(x3d - w, y3d - h, 15),
            projectVR(x3d + w, y3d - h, 15),
            projectVR(x3d + w, y3d + h, 15),
            projectVR(x3d - w, y3d + h, 15)
          ];
          ctx.fillStyle = '#2563eb';
          ctx.beginPath();
          ctx.moveTo(box[4].x, box[4].y);
          for (let i = 5; i < 8; i++) ctx.lineTo(box[i].x, box[i].y);
          ctx.closePath();
          ctx.fill();
        }
      });

      // Smooth auto-orbit rotation
      setVrYaw(prev => prev + 0.005);
      animId = requestAnimationFrame(renderVR);
    };

    animId = requestAnimationFrame(renderVR);
    return () => cancelAnimationFrame(animId);
  }, [isVROpen, vrYaw, elements]);

  const selectedElement = elements.find(el => el.id === selectedId);

  if (isLoading) {
    return <SkeletonLoader type="detail" />;
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div className="no-print" style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Banquets / Layout Configurator
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
            Workspace: {activeVenue.name}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Editor Mode Selector */}
          <div style={{ display: 'flex', padding: '4px', background: '#f1f5f9', borderRadius: '24px' }}>
            <Button 
              type={activeTab === '2d' ? 'primary' : 'text'} 
              onClick={() => setActiveTab('2d')}
              style={{ borderRadius: '20px', fontSize: '13px', backgroundColor: activeTab === '2d' ? '#fff' : 'transparent', color: '#1e293b', border: 0, boxShadow: activeTab === '2d' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              2D Editor
            </Button>
            <Button 
              type={activeTab === '3d' ? 'primary' : 'text'} 
              onClick={() => {
                setActiveTab('3d');
                showToast.info('Rendering 3D Perspective Model...');
              }}
              style={{ borderRadius: '20px', fontSize: '13px', backgroundColor: activeTab === '3d' ? '#fff' : 'transparent', color: '#1e293b', border: 0, boxShadow: activeTab === '3d' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              3D Spatial
            </Button>
          </div>

          <div style={{ padding: '8px 16px', border: '1px solid #eef0f2', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: 600 }}>
            Seating Capacity: <span style={{ color: capacityExceeded ? '#ef4444' : '#1e293b' }}>{totalSeating}</span> / {activeVenue.maxCapacity} Pax
          </div>

          <Button 
            icon={<Printer size={16} />}
            onClick={handlePrintLayout}
            style={{ fontWeight: 600, borderRadius: '8px' }}
          >
            Print
          </Button>

          <Button 
            type="primary" 
            onClick={handleSaveLayout}
            style={{ backgroundColor: '#9e2a2b', borderColor: '#9e2a2b', fontWeight: 600, borderRadius: '8px' }}
          >
            Save Layout
          </Button>
        </div>
      </div>

      {capacityExceeded && (
        <Alert
          message="Capacity Exception Triggered"
          description={`Seating layout requests ${totalSeating} guests, which exceeds the venue's maximum allowable capacity of ${activeVenue.maxCapacity}. You will not be allowed to publish this layout.`}
          type="error"
          showIcon
          icon={<ShieldAlert size={18} />}
          style={{ marginBottom: '20px', borderRadius: '8px' }}
        />
      )}

      {activeTab === '2d' ? (
        <Row gutter={24}>
          {/* Left panel layout shapes tools */}
          <Col xs={24} md={6} className="no-print">
            <Card style={{ borderRadius: '16px', height: '100%' }} bodyStyle={{ padding: '16px 12px' }}>
              <h4 style={{ fontWeight: 600, color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>Toolbox</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button 
                  icon={<div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #a8201a', display: 'inline-block', marginRight: '8px' }} />}
                  style={{ display: 'flex', alignItems: 'center', height: '40px', borderRadius: '8px' }}
                  onClick={() => handleAddElement('round-table')}
                >
                  Round Table
                </Button>
                <Button 
                  icon={<div style={{ width: '16px', height: '8px', background: '#3b82f6', display: 'inline-block', marginRight: '8px' }} />}
                  style={{ display: 'flex', alignItems: 'center', height: '40px', borderRadius: '8px' }}
                  onClick={() => handleAddElement('stage')}
                >
                  Stage
                </Button>
                <Button 
                  icon={<div style={{ width: '12px', height: '12px', background: '#cbd5e1', display: 'inline-block', marginRight: '8px' }} />}
                  style={{ display: 'flex', alignItems: 'center', height: '40px', borderRadius: '8px' }}
                  onClick={() => handleAddElement('dance-floor')}
                >
                  Dance Floor
                </Button>
                <Button 
                  icon={<div style={{ width: '16px', height: '8px', background: '#8b5cf6', display: 'inline-block', marginRight: '8px' }} />}
                  style={{ display: 'flex', alignItems: 'center', height: '40px', borderRadius: '8px' }}
                  onClick={() => handleAddElement('buffet-station')}
                >
                  Buffet Line
                </Button>

                {selectedId && selectedElement && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>Selected Element</span>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                        <span>Rotation</span>
                        <strong>{selectedElement.rotation || 0}°</strong>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="360"
                        value={selectedElement.rotation || 0}
                        onChange={(e) => handleUpdateElement('rotation', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#9e2a2b', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                        <span>Scale</span>
                        <strong>{(selectedElement.scale || 1).toFixed(1)}x</strong>
                      </div>
                      <input 
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={selectedElement.scale || 1}
                        onChange={(e) => handleUpdateElement('scale', parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: '#9e2a2b', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Button 
                        icon={<Copy size={14} />} 
                        onClick={handleDuplicateElement}
                        style={{ width: '100%', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        Duplicate Item
                      </Button>
                      
                      <Button 
                        type="primary" 
                        danger 
                        icon={<Trash2 size={14} />}
                        onClick={() => handleDeleteElement(selectedId)}
                        style={{ width: '100%', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        Delete Item
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Seating Grid Canvas */}
          <Col xs={24} md={18}>
            <div 
              className="layout-canvas-frame"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ userSelect: 'none' }}
            >
              <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                EXTERIOR WALL - 24' height
              </div>

              {/* Layout Nodes */}
              {elements.map(el => {
                const isSelected = selectedId === el.id;
                const styleObj: React.CSSProperties = {
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  transform: `rotate(${el.rotation || 0}deg) scale(${el.scale || 1})`,
                  transition: draggingId === el.id ? 'none' : 'all 0.15s ease',
                  cursor: draggingId === el.id ? 'grabbing' : 'grab',
                  zIndex: isSelected ? 100 : 10
                };

                let className = '';
                if (el.type === 'round-table') className = `canvas-node-table ${isSelected ? 'selected' : ''}`;
                else if (el.type === 'stage') className = `canvas-node-stage ${isSelected ? 'selected' : ''}`;
                else if (el.type === 'dance-floor') className = `canvas-node-dance ${isSelected ? 'selected' : ''}`;
                else className = `canvas-node-buffet ${isSelected ? 'selected' : ''}`;

                return (
                  <div 
                    key={el.id}
                    className={className}
                    style={styleObj}
                    onMouseDown={(e) => handleMouseDown(e, el)}
                  >
                    {el.name}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      ) : (
        /* Real-Time Interactive 3D Perspective Canvas */
        <Row gutter={24}>
          <Col xs={24} md={6} className="no-print">
            <Card style={{ borderRadius: '16px' }} bodyStyle={{ padding: '16px' }}>
              <h4 style={{ fontWeight: 600, color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '12px' }}>3D Controls</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>
                Click and drag on the 3D screen to orbit the camera and review clearance spacing.
              </p>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  icon={<RotateCcw size={14} />} 
                  onClick={() => { setYaw(-0.6); setPitch(0.5); }}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  Reset Camera View
                </Button>
                
                <Button 
                  type="primary" 
                  icon={<Eye size={14} />}
                  onClick={() => setIsVROpen(true)}
                  style={{ width: '100%', backgroundColor: '#a8201a', borderColor: '#a8201a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  Launch Fullscreen VR
                </Button>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={18}>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'rgba(15, 23, 42, 0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: '#94a3b8' }}>
                3D SPATIAL PREVIEW - ACTIVE
              </div>
              <canvas 
                ref={canvasRef}
                width={700}
                height={440}
                onMouseDown={handleMouseDown3d}
                onMouseMove={handleMouseMove3d}
                onMouseUp={handleMouseUp3d}
                onMouseLeave={handleMouseUp3d}
                style={{ display: 'block', width: '100%', cursor: dragStart3d ? 'grabbing' : 'grab' }}
              />
            </div>
          </Col>
        </Row>
      )}

      {/* VR Walkthrough Simulation Modal */}
      <Modal
        title="Immersive VR 3D Walkthrough Tour"
        open={isVROpen}
        onCancel={() => setIsVROpen(false)}
        footer={null}
        width={750}
        bodyStyle={{ padding: '0 0 10px 0', background: '#020617', color: '#fff' }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'rgba(2, 6, 23, 0.85)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #0284c7' }}>
            <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              IMMERSIVE MODE ACTIVE
            </span>
            <span style={{ fontSize: '12px', color: '#e0f2fe' }}>Ballroom Space Tour Simulating...</span>
          </div>

          <div style={{ position: 'absolute', bottom: '12px', right: '12px', zIndex: 10, display: 'flex', gap: '8px' }}>
            <Button size="small" onClick={() => setVrYaw(prev => prev - 0.2)}>Turn Left</Button>
            <Button size="small" onClick={() => setVrYaw(prev => prev + 0.2)}>Turn Right</Button>
          </div>

          <canvas 
            ref={vrCanvasRef}
            width={720}
            height={400}
            style={{ display: 'block', width: '100%' }}
          />
        </div>
      </Modal>
    </div>
  );
};
