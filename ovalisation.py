import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider

# Define x-axis variable
xx_thermal_speed = np.linspace(1.5, 5, num=100)


# Classes for resolving the problem with angle calculus and Thales theorem
class Trigonometry:

    def __init__(self, wind_drift, turn_duration=20, vertical_speed_in_thermal=-1.5):
        self.thermal_drift_angle = np.arctan(
            xx_thermal_speed / wind_drift
        )  # Result in gradient
        self.vertical_loss_per_turn = (
            vertical_speed_in_thermal * turn_duration
        )  # Negative value

    def calculate_horizontal_dist_to_recover(self):
        horizontal_dist_to_recover = abs(self.vertical_loss_per_turn) / np.tan(
            self.thermal_drift_angle
        )
        return horizontal_dist_to_recover


class Thales:

    def __init__(
        self, wind_drift, turn_duration=20, vertical_speed_in_thermal=-1.5
    ) -> None:
        self.thermal_gain_per_turn = turn_duration * xx_thermal_speed
        self.vertical_loss_per_turn = (
            vertical_speed_in_thermal * turn_duration
        )  # Negative value
        self.drift_distance_per_turn = wind_drift * turn_duration

    def calculate_horizontal_dist_to_recover(self):
        horizontal_dist_to_recover = (
            -self.vertical_loss_per_turn * self.drift_distance_per_turn
        ) / self.thermal_gain_per_turn
        return horizontal_dist_to_recover


# Define slider variable
slider_wind_drift = 3

# Calculate initial horizontal distance to recover
solver = Thales(slider_wind_drift)
horizontal_dist_to_recover = solver.calculate_horizontal_dist_to_recover()

# Create the plot
fig, ax = plt.subplots(figsize=(12, 6))
plt.subplots_adjust(
    left=0.1, bottom=0.25
)  # Adjust the main plot to make room for the slider

(line,) = ax.plot(xx_thermal_speed, horizontal_dist_to_recover)
ax.set_xlabel("Thermal speed - m/s")
ax.set_ylabel("Horizontal distance to recover - m")
ax.set_title(
    "Horizontal distance to recover by ovalizing each turn as a function of thermal speed for a fixed wind drift"
)
ax.set_ylim(0, 100)

# Create the slider axis and slider
ax_slider = plt.axes((0.1, 0.1, 0.8, 0.05), facecolor="lightgoldenrodyellow")
slider = Slider(ax_slider, "Wind drift", 0.1, 10.0, valinit=slider_wind_drift)


# Update function to be called when the slider's value changes
def update(val):
    wind_drift = slider.val
    solver = Thales(wind_drift)
    line.set_ydata(solver.calculate_horizontal_dist_to_recover())


# Attach the update function to the slider
slider.on_changed(update)

plt.show()
plt.close()
