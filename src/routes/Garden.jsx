import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

//TODO FIX MOVE AND DELETE BED

function Garden() {
  const [savedBeds, setSavedBeds] = useState([]);
  const [newBed, setNewBed] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetBedId: null,
    targetSquareId: null
  });
  const SQUARE_SIZE = 40;
  const navigate = useNavigate();
  const location = useLocation();

  async function fetchBeds() {
    console.log("fetch beds!")
    const res = await fetch("http://localhost:3000/beds");
    if (!res.ok) {
      throw new Error(`Failed to fetch beds: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error(`Expected an array but got: ${JSON.stringify(data)}`);
    }

    setSavedBeds(data.map(b => ({ ...b, id: String(b.id) })));
  }

  useEffect(() => {
    fetchBeds();
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, targetBedId: null, targetSquareId: null });
      }
    };
  
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu.visible]);

  const drawGridDots = (width, height) => {
    const dots = [];
  
    for (let x = 0; x < width; x += SQUARE_SIZE) {
      for (let y = 0; y < height; y += SQUARE_SIZE) {
        dots.push(
          <Circle
            key={`dot-${x}-${y}`}
            x={x}
            y={y}
            radius={1.5}
            fill="#9e9c9b"
          />
        );
      }
    }
  
    return dots;
  };

  function getPlantingSites(bed, squareX, squareY, numSites) {
    const cols = Math.ceil(Math.sqrt(numSites));
    const rows = Math.ceil(numSites / cols);
  
    const spacingX = SQUARE_SIZE / cols;
    const spacingY = SQUARE_SIZE / rows;
  
    const offsetX = (SQUARE_SIZE - (spacingX * cols)) / 2;
    const offsetY = (SQUARE_SIZE - (spacingY * rows)) / 2;
  
    const sites = [];
  
    let count = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (count >= numSites) break;
  
        const x = bed.x + squareX * SQUARE_SIZE + offsetX + col * spacingX + spacingX / 2;
        const y = bed.y + squareY * SQUARE_SIZE + offsetY + row * spacingY + spacingY / 2;
  
        sites.push({ x, y });
        count++;
      }
    }
  
    return sites;
  }

  const handleMouseDown = (e) => {
    console.log("target", e.target)
    const stage = e.target.getStage();
    if (e.target !== stage) {
      return;
    }
    const pointerPos = stage.getPointerPosition();
    setNewBed({
      x: snapToGrid(pointerPos.x),
      y: snapToGrid(pointerPos.y),
      width: 0,
      height: 0,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const x2 = snapToGrid(pointerPos.x);
    const y2 = snapToGrid(pointerPos.y);
    const width = x2 - newBed.x;
    const height = y2 - newBed.y;

    setNewBed({
      ...newBed,
      width,
      height,
    });
  };

  const handleMouseUp = async () => {
    if (newBed && Math.abs(newBed.width) >= SQUARE_SIZE && Math.abs(newBed.height) >= SQUARE_SIZE) {
      const res = await fetch("http://localhost:3000/beds", {method: "POST", body: JSON.stringify(newBed), 
        headers: { "Content-Type": "application/json"}});
      const savedBed = await res.json();
      setSavedBeds(prev => [...prev, { ...savedBed, id: String(savedBed.id) }]);
    }
    setIsDrawing(false);
    setNewBed(null);
  };

  const handleDragEnd = async (e, id) => {
    const bed = savedBeds.find((b) => b.id === id);
    const x = snapToGrid(Math.max(0, Math.min(e.target.x(), window.innerWidth - bed.width)));
    const y = snapToGrid(Math.max(0, Math.min(e.target.y(), window.innerHeight - 90 - bed.height)));
    await fetch("http://localhost:3000/beds/" + bed.id, {method: "PATCH", body: JSON.stringify({x: x, y: y}),
        headers: { "Content-Type": "application/json"}});
    setNewBed(null);
    await fetchBeds();
  };

  const snapToGrid = (value) => {
    return Math.round(value / SQUARE_SIZE) * SQUARE_SIZE;
  };

  return (
    <>
      <Outlet />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 90}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: "#f5f5f5" }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
      >
        <Layer>
          {drawGridDots(window.innerWidth, window.innerHeight - 90)}
        </Layer>
        <Layer>
        {savedBeds.map((b) => (
          <React.Fragment key={b.id}>
            <Rect
              {...b}
              fill="#75432a"
              draggable
              onDragEnd={(e) => handleDragEnd(e, b.id)}
              dragBoundFunc={(pos) => {
                const x = snapToGrid(Math.max(0, Math.min(pos.x, window.innerWidth - b.width)));
                const y = snapToGrid(Math.max(0, Math.min(pos.y, window.innerHeight - 90 - b.height)));
                return { x, y };
              }}
              onContextMenu={(e) => {
                e.evt.preventDefault();
                setContextMenu({
                  visible: true,
                  x: e.evt.clientX,
                  y: e.evt.clientY,
                  targetBedId: b.id,
                  targetSquareId: null
                });
              }}
            />

            {b.squares?.map((sq) => {
              const planting = sq.planting;
              const sites = planting ? getPlantingSites(b, sq.x, sq.y, planting.num_sites) : [];

              return (
                <React.Fragment key={sq.id}>
                  <Rect
                    x={b.x + sq.x * SQUARE_SIZE}
                    y={b.y + sq.y * SQUARE_SIZE}
                    width={SQUARE_SIZE}
                    height={SQUARE_SIZE}
                    fill="transparent"
                    //listening={false}
                    onContextMenu={(e) => {
                      e.evt.preventDefault();
                      setContextMenu({
                        visible: true,
                        x: e.evt.clientX,
                        y: e.evt.clientY,
                        targetBedId: b.id,
                        targetSquareId: sq.id,
                      });
                    }}
                  />
                  {sites.map((pos, index) => (
                    <Circle
                      key={`${sq.id}-site-${index}`}
                      x={pos.x}
                      y={pos.y}
                      radius={4}
                      fill="green"
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}

          {isDrawing && newBed && (
            <Rect
              {...newBed}
              fill="#8a5337"
              stroke="#75432a"
              strokeWidth={1}
            />
          )}
        </Layer>
      </Stage>
      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            background: "white",
            border: "1px solid #ccc",
            padding: "5px 10px",
            borderRadius: "4px",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}>
            <div onClick={async () => {
              console.log("contextmenu", contextMenu)
              await fetch("http://localhost:3000/beds/" + contextMenu.targetBedId, {method: "DELETE"});
              setSavedBeds(savedBeds.filter((b) => b.id !== contextMenu.targetBedId));
              setContextMenu({ visible: false, x: 0, y: 0, targetBedId: null, targetSquareId: null });
              }}>Delete This Bed
            </div>
            <div onClick={() => {
              console.log("contextmenu", contextMenu)
              navigate("/planting", { state: { squareId: contextMenu.targetSquareId } });
              setContextMenu({ visible: false, x: 0, y: 0, targetBedId: null, targetSquareId: null });
              }}>Add New Planting
            </div>
        </div>
      )}
    </>
  );
}
  
export default Garden;