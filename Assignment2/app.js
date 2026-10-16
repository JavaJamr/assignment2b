
(function () {
    'use strict';

    //Name used to identify this application's saved data in localStorage.
    const STORAGE_KEY = 'biodome_plant_records_v1';

    //Get the HTML elements that JavaScript needs to interact with.
    const plantForm = document.getElementById('plant-card-form');
    const recordsList = document.getElementById('dynamic-portal-list');
    const entryCount = document.getElementById('log-item-count');
    const btnClearAll = document.getElementById('btn-clear-all');

    //Get the form input fields.
    const inputName = document.getElementById('plant-name');
    const inputPH = document.getElementById('ph');
    const inputEC = document.getElementById('ec');
    const inputTemperature = document.getElementById('temperature');
    const inputHumidity = document.getElementById('humidity');

    //Get the elements used to display validation errors.
    const errorPH = document.getElementById('ph-error');
    const errorEC = document.getElementById('ec-error');
    const errorTemperature = document.getElementById('temperature-error');
    const errorHumidity = document.getElementById('humidity-error');

    //Initialize the application state by loading up records
    let records = loadRecords();

    //Display the records when the page first loads.
    render();

    
    //Load saved plant records from localStorage.
    function loadRecords(){

        //solves errors beyond your control
        try {
           //Establish connection with your data store
           const stored = localStorage.getItem(STORAGE_KEY);

           //If it exists or if its empty. | condition ? (true) : (false);
           return stored ? JSON.parse(stored) : [];

        } catch (error) {  
            console.error("Something Went Wrong",error);
            return [];
            
        }
    }

    //Save the current records array to localStorage.
    function saveRecords() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    //Handle the submission of a new plant record.
    function handleSubmit(event) {
        //Prevent the page from refreshing.
        event.preventDefault();

        //Create a record using the form input values.
        const newRecord = {
            id: Date.now(),
            name: inputName.value.trim(),
            ph: Number(inputPH.value),
            ec: Number(inputEC.value),
            temperature: Number(inputTemperature.value),
            humidity: Number(inputHumidity.value)
        };

        //Add the record to the array.
        records.push(newRecord);

        //Save the updated records.
        saveRecords();

        //Update the displayed entries.
        render();

        //Clear the form.
        plantForm.reset();
    }

    



 
    //DOM Render function
    function render() {
        //Update the number of recorded plant entries.
        entryCount.textContent = records.length +
            (records.length === 1
                ? ' recorded entry'
                : ' recorded entries');

        //Get the portal elements.
        const portalSection = document.querySelector('.portal-section');
        const portalHeader = document.querySelector('.portal-header-section');
        const portalPanel = document.querySelector('.portal-panel');

        const staticPortal = document.querySelector('.static-portal-section');

        //If there are no records, clear the list and hide the portal.
        if (records.length === 0) {
            recordsList.replaceChildren();
            //Hide Dynamic portal
            portalSection.classList.add('hidden');
            portalHeader.classList.add('hidden');
            portalPanel.classList.add('hidden');
            try {
                //Show Static portal (caught in case its not hidden)
                staticPortal.classList.remove('hidden');
            } catch (error) {}

            return;
        }

        //Hide static portal
        staticPortal.classList.add('hidden');

        //Show the portal when records exist.
        portalSection.classList.remove('hidden');
        portalHeader.classList.remove('hidden');
        portalPanel.classList.remove('hidden');

        //Create a temporary DOM fragment to minimize browser updates.
        const fragment = document.createDocumentFragment();

        //Create a plant card for every record.
        records.forEach(function (rec) {
            const li = document.createElement('li');
            li.className = 'plant-card';

            //Create the plant name.
            const plantName = document.createElement('h3');
            plantName.className = 'plant-name-text';
            plantName.textContent = rec.name;

            //Create the plant measurements.
            const measurements = document.createElement('div');
            measurements.className = 'plant-biometric-stats';

            measurements.innerHTML = `
                <div class="stat-item">
                    <span>Soil pH</span>
                    ${rec.ph}
                </div>

                <div class="stat-item">
                    <span>Electrical Conductivity</span>
                    ${rec.ec} mS/cm
                </div>

                <div class="stat-item">
                    <span>Temperature</span>
                    ${rec.temperature.toFixed(1)} &deg;F
                </div>

                <div class="stat-item">
                    <span>Relative Humidity</span>
                    ${rec.humidity}%
                </div>
            `;

            //Create the Delete button.
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn-delete';
            deleteButton.textContent = 'Delete';
            deleteButton.dataset.id = rec.id;

            //Delete this plant record when clicked.
            deleteButton.addEventListener('click', function () {
                records = records.filter(function (item) {
                    return item.id !== rec.id;
                });

                saveRecords();
                render();
            });

            //Create the plant card.
            li.append(plantName, measurements, deleteButton);

            //Add the completed card to the fragment.
            fragment.appendChild(li);
        });

        //Replace the existing list with the newly rendered cards.
        recordsList.replaceChildren(fragment);
    }




//-----------------Event Listners---------------------

//Run handleSubmit when the form is submitted.
plantForm.addEventListener('submit', handleSubmit);
})();
