
// Check if a number is between two values
function isInRange(number, minVal, maxVal) {
    if (number >= minVal && number <= maxVal) return true;
    return false;
}

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
        this.size = size;
        this.gates = [];
        this.wires = [];
        this.switchOn = [0, 0, 0, 0];

        this.graph = [];
    }

    createGate(gateType, x, y, x2=null, y2=null, power=0) {
        return {
            gateType: gateType,
            power: power,
            x: x,
            y: y,
            x2: x2,
            y2: y2
        };
    }

    addGate(gateType, x, y) {
        // Make sure the gate coords are between 1 and size - 1
        if (!isInRange(x, 1, this.size - 1) ||
            !isInRange(y, 1, this.size - 1)) {
            return null;
        }
        const gate = this.createGate(gateType, x, y);
        this.gates.push(gate);
        return gate;
    }

    addWire(x, y, x2, y2) {
        // Make sure the wire ends are between 0 and size
        if (!isInRange(x, 0, this.size) &&
            !isInRange(y, 0, this.size) &&
            !isInRange(x2, 0, this.size) &&
            !isInRange(y2, 0, this.size)) {
            return null;
        }
        const gate = this.createGate('wire', x, y, x2, y2);
        this.wires.push(gate);
        return gate;
    }

    // Build a graph mapping each gate to the other gates and
    // wires that it affects.
    buildGraph() {
        const graph = [];
        for (let wire of this.wires) {
            Point.addWire(wire, graph);
        }
        console.log(graph);
    }

    propogatePower() {
        // Power can only be supplied by switches or the outputs of
        // logic gates. Propogate that power through all the
        // connected wires and to the inputs of the other gates.
    }
}