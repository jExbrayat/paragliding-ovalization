
class SetOfConditions {
    constructor(wind_vx, thermal_vz, wing_vz, wing_vx) {
        this.wind_vx = wind_vx;
        this.thermal_vz = thermal_vz;
        this.wing_vz = wing_vz;
        this.wing_vx = wing_vx;
        // Compute constants
        this.pilot_upwind_vx = wind_vx - wing_vx;
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

    function compute_solution(thermal_vz) {
        instance = new SetOfConditions(wind_vx = 3, thermal_vz = thermal_vz, wing_vz = -1.5, wing_vx = 10)
        solution = instance.solver()
        return solution
    }

    let x_axis = nj.arange(1.5, 10, 0.5) // Mapping the x-axis of the thermal vz
    x_axis = x_axis.tolist() // Do not use numpy js anymore
    let y_values = x_axis.map(compute_solution)
    
    var plotly_trace = {
        x: x_axis,
        y: y_values,
        mode: 'lines'
    }
    
    var layout = {
        title: 'Line and Scatter Plot'
    };
    
    Plotly.newPlot('graphCanvas', [plotly_trace], layout)
})