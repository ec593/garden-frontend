import classes from './SeedPacket.module.css';
import { Link } from 'react-router-dom';
import { MdOutlineHideSource } from "react-icons/md";

function SeedPacket({ id, seed_type, name, company, year, notes, isEmpty }) {
    const iconLocation = "src/assets/icons/" + seed_type.toLowerCase() + ".png";
    return (
        <Link to={"/seeds/" + id}>
            <div className="card" style={{width: 18 + 'rem'}}>
                <img src={iconLocation} className="card-img-top" alt="" style={{width: 8 + 'rem', alignSelf: 'center'}}/>
                <div className="card-header">
                    <p style={{marginBottom: 0 + 'px'}}>{seed_type}: {name}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">{company}, {year}</li>
                    {notes && <li className="list-group-item">Notes: {notes}</li>}
                </ul>
            </div>
        </Link>);
}

export default SeedPacket;
