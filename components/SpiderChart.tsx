import React, { useEffect, useRef } from 'react';

interface SpiderChartDataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

interface SpiderChartProps {
    data: {
        labels: string[];
        datasets: SpiderChartDataset[];
    };
}

export const SpiderChart: React.FC<SpiderChartProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const baseSize = 400; // Base resolution

    useEffect(() => {
        if (!canvasRef.current || !data || !data.labels || data.labels.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = baseSize;
        canvas.width = size;
        canvas.height = size;
        
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = Math.min(centerX, centerY) * 0.7;
        const angleSlice = (Math.PI * 2) / data.labels.length;

        ctx.clearRect(0, 0, size, size);

        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const gridColor = isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)';
        const labelColor = isDarkMode ? '#94a3b8' : '#64748b';

        // Draw grid lines (spokes)
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < data.labels.length; i++) {
            const angle = i * angleSlice - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
            ctx.stroke();
        }
        
        // Draw grid polygons
        for (let i = 1; i <= 4; i++) { // 4 levels: 25, 50, 75, 100
             const currentRadius = (radius / 4) * i;
             ctx.beginPath();
             ctx.moveTo(centerX + currentRadius * Math.cos(-Math.PI / 2), centerY + currentRadius * Math.sin(-Math.PI / 2));
             for (let j = 1; j <= data.labels.length; j++) {
                 const angle = j * angleSlice - Math.PI / 2;
                 ctx.lineTo(centerX + currentRadius * Math.cos(angle), centerY + currentRadius * Math.sin(angle));
             }
             ctx.closePath();
             ctx.stroke();
        }

        // --- RENDER DATASETS ---
        data.datasets.forEach(dataset => {
            ctx.strokeStyle = dataset.borderColor;
            ctx.fillStyle = dataset.backgroundColor;
            ctx.lineWidth = dataset.borderWidth;
            ctx.beginPath();
            dataset.data.forEach((value, i) => {
                const pointRadius = (value / 100) * radius; // value is 0-100
                const angle = i * angleSlice - Math.PI / 2;
                const x = centerX + pointRadius * Math.cos(angle);
                const y = centerY + pointRadius * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        // Draw labels
        ctx.font = `12px Helvetica`;
        ctx.fillStyle = labelColor;
        ctx.textBaseline = 'middle';
        
        data.labels.forEach((label, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const labelRadius = radius + 15;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            
            const cosAngle = Math.cos(angle);
            if (Math.abs(cosAngle) < 0.1) ctx.textAlign = 'center';
            else if (cosAngle > 0) ctx.textAlign = 'left';
            else ctx.textAlign = 'right';
            
            ctx.fillText(label, x, y);
        });

    }, [data, baseSize]);

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <canvas ref={canvasRef} className="w-full h-auto"></canvas>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                {data.datasets.map(dataset => (
                    <div key={dataset.label} className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: dataset.borderColor }}></span>
                        <span>{dataset.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
