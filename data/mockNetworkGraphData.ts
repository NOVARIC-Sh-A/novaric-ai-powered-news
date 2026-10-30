// data/mockNetworkGraphData.ts
// Defines the structure and data for the network graph visualization.

import { GraphNode, GraphEdge } from '../types';

export const graphData: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    // Central Node
    { id: 'vip33', label: 'Dr. Alban Gj. THIKA', x: 450, y: 350, size: 28, color: '#dc2626', group: 'Analyst' }, // Red

    // Politics
    { id: 'vip1', label: 'Edi Rama', x: 150, y: 120, size: 22, color: '#3b82f6', group: 'Politics (PS)' }, // Blue
    { id: 'vip2', label: 'Sali Berisha', x: 300, y: 180, size: 20, color: '#22c55e', group: 'Politics (PD)' }, // Green
    { id: 'mp19', label: 'Benet Beci', x: 120, y: 250, size: 16, color: '#3b82f6', group: 'Politics (PS)' }, // Blue

    // Judiciary
    { id: 'inst_spak', label: 'Altin Dumani (SPAK)', x: 200, y: 480, size: 20, color: '#f97316', group: 'Judiciary' }, // Orange
    { id: 'jgjkko1', label: 'Irena Gjoka (GJKKO)', x: 350, y: 520, size: 16, color: '#f97316', group: 'Judiciary' },

    // Media
    { id: 'vip4', label: 'Blendi Fevziu', x: 600, y: 120, size: 18, color: '#ec4899', group: 'Media' }, // Rose/Pink
    { id: 'vip10', label: 'Eni Vasili', x: 750, y: 180, size: 16, color: '#ec4899', group: 'Media' },
    { id: 'vip9', label: 'Sokol Balla', x: 780, y: 280, size: 16, color: '#ec4899', group: 'Media' },
    { id: 'vip32', label: 'Ylli Rakipi', x: 620, y: 250, size: 16, color: '#ec4899', group: 'Media' },

    // Business
    { id: 'vip31', label: 'Samir Mane', x: 700, y: 480, size: 20, color: '#06b6d4', group: 'Business' }, // Light Blue/Cyan
    { id: 'inst_dht', label: 'Dhoma e Tregtisë', x: 550, y: 530, size: 18, color: '#06b6d4', group: 'Business' },
  ],
  edges: [
    // --- Dr. Thika's Analytical Connections ---
    { source: 'vip33', target: 'vip1', type: 'thematic' },
    { source: 'vip33', target: 'vip2', type: 'thematic' },
    { source: 'vip33', target: 'mp19', type: 'direct' }, // Direct via Open Letter
    { source: 'vip33', target: 'inst_spak', type: 'thematic' },
    { source: 'vip33', target: 'jgjkko1', type: 'thematic' },
    { source: 'vip33', target: 'vip4', type: 'thematic' },
    { source: 'vip33', target: 'vip10', type: 'thematic' },
    { source: 'vip33', target: 'vip9', type: 'thematic' },
    { source: 'vip33', target: 'vip32', type: 'thematic' },
    { source: 'vip33', target: 'vip31', type: 'thematic' },
    { source: 'vip33', target: 'inst_dht', type: 'direct' }, // Direct via Buletin
    
    // --- Inter-Group Connections (Based on Public Data) ---
    // Media -> Politics
    { source: 'vip4', target: 'vip1' },
    { source: 'vip4', target: 'vip2' },
    { source: 'vip10', target: 'vip1' },
    { source: 'vip9', target: 'vip1' },
    { source: 'vip32', target: 'vip2' },

    // Judiciary -> Politics
    { source: 'inst_spak', target: 'vip2' },
    { source: 'jgjkko1', target: 'vip2' },
    
    // Business -> Politics
    { source: 'vip31', target: 'vip1' },
    { source: 'inst_dht', target: 'vip1' },

    // Politics -> Politics
    { source: 'vip1', target: 'mp19' }, // Same party
    { source: 'vip1', target: 'vip2' }, // Political rivals
  ],
};