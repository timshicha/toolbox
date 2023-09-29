
// Check if a number is between two values
function isInRange(number, minVal, maxVal) {
    if (number >= minVal && number <= maxVal) return true;
    return false;
}

export class LogicCircuitBoard {
    
    constructor(size) {
        this.size = size;
        this.gates = [];
        this.wires = [];
        this.power = [0, 0, 0, 0];
    }

    addGate(gateType, x, y) {
        // Make sure the gate coords are between 1 and size - 1
        if (!isInRange(x, 1, this.size - 1) ||
            !isInRange(y, 1, this.size - 1)) {
            return null;
        }
        this.gates.push([gateType, x, y]);
        return true;
    }

    addWire(x, y, x2, y2) {
        // Make sure the wire ends are between 0 and size
        if (!isInRange(x, 0, this.size) &&
            !isInRange(y, 0, this.size) &&
            !isInRange(x2, 0, this.size) &&
            !isInRange(y2, 0, this.size)) {
            return null;
        }
        this.wires.push([x, y, x2, y2]);
        return true;
    }
}