import React from 'react';
import { GraphNode, GraphEdge } from '../types';

interface NetworkGraphProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, edges }) => {

  return (
    <div className="w-full min-h-[650px] relative">
        <svg width="100%" height="100%" viewBox="0 0 900 650" aria-labelledby="map-title">
            <title id="map-title">Diagram of influencer network connections</title>
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/>
                </filter>
            </defs>
            
            {/* Edges */}
            {edges.map((edge, i) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                return (
                    <line
                        key={i}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={edge.type === 'direct' ? '#dc2626' : '#94a3b8'}
                        strokeWidth={edge.type === 'direct' ? 1.5 : 1}
                        strokeDasharray={edge.type === 'thematic' ? '4 2' : 'none'}
                        strokeOpacity="0.8"
                    />
                );
            })}

            {/* Nodes */}
            {nodes.map(node => (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <circle
                        r={node.size}
                        fill={node.color}
                        stroke="#fff"
                        strokeWidth="2"
                        style={{ filter: 'url(#shadow)'}}
                    />
                    <text
                        y={node.size + 14}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="600"
                        className="fill-slate-800 dark:fill-slate-100"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}
                    >
                        {node.label.split(' ').map((word, i) => (
                            <tspan key={i} x="0" dy={i > 0 ? '1.2em' : '0'}>
                                {word}
                            </tspan>
                        ))}
                    </text>
                </g>
            ))}
        </svg>
    </div>
  );
};