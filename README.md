# Rabbit, Dingo, and Grasshopper Population Simulation

This is a simple ecological simulation that models the interaction between rabbits, dingoes, and grasshoppers. The simulation tracks the populations of these species over time and visualizes their dynamics with a graph. The user can adjust various parameters such as grass growth, initial populations, and predation rates through interactive sliders.

## Features

- **Rabbits**: Reproduce based on available food (grasshoppers) and their energy levels. Their population grows, but they can also die naturally or get eaten by dingoes.
- **Dingoes**: Predators that consume rabbits to gain energy. Their population grows based on the energy they consume from the rabbits.
- **Grasshoppers**: Consume grass and serve as food for rabbits. They reproduce based on their energy levels and contribute to the rabbit population's survival.
- **Interactive Controls**: Allows users to modify initial conditions and parameters such as:
  - Grass growth per season
  - Initial rabbit and dingo populations
  - Predation rate (percentage of rabbits eaten by dingoes)

## How It Works

The simulation runs over a series of "seasons", where each season involves:
1. **Grass Growth**: Grass grows each season, providing energy for grasshoppers.
2. **Grasshopper Population**: Grasshoppers consume the grass, and their population increases if they have enough energy.
3. **Rabbit Population**: Rabbits eat grasshoppers for energy, reproduce based on energy, and are eaten by dingoes.
4. **Dingo Population**: Dingoes eat rabbits for energy, reproduce based on their energy consumption, and naturally die if they don't have enough energy.

The populations of all species are visualized with a line graph showing how their numbers change over the course of the simulation.

## Interactive Parameters

- **Grass Growth per Season**: Controls the amount of grass available to the grasshoppers each season.
- **Initial Number of Rabbits**: Sets the starting population of rabbits.
- **Initial Number of Dingoes**: Sets the starting population of dingoes.
- **Predation Rate**: Percentage of the rabbit population that is eaten by dingoes each season.
