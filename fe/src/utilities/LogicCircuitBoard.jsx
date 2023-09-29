
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
        this.switchOn = [0, 0, 0, 0];
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
}