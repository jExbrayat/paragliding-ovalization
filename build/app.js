"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plotly = require("plotly.js");
var SetOfConditions = /** @class */ (function () {
    function SetOfConditions(wind_vx, thermal_vz, wing_vz, wing_vx) {
        this.wind_vx = wind_vx;
        this.thermal_vz = thermal_vz;
        this.wing_vz = wing_vz;
        this.wing_vx = wing_vx;
        // Compute constants
        this.pilot_upwind_vx = -(wing_vx - wind_vx); // Take the opposite value since a positive upwind speed
        // results in a negative x-coordinate for the upwind vector on the graph 
        this.pilot_vz = thermal_vz + wing_vz; // wing_vz is negative
    }
    SetOfConditions.prototype.solver = function () {
        // Note that since we compute on a unitary time (one second), 
        // P_x = wind_vx and P_y = pilot_vz
        var a_1 = this.pilot_vz / this.pilot_upwind_vx;
        var b_1 = this.pilot_vz - a_1 * this.wind_vx;
        var a_2 = this.thermal_vz / this.wind_vx;
        var x_star = b_1 / (a_2 - a_1);
        var i_x = x_star - this.wind_vx;
        var time_to_objective = i_x / this.pilot_upwind_vx;
        return time_to_objective;
    };
    return SetOfConditions;
}());
document.addEventListener('DOMContentLoaded', function () {
    function compute_solution(wind_vx, thermal_vz, time_for_one_turn, wing_vz, wing_vx) {
        var instance = new SetOfConditions(wind_vx, thermal_vz, wing_vz, wing_vx);
        var solution = instance.solver() * time_for_one_turn;
        // Give solution for one turn time reference (it was computed for a unitary timestep i.e. one second)
        return solution;
    }
    function updatePlot(wind_vx, time_for_one_turn, wing_vz, wing_vx) {
        // updatePlot function takes as arguments the parameters selected by the user
        // while the thermal strength variable is inherent to the graph x-axis
        var x_axis = Array.from({ length: Math.ceil((10 - 1.5) / 0.5) + 1 }, function (_, i) { return 1.5 + (i * 0.5); });
        var y_values = x_axis.map(function (thermal_vz) { return compute_solution(wind_vx, thermal_vz, time_for_one_turn, wing_vz, wing_vx); });
        var plotly_trace = {
            x: x_axis,
            y: y_values,
            mode: 'lines',
            hovertemplate: 'Thermal strength: %{x:.1f} m/s<br>Upwind time needed: %{y:.1f} s<extra></extra>'
        };
        var layout = {
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
    var sliderObject = document.getElementById("windSlider");
    var inputObject1 = document.getElementById("input1");
    var inputObject2 = document.getElementById("input2");
    var inputObject3 = document.getElementById("input3");
    var selectedWindVx = parseFloat(sliderObject.value);
    var selectedWingVx = parseFloat(inputObject1.value);
    var selectedWingVz = -parseFloat(inputObject2.value); // Take the opposite since the ui asks for a sink rate (positive) 
    // while the solver asks for a vertical speed (negative)
    var selectedTimeForOneTurn = parseFloat(inputObject3.value);
    updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    // Update plot with user's interaction
    sliderObject.addEventListener('input', function () {
        selectedWindVx = parseFloat(sliderObject.value); // Update value
        var currentValue = document.getElementById("sliderValue");
        if (currentValue) {
            currentValue.textContent = sliderObject.value; // Update displayed value next to the slider
        }
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
    inputObject1.addEventListener('input', function () {
        selectedWingVx = parseFloat(inputObject1.value); // Update value
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
    inputObject2.addEventListener('input', function () {
        selectedWingVz = -parseFloat(inputObject2.value); // Update value
        // Take the opposite since the ui asks for a sink rate (positive) 
        // while the solver asks for a vertical speed (negative)
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
    inputObject3.addEventListener('input', function () {
        selectedTimeForOneTurn = parseFloat(inputObject3.value); // Update value
        updatePlot(selectedWindVx, selectedTimeForOneTurn, selectedWingVz, selectedWingVx);
    });
});
//# sourceMappingURL=app.js.map