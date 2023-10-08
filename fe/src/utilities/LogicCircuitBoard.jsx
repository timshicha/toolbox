

class Point {
    // Create a point struct
    static createPoint(x, y) {
        return {
            x: x,
            y: y
        };
    }

    // See if two points are the same
    static comparePoints(point1, point2) {
        if (point1.x === point2.x && point1.y === point2.y) {
            return true;
        }
        return false;
    }

    // See if a point exists in an array
    static pointExists(point, pointsArray) {
        // Look through all the points
        for (let currentPoint of pointsArray) {
            // If a point is found
            if (this.comparePoints(point, currentPoint)) {
                return true;
            }
        }
        // If point was not found
        return false;
    }

    // Add a point to an array of points if the point is not
    // already in the array.
    static addPoint(point, pointsArray) {
        // Check if the point exists
        if (this.pointExists(point, pointsArray)) {
            return false;
        }
        // If this point does not already exist, add it
        pointsArray.push(point);
        return true;
    }

    // Merge two arrays
    static mergeArrays(pointsArray1, pointsArray2) {
        return pointsArray1.concat(pointsArray2);
    }

    // Add a wire to graph
    static addWire(wire, graph) {
        const point1 = this.createPoint(wire.x, wire.y);
        const point2 = this.createPoint(wire.x2, wire.y2);
        
        for (let i = 0; i < graph.length; i++) {
            let wireArray = graph[i];
            // If point1 is found
            if (this.pointExists(point1, wireArray)) {
                // If point2 is also here, don't add anything
                if (this.pointExists(point2, wireArray)) {
                    return true;
                }
                // If point2 is in a different array, merge arrays
                for (let j = i + 1; j < graph.length; j++) {
                    let wireArray2 = graph[j];
                    if (this.pointExists(point2, wireArray2)) {
                        graph[i] = this.mergeArrays(wireArray, wireArray2);
                        // Remove other array
                        graph.splice(j, 1);
                        return true;
                    }
                }
                // Otherwise, add point2 here
                this.addPoint(point2, wireArray);
                return;
            }
            // If point2 is found
            if (this.pointExists(point2, wireArray)) {
                // If point1 is also here, don't add anything
                if (this.pointExists(point1, wireArray)) {
                    return true;
                }
                // If point1 is in a different array, merge arrays
                for (let j = i + 1; j < graph.length; j++) {
                    let wireArray2 = graph[j];
                    if (this.pointExists(point1, wireArray2)) {
                        graph[i] = this.mergeArrays(wireArray, wireArray2);
                        // Remove other array
                        graph.splice(j, 1);
                        return true;
                    }
                }
                // Otherwise, add point1 here
                this.addPoint(point1, wireArray);
                return;
            }
        }
        // If neither point was found
        graph.push([point1, point2]);
        return true;
    }
}

export class LogicCircuitBoard {
    constructor(size) {
        // Create matrix of lists. Each cell contains the gates
        // and wires that affect or affected by that cell.
        this.board = new Array(size).fill(null);
        this.size = size;
        for (let i = 0; i < size; i++) {
            this.board[i] = new Array(size).fill(null);
            for (let j = 0; j < size; j++) {
                this.board[i][j] = {
                    gate: null,
                    wires: [],
                    onBy: [],
                    power: 0
                };
            }
        }
        this.addSwitch(2, 7);
        this.addSwitch(2, 15);
        this.addSwitch(2, 23);
        this.addSwitch(2, 31);
    }

    // See if a point is a switch
    isSwitch(x, y) {
        if (x !== 2) return false;
        if (y === 7 || y === 15 || y === 23 || y === 31) {
            return true;
        }
        return false;
    }

    addWire(x, y, x2, y2) {
        this.board[x][y].wires.push({ x: x2, y: y2 });
        this.board[x2][y2].wires.push({ x: x, y: y });
        return true;
    }

    addGate(gateType, x, y) {
        this.board[x][y].gate = gateType;
        this.board[x + 1][y].onBy.push({ x: x + 1, y: y });
        this.board[x][y].onBy.push({ x: x, y: y });
        return true;
    }

    addSwitch(x, y) {
        this.board[x][y].gate = 'switch';
        this.board[x + 1][y].onBy.push({ x: x + 1, y: y });
        this.board[x][y].onBy.push({ x: x, y: y });
        return true;
    }

    onByExists(x, y, onBy) {
        for (let currentOnBy of this.board[x][y].onBy) {
            if (onBy.x === currentOnBy.x &&
                onBy.y === currentOnBy.y) {
                return true;
            }
        }
        return false;
    }

    updateNeighbor(x, y, neighborX, neighborY) {
        for (let currentOnBy of this.board[x][y].onBy) {
            if (!this.onByExists(neighborX, neighborY, currentOnBy)) {
                this.board[neighborX][neighborY].onBy.push({ x: currentOnBy.x, y: currentOnBy.y });
            }
        }
    }

    updateNeighbors(x, y) {
        for (let neighbor of this.board[x][y].wires) {
            this.updateNeighbor(x, y, neighbor.x, neighbor.y);
        }
    }

    propogateGates() {
        for (let x = 1; x < this.size - 1; x++) {
            for (let y = 1; y < this.size - 1; y++) {
                // If no gate
                if (!this.board[x][y].gate) continue;
                // If AND gate
                if (this.board[x][y].gate === 'AND') {
                    if (this.board[x - 1][y - 1].power &&
                        this.board[x - 1][y + 1].power) {
                        this.board[x + 1][y].power = 1;
                        this.board[x][y].power = 1;
                    }
                    else {
                        this.board[x + 1][y].power = 0;
                        this.board[x][y].power = 0;
                    }
                }
                else if (this.board[x][y].gate === 'OR') {
                    if (this.board[x - 1][y - 1].power ||
                        this.board[x - 1][y + 1].power) {
                        this.board[x + 1][y].power = 1;
                        this.board[x][y].power = 1;
                    }
                    else {
                        this.board[x + 1][y].power = 0;
                        this.board[x][y].power = 0;
                    }
                }
                else if (this.board[x][y].gate === 'NOT') {
                    if (this.board[x - 1][y].power) {
                        this.board[x + 1][y].power = 0;
                        this.board[x][y].power = 0;
                    }
                    else {
                        this.board[x + 1][y].power = 1;
                        this.board[x][y].power = 1;
                    }
                }
            }
        }
    }

    hasPower(x, y) {
        // See all the onBy's
        for (let onBy of this.board[x][y].onBy) {
            if (this.board[onBy.x][onBy.y].power) {
                return 1;
            }
        }
        return 0;
    }

    removeWire(x, y, removeX, removeY) {
        for (let i = 0; i < this.board[x][y].wires.length; i++) {
            let wire = this.board[x][y].wires[i];
            if (wire.x === removeX && wire.y === removeY) {
                this.board[x][y].wires.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    resetPower() {
        // Save the switches
        let switches = [
            this.board[2][7].power,
            this.board[2][15].power,
            this.board[2][23].power,
            this.board[2][31].power
        ];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                this.board[x][y].power = this.hasPower(x, y);
            }
        }
        this.board[2][7].power = switches[0];
        this.board[3][7].power = switches[0];
        this.board[2][15].power = switches[1];
        this.board[3][15].power = switches[1];
        this.board[2][23].power = switches[2];
        this.board[3][23].power = switches[2];
        this.board[2][31].power = switches[3];
        this.board[3][31].power = switches[3];
    }

    updatePower() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                this.board[x][y].power = this.hasPower(x, y);
            }
        }
    }

    toggleSwitch(x, y) {
        if (this.board[x][y].gate !== 'switch') {
            console.log("Not a switch");
            return false;
        }
        if (this.board[x][y].power) {
            this.board[x][y].power = 0;
            this.board[x + 1][y].power = 0;
        }
        else {
            this.board[x][y].power = 1;
            this.board[x + 1][y].power = 1;
        }
        return true;
    }

    erase(x, y) {
        if (this.isSwitch(x, y)) {
            console.log("Can't delete a switch");
            return;
        }
        // Erase the gate and connected wires
        this.board[x][y].gate = null;
        this.board[x][y].power = 0;
        this.board[x][y].onBy = [];
        // Before erasing the wires, erase this wire from the
        // other end
        for (let wire of this.board[x][y].wires) {
            this.removeWire(wire.x, wire.y, x, y);
        }
        this.board[x][y].wires = [];
    }

    calc() {
        this.resetPower();
        for (let i = 0; i < 50; i++) {
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    this.updateNeighbors(x, y);
                }
            }
            this.propogateGates();
            this.updatePower();
        }
        console.log(this.board);
    }
}