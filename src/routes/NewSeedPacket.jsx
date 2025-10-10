import classes from './NewSeedPacket.module.css';
import Modal from '../components/Modal';
import { Link, Form, redirect } from 'react-router-dom';

function NewSeedPacket() {
    return (
        <Modal>
            <Form method="post" className={classes.form}>
                <p>
                    <label htmlFor="seed_type">Type</label>
                    <input type="text" id="seed_type" name="seed_type"/>
                </p>
                <p>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required/>
                </p>
                <p>
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" name="company" required/>
                </p>
                <p>
                    <label htmlFor="year">Year</label>
                    <input type="text" id="year" name="year" required/>
                </p>
                <p>
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" rows={3}/>
                </p>
                <p>
                    <input type="hidden" id="is_empty" name="is_empty" value="false"/>
                </p>
                <p className={classes.actions}>
                    <Link to=".." type="button">Cancel</Link>
                    <button type="submit">Submit</button>
                </p>
            </Form>
        </Modal>
    );
}

export default NewSeedPacket;
export async function action({request}) {
    const formData = await request.formData();
    const seedPacketData = Object.fromEntries(formData);
    await fetch("http://localhost:3000/seed_packets", {method: "POST", body: JSON.stringify(seedPacketData), 
        headers: { "Content-Type": "application/json"}});
    return redirect('/seeds');
}