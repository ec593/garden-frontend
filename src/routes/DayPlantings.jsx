import { useLoaderData, Link } from 'react-router-dom';
import Modal from '../components/Modal';
import styles from './DayPlantings.module.css';

function DayPlantings() {
  const { plantings, date } = useLoaderData();

  if (!plantings || plantings.length === 0) {
    return (
      <Modal>
        <main className={styles.container}>
          <h2>No plantings found</h2>
          <p>No plantings found for {date}.</p>
          <p>
            <Link to="..">Close</Link>
          </p>
        </main>
      </Modal>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Modal>
      <main className={styles.container}>
        <h2>Plantings for {date}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Seed Packet</th>
              <th>Type</th>
              <th>Num Sites</th>
              <th>Seeds Per Site</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plantings.map((planting) => (
              <tr key={planting.id}>
                <td>{planting.seed_packet.name}</td>
                <td>{planting.seed_packet.seed_type}</td>
                <td>{planting.num_sites}</td>
                <td>{planting.seeds_per_site}</td>
                <td>{formatDate(planting.start)}</td>
                <td>{formatDate(planting.end)}</td>
                <td>
                  <Link 
                    to={`/calendar/planting/${planting.id}`}
                    className={styles.viewLink}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.actions}>
          <Link to=".." className={styles.closeButton}>Close</Link>
        </div>
      </main>
    </Modal>
  );
}

export default DayPlantings;

export async function loader({ request }) {
  const url = new URL(request.url);
  const day = url.searchParams.get('day');
  const month = url.searchParams.get('month');
  const year = url.searchParams.get('year');

  if (!day || !month || !year) {
    return { plantings: [], date: 'Invalid date' };
  }

  // Fetch all plantings
  const response = await fetch("http://localhost:3000/plantings");
  const allPlantings = await response.json();

  // Filter plantings for the selected day
  const targetDate = new Date(parseInt(year), parseInt(month), parseInt(day));
  const dayPlantings = allPlantings.filter(planting => {
    const startDate = new Date(planting.start);
    return startDate.getDate() === parseInt(day) && 
           startDate.getMonth() === parseInt(month) && 
           startDate.getFullYear() === parseInt(year);
  });

  const dateString = targetDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return { plantings: dayPlantings, date: dateString };
}

