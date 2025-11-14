import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './Calendar.module.css';

function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const plantings = useLoaderData();
  const navigate = useNavigate();
  console.log(plantings);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const hasPlantingOnDay = (day, month, year) => {
    if (!plantings) return false;
    
    return plantings.some(planting => {
      const startDate = new Date(planting.start);
      return startDate.getDate() === day && 
             startDate.getMonth() === month && 
             startDate.getFullYear() === year;
    });
  };

  const handleDayClick = (day, month, year) => {
    const hasPlanting = hasPlantingOnDay(day, month, year);
    if (hasPlanting) {
      navigate(`/calendar/day?day=${day}&month=${month}&year=${year}`);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles['calendar-day']} ${styles.empty}`}></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === new Date().getDate() && 
        selectedMonth === new Date().getMonth() && 
        selectedYear === new Date().getFullYear();
      
      const hasPlanting = hasPlantingOnDay(day, selectedMonth, selectedYear);
      
      days.push(
        <div 
          key={day} 
          className={`${styles['calendar-day']} ${isToday ? styles.today : ''} ${hasPlanting ? styles.clickable : ''}`}
          onClick={() => handleDayClick(day, selectedMonth, selectedYear)}
        >
          <div className={styles.dayNumber}>{day}</div>
          {hasPlanting && <div className={styles.plantingDot}></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <>
    <Outlet />
    <main className={styles['calendar-container']}>
      <div className={styles['calendar-header']}>
        <div className={styles['calendar-controls']}>
          <button 
            onClick={handlePreviousMonth}
            className={styles['nav-arrow']}
            aria-label="Previous month"
          >
            ◀
          </button>
          
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className={styles['month-selector']}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={styles['year-selector']}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleNextMonth}
            className={styles['nav-arrow']}
            aria-label="Next month"
          >
            ▶
          </button>
        </div>
      </div>

      <div className={styles['calendar-grid']}>
        <div className={styles['calendar-weekdays']}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={styles.weekday}>{day}</div>
          ))}
        </div>
        
        <div className={styles['calendar-days']}>
          {renderCalendar()}
        </div>
      </div>
    </main>
    </>
  );
}

export default Calendar;
export async function loader() {
  const response = await fetch("http://localhost:3000/plantings")
  const resData = await response.json();
  return resData;
}
