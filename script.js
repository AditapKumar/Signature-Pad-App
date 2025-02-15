const canvas = document.getElementById("signature-pad");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");

const context = canvas.getContext("2d");
let display = document.getElementById("show");
let painting = false;
let drawStart = false;

function startPosition(e) {
    painting = true;
}

function finishedPosition() {
    painting = false;
    context.beginPath();
    saveState();
}

function draw(e) {
    if (!painting) return;

    let clientX, clientY;
    if (e.type.startsWith("touch")) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);

    drawStart = true;
}

function saveState() {
    localStorage.setItem("canvas", canvas.toDataURL());
}

function loadState() {
    const savedData = localStorage.getItem("canvas");
    if (savedData) {
        const img = new Image();
        img.src = savedData;
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        };
    }
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseleave", finishedPosition);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", finishedPosition);
canvas.addEventListener("touchmove", draw);

clearBtn.addEventListener("click", () => {
    drawStart = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
    display.innerHTML = "";
});

saveBtn.addEventListener("click", () => {
    if (drawStart) {
        const dataURL = canvas.toDataURL();
        let img = document.createElement("img");
        img.setAttribute("class", "signature-img");
        img.src = dataURL;

        const aFilename = document.createElement("a");
        aFilename.href = dataURL;
        aFilename.download = "signature.png";
        aFilename.appendChild(img);

        display.appendChild(aFilename);
    } else {
        display.innerHTML = "<span class='error'>Please sign before saving</span>";
    }
});

loadState();

window.onload = () => {
    drawStart = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
};