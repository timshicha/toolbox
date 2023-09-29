import { useRef, useState, useEffect } from "react";

const CANVAS_SIZE = 40;
const CELL_SIZE = 15;
const TOTAL_SIZE = CANVAS_SIZE * CELL_SIZE

class GateDrawer {

    // Default configurations for the gate drawer
    constructor(scale=1) {
        this.lineWidth = 4;
        this.scale = scale;
    }

    drawAndGate(context, power, x, y) {
        context.moveTo((x - 1) * this.scale, (y - 1) * this.scale);
        context.lineTo((x - 1) * this.scale, (y + 1) * this.scale);
        context.arc(x * this.scale, y * this.scale, this.scale, Math.PI / 2, 3 * Math.PI / 2, true);
        context.lineTo((x - 1) * this.scale, (y - 1) * this.scale);
        // If power, make the inside light up
        context.stroke();
    }

    drawOrGate(context, power, x, y) {
        context.arc((x - 2) * this.scale, y * this.scale, 1.5 * this.scale, 7 * Math.PI / 4 + 0.05, Math.PI / 4 - 0.05, false);
        context.arc(x * this.scale, y * this.scale, this.scale, Math.PI / 2, 3 * Math.PI / 2, true);
        context.lineTo((x - 1) * this.scale, (y - 1) * this.scale);
        // If power, make the inside light up
        context.stroke();
    }

    drawGate(gate, context, power, x, y, x2 = null, y2=null) {
        if (gate === 'AND') {
            this.drawAndGate(context, power, x, y);
        }
        if (gate === 'OR') {
            this.drawOrGate(context, power, x, y);
        }
    }
}

function LogicCircuit() {

    const visualCanvasRef = useRef();
    const hintCanvasRef = useRef();
    let clientX = 0;
    let clientY = 0;
    let toolInHand = 'AND';
    const gateDrawer = new GateDrawer(CELL_SIZE);

    useEffect(() => {
        // Detect if client moved their mouse
        hintCanvasRef.current.addEventListener("mousemove", event => handleCanvasMove(event));
        return () => {
            if (hintCanvasRef && hintCanvasRef.current) {
                hintCanvasRef.current.removeEventListener("mousemove", event => handleCanvasMove(event));
            }
        };
    }, []);

    function resetVisualCanvas() {
        // Clear the canvas
        const canvas = visualCanvasRef.current;
        const context = canvas.getContext('2d');
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

    // When the user moves in the canvas, update the coords
    function handleCanvasMove(event) {
        const canvasCoords = hintCanvasRef.current.getBoundingClientRect();

        // Round nearest reference: https://1loc.dev/math/round-a-number-to-the-nearest-multiple-of-a-given-value/
        function roundNearest(value, nearest) {
            return Math.round(value / nearest) * nearest;
        }
        // If the grid coords changed, update them
        const newX = parseInt(roundNearest(event.clientX - canvasCoords.left, CELL_SIZE) / CELL_SIZE);
        const newY = parseInt(roundNearest(event.clientY - canvasCoords.top, CELL_SIZE) / CELL_SIZE);

        // If the cell the user is selecting changed
        if (newX !== clientX || newY !== clientY) {
            console.log(newX, clientX);
            clientX = newX;
            console.log(newY, clientY);
            clientY = newY;

            updateHintCanvas();
        }
    }

    function updateHintCanvas() {
        const canvas = hintCanvasRef.current;
        const context = canvas.getContext('2d');
        // Clear hint canvas first
        context.reset();
        context.strokeStyle = '#FFFFFF';
        // Draw the necessary hint object

        gateDrawer.drawGate(toolInHand, context, 0, clientX, clientY);
    }

    function selectTool(tool) {
        toolInHand = tool;
    }

    return (
        <>
            <div className={"block h-[" + TOTAL_SIZE + "px]"}>
                <canvas ref={visualCanvasRef} className="absolute bg-black" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
                <canvas ref={hintCanvasRef} className="absolute" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
            </div>
            <button onClick={resetVisualCanvas}>Clear canvas</button>
            <button onClick={() => selectTool('AND')}>AND</button>
            <button onClick={() => selectTool('OR')}>OR</button>

        </>
    );
}

export { LogicCircuit };