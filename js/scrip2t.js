let data2;
document.addEventListener('DOMContentLoaded', function () {
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            setupDayButtons();
        })
        .catch(error => console.error('Error cargando datos JSON:', error));
});

// Crear los botones de días y asignar eventos
function setupDayButtons() {
    const daysButtonsContainer = document.getElementById("daysButtons");
    const days = Object.keys(data.buttonDays); 

    days.forEach(day => {
        const button = document.createElement("button");
        button.textContent = day;
        button.classList.add("day-button");
        button.setAttribute("data-day", day);

        button.addEventListener("click", function () {
            document.querySelectorAll(".day-button").forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            updateBarValues(day);
        });

        daysButtonsContainer.appendChild(button);
    });

    // Seleccionar automáticamente el primer día ("Su")
    const defaultDay = days[0]; 
    document.querySelector(`button[data-day="${defaultDay}"]`).classList.add("selected");
    updateBarValues(defaultDay);
}

// Función que actualiza las barras con los valores del JSON
function updateBarValues(selectedDay) {
    const barsData = data.buttonDays[selectedDay].bars;

    if (!barsData || barsData.length === 0) {
        console.error("No hay datos de barras para este día.");
        return;
    }

    // Actualizar las barras con los valores del JSON
    for (let i = 0; i < 8; i++) {
        const bar = document.getElementById(`bar${i + 1}`);
        const value = barsData[i] !== undefined ? barsData[i] : 0;
        bar.style.height = `${value * 10}%`;
    }
}
