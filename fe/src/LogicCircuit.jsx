import { useRef, useEffect } from "react";
import { LogicCircuitBoard } from "./utilities/LogicCircuitBoard";

const CANVAS_SIZE = 40;
const CELL_SIZE = 15;
const TOTAL_SIZE = CANVAS_SIZE * CELL_SIZE

class GateDrawer {
    
    // Configure the gate drawer (colors, width)
    constructor(scale=null, gateStrokeColor=null, gateFillColor=null, wireColor=null, powerColor=null) {
        // Set default colors if colors not chosen
        scale ? this.scale = scale : this.scale = CELL_SIZE;
        gateStrokeColor ? this.gateStrokeColor = gateStrokeColor : this.gateStrokeColor = '#FFFFFF';
        gateFillColor ? this.gateFillColor = gateFillColor : this.gateFillColor = '#444444';
        wireColor ? this.wireColor = wireColor : this.wireColor = '#004C99';
        powerColor ? this.powerColor = powerColor : this.powerColor = '#777700';
    }

    drawAndGate(context, x, y) {
        context.beginPath();
        context.moveTo((x - 1) * this.scale, (y - 1) * this.scale);
        context.lineTo((x - 1) * this.scale, (y + 1) * this.scale);
        context.arc(x * this.scale, y * this.scale, this.scale, Math.PI / 2, 3 * Math.PI / 2, true);
        context.lineTo((x - 1) * this.scale, (y - 1) * this.scale);
        context.fill();
        context.stroke();
    }

    drawOrGate(context, x, y) {
        context.beginPath();
        context.arc((x - 2) * this.scale, y * this.scale, 1.5 * this.scale, 7 * Math.PI / 4 + 0.05, Math.PI / 4 - 0.05, false);
        context.arc(x * this.scale, y * this.scale, this.scale, Math.PI / 2, 3 * Math.PI / 2, true);
        context.lineTo((x - 1) * this.scale, (y - 1) * this.scale);
        context.fill();
        context.stroke();
    }

    drawNotGate(context, x, y) {
        // Draw the triangle of the NOT gate
        context.beginPath();
        context.moveTo((x + 1 / 3) * this.scale, y * this.scale);
        context.lineTo((x - 1) * this.scale, (y - 1) * this.scale);
        context.lineTo((x - 1) * this.scale, (y + 1) * this.scale);
        context.closePath();
        context.fill();
        context.stroke();
        // Draw the circle of the NOT gate
        context.beginPath();
        context.arc((x + 2/3) * this.scale, y * this.scale, 1 / 3 * this.scale, Math.PI, 4 * Math.PI, false);
        context.closePath();
        context.fill();
        context.stroke();
    }

    drawGate(gate, context, power, x, y, x2 = null, y2 = null) {
        // Select proper fill color
        if (power) context.fillStyle = this.powerColor;
        else context.fillStyle = this.gateFillColor;
        // Select proper stroke color
        context.strokeStyle = this.gateStrokeColor;

        if (gate === 'AND') {
            this.drawAndGate(context, x, y);
        }
        else if (gate === 'OR') {
            this.drawOrGate(context, x, y);
        }
        else if (gate === 'NOT') {
            this.drawNotGate(context, x, y);
        }
    }
}

class GridDrawer {
    
    // Congifure the grid drawer
    constructor(lineWidth=1, color="#444444") {
        this.lineWidth = lineWidth;
        this.color = color;
    }

    resetGrid(context) {
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
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.stroke();
    }
}

function LogicCircuit() {

    const gridCanvasRef = useRef();
    const mainCanvasRef = useRef();
    const hintCanvasRef = useRef();
    let clientX = 0;
    let clientY = 0;
    let toolInHand = 'AND';
    const gridDrawer = new GridDrawer();
    const mainGateDrawer = new GateDrawer();
    const hintGateDrawer = new GateDrawer(CELL_SIZE, '#444444AA', '#444444AA', '#003C89AA');
    const circuitLogicBoard = new LogicCircuitBoard(CANVAS_SIZE);

    useEffect(() => {
        resetGridCanvas();
        // Detect if client moved their mouse
        hintCanvasRef.current.addEventListener("mousemove", event => handleCanvasMove(event));
        hintCanvasRef.current.addEventListener("mousedown", handleCanvasClick);
        return () => {
            if (hintCanvasRef && hintCanvasRef.current) {
                hintCanvasRef.current.removeEventListener("mousemove", event => handleCanvasMove(event));
                hintCanvasRef.current.removeEventListener("mousedown", handleCanvasClick);
            }
        };
    }, []);

    function resetMainCanvas() {
        // Clear the canvas
    }

    function resetGridCanvas() {
        gridDrawer.resetGrid(gridCanvasRef.current.getContext('2d'));
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
            // console.log(newX, clientX);
            clientX = newX;
            // console.log(newY, clientY);
            clientY = newY;

            updateHintCanvas();
        }
    }

    // When the user clicks in the canvas
    function handleCanvasClick() {
        let newGate = circuitLogicBoard.addGate(toolInHand, clientX, clientY);
        const context = mainCanvasRef.current.getContext('2d');
        if (newGate) {
            mainGateDrawer.drawGate(toolInHand, context, 0, clientX, clientY);
            hintCanvasRef.current.getContext('2d').reset();
        }
        else {
            console.log("Bad gate or wire placement");
        }
    }

    function updateHintCanvas() {
        const canvas = hintCanvasRef.current;
        const context = canvas.getContext('2d');
        // Clear hint canvas first
        context.reset();
        // Draw the necessary hint object
        hintGateDrawer.drawGate(toolInHand, context, 0, clientX, clientY);
    }

    function selectTool(tool) {
        toolInHand = tool;
    }

    return (
        <>
            <div className={"block h-[" + TOTAL_SIZE + "px]"}>
                <canvas ref={gridCanvasRef} className="absolute bg-black" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
                <canvas ref={mainCanvasRef} className="absolute" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
                <canvas ref={hintCanvasRef} className="absolute" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
            </div>
            <button onClick={resetMainCanvas}>Clear canvas</button>
            <button onClick={() => selectTool('AND')}>AND</button>
            <button onClick={() => selectTool('OR')}>OR</button>
            <button onClick={() => selectTool('NOT')}>NOT</button>

        </>
    );
}

export { LogicCircuit };