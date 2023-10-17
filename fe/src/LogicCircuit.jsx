import React, { useRef, useEffect, useState } from "react";
import { LogicCircuitBoard } from "./utilities/LogicCircuitBoard";
import { LogicGateButton } from "./components/Buttons";
import andImg from "./assets/images/AND.svg";
import orImg from "./assets/images/OR.svg";
import notImg from "./assets/images/NOT.svg";
import wireImg from "./assets/images/wire.svg";

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

    drawLight(context, x, y, power) {
        context.strokeStyle = this.gateStrokeColor;
        if (power) {
            context.fillStyle = this.powerColor;
            context.strokeStyle = '#999999';
        }
        else {
            context.fillStyle = this.gateFillColor;
        }
        context.beginPath();

        // Draw inside
        context.arc(x * this.scale, (y - 0.25) * this.scale, 3 / 4 * this.scale, 0, 3 * Math.PI);
        context.moveTo((x - 0.25) * this.scale, (y + 1) * this.scale);
        context.lineTo((x - 0.25) * this.scale, (y + 0.5) * this.scale);
        context.lineTo((x + 0.25) * this.scale, (y + 0.5) * this.scale);
        context.lineTo((x + 0.25) * this.scale, (y + 1) * this.scale);
        context.closePath();
        // If on, make bright
        if (power) context.fillStyle = '#FFFF00';
        context.fill();
        context.stroke();
        context.beginPath();
        context.moveTo(x * this.scale, (y + 0.5) * this.scale);
        context.lineTo(x * this.scale, (y - 0.25) * this.scale);
        context.moveTo((x - 0.25) * this.scale, (y - 0.25) * this.scale);
        context.lineTo((x + 0.25) * this.scale, (y - 0.25) * this.scale);
        context.moveTo((x - 0.25) * this.scale, y * this.scale);
        context.lineTo((x + 0.25) * this.scale, y * this.scale);
        context.moveTo((x - 0.25) * this.scale, (y + 0.25) * this.scale);
        context.lineTo((x + 0.25) * this.scale, (y + 0.25) * this.scale);
        context.stroke();
        context.beginPath();
        context.arc(x * this.scale, (y + 1) * this.scale, 1/10 * this.scale, 0, 2 * Math.PI);
        context.fillStyle = '#FFFFFF';
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

    drawSwitch(context, x, y, power) {
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo((x - 1) * this.scale, (y - 1) * this.scale);
        context.lineTo((x - 1) * this.scale, (y + 1) * this.scale);
        context.lineTo((x + 1) * this.scale, (y + 1) * this.scale);
        context.lineTo((x + 1) * this.scale, (y - 1) * this.scale);
        context.closePath();
        context.strokeStyle = this.gateStrokeColor;
        if (power) {
            context.fillStyle = this.powerColor;
        }
        else {
            context.fillStyle = this.gateFillColor;
        }
        context.fill();
        context.stroke();

        if (power) {
            context.beginPath();
            context.moveTo((x - 0.35) * this.scale, (y - 0.5) * this.scale);
            context.lineTo((x - 0.35) * this.scale, y * this.scale);
            context.lineTo((x + 0.35) * this.scale, y * this.scale);
            context.lineTo((x + 0.35) * this.scale, (y - 0.5) * this.scale);
            context.closePath();
            context.fillStyle = this.gateStrokeColor;
            context.fill();
        }
        else {
            context.beginPath();
            context.moveTo((x - 0.35) * this.scale, (y + 0.5) * this.scale);
            context.lineTo((x - 0.35) * this.scale, y * this.scale);
            context.lineTo((x + 0.35) * this.scale, y * this.scale);
            context.lineTo((x + 0.35) * this.scale, (y + 0.5) * this.scale);
            context.closePath();
            context.fillStyle = this.gateStrokeColor;
            context.fill();
        }
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
                if (power) {
                    context.strokeStyle = this.powerColor;
                    context.fillStyle = this.powerColor;
                }
                else {
                    context.strokeStyle = this.wireColor;
                    context.fillStyle = this.wireColor;
                }
                this.drawWire(context, x, y, x2, y2);
            }
            // If no wire start, just draw a dot
            else {
                this.drawWire(context, x, y, x, y);
            }
        }
        else if (gate === 'light') {
            this.drawGate('light', context, x, y);
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
    const andBtnRef = useRef();
    const orBtnRef = useRef();
    const notBtnRef = useRef();
    const wireBtnRef = useRef();

    let clientX = 0;
    let clientY = 0;
    let toolInHand;
    let wireStartX = null;
    let wireStartY = null;
    const gridDrawer = new GridDrawer();
    const mainGateDrawer = new GateDrawer();
    const hintGateDrawer = new GateDrawer(CELL_SIZE, '#444444AA', '#444444AA', '#444444AA');
    const circuitLogicBoard = new LogicCircuitBoard(CANVAS_SIZE);
    
    useEffect(() => {
        resetGridCanvas();
        updateMainCanvas();
        selectTool('wire');
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
        circuitLogicBoard.calc();
        const context = getMainContext();
        context.reset();
        for (let x = 0; x < CANVAS_SIZE; x++) {
            for (let y = 0; y < CANVAS_SIZE; y++) {
                let cell = circuitLogicBoard.board[x][y];
                if (cell.gate) {
                    mainGateDrawer.drawGate(cell.gate, context, cell.power, x, y);
                }
                for (let wire of cell.wires) {
                    mainGateDrawer.drawGate('wire',context,cell.power,x,y,wire.x,wire.y);
                }
            }
        }
        mainGateDrawer.drawSwitch(context, 2, 7, circuitLogicBoard.board[2][7].power);
        mainGateDrawer.drawSwitch(context, 2, 15, circuitLogicBoard.board[2][15].power);
        mainGateDrawer.drawSwitch(context, 2, 23, circuitLogicBoard.board[2][23].power);
        mainGateDrawer.drawSwitch(context, 2, 31, circuitLogicBoard.board[2][31].power);
        mainGateDrawer.drawLight(context, 37, 20, circuitLogicBoard.board[37][21].power);
    }

    // Clear the hint canvas
    function clearHintCanvas() {
        const context = getHintContext();
        context.reset();
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
            // If it's over a switch, don't update canvas
            if (clientX === 2 && (
                clientY === 7 ||
                clientY === 15 ||
                clientY === 23 ||
                clientY === 31
            )) {
                
                return;
            }
            updateHintCanvas();
        }
    }

    // When the user clicks in the canvas
    function handleCanvasClick() {
        // If clicked on switch
        if (clientX === 2 && (
            clientY === 7 ||
            clientY === 15 ||
            clientY === 23 ||
            clientY === 31
        )) {
            circuitLogicBoard.toggleSwitch(clientX, clientY);
            updateMainCanvas();
            return;
        }
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
        // If eraser
        else if (toolInHand === 'eraser') {
            circuitLogicBoard.erase(clientX, clientY);
        }
        // If a gate
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
        // return;
        andBtnRef.current.deselectTool();
        orBtnRef.current.deselectTool();
        notBtnRef.current.deselectTool();
        wireBtnRef.current.deselectTool();
        toolInHand = tool;
        if (tool === 'AND') {
            andBtnRef.current.selectTool();
        }
        else if (tool === 'OR') {
            orBtnRef.current.selectTool();
        }
        else if (tool === 'NOT') {
            notBtnRef.current.selectTool();
        }
        else if (tool === 'wire') {
            wireBtnRef.current.selectTool();
        }

        wireStartX = null;
        wireStartY = null;
    }

    function undo() {
        circuitLogicBoard.undo();
        updateMainCanvas();
    }

    function redo() {
        circuitLogicBoard.redo();
        updateMainCanvas();
    }

    return (
        <>
            <div className={"relative h-[" + TOTAL_SIZE + "px]"}>
                <canvas ref={gridCanvasRef} className="absolute bg-black" width={(CANVAS_SIZE - 1) * CELL_SIZE} height={(CANVAS_SIZE - 1) * CELL_SIZE}></canvas>
                <canvas ref={mainCanvasRef} className="absolute" width={(CANVAS_SIZE - 1) * CELL_SIZE} height={(CANVAS_SIZE - 1) * CELL_SIZE}></canvas>
                <canvas ref={hintCanvasRef} className="absolute" width={(CANVAS_SIZE - 1) * CELL_SIZE} height={(CANVAS_SIZE - 1) * CELL_SIZE}
                    onMouseLeave={clearHintCanvas} onMouseMove={handleCanvasMove} onMouseDown={handleCanvasClick}></canvas>
            </div>
            <div className="absolute mt-[600px]">
                <LogicGateButton image={andImg} onClick={() => selectTool('AND')} ref={andBtnRef}></LogicGateButton>
                <LogicGateButton image={orImg} onClick={() => selectTool('OR')} ref={orBtnRef}></LogicGateButton>
                <LogicGateButton image={notImg} onClick={() => selectTool('NOT')} ref={notBtnRef}></LogicGateButton>
                <LogicGateButton image={wireImg} onClick={() => selectTool('wire')} ref={wireBtnRef}></LogicGateButton>

                <button onClick={() => selectTool('eraser')}>Eraser</button>
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
            </div>
        </>
    );
}

export { LogicCircuit };