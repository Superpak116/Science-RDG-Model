/* Body Styling */
body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(to bottom right, #74ebd5, #acb6e5);
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
}

/* Main Container */
.container {
    text-align: center;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 30px;
    width: 90%;
    max-width: 900px;
}

/* Header Styling */
header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #4b7bec;
}

header p {
    color: #636e72;
    margin-bottom: 20px;
}

/* Section Styling */
main section {
    margin: 20px 0;
    padding: 20px;
    border-radius: 10px;
    background: #f9f9f9;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
}

.controls h2, .simulation h2, .stats h2 {
    margin-bottom: 15px;
    color: #2d98da;
}

/* Slider Controls */
.sliders {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.slider {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.slider label {
    font-size: 1rem;
    flex: 1;
}

.slider input {
    flex: 2;
    margin-left: 10px;
}

.slider span {
    flex: 0.5;
    font-weight: bold;
    color: #10ac84;
}

/* Buttons */
.buttons button {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    color: white;
    margin: 5px;
    cursor: pointer;
    transition: 0.3s ease;
}

#startButton { background-color: #1dd1a1; }
#stopButton { background-color: #ff9f43; }
#resetButton { background-color: #ee5253; }

.buttons button:hover {
    transform: scale(1.05);
    opacity: 0.9;
}

/* Chart Styling */
canvas {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
}

/* Statistics */
.stats .stat {
    margin: 5px 0;
    font-size: 1.1rem;
}

.stats .stat span {
    color: #576574;
}