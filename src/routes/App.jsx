import MainHeader from "../components/MainHeader"
import { Outlet } from 'react-router-dom'

function App() {
    return (
        <>
            <MainHeader />
            <Outlet />
        </>
    );
}

export default App;