import SeedList from '../components/SeedList';
import { Outlet } from 'react-router-dom';

function SeedCollection({ empty }) {

  return (
    <>
    <Outlet />
    <main>
        <SeedList empty={empty}/>
      </main>
    </>
  );
}

export default SeedCollection;
export async function loader() {
  const response = await fetch("http://localhost:3000/seed_packets")
  const resData = await response.json();
  console.log(resData);
  return resData;
}
