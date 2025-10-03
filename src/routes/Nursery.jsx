import { Outlet } from 'react-router-dom';

function Nursery() {
    return (
      <>
        <Outlet />
        <h2>Seed trays will go here!</h2>
      </>
    );
}
  
export default Nursery;