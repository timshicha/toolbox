

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
        for (let i = 0; i < size; i++) {
            this.board[i] = new Array(size).fill(null);
            for (let j = 0; j < size; j++) {
                this.board[i][j] = {
                    gate: null,
                    wires: [],
                    onBy: []
                };
            }
        }
        this.board[1][1].onBy = [{ x: 0, y: 0 }];
    }
}