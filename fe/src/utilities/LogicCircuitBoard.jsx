
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

    // Add a point to an array of points if the point is not
    // already in the array.
    static addPoint(point, pointsArray) {
        // Look through all the points
        for (let currentPoint of pointsArray) {
            // If a point like this is found, quit
            if (this.comparePoints(point, currentPoint)) {
                return false;
            }
        }
        // If this point does not already exist, add it
        pointsArray.push(point);
        return true;
    }

    // If either point1 or point2 are in the array of points,
    // add the other point to the array (if it's not already
    // in the array). Return true if there was a match, and
    // return false if neither of the points appeared in the
    // pointsArray.
    static mergeWireToArray(point1, point2, pointsArray) {
        // Go through each point in the array
        for (let i = 0; i < pointsArray.length; i++) {
            let currentPoint = pointsArray[i];
            // If point1 matches, add point2
            if (this.comparePoints(point1, currentPoint)) {
                this.addPoint(point2, pointsArray);
                return true;
            }
            // If point2 matches, add point1
            else if (this.comparePoints(point2, currentPoint)) {
                this.addPoint(point1, pointsArray);
                return true;
            }
        }
        // Otherwise, neither point is in the array
        return false;
    }

    // Given a list of lists of points, add the wire to the
    // proper list (or to a new list).
    static addWireToGraph(wire, graph) {
        let point1 = Point.createPoint(wire.x, wire.y);
        let point2 = Point.createPoint(wire.x2, wire.y2);
        // Go through each wire array
        for (let wireArray of graph) {
            // Add point to this wire array
            if (this.mergeWireToArray(point1, point2, wireArray)) {
                return;
            }
        }
        // If no wire array contains either point, create
        // a new wire array.
        graph.push([point1, point2]);
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
            Point.addWireToGraph(wire, graph);
        }
        console.log(this);
        console.log(graph);
    }

    propogatePower() {
        // Power can only be supplied by switches or the outputs of
        // logic gates. Propogate that power through all the
        // connected wires and to the inputs of the other gates.
    }
}