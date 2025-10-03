import { useLoaderData, Link, Form, redirect } from 'react-router-dom';
import Modal from '../components/Modal';
import classes from './SeedPacketDetails.module.css';

function SeedPacketDetails() {
  const seedPacket = useLoaderData();

  if (!seedPacket) {
    return (
      <Modal>
        <main className={classes.details}>
          <h1>Could not find seed packet</h1>
          <p>Unfortunately, the requested seed packet could not be found.</p>
          <p>
            <Link to="..">
              Okay
            </Link>
          </p>
        </main>
      </Modal>
    );
  }
  return (
    <Modal>
      <Form method="post">
                <p>
                    <input type="hidden" id="id" name="id" value={seedPacket.id}/>
                </p>
                <p>
                    <label htmlFor="seed_type">Type</label>
                    <input type="text" id="seed_type" name="seed_type" required defaultValue={seedPacket.seed_type}/>
                </p>
                <p>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required defaultValue={seedPacket.name}/>
                </p>
                <p>
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" name="company" required defaultValue={seedPacket.company}/>
                </p>
                <p>
                    <label htmlFor="year">Year</label>
                    <input type="text" id="year" name="year" required defaultValue={seedPacket.year}/>
                </p>
                <p>
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" rows={3} defaultValue={seedPacket.notes}/>
                </p>
                <p>
                    <label htmlFor="empty">Empty</label>
                    <input type="checkbox" id="empty" name="empty" defaultValue={seedPacket.isEmpty}/>
                </p>
                <p>
                    <Link to=".." type="button">Cancel</Link>
                    <button type="submit" name="_action" value="update">Update</button>
                    <button type="submit" name="_action" value="delete">Delete</button>
                </p>
            </Form>
    </Modal>
  );
}

export default SeedPacketDetails;
export async function loader({params}) {
    const response = await fetch("http://localhost:3000/seed_packets/" + params.id)
    const resData = await response.json();
    console.log(resData)
    return resData;
}
export async function action({request}) {
  const formData = await request.formData();
  if (formData.get("_action") == 'delete') {
    await fetch("http://localhost:3000/seed_packets/" + formData.get("id"), {method: "DELETE"});
  } else if (formData.get("_action") === 'update') {
    formData.delete("_action");
    const seedPacketData = Object.fromEntries(formData);
    await fetch("http://localhost:3000/seed_packets/" + seedPacketData.id, {method: "PUT", body: JSON.stringify(seedPacketData), 
        headers: { "Content-Type": "application/json"}});
  }
  return redirect('/seeds');
}