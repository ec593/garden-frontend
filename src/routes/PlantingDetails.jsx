import { useLoaderData, Link, Form, redirect } from 'react-router-dom';
import Modal from '../components/Modal';
import classes from './SeedPacketDetails.module.css';

function PlantingDetails() {
  const planting = useLoaderData();

  if (!planting) {
    return (
      <Modal>
        <main className={classes.details}>
          <h1>Could not find planting</h1>
          <p>Unfortunately, the requested planting could not be found.</p>
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
                    <input type="hidden" id="id" name="id" value={planting.id}/>
                </p>
                <p>
                    <input type="hidden" id="square_id" name="square_id" value={planting.square_id}/>
                </p>
                <p>
                    <input type="hidden" id="num_squares" name="num_squares" value={planting.num_squares}/>
                </p>
                <p>
                    <input type="hidden" id="seed_packet_id" name="seed_packet_id" value={planting.seed_packet_id}/>
                </p>
                <p>
                  <label>//TODO NEED SEED NAME AND TYPE</label>
                </p>
                <p>
                    <label htmlFor="num_sites">Num Sites</label>
                    <input type="number" id="num_sites" name="num_sites" required defaultValue={planting.num_sites}/>
                </p>
                <p>
                    <label htmlFor="seeds_per_site">Seeds Per Site</label>
                    <input type="number" id="seeds_per_site" name="seeds_per_site" required defaultValue={planting.seeds_per_site}/>
                </p>
                <p>
                    <label htmlFor="start">Start</label>
                    <input type="date" id="start" name="start" required defaultValue={planting.start}/>
                </p>
                <p>
                    <label htmlFor="end">End</label>
                    <input type="date" id="end" name="end" defaultValue={planting.end}/>
                </p>
                <p>
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" rows={3} defaultValue={planting.notes}/>
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

export default PlantingDetails;
export async function loader({params}) {
    const response = await fetch("http://localhost:3000/plantings/" + params.id)
    const resData = await response.json();
    return resData;
}
export async function action({request}) {
  const formData = await request.formData();
  if (formData.get("_action") == 'delete') {
    await fetch("http://localhost:3000/plantings/" + formData.get("id"), {method: "DELETE"});
  } else if (formData.get("_action") === 'update') {
    formData.delete("_action");
    const plantingData = Object.fromEntries(formData);
    await fetch("http://localhost:3000/plantings/" + seedPacketData.id, {method: "PUT", body: JSON.stringify(plantingData), 
        headers: { "Content-Type": "application/json"}});
  }
  return redirect('../');
}