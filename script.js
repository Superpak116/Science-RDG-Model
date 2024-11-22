const totalSeasonsDefault = 50;
let totalSeasons = totalSeasonsDefault;

let predationRate = 8;
let grasshopperPredationRate = 5;
let initialRabbits = 10;
let initialDingoes = 5;
let initialGrasshoppers = 10;
let grassGrowth = 12;

let rabbitDeathThreshold = 3;
let dingoDeathThreshold = 0;
let grasshopperDeathThreshold = 2;
let rabbitReproductionThreshold = 7;
let dingoReproductionThreshold = 15;

let simulationRunning = false;
let currentSeason = 0;

let rabbits = [];
let dingoes = [];
let grasshoppers = [];
const populationData = [];
let chart;

function updatePredationRate(value) {
    predationRate = value;
    document.getElementById('predationRateValue').innerText = value + '%';
}

function updateGrasshopperPredationRate(value) {
    grasshopperPredationRate = value;
    document.getElementById('grasshopperPredationRateValue').innerText = value + '%';
}

function updateInitialRabbits(value) {
    initialRabbits = value;
    document.getElementById('initialRabbitsValue').innerText = value;
}

function updateInitialDingoes(value) {
    initialDingoes = value;
    document.getElementById('initialDingoesValue').innerText = value;
}

function updateInitialGrasshoppers(value) {
    initialGrasshoppers = value;
    document.getElementById('initialGrasshoppersValue').innerText = value;
}

function updateGrassGrowth(value) {
    grassGrowth = value;
    document.getElementById('grassGrowthValue').innerText = value;
}

function simulateSeason(season) {
    // Grasshoppers eat grass
    let grassEnergy = grassGrowth / Math.max(1, grasshoppers.length);
    grasshoppers = grasshoppers.map(g => g + grassEnergy - 1);
    grasshoppers = grasshoppers.map(g => g < grasshopperDeathThreshold ? 0 : g);

    // Grasshoppers reproduce
    let newGrasshoppers = [];
    grasshoppers.forEach(g => {
        if (g > 6) newGrasshoppers.push(Math.floor(g / 2));
    });
    grasshoppers = grasshoppers.concat(newGrasshoppers);

    // Rabbits eat grasshoppers
    let rabbitEnergy = grasshoppers.filter(g => g > 0).length * (grasshopperPredationRate / 100);
    rabbits = rabbits.map(r => r + rabbitEnergy - 1);
    rabbits = rabbits.map(r => r < rabbitDeathThreshold ? 0 : r);

    // Rabbits reproduce
    let newRabbits = [];
    rabbits.forEach(r => {
        if (r > rabbitReproductionThreshold) newRabbits.push(Math.floor(r / 2));
    });
    rabbits = rabbits.concat(newRabbits);

    // Dingoes eat rabbits
    let rabbitsEaten = Math.floor(rabbits.filter(r => r > 0).length * (predationRate / 100));
    let energyFromRabbits = 0;

    for (let i = 0; i < rabbitsEaten; i++) {
        let index = rabbits.findIndex(r => r > 0);
        if (index !== -1) {
            energyFromRabbits += rabbits[index];
            rabbits[index] = 0;
        }
    }

    // Dingoes gain energy and reproduce
    let energyPerDingo = energyFromRabbits / dingoes.length;
    dingoes = dingoes.map(d => d + energyPerDingo - 1);
    dingoes = dingoes.filter(d => d > dingoDeathThreshold);

    let newDingoes = [];
    dingoes.forEach(d => {
        if (d > dingoReproductionThreshold) newDingoes.push(Math.floor(d / 2));
    });
    dingoes = dingoes.concat(newDingoes);

    // Save data for chart
    populationData.push({
        season,
        rabbits: rabbits.filter(r => r > 0).length,
        dingoes: dingoes.length,
        grasshoppers: grasshoppers.filter(g => g > 0).length,
    });
}

function startSimulation() {
    simulationRunning = true;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('stopButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'inline';

    rabbits = Array.from({ length: initialRabbits }, () => 6);
    dingoes = Array.from({ length: initialDingoes }, () => 10);
    grasshoppers = Array.from({ length: initialGrasshoppers }, () => 4);

    if (!chart) setupChart();

    const interval = setInterval(() => {
        if (!simulationRunning || currentSeason >= totalSeasons) {
            clearInterval(interval);
            return;
        }
        currentSeason++;
        simulateSeason(currentSeason);
        updateChart();
        updateStats();
    }, 200);
}

function stopSimulation() {
    simulationRunning = false;
    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('stopButton').style.display = 'none';
}

function resetSimulation() {
    simulationRunning = false;
    currentSeason = 0;
    rabbits = [];
    dingoes = [];
    grasshoppers = [];
    populationData.length = 0;

    updateStats();
    if (chart) chart.destroy();
    chart = null;

    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('stopButton').style.display = 'none';
    document.getElementById('resetButton').style.display = 'none';
}

function updateChart() {
    const rabbitCounts = populationData.map(data => data.rabbits);
    const dingoCounts = populationData.map(data => data.dingoes);
    const grasshopperCounts = populationData.map(data => data.grasshoppers);

    chart.data.datasets[0].data = rabbitCounts;
    chart.data.datasets[1].data = dingoCounts;
    chart.data.datasets[2].data = grasshopperCounts;
    chart.update();
}

function updateStats() {
    const latestData = populationData[populationData.length - 1] || {
        season: 0,
        rabbits: 0,
        dingoes: 0,
        grasshoppers: 0,
    };

    document.getElementById('seasonDisplay').innerText = latestData.season;
    document.getElementById('rabbitCountDisplay').innerText = latestData.rabbits;
    document.getElementById('dingoCountDisplay').innerText = latestData.dingoes;
    document.getElementById('grasshopperCountDisplay').innerText = latestData.grasshoppers;
}

function setupChart() {
    const ctx = document.getElementById('populationChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: totalSeasons }, (_, i) => i + 1),
            datasets: [
                { label: 'Rabbits', data: [], borderColor: 'green', borderWidth: 2 },
                { label: 'Dingoes', data: [], borderColor: 'red', borderWidth: 2 },
                { label: 'Grasshoppers', data: [], borderColor: 'orange', borderWidth: 2 },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Season' } },
                y: { title: { display: true, text: 'Population' } },
            },
        },
    });
}

// Toggle the settings modal
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Apply settings changes
function applySettings() {
    totalSeasons = parseInt(document.getElementById('totalSeasons').value);
    rabbitDeathThreshold = parseInt(document.getElementById('rabbitDeathThreshold').value);
    dingoDeathThreshold = parseInt(document.getElementById('dingoDeathThreshold').value);
    grasshopperDeathThreshold = parseInt(document.getElementById('grasshopperDeathThreshold').value);
    rabbitReproductionThreshold = parseInt(document.getElementById('rabbitReproductionThreshold').value);
    dingoReproductionThreshold = parseInt(document.getElementById('dingoReproductionThreshold').value);

    alert('Settings applied successfully!');
    toggleSettings();
}