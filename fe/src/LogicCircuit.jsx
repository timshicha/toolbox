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
        wireColor ? this.wireColor = wireColor : this.wireColor = '#003C89';
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

    drawWire(context, x, y, x2, y2) {
        context.strokeStyle = this.wireColor;
        context.fillStyle = this.wireColor;
        context.beginPath();
        context.moveTo(x * this.scale, y * this.scale);
        context.arc(x * this.scale, y * this.scale, 1 / 8 * CELL_SIZE, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
        context.beginPath();
        context.moveTo(x * CELL_SIZE, y * CELL_SIZE);
        context.lineTo(x2 * CELL_SIZE, y2 * CELL_SIZE);
        context.stroke();
        context.fill();
        context.beginPath();
        context.arc(x2 * CELL_SIZE, y2 * CELL_SIZE, 1 / 8 * CELL_SIZE, 0, 2 * Math.PI);
        context.lineTo(x2 * CELL_SIZE, y2 * CELL_SIZE);
        context.stroke();
        context.fill();
    }

    drawGate(gate, context, power, x, y, x2 = null, y2 = null) {
        // Select proper fill color
        if (power) context.fillStyle = this.powerColor;
        else context.fillStyle = this.gateFillColor;
        // Select proper stroke color
        context.strokeStyle = this.gateStrokeColor;
        context.lineWidth = 2;

        if (gate === 'AND') {
            this.drawAndGate(context, x, y);
        }
        else if (gate === 'OR') {
            this.drawOrGate(context, x, y);
        }
        else if (gate === 'NOT') {
            this.drawNotGate(context, x, y);
        }
        else if (gate === 'wire') {
            // If wire start specified, draw wire
            if (x2 !== null && y2 !== null) {
                this.drawWire(context, x, y, x2, y2);
            }
            // If no wire start, just draw a dot
            else {
                this.drawWire(context, x, y, x, y);
            }
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
    let wireStartX = null;
    let wireStartY = null;
    const gridDrawer = new GridDrawer();
    const mainGateDrawer = new GateDrawer();
    const hintGateDrawer = new GateDrawer(CELL_SIZE, '#444444AA', '#444444AA', '#444444AA');
    const circuitLogicBoard = new LogicCircuitBoard(CANVAS_SIZE);

    useEffect(() => {
        resetGridCanvas();
    }, []);

    // Quick functions to get canvas context of the canvases
    function getGridContext() {
        return gridCanvasRef.current.getContext('2d');
    }
    function getMainContext() {
        return mainCanvasRef.current.getContext('2d');
    }
    function getHintContext() {
        return hintCanvasRef.current.getContext('2d');
    }

    // Make the visual canvas display the current circuit board
    function updateMainCanvas() {
        const context = getMainContext();
        context.reset();
        for (let gate of circuitLogicBoard.gates) {
            mainGateDrawer.drawGate(gate[0], context, 0, gate[1], gate[2]);
        }
        for (let wire of circuitLogicBoard.wires) {
            mainGateDrawer.drawGate('wire', context, 0, wire[0], wire[1], wire[2], wire[3]);
        }
    }

    // Clear the hint canvas
    function clearHintCanvas() {
        const context = getHintContext();
        context.reset();
        console.log("ok");
    }

    // Display a gate where the user is hovering
    function updateHintCanvas() {
        const context = getHintContext();
        context.reset();
        hintGateDrawer.drawGate(toolInHand, context, 0, clientX, clientY, wireStartX, wireStartY);
    }

    // Draw the grid
    function resetGridCanvas() {
        const context = getGridContext();
        gridDrawer.resetGrid(context);
    }

    // When the user moves in the canvas, update the coords
    function handleCanvasMove(event) {
        // Round nearest reference: https://1loc.dev/math/round-a-number-to-the-nearest-multiple-of-a-given-value/
        function roundNearest(value, nearest) {
            return parseInt(Math.round(value / nearest) * nearest);
        }
        // Get the user's coordinates
        const canvasCoords = hintCanvasRef.current.getBoundingClientRect();
        const newX = roundNearest(event.clientX - canvasCoords.left, CELL_SIZE) / CELL_SIZE;
        const newY = roundNearest(event.clientY - canvasCoords.top, CELL_SIZE) / CELL_SIZE;
        // If the cell the user is selecting changed:
        if (newX !== clientX || newY !== clientY) {
            clientX = newX;
            clientY = newY;
            updateHintCanvas();
        }
    }

    // When the user clicks in the canvas
    function handleCanvasClick() {
        // If user is trying to add a wire
        if (toolInHand === 'wire') {
            // See if user already selected first point
            if (wireStartX !== null && wireStartY !== null) {
                if (clientX === wireStartX && clientY === wireStartY) {
                    wireStartX = null;
                    wireStartY = null;
                }
                else if (!circuitLogicBoard.addWire(wireStartX, wireStartY, clientX, clientY)) {
                    console.log("Invalid wire placement.");
                }
                else {
                    wireStartX = null;
                    wireStartY = null;
                    clearHintCanvas();
                }
            }
            else {
                wireStartX = clientX;
                wireStartY = clientY;
            }
        }
        else {
            if (!circuitLogicBoard.addGate(toolInHand, clientX, clientY)) {
                console.log("Invalid gate placement.");
            }
            else {
                clearHintCanvas();
            }
        }
        updateMainCanvas();
    }

    function selectTool(tool) {
        toolInHand = tool;
        wireStartX = null;
        wireStartY = null;
    }

    return (
        <>
            <div className={"block h-[" + TOTAL_SIZE + "px]"}>
                <canvas ref={gridCanvasRef} className="absolute bg-black" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
                <canvas ref={mainCanvasRef} className="absolute" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}></canvas>
                <canvas ref={hintCanvasRef} className="absolute" width={CANVAS_SIZE * CELL_SIZE} height={CANVAS_SIZE * CELL_SIZE}
                    onMouseLeave={clearHintCanvas} onMouseMove={handleCanvasMove} onMouseDown={handleCanvasClick}></canvas>
            </div>
            <button onClick={() => selectTool('wire')}>wire</button>
            <button onClick={() => selectTool('AND')}>AND</button>
            <button onClick={() => selectTool('OR')}>OR</button>
            <button onClick={() => selectTool('NOT')}>NOT</button>

        </>
    );
}

export { LogicCircuit };