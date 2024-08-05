"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Plotly = __importStar(require("plotly.js"));
class SetOfConditions {
    constructor(wind_vx, thermal_vz, wing_vz, wing_vx) {
        this.wind_vx = wind_vx;
        this.thermal_vz = thermal_vz;
        this.wing_vz = wing_vz;
        this.wing_vx = wing_vx;
        // Compute constants
        this.pilot_upwind_vx = -(wing_vx - wind_vx); // Take the opposite value since a positive upwind speed
        // results in a negative x-coordinate for the upwind vector on the graph 
        this.pilot_vz = thermal_vz + wing_vz; // wing_vz is negative
    }
    solver() {
        // Note that since we compute on a unitary time (one second), 
        // P_x = wind_vx and P_y = pilot_vz
        const a_1 = this.pilot_vz / this.pilot_upwind_vx;
        const b_1 = this.pilot_vz - a_1 * this.wind_vx;
        const a_2 = this.thermal_vz / this.wind_vx;
        const x_star = b_1 / (a_2 - a_1);
        const i_x = x_star - this.wind_vx;
        const time_to_objective = i_x / this.pilot_upwind_vx;
        return time_to_objective;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    function compute_solution(wind_vx, thermal_vz, time_for_one_turn, wing_vz, wing_vx) {
        const instance = new SetOfConditions(wind_vx, thermal_vz, wing_vz, wing_vx);
        const solution = instance.solver() * time_for_one_turn;
        // Give solution for one turn time reference (it was computed for a unitary timestep i.e. one second)
        return solution;
    }
    function updatePlot(wind_vx, time_for_one_turn, wing_vz, wing_vx) {
        // updatePlot function takes as arguments the parameters selected by the user
        // while the thermal strength variable is inherent to the graph x-axis
        const x_axis = Array.from({ length: Math.ceil((10 - 1.5) / 0.5) + 1 }, (_, i) => 1.5 + (i * 0.5));
        const y_values = x_axis.map(thermal_vz => compute_solution(wind_vx, thermal_vz, time_for_one_turn, wing_vz, wing_vx));
        const plotly_trace = {
            x: x_axis,
            y: y_values,
            mode: 'lines',
            hovertemplate: 'Thermal strength: %{x:.1f} m/s<br>Upwind time needed: %{y:.1f} s<extra></extra>'
        };
        const layout = {
            title: 'Needed time ovalizing in a straight line - for modelling simplicity - upwind each turn',
            yaxis: {
                range: [0, 20],
                title: { text: 'Upwind time - second' }
            },
            xaxis: {
                range: [1, 10],
                title: { text: 'Thermal strength - m/s' }
            }
        };
        Plotly.newPlot('graphCanvas', [plotly_trace], layout);
    }
    // Make initial plot
    const sliderObject = document.getElementById("windSlider");
    const inputObject1 = document.getElementById("input1");
    const inputObject2 = document.getElementById("input2");
    const inputObject3 = document.getElementById("input3");
    let selectedWindVx = parseFloat(sliderObject.value);
    let selectedWingVx = parseFloat(inputObject1.value);
    let selectedWingVz = -parseFloat(inputObject2.value); // Take the opposite since the ui asks for a sink rate (positive) 
    // while the solver asks for a vertical speed (negative)
    let selectedTimeForOneTurn = parseFloat(inputObject3.value);
    updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    // Update plot with user's interaction
    sliderObject.addEventListener('input', () => {
        selectedWindVx = parseFloat(sliderObject.value); // Update value
        const currentValue = document.getElementById("sliderValue");
        if (currentValue) {
            currentValue.textContent = sliderObject.value; // Update displayed value next to the slider
        }
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
    inputObject1.addEventListener('input', () => {
        selectedWingVx = parseFloat(inputObject1.value); // Update value
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
    inputObject2.addEventListener('input', () => {
        selectedWingVz = -parseFloat(inputObject2.value); // Update value
        // Take the opposite since the ui asks for a sink rate (positive) 
        // while the solver asks for a vertical speed (negative)
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
    inputObject3.addEventListener('input', () => {
        selectedTimeForOneTurn = parseFloat(inputObject3.value); // Update value
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
});
