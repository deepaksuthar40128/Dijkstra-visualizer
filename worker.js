const { parentPort } = require('worker_threads');

parentPort.on('message', async (message) => {
    const { matrix, matrixSize } = message;
    const result = await Dijkastra(matrix, matrixSize);  
    parentPort.postMessage(result);  
});


const Dijkastra = (matrix, matrixSize) => {
    return new Promise((resolve, reject) => {
        let disMatrix = [];
        let parentMatrix = [];
        matrixSize = parseInt(matrixSize);
        matrix = matrix.map((x) => {
            return x.map((y) => {
                return parseInt(y);
            })
        })
        for (let i = 0; i < matrixSize; i++) {
            let dummyParent = [];
            for (let j = 0; j < matrixSize; j++) {
                let parent = [i, j];
                dummyParent.push(parent);
            }
            parentMatrix.push(dummyParent);
        }

        for (let i = 0; i < matrixSize; i++) {
            let dummyRow = [];
            for (let j = 0; j < matrixSize; j++) {
                dummyRow.push(1e9);
            }
            disMatrix[i] = dummyRow;
        }
        let myPriorityQueue = [];
        myPriorityQueue.push([matrix[0][0], 0, 0]);
        disMatrix[0][0] = 0;
        let dx = [-1, 0, 1];
        while (myPriorityQueue.length) {
            myPriorityQueue.sort((a, b) => {
                return -1;
            });
            let req_pair = myPriorityQueue[myPriorityQueue.length - 1];
            // console.log(req_pair);
            myPriorityQueue.pop();
            dx.forEach((x) => {
                dx.forEach((y) => {
                    if (Math.abs(x) === Math.abs(y)) {
                        //skip
                    } else {
                        let newX = req_pair[1] + x;
                        let newY = req_pair[2] + y;
                        if (
                            newX >= 0 &&
                            newY >= 0 &&
                            newX < matrixSize &&
                            newY < matrixSize
                        ) {
                            if (req_pair[0] + matrix[newX][newY] < disMatrix[newX][newY]) {
                                disMatrix[newX][newY] = req_pair[0] + matrix[newX][newY];
                                myPriorityQueue.push([disMatrix[newX][newY], newX, newY]);
                                parentMatrix[newX][newY] = [req_pair[1], req_pair[2]];
                            }
                        }
                    }
                });
            });
        }
        let pathMatrix = [];
        let presentNode = [matrixSize - 1, matrixSize - 1];
        while (presentNode !== parentMatrix[presentNode[0]][presentNode[1]]) {
            pathMatrix.push(presentNode);
            presentNode = parentMatrix[presentNode[0]][presentNode[1]];
        }

        pathMatrix.reverse();
        resolve({ pathMatrix, disMatrix });
    })
}
