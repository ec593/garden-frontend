
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMemo } from "react";
import classes from './MainHeader.module.css';

function MainHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date");

  function toDateTimeLocalString(date = new Date()) { //TODO MAKE UTIL (REACT CONTEXT?)
    const pad = (n) => String(n).padStart(2, "0");
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const selectedDate = useMemo(() => {
    if (dateParam) {
      const localDate = new Date(dateParam);
      return toDateTimeLocalString(localDate);
    } else {
      return toDateTimeLocalString();
    }
  }, [dateParam]);

  const handleDateChange = (e) => {
    if (e.target.value) {
      const localDate = new Date(e.target.value);
      const utcISOString = localDate.toISOString();
      navigate(`?date=${utcISOString}`);
    } else {
      navigate("/");
    }
  };

    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/"><img className={classes.mainImg} src="/src/assets/images/vegetables.png" alt="vegetables" /></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Garden</a>
              </li>
              <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/nursery">Nursery</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Seed Collection
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/seeds">View Current Seed Packets</a></li>
                  <li><a className="dropdown-item" href="/seeds/empty">View Empty Seed Packets</a></li>
                  <li><Link to="/seeds/new" className="dropdown-item" href="/seeds/new">Add New Seed Packet</Link></li>
                </ul>
              </li>
              <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/calendar">Calendar</a>
              </li>
            </ul>
          </div>
          <div>
            Garden as of: <input type="datetime-local" onChange={handleDateChange} value={selectedDate}></input>
          </div>
        </div>
      </nav>
    );
  }
  

export default MainHeader;