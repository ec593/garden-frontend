import SeedList from '../components/SeedList';
import { Outlet } from 'react-router-dom';

function SeedCollection() {

  return (
    <>
    <Outlet />
    <main>
        <SeedList/>
      </main>
    </>
  );
}

export default SeedCollection;
export async function loader({ request }) {
  const url = new URL(request.url);
  const response = await fetch("http://localhost:3000/seed_packets?empty=" + (url.pathname.endsWith("empty") ? "true" : "false"))
  const resData = await response.json();
  return resData;
}
