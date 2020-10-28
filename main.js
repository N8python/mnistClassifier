let model;
async function main() {
    model = await tf.loadLayersModel('conv-model/model.json');
}
main();

function setup() {
    createCanvas(28 * 10, 28 * 10);
}
let lines = [];

function draw() {
    background(0);
    stroke(255);
    strokeWeight(20);
    if (mouseIsPressed) {
        lines.push([mouseX, mouseY, pmouseX, pmouseY])
    }
    lines.forEach(([x1, y1, x2, y2]) => {
        line(x1, y1, x2, y2);
    })
    let arr = [];
    for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
            let pixelVal = 0;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    pixelVal += get(x * 10 + i * 5, y * 10 + j * 5)[0];
                }

            }
            fill(pixelVal / 4);
            arr.push(pixelVal / 9 / 255);
            noStroke();
            rect(x * 10, y * 10, 10, 10);
        }
    }
    if (model) {
        const predictions = model.predict(tf.tensor([arr]).reshape([1, 28, 28, 1])).dataSync();
        const max = Math.max(...predictions);
        document.getElementById("prediction").innerHTML = `Prediction: ${predictions.findIndex(pred => pred === max)}`;
        document.getElementById("confidence").innerHTML = `Confidence: ${(predictions.find(pred => pred === max) * 100).toFixed(2)}%`;
    }
}
document.getElementById("clear").onclick = () => {
    lines = [];
}