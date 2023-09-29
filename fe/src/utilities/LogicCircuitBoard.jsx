
export class LogicCircuitBoard {
    
    constructor(size) {
        this.size = size;
        this.gates = [];
        this.wires = [];
        this.power = [0, 0, 0, 0];
    }

    addGate(gateType, x, y) {
        // Make sure the gate is inbounds
        if (x < 1 || x >= this.size) {
            return -1;
        }
        if (y < 1 || y >= this.size) {
            return -1;
        }
        this.gates.push([gateType, x, y]);
        console.log(this.gates);
    }
}