import classes from './NewSeedPacket.module.css';
import Modal from '../components/Modal';
import { Link, Form, redirect, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";

function NewPlanting() {
    const location = useLocation();
    const squareId = location.state?.squareId;
    const [seedPackets, setSeedPackets] = useState([]);
    useEffect(() => {
        async function fetchSeeds() {
            const res = await fetch("http://localhost:3000/seed_packets");
            const data = await res.json();
            setSeedPackets(data);
        }
        fetchSeeds();
    }, []);

    return (
        <Modal>
            <Form method="post" className={classes.form}>
                <p>
                    <label htmlFor="seed_packet_id">Seed Packet</label>
                    <select id="seed_packet_id" name="seed_packet_id" required>
                        <option value="">-- Select a seed packet --</option>
                        {seedPackets.map((seed) => (
                            <option key={seed.id} value={seed.id}>
                                {seed.seed_type + " - " + seed.name}
                            </option>
                        ))}
                    </select>
                </p>
                <p>
                    <label htmlFor="num_sites">Num Sites</label>
                    <input type="number" id="num_sites" name="num_sites" required/>
                </p>
                <p>
                    <label htmlFor="seeds_per_site">Seeds Per Site</label>
                    <input type="number" id="seeds_per_site" name="seeds_per_site" required/>
                </p>
                <p>
                    <input type="hidden" id="sqaure_id" name="square_id" value={squareId}/>
                </p>
                <p className={classes.actions}>
                    <Link to=".." type="button">Cancel</Link>
                    <button type="submit">Submit</button>
                </p>
            </Form>
        </Modal>
    );
}

export default NewPlanting;
export async function action({request}) {
    const formData = await request.formData();
    const plantingData = Object.fromEntries(formData);
    await fetch("http://localhost:3000/plantings", {method: "POST", body: JSON.stringify(plantingData), 
        headers: { "Content-Type": "application/json"}});
    return redirect('/');
}