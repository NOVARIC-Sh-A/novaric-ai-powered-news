import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarProps {
    onDateSelect: (date: Date) => void;
    selectedDate: Date | null;
    newsDates: Set<string>; // Expects 'YYYY-MM-DD' format for efficient lookup
}

const formatDateToYyyyMmDd = (date: Date): string => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Normalize date to prevent timezone issues
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

export const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate, newsDates }) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const renderHeader = () => {
        const monthFormat = new Intl.DateTimeFormat('sq-AL', { month: 'long', year: 'numeric' });
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" aria-label="Muaji i kaluar">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {monthFormat.format(currentMonth)}
                </h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" aria-label="Muaji i ardhshëm">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const daysOfWeek = ['Hë', 'Ma', 'Më', 'En', 'Pr', 'Sh', 'Di'];
        return (
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        const dayOfWeek = monthStart.getDay();
        const startDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - startDayIndex);

        const cells = [];
        let day = new Date(startDate);
        
        for (let i = 0; i < 42; i++) { // Render 6 weeks for a consistent grid size
            const formattedDate = formatDateToYyyyMmDd(day);
            const isToday = formattedDate === formatDateToYyyyMmDd(new Date());
            const isSelected = selectedDate ? formattedDate === formatDateToYyyyMmDd(selectedDate) : false;
            const hasNews = newsDates.has(formattedDate);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

            let cellClasses = 'w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors relative ';

            if (!isCurrentMonth) {
                cellClasses += 'text-slate-400 dark:text-slate-500 cursor-not-allowed';
            } else {
                if (isSelected) {
                    cellClasses += 'bg-primary-600 text-white font-bold ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-slate-800';
                } else if (isToday) {
                    cellClasses += 'bg-slate-200 dark:bg-slate-600 font-semibold';
                }
                
                if (isCurrentMonth) {
                    cellClasses += ' hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer';
                }
            }


            cells.push(
                <div key={day.toString()} className="flex justify-center items-center p-0.5">
                    <button
                        onClick={() => isCurrentMonth && onDateSelect(new Date(day))}
                        disabled={!isCurrentMonth}
                        className={cellClasses}
                        aria-label={`Zgjidh datën ${day.toLocaleDateString()}${hasNews ? ' (ka lajme)' : ''}`}
                        aria-pressed={isSelected}
                    >
                        {day.getDate()}
                        {hasNews && <span className="absolute bottom-1 w-1.5 h-1.5 bg-primary-500 rounded-full"></span>}
                    </button>
                </div>
            );
            day.setDate(day.getDate() + 1);
        }

        return <div className="grid grid-cols-7 gap-y-1 mt-2">{cells}</div>;
    };


    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-sm">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};