# Schema

![schema](./assets/schema.png).

# Legend

$O$: origin from which we begin to look at a thermal particle and the paraglider pilot  

$P$: pilot's position after making one turn  

$T$: thermal particle's position after the pilot made one turn  

$(OT)$: pilot's trajectory  

$(OP)$: thermal particle's trajectory. Considered as the optimal trajectory for climbing  

$\vec{OP}$: vector of the pilot's movement  

$\vec{OT}$: vector of the thermal particle's movement  

$\vec{Dv}$: horizontal component of $\vec{OP}$ and $\vec{OT}$ due to the wind drift  
$||\vec{Dv}|| = \text{wind speed} \times \text{time for one turn}$  

$\vec{Vzt}$: vertical component of $\vec{OT}$  
$||\vec{Vzt}|| = \text{thermal climb rate} \times \text{time for one turn}$  

$\vec{Vzp}$: vertical component of $\vec{OP}$  
$||\vec{Vzp}|| = (\text{thermal climb rate} - \text{pilot sink rate}) \times \text{time for one turn}$  

$I$: point of intersection between the pilot's ovalization trajectory $(IP)$ and the optimal placement in the thermal  

$\vec{i}$: vector of the pilot's ovalization movement  

# Problem

Ovalization in thermalling is the action of circling a little bit upwind each turn in order to recenter the thermal when encountering wind drift.  

What distance do we need to recover each turn to return to the center of the thermal? What are the parameters that affect the need for ovalization?

## The problem is formalized as follows:

We consider a pilot and a thermal air particle starting from the same point $O$ at time $t_0$.  

After the pilot has made one turn, at $t_1$, the pilot's position $P$ is below the thermal particle's position $T$ since they are subject to the same wind drift but different vertical speeds.  

The pilot, aware of the need for ovalization, stops circling and goes upwind in a straight line to return to the strongest part of the thermal $I$ at $t_2$. The vector describing this movement is $\vec{i}$.  
Note that $\vec{i}$ is inclined upward since the pilot is still climbing while returning to the strongest part of the thermal. For simplicity, we assume the climbing rate to be constant.  

Let's calculate the horizontal distance covered until the pilot reaches the point of intersection $I$ with the optimal trajectory.

# Calculations

We set a wind speed, a thermal's vertical speed, and a pilot's vertical speed (thermal climb rate - pilot sink rate).  
Thus $\vec{Dv}$, $\vec{Vzp}$, $\vec{Vzt}$, $T$, and $P = (P_x, P_y)$ are known.  
Let's determine the equation of the straight lines $(IP)$ and $(OT)$ to find the coordinates of $I$, the point at which they intersect.  

$(IP) : y = a_1 \times x + b_1$  
where  

$$
    a_1 = \frac{||\vec{Vzp}||}{||\vec{i_x}||}
$$

and

$$
    b_1 = P_y - a_1 \times P_x
$$

Although $||\vec{i_x}||$ is unknown, the computation will be made using a unit time of one second, which constraints $||\vec{i_x}||$ to be equal to the pilot's upwind speed.

$(OT) : y = a_2 \times x$  
where

$$
    a_2 = \frac{||\vec{Vzt}||}{||\vec{Dv}||}
$$

Let's calculate the x-coordinate of $I$, the point of intersection of $(OT)$ and $(IP)$, denoted $x^*$:  

$$
\begin{align}
    a_1 \times x^* + b_1 = a_2 \times x^* \\
    x^* = \frac{b_1}{a_2 - a_1}
\end{align}
$$

After replacing $a_1$, $a_2$, and $b_1$ with their developed values and simplifying the equation, we get

$$
    x^* = \frac{
        ||\vec{Dv}|| \cdot (||\vec{i_x}|| \cdot P_y - ||\vec{Vzp}|| \cdot P_x)
        }{
            ||\vec{i_x}|| \cdot ||\vec{Vzt}|| - ||\vec{Vzp}|| \cdot ||\vec{Dv}||
        }
$$

We can evaluate the equation of $(OT)$ at $x^*$ to calculate the y-coordinate of $I$:

$$
\begin{align*}
    y^* &= a_2 \times x^* \\
        &= \frac{
        ||\vec{Vzt}|| \cdot (||\vec{i_x}|| \cdot P_y - ||\vec{Vzp}|| \cdot P_x)
        }{
            ||\vec{i_x}|| \cdot ||\vec{Vzt}|| - ||\vec{Vzp}|| \cdot ||\vec{Dv}||
        } 
\end{align*}
$$

Now we know the coordinates of the vector $\vec{i} = (i_x, i_y) = (x^* - P_x, y^* - P_y)$.  

Given $i_x$, the horizontal component of $\vec{i}$, and the wing speed, we can estimate the time needed for the pilot to return to the optimal trajectory with a straight line upwind:  

$$
    t_2 - t_1 = \frac{i_x}{\text{wing upwind speed}}
$$
