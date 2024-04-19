document.addEventListener('DOMContentLoaded', function() {
    let data;

    fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        const daysData = data.days;
        const daysSelect = document.getElementById('daysSelect');
        const days = Object.keys(daysData);
        days.forEach(day => {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = `Últimos ${day} días`;
            daysSelect.appendChild(option);
        });
        
        daysSelect.addEventListener('change', () => {
            updateCharts();
            updateDate();
        });

        const filterButtonsPlaces = document.querySelectorAll('.filter-button-places');
        filterButtonsPlaces.forEach(button => {
            button.addEventListener('click', function() {
                filterButtonsPlaces.forEach(button => {
                    button.classList.remove('selected');
                });
                this.classList.add('selected');
                updateCharts();
            });
        });
    
        const filterButtonsGender = document.querySelectorAll('.filter-button-gender');
        filterButtonsGender.forEach(button => {
            button.addEventListener('click', function() {
                filterButtonsGender.forEach(button => {
                    button.classList.remove('selected');
                });
                this.classList.add('selected');
                updateCharts();
            });
        });

        updateCharts();
        updateDate();
    });

    function updateCharts() {
        const selectedDay = document.getElementById('daysSelect').value;
        const selectedPlacesFilter = document.querySelector('.filter-button-places.selected').attributes[1].value;
        const selectedDayData = data.days[selectedDay];
        let chartDataPlaces;
        if (selectedPlacesFilter === 'cities') {
            chartDataPlaces = Object.entries(selectedDayData.cities).map(([country, value]) => ({
                country,
                value
            }));
        } else if (selectedPlacesFilter === 'countries') {
            chartDataPlaces = Object.entries(selectedDayData.countries).map(([country, value]) => ({
                country,
                value
            }));
        }

        const chartDataMale = [];
        Object.entries(selectedDayData.gender).forEach(([age, genderData]) => {
            chartDataMale.push({
                age,
                value: genderData.Male
            });
        });

        const chartDataFemale = [];
        Object.entries(selectedDayData.gender).forEach(([age, genderData]) => {
            chartDataFemale.push({
                age,
                value: genderData.Female
            });
        });

        const selectedGenderFilter = document.querySelector('.filter-button-gender.selected');
        const filterValue = selectedGenderFilter ? selectedGenderFilter.getAttribute('data-filter') : 'all';
        let chartDataGender;
        if (filterValue === 'all') {
            chartDataGender = [];
            chartDataMale.forEach(maleItem => {
                const femaleItem = chartDataFemale.find(femaleItem => femaleItem.age === maleItem.age);
                if (femaleItem) {
                    chartDataGender.push({
                        age: maleItem.age,
                        value: (maleItem.value + femaleItem.value) / 2
                    });
                }
            });
        } else if (filterValue === 'Male') {
            chartDataGender = chartDataMale;
        } else if (filterValue === 'Female') {
            chartDataGender = chartDataFemale;
        }

        renderChart(chartDataPlaces, 'chart', 'all', 'places');
        renderChart(chartDataGender, 'chart2', filterValue, 'gender');
    }

    function updateDate() {
        const selectedDay = document.getElementById('daysSelect').value;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(selectedDay) + 1);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        const startDateFormatted = `${startDate.getDate()} ${getMonthShortName(startDate.getMonth())}.`;
        const endDateFormatted = `${endDate.getDate()} ${getMonthShortName(endDate.getMonth())}.`;

        document.getElementById('date').textContent = `${startDateFormatted} - ${endDateFormatted}`;
    }

    function getMonthShortName(monthIndex) {
        const monthsShortNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return monthsShortNames[monthIndex];
    }
});

function renderChart(data, chart, filterValue, filterType) {
    const chartElement = document.getElementById(chart);
    chartElement.innerHTML = '';

    data.forEach(item => {
        const barContainer = document.createElement("div");
        barContainer.classList.add("bar-container");

        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = filterType === 'places' ? item.country : item.age;
        barContainer.appendChild(label);

        const percentage = document.createElement("div");
        percentage.classList.add("percentage");
        percentage.textContent = filterType === 'places' ? `${item.value}%` : `${item.value}%`;
        barContainer.appendChild(percentage);

        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.width = `${item.value}%`;
        bar.setAttribute("data-age", item.age);
        bar.setAttribute("data-male-value", `${item.value}%`);

        if (filterType === "age" && item.age === filterValue) {
            barContainer.classList.add("matching-bar");
        }

        chartElement.appendChild(barContainer);
        barContainer.appendChild(bar);
    });
}