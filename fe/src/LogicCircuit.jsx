import { useRef } from "react";

const CANVAS_SIZE = 40;
const CELL_SIZE = 15;

function LogicCircuit() {

    const visualCanvasRef = useRef();

    function resetVisualCanvas() {
        // Clear the canvas
        const canvas = visualCanvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.reset();
        context.beginPath();
        // Draw the horitonal lines
        for (let i = 0; i <= CANVAS_SIZE; i++) {
            context.moveTo(0, i * CELL_SIZE);
            context.lineTo(CANVAS_SIZE * CELL_SIZE, i * CELL_SIZE);
        }
        // Draw the vertical lines
        for (let i = 0; i <= CANVAS_SIZE; i++) {
            context.moveTo(i * CELL_SIZE, 0);
            context.lineTo(i * CELL_SIZE, CANVAS_SIZE * CELL_SIZE);
        }
        context.strokeStyle = "#FFFFFF";
        context.lineWidth = 0.2;
        context.stroke();
    }

    return (
        <>
            <button onClick={resetVisualCanvas}>Clear canvas</button>
            <div className="relative block">
                <canvas ref={visualCanvasRef}  className="absolute bg-black" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
            </div>
    </>
    );
}

export { LogicCircuit };