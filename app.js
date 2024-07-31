
class SetOfConditions {
    constructor(wind_vx, thermal_vz, wing_vz, wing_vx) {
        this.wind_vx = wind_vx;
        this.thermal_vz = thermal_vz;
        this.wing_vz = wing_vz;
        this.wing_vx = wing_vx;
        // Compute constants
        this.pilot_upwind_vx = - (wing_vx - wind_vx); // Take the opposite value since a positive upwind speed
        // results in a negative x-coordinate for the upwind vector on the graph 
        this.pilot_vz = thermal_vz + wing_vz; // wing_vz is negative
    }
    // vx stands for horizontal speed, vz for vertical speed

    solver() {
        // Note that since we compute on a unitary time (one second), 
        // P_x = wind_vx and P_y = pilot_vz
        let a_1 = this.pilot_vz / this.pilot_upwind_vx
        let b_1 = this.pilot_vz - a_1 * this.wind_vx
        let a_2 = this.thermal_vz / this.wind_vx
        let x_star = b_1 / (a_2 - a_1)
        let i_x = x_star - this.wind_vx
        let time_to_objective = i_x / this.pilot_upwind_vx
        return time_to_objective
    }
}

document.addEventListener('DOMContentLoaded', function () {

    function compute_solution(wind_vx, thermal_vz, time_for_one_turn, wing_vz, wing_vx) {
        instance = new SetOfConditions(wind_vx = wind_vx, thermal_vz = thermal_vz, wing_vz = wing_vz, wing_vx = wing_vx)
        solution = instance.solver() * time_for_one_turn
        // Give solution for one turn time reference (it was computed for a unitary timestep i.e. one second)
        return solution
    }

    function updatePlot(wind_vx, time_for_one_turn, wing_vz, wing_vx) {
        // updatePlot function takes as arguments the parameters selected by the user
        // while the thermal strength variable is inherent to the graph x-axis
        let y_values = x_axis.map(thermal_vz => compute_solution(
            wind_vx = wind_vx,
            thermal_vz = thermal_vz,
            time_for_one_turn = time_for_one_turn,
            wing_vz = wing_vz,
            wing_vx = wing_vx
        ));

        var plotly_trace = {
            x: x_axis,
            y: y_values,
            mode: 'lines'
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
    let x_axis = nj.arange(1.5, 10, 0.5) // Mapping the x-axis of the thermal vz
    x_axis = x_axis.tolist() // Do not use numpy js anymore

    let sliderObject = document.getElementById("windSlider")
    let inputObject1 = document.getElementById("input1")
    let inputObject2 = document.getElementById("input2")
    let inputObject3 = document.getElementById("input3")

    let selectedWindVx = sliderObject.value;
    let selectedWingVx = inputObject1.value;
    let selectedWingVz = - inputObject2.value;
    // Take the opposite since the ui asks for a sink rate (positive) 
    // while the solver asks for a vertical speed (negative)
    let selectedTimeForOneTurn = inputObject3.value;

    updatePlot(
        wind_vx = selectedWindVx,
        time_for_one_turn = selectedTimeForOneTurn,
        wing_vz = selectedWingVz,
        wing_vx = selectedWingVx
    );

    // Update plot with user's interaction
    sliderObject.addEventListener('input', (event) => {
        selectedWindVx = sliderObject.value // Update value
        let currentValue = document.getElementById("sliderValue")
        currentValue.textContent = selectedWindVx // Update displayed value next to the slider
        updatePlot( // Compute again and plot
            wind_vx = selectedWindVx,
            time_for_one_turn = selectedTimeForOneTurn,
            wing_vz = selectedWingVz,
            wing_vx = selectedWingVx
        );
    })

    inputObject1.addEventListener('input', (event) => {
        selectedWingVx = inputObject1.value // Update value
        updatePlot( // Compute again and plot
            wind_vx = selectedWindVx,
            time_for_one_turn = selectedTimeForOneTurn,
            wing_vz = selectedWingVz,
            wing_vx = selectedWingVx
        );
    })

    inputObject2.addEventListener('input', (event) => {
        selectedWingVz = - inputObject2.value // Update value
        // Take the opposite since the ui asks for a sink rate (positive) 
        // while the solver asks for a vertical speed (negative)
        updatePlot( // Compute again and plot
            wind_vx = selectedWindVx,
            time_for_one_turn = selectedTimeForOneTurn,
            wing_vz = selectedWingVz,
            wing_vx = selectedWingVx
        );
    })

    inputObject3.addEventListener('input', (event) => {
        selectedTimeForOneTurn = inputObject3.value // Update value
        updatePlot( // Compute again and plot
            wind_vx = selectedWindVx,
            time_for_one_turn = selectedTimeForOneTurn,
            wing_vz = selectedWingVz,
            wing_vx = selectedWingVx
        );
    })
})