let matrixSize = 5, num = 10;
document.getElementById('nums').addEventListener('change', (e) => {
    num = parseInt(e.target.value);
})
let ele = document.getElementById('size');
ele.addEventListener('change', (e) => {
    matrixSize = e.target.value;
    createMatrix();
    ele.setAttribute('disabled',true);
})
const createRow = (matrixSize) => {
    let cell = '<div class="cell"></div>';
    let row = '<div class="row">';
    for (let i = 0; i < matrixSize; i++) {
        row += cell;
    }
    row += "</div>";
    return row;
};
const Dijkastra = (matrix, matrixSize) => {
    data = {
        matrix,
        matrixSize
    }
    console.log(data)
    return new Promise((resolve, reject) => {
        var request = {
            "url": '/solver',
            "method": "POST",
            "data": data
        }
        $.ajax(request).done(function (response) {
            visual(response.pathMatrix, response.disMatrix);
        })
    })
}
const createMatrix = () => {
    let matrix = [];
    let mainBox = document.getElementsByClassName("mainBox")[0];
    mainBox.innerHTML = "";
    for (let i = 0; i < matrixSize; i++) {
        mainBox.innerHTML += createRow(matrixSize);
        let dummyRow = [];
        for (let j = 0; j < matrixSize; j++) dummyRow.push(0);
        matrix[i] = dummyRow;
    }
    let cells = document.getElementsByClassName("cell");
    Array.from(cells).forEach((cell, index) => {
        let cellVal = Math.ceil(Math.random() * num);
        matrix[Math.floor(index / matrixSize)][index % matrixSize] = cellVal;
        cell.innerText = cellVal;
    });
    Dijkastra(matrix, matrixSize);
};
createMatrix();


let fillcolor = "#fff580", speed = 100;
document.getElementById('color').addEventListener('change', (e) => {
    fillcolor = e.target.value;
})
document.getElementById('speed').addEventListener('change', (e) => {
    speed = parseInt(e.target.value);
})


const visual = async (pathMatrix, disMatrix) => {
    document.getElementById("distanceValue").innerText =
        disMatrix[matrixSize - 1][matrixSize - 1];

    const f = (cell, delay) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let DOMmatrix = Array.from(
                    document.getElementsByClassName("mainBox")[0].children
                );
                Array.from(DOMmatrix[cell[0]].children)[cell[1]].style.background =
                    fillcolor;
                resolve();
            }, speed);
        });
    };
    for (let i = 0; i < pathMatrix.length; i++) {
        const cell = pathMatrix[i];
        await f(cell);
    }
    ele.removeAttribute('disabled');
}