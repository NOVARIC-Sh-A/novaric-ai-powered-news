
import React, { useEffect, useRef, useState } from 'react';
import { ZoomInIcon, ZoomOutIcon, ArrowPathIcon } from './icons';

interface RadarChartDataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor: string;
}

interface RadarChartProps {
    data?: {
        labels: string[];
        datasets: RadarChartDataset[];
    };
    labels?: string[];
    values?: number[];
}

// Helper to store label render information
interface LabelRenderData {
    value: number;
    originalValue: number;
    angle: number;
    color: string;
    textColor: string;
    isYellow: boolean;
    datasetLabel: string;
}

// Helper function to wrap text on a canvas
function wrapText(
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    lineHeight: number
) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());

    // Adjust starting y-position for multi-line labels to be vertically centered
    const startY = y - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + index * lineHeight);
    });
}

export const RadarChart: React.FC<RadarChartProps> = ({ data: providedData, labels, values }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    // Increased base size to 800 for higher resolution on larger displays
    const baseSize = 800; 

    // Construct data object if using simple props
    const data = providedData || (labels && values ? {
        labels,
        datasets: [{
            label: 'Pikët',
            data: values,
            backgroundColor: 'rgba(228, 25, 30, 0.2)',
            borderColor: 'rgba(228, 25, 30, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(228, 25, 30, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(228, 25, 30, 1)',
        }]
    } : null);

    useEffect(() => {
        if (!canvasRef.current || !data) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = baseSize * zoomLevel;
        canvas.width = size;
        canvas.height = size;
        
        const centerX = size / 2;
        const centerY = size / 2;
        // Adjusted radius to fill appropriate space (0.65)
        const radius = Math.min(centerX, centerY) * 0.65; 
        const angleSlice = (Math.PI * 2) / data.labels.length;

        ctx.clearRect(0, 0, size, size);

        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const gridColor = isDarkMode ? '#475569' : '#e5e7eb';
        const axesColor = isDarkMode ? '#64748b' : '#d1d5db';
        const labelColor = isDarkMode ? '#94a3b8' : '#64748b';

        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1 * zoomLevel;
        ctx.setLineDash([]); // Ensure solid lines for grid
        for (let i = 1; i <= 5; i++) {
            const currentRadius = (radius / 5) * i;
            ctx.beginPath();
            ctx.moveTo(centerX + currentRadius * Math.cos(-Math.PI / 2), centerY + currentRadius * Math.sin(-Math.PI / 2));
            for (let j = 1; j <= data.labels.length; j++) {
                const angle = j * angleSlice - Math.PI / 2;
                ctx.lineTo(centerX + currentRadius * Math.cos(angle), centerY + currentRadius * Math.sin(angle));
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw axis value labels (0, 20, 40, 60, 80, 100)
        ctx.fillStyle = labelColor;
        ctx.font = `600 ${10 * zoomLevel}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tickAngle = -Math.PI / 2; // Upwards

        for (let i = 1; i <= 5; i++) {
             const val = i * 20;
             const r = (radius / 5) * i;
             const x = centerX + r * Math.cos(tickAngle);
             const y = centerY + r * Math.sin(tickAngle);
             
             // Background for text
             const text = val.toString();
             const tm = ctx.measureText(text);
             const p = 3 * zoomLevel;
             
             ctx.save();
             ctx.fillStyle = isDarkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)';
             ctx.beginPath();
             ctx.roundRect(x - tm.width/2 - p, y - 5*zoomLevel, tm.width + p*2, 10*zoomLevel, 3);
             ctx.fill();
             ctx.restore();
             
             ctx.fillText(text, x, y);
        }

        // Draw axes
        ctx.strokeStyle = axesColor;
        data.labels.forEach((_, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
            ctx.stroke();
        });

        // --- RENDER DATASETS (SHAPES ONLY) ---
        // Allow datasets to define if they want to be filled via property or label convention, falling back to existing logic
        const filledDatasets = data.datasets.filter(d => d.label === 'Mesatarja e Sistemeve të Ngjashme' || d.label === 'Pikët' || (d.backgroundColor && d.backgroundColor !== 'transparent'));
        const lineDatasets = data.datasets.filter(d => !filledDatasets.includes(d));
        
        // Ensure Dr. Alban's dataset (Yellow/Orange) is drawn last (on top) if present
        const allDatasets = [...filledDatasets, ...lineDatasets].sort((a, b) => {
             const isAYellow = a.borderColor === '#FFEB3B' || a.borderColor === '#FF9800' || (a.label && a.label.includes('Dr. Alban'));
             const isBYellow = b.borderColor === '#FFEB3B' || b.borderColor === '#FF9800' || (b.label && b.label.includes('Dr. Alban'));
             if (isAYellow && !isBYellow) return 1;
             if (!isAYellow && isBYellow) return -1;
             return 0;
        });

        // Collect labels for later rendering
        const axisLabels: LabelRenderData[][] = Array.from({ length: data.labels.length }, () => []);

        // Draw Polygon Shapes
        allDatasets.forEach(dataset => {
            const doFill = dataset.label === 'Mesatarja e Sistemeve të Ngjashme' || dataset.label === 'Pikët' || (dataset.backgroundColor && dataset.backgroundColor !== 'transparent');
            ctx.setLineDash([]); // Reset dash
            ctx.strokeStyle = dataset.borderColor;
            ctx.fillStyle = dataset.backgroundColor;
            ctx.lineWidth = dataset.borderWidth * zoomLevel;
            ctx.beginPath();
            dataset.data.forEach((value, i) => {
                const pointRadius = (value / 100) * radius;
                const angle = i * angleSlice - Math.PI / 2;
                const x = centerX + pointRadius * Math.cos(angle);
                const y = centerY + pointRadius * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Collect label info if this dataset needs labels
                const isRed = 
                    dataset.borderColor === '#D32F2F' || 
                    dataset.borderColor === 'rgba(228, 25, 30, 1)' || 
                    dataset.borderColor === 'rgba(220, 38, 38, 1)' ||
                    (dataset.label && (dataset.label.includes('Shkodra') || dataset.label === 'Pikët' || dataset.label.includes('Nora')));
                
                const isYellow = dataset.borderColor === '#FFEB3B' || dataset.borderColor === '#FF9800' || (dataset.label && dataset.label.includes('Dr. Alban'));
                
                if (isRed || isYellow) {
                     axisLabels[i].push({
                         value: value,
                         originalValue: value,
                         angle: angle,
                         color: dataset.borderColor,
                         textColor: isYellow ? '#E65100' : dataset.borderColor,
                         isYellow: isYellow,
                         datasetLabel: dataset.label
                     });
                }
            });
            ctx.closePath();
            if (doFill) ctx.fill();
            ctx.stroke();
        });

        // --- GAP ANALYSIS (CREATIVE REQUEST) ---
        // Find Dr. Alban's dataset and the European Standard dataset
        const albanDataset = allDatasets.find(d => d.label.includes('Dr. Alban'));
        const europeDataset = allDatasets.find(d => d.label.includes('Standardi Evropian'));
        
        // Fixed capital requirements based on specific visual request
        const capitalRequirements = [
            "€150M", // Planifikimi Urban
            "€200M", // Shëndeti & Jeta Aktive
            "€25M",  // Sociologjia
            "€100M", // Ekonomia
            "€80M",  // Arsimi
            "€40M",  // Siguria
            "€120M"  // Konteksti Rajonal
        ];

        if (albanDataset && europeDataset) {
            ctx.save();
            albanDataset.data.forEach((val, i) => {
                const targetVal = europeDataset.data[i];
                // If there is a gap to close (target > current)
                if (targetVal > val) {
                    const angle = i * angleSlice - Math.PI / 2;
                    
                    // Start arrows slightly offset from the data point to avoid clutter
                    const bubbleRadiusSpace = 25 * zoomLevel; 
                    const startR = (val / 100) * radius;
                    const endR = (targetVal / 100) * radius;
                    
                    // Start arrow outside where the bubble usually sits
                    const arrowStartOffset = startR + bubbleRadiusSpace;
                    
                    const x1 = centerX + arrowStartOffset * Math.cos(angle); 
                    const y1 = centerY + arrowStartOffset * Math.sin(angle);
                    
                    const x2 = centerX + (endR - 5 * zoomLevel) * Math.cos(angle); // End slightly before target
                    const y2 = centerY + (endR - 5 * zoomLevel) * Math.sin(angle);

                    // Only draw arrow if there is meaningful space
                    if (endR > arrowStartOffset + (10 * zoomLevel)) {
                        // Draw Arrow Line
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.lineWidth = 1.5 * zoomLevel;
                        ctx.strokeStyle = '#ef4444'; // Red for alert/gap
                        ctx.setLineDash([4 * zoomLevel, 2 * zoomLevel]); // Dashed
                        ctx.stroke();
                        
                        // Arrowhead
                        const headLen = 10 * zoomLevel;
                        ctx.beginPath();
                        ctx.moveTo(x2, y2);
                        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
                        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
                        ctx.fillStyle = '#ef4444';
                        ctx.setLineDash([]);
                        ctx.fill();
                        
                        // Gap Value Label (Green Box)
                        const formattedCap = capitalRequirements[i] || "";
                        
                        // Draw Label Position
                        // Default midpoint (0.5).
                        // Shift 'Siguria' (index 5) and 'Konteksti Rajonal' (index 6) outwards to 80% to avoid clutter.
                        const isShifted = i === 5 || i === 6;
                        const labelRatio = isShifted ? 0.8 : 0.5;
                        const labelX = x1 + (x2 - x1) * labelRatio;
                        const labelY = y1 + (y2 - y1) * labelRatio;
                        
                        // Increase font size by 15%
                        const fontSize = 12 * zoomLevel * 1.15;
                        ctx.font = `bold ${fontSize}px monospace`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        // Label Background
                        const textMetrics = ctx.measureText(`${formattedCap}`);
                        const padding = 4 * zoomLevel;
                        
                        // Scale box size based on font increase
                        const boxHeight = 28 * zoomLevel * 1.15;
                        const boxTopOffset = 16 * zoomLevel * 1.15;
                        
                        // Green Background 80%
                        ctx.fillStyle = 'rgba(34, 197, 94, 0.9)'; 
                        ctx.fillRect(
                            labelX - textMetrics.width / 2 - padding, 
                            labelY - boxTopOffset, 
                            textMetrics.width + padding * 2, 
                            boxHeight
                        );
                        
                        // Euro Value - White
                        ctx.fillStyle = '#ffffff'; 
                        const textYOffset = 6 * zoomLevel * 1.15;
                        ctx.fillText(formattedCap, labelX, labelY - textYOffset);
                        
                        // "Invest." Label
                        const subFontSize = 9 * zoomLevel * 1.15;
                        ctx.font = `italic ${subFontSize}px sans-serif`;
                        ctx.fillStyle = '#f0fdf4'; // Light green/white
                        ctx.fillText("Invest.", labelX, labelY + textYOffset);
                    }
                }
            });
            ctx.restore();
        }

        // --- RENDER DISTRIBUTED SCORE LABELS ---
        // This logic prevents overlap by checking distance between bubbles on the same axis
        
        ctx.save();
        ctx.font = `bold ${16 * zoomLevel}px Helvetica`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const bubbleRadius = 15 * zoomLevel;
        const minSpacing = bubbleRadius * 2.2; // Minimum distance between centers

        axisLabels.forEach(labelsOnAxis => {
            if (labelsOnAxis.length === 0) return;
            // Sort by value ascending (from center outwards)
            labelsOnAxis.sort((a, b) => a.value - b.value);
            let previousRadiusPos = -1000;

            labelsOnAxis.forEach(lbl => {
                let currentRadiusPos = (lbl.value / 100) * radius;
                
                // Check collision with previous label on this axis
                if (currentRadiusPos < previousRadiusPos + minSpacing) {
                    // Push outwards
                    currentRadiusPos = previousRadiusPos + minSpacing;
                }
                
                // Update tracker
                previousRadiusPos = currentRadiusPos;
                
                const angle = lbl.angle;
                const x = centerX + currentRadiusPos * Math.cos(angle);
                const y = centerY + currentRadiusPos * Math.sin(angle);
                
                // Connector line (if shifted significantly from original point)
                const originalRadiusPos = (lbl.originalValue / 100) * radius;
                if (Math.abs(currentRadiusPos - originalRadiusPos) > 5 * zoomLevel) {
                    const ox = centerX + originalRadiusPos * Math.cos(angle);
                    const oy = centerY + originalRadiusPos * Math.sin(angle);
                    
                    ctx.beginPath();
                    ctx.moveTo(ox, oy);
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = lbl.color;
                    ctx.lineWidth = 1.5 * zoomLevel;
                    ctx.stroke();
                }
                
                // Bubble background
                ctx.beginPath();
                ctx.arc(x, y, bubbleRadius, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.fill();
                ctx.lineWidth = 2 * zoomLevel;
                ctx.strokeStyle = lbl.color;
                ctx.stroke();
                
                // Text Value
                ctx.fillStyle = lbl.textColor;
                ctx.fillText(Math.round(lbl.originalValue).toString(), x, y);
            });
        });
        ctx.restore();

        // --- RENDER AXIS LABELS (TEXT WRAPPING) ---
        ctx.font = `${16 * zoomLevel}px Helvetica`; 
        ctx.fillStyle = labelColor;
        ctx.textBaseline = 'middle';
        const lineHeight = 18 * zoomLevel;
        
        data.labels.forEach((label, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const labelRadius = radius + 40 * zoomLevel; 
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            
            const cosAngle = Math.cos(angle);
            if (Math.abs(cosAngle) < 0.1) {
                 ctx.textAlign = 'center';
            } else if (cosAngle > 0) {
                 ctx.textAlign = 'left';
            } else {
                 ctx.textAlign = 'right';
            }
            const maxWidth = (size / 2) - labelRadius + (20 * zoomLevel);
            wrapText(ctx, label, x, y, maxWidth > 100 * zoomLevel ? maxWidth : 140 * zoomLevel, lineHeight);
        });

    }, [data, zoomLevel]);

    if (!data) return null;

    return (
        <div className="relative w-full max-w-full mx-auto">
             <div className="absolute top-0 right-0 z-10 flex items-center space-x-1 p-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-bl-lg">
                <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Zoom In"
                >
                    <ZoomInIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Zoom Out"
                >
                    <ZoomOutIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                 <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Reset Zoom"
                >
                    <ArrowPathIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
            </div>
            <canvas ref={canvasRef} className="w-full h-auto"></canvas>
            <div className="mt-2 flex justify-center items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-mono border-b border-slate-200 dark:border-slate-700 pb-2 mb-2 w-3/4 mx-auto">
                <div className="flex items-center gap-1">
                    <span className="font-bold">0</span>
                    <span>= Dështim Kritik</span>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-50"></div>
                <div className="flex items-center gap-1">
                    <span className="font-bold">100</span>
                    <span>= Standardi BE</span>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                {data.datasets.map(dataset => (
                    <div key={dataset.label} className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: dataset.borderColor }}></span>
                        <span>{dataset.label}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    &copy; 2025 Dr Alban Gj. THIKA
                </p>
            </div>
        </div>
    );
};
