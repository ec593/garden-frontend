import React from 'react';
import ReactDOM from 'react-dom/client';
import SeedCollection, { loader as postLoader } from "./routes/SeedCollection";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import NewSeedPacket, { action as newSeedPacketAction } from "./routes/NewSeedPacket";
import App from "./routes/App";
import SeedPacketDetails, { loader as detailsLoader, action as updateSeedPacketAction } from "./routes/SeedPacketDetails";
import Nursery from "./routes/Nursery";
import Garden from "./routes/Garden";
import NewPlanting, { action as newPlantingAction } from "./routes/NewPlanting";
import PlantingDetails, { loader as plantingLoader, action as updatePlantingAction } from "./routes/PlantingDetails";
import DayPlantings, { loader as dayPlantingsLoader } from "./routes/DayPlantings";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Calendar, { loader as calendarLoader } from "./routes/Calendar";

const router = createBrowserRouter([
  {path: "/", element:<App />, children: [
    {path: "/", element: <Garden />, children: [
      {path: "/planting", action: newPlantingAction, element: <NewPlanting />},
      {path: "/planting/:id", loader: plantingLoader, action: updatePlantingAction, element: <PlantingDetails />}
    ]},
    {path: "/nursery", element: <Nursery />},
    {path: "/seeds", element: <SeedCollection/>, loader: postLoader, children: [
      {path: "/seeds/new", action: newSeedPacketAction, element: <NewSeedPacket />},
      {path: "/seeds/:id", loader: detailsLoader, action: updateSeedPacketAction, element: <SeedPacketDetails />}
    ]},
    {path: "/seeds/empty", element: <SeedCollection/>, loader: postLoader, children: [//TODO CNVERT TO USE QUERY PARAM
      {path: "/seeds/empty/:id", loader: detailsLoader, element: <SeedPacketDetails />}
    ]},
    {path: "/calendar", element: <Calendar />, loader: calendarLoader, children: [
      {path: "/calendar/day", loader: dayPlantingsLoader, element: <DayPlantings />},
      {path: "/calendar/planting/:id", loader: plantingLoader, action: updatePlantingAction, element: <PlantingDetails />}
    ]}
  ]}
  

]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
