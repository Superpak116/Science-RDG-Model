const totalSeasons = 50;
let predationRate = 8;
let initialRabbits = 10;
let initialDingoes = 5;
let initialGrasshoppers = 20;
let grassGrowth = 12;
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
    grasshoppers = grasshoppers.map(g => g + grassGrowth - 2); // Grasshoppers gain from grass but lose energy.
    grasshoppers = grasshoppers.map(g => g > 3 ? g : 0); // Grasshoppers below energy threshold die.

    let grasshopperCount = grasshoppers.filter(g => g > 0).length;

    // Grasshoppers reproduce (restricted reproduction)
    let newGrasshoppers = [];
    grasshoppers.forEach(g => {
        if (g > 8 && Math.random() < 0.3) { // Reproduce only if energy > 8 and 30% chance.
            newGrasshoppers.push(3); // Each reproducing grasshopper adds 3 offspring.
        }
    });
    grasshoppers = grasshoppers.concat(newGrasshoppers);

    // Grasshoppers die off naturally (natural death rate)
    grasshoppers = grasshoppers.filter(() => Math.random() > 0.1); // 10% of grasshoppers die each season.

    // Grasshoppers overcrowding (reduce population if above a threshold)
    if (grasshoppers.length > 100) {
        grasshoppers = grasshoppers.slice(0, 100); // Cap population to 100.
    }

    // Rabbits eat grasshoppers
    let grasshoppersEaten = Math.min(grasshopperCount, rabbits.length);
    grasshoppers = grasshoppers.map((g, i) => (i < grasshoppersEaten ? 0 : g)); // Reduce grasshopper population.
    rabbits = rabbits.map(r => r + (grasshoppersEaten > 0 ? 1.5 : 0) - 1); // Rabbits gain more energy (1.5) from grasshoppers but lose energy each season.
    rabbits = rabbits.filter(r => r > 0); // Remove dead rabbits.

    let rabbitCount = rabbits.length;

    // Natural rabbit deaths
    rabbits = rabbits.filter(() => Math.random() > 0.02); // 2% of rabbits die naturally each season.

    // Rabbits reproduce (lower reproduction threshold)
    let newRabbits = [];
    rabbits.forEach(r => {
        if (r > 8) { // Reproduction threshold reduced to >8.
            newRabbits.push(Math.floor(r / 2));
        }
    });
    rabbits = rabbits.concat(newRabbits);

    // Dingoes eat rabbits
    let rabbitsEaten = Math.floor(rabbitCount * (predationRate / 100));
    let energyFromRabbits = 0;

    for (let i = 0; i < rabbitsEaten; i++) {
        if (rabbits[i]) {
            energyFromRabbits += rabbits[i];
            rabbits[i] = 0;
        }
    }
    rabbits = rabbits.filter(r => r > 0);

    let energyPerDingo = energyFromRabbits / dingoes.length;
    dingoes = dingoes.map(d => d + energyPerDingo - 1); // Dingoes lose energy if not eating enough rabbits.
    dingoes = dingoes.filter(d => d > 0); // Remove dead dingoes.

    let dingoCount = dingoes.length;

    // Dingoes reproduce
    let newDingoes = [];
    dingoes.forEach(d => {
        if (d > 15) newDingoes.push(Math.floor(d / 2));
    });
    dingoes = dingoes.concat(newDingoes);

    populationData.push({ season, rabbits: rabbits.length, dingoes: dingoCount, grasshoppers: grasshopperCount });
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
    const latestData = populationData[populationData.length - 1] || { rabbits: 0, dingoes: 0, grasshoppers: 0 };
    document.getElementById('seasonDisplay').innerText = currentSeason;
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
                { label: 'Grasshoppers', data: [], borderColor: 'orange', borderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Season' } },
                y: { title: { display: true, text: 'Population' } }
            }
        }
    });
}
