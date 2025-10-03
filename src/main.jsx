import React from 'react';
import ReactDOM from 'react-dom/client';
import SeedCollection, { loader as postLoader } from "./routes/SeedCollection";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import NewSeedPacket, { action as newSeedPacketAction} from "./routes/NewSeedPacket";
import App from "./routes/App";
import SeedPacketDetails, { loader as detailsLoader, action as updateSeedPacketAction } from "./routes/SeedPacketDetails";
import Nursery from "./routes/Nursery";
import Garden from "./routes/Garden";
import NewPlanting, { action as newPlantingAction} from "./routes/NewPlanting";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const router = createBrowserRouter([
  {path: "/", element:<App />, children: [
    {path: "/", element: <Garden />, children: [
      {path: "/planting", action: newPlantingAction, element: <NewPlanting />}
    ]},
    {path: "/nursery", element: <Nursery />},
    {path: "/seeds", element: <SeedCollection empty='false'/>, loader: postLoader, children: [
      {path: "/seeds/new", action: newSeedPacketAction, element: <NewSeedPacket />},
      {path: "/seeds/:id", loader: detailsLoader, action: updateSeedPacketAction, element: <SeedPacketDetails />}
    ]},
    {path: "/seeds/empty", element: <SeedCollection empty='true'/>, loader: postLoader, children: [
      {path: "/seeds/empty/:id", loader: detailsLoader, element: <SeedPacketDetails />}
    ]}
  ]}
  

]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
