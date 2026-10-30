import React, { useEffect, useRef } from 'react';
import { TranslatedParagonEntry } from '../types';

interface MiniRadarChartProps {
    analysisData?: TranslatedParagonEntry[];   // made optional/safe
    size: number;
}

/**
 * Helper: wrap text safely for canvas rendering.
 */
function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
) {
    if (!text) return;

    const words = text.split(/[\s-]+/);
    if (!words.length) return;

    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n];
        if (n < words.length - 1) testLine += ' ';
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

    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}


export const MiniRadarChart: React.FC<MiniRadarChartProps> = ({ analysisData = [], size }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- SAFETY: Guard against missing/empty data to avoid crashes ---
        const safeData = Array.isArray(analysisData)
            ? analysisData.filter((d) => d && typeof d.score === 'number')
            : [];

        if (safeData.length === 0) {
            // Draw a simple empty placeholder
            canvas.width = size;
            canvas.height = size;
            ctx.clearRect(0, 0, size, size);

            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Pa të dhëna', size / 2, size / 2);
            return;
        }

        // --- Continue normally because data is safe now ---
        canvas.width = size;
        canvas.height = size;
        
        const centerX = size / 2;
        const centerY = size / 2;
        const numLabels = safeData.length;
        const radius = size * 0.28;
        const angleSlice = (Math.PI * 2) / numLabels;

        ctx.clearRect(0, 0, size, size);

        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const gridColor = isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)';
        const axesColor = isDarkMode ? 'rgba(100, 116, 139, 0.5)' : 'rgba(203, 213, 225, 0.8)';
        const labelColor = isDarkMode ? '#94a3b8' : '#64748b';

        // Grid circles
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        [0.5, 1].forEach((level) => {
            const currentRadius = radius * level;
            ctx.beginPath();
            ctx.moveTo(
                centerX + currentRadius * Math.cos(-Math.PI / 2),
                centerY + currentRadius * Math.sin(-Math.PI / 2)
            );
            for (let i = 1; i <= numLabels; i++) {
                const angle = i * angleSlice - Math.PI / 2;
                ctx.lineTo(
                    centerX + currentRadius * Math.cos(angle),
                    centerY + currentRadius * Math.sin(angle)
                );
            }
            ctx.closePath();
            ctx.stroke();
        });

        // Axes
        ctx.strokeStyle = axesColor;
        safeData.forEach((_, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
            ctx.stroke();
        });

        // Data polygon
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.8)';
        ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        safeData.forEach((entry, i) => {
            const score = typeof entry.score === 'number' ? entry.score : 0;
            const pointRadius = (score / 100) * radius;
            const angle = i * angleSlice - Math.PI / 2;
            const x = centerX + pointRadius * Math.cos(angle);
            const y = centerY + pointRadius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Labels
        ctx.font = `bold 8px sans-serif`;
        ctx.fillStyle = labelColor;
        ctx.textBaseline = 'middle';

        const lineHeight = 10;

        safeData.forEach((entry, i) => {
            const label = entry.dimension || 'Pa emër';
            const angle = i * angleSlice - Math.PI / 2;
            const labelRadius = radius + 25;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);

            const cosAngle = Math.cos(angle);
            if (Math.abs(cosAngle) < 0.1) ctx.textAlign = 'center';
            else if (cosAngle > 0) ctx.textAlign = 'left';
            else ctx.textAlign = 'right';

            wrapText(ctx, label, x, y, size * 0.2, lineHeight);
        });

    }, [analysisData, size]);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <canvas ref={canvasRef} />
        </div>
    );
};
