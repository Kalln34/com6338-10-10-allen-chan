document.addEventListener("DOMContentLoaded", () => {
    const boredBtn = document.getElementById("boredBtn");
    const activityResult = document.getElementById("activityResult");
    const currentYear = document.getElementById("currentYear");
    const activityType = document.getElementById("activityType");

    currentYear.textContent = new Date().getFullYear();

    findBtn.addEventListener("click", () => {
        activityResult.textContent = "Finding you...";

        if (!navigator.geolocation) {
            activityResult.textContent = "Geolocation not supported by browser";
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            activityResult.textContent = "Finding nearby attractions...";

            const API_KEY = "3935a4f1e531431889e2ce2c02564d7b";
            const selectedType = activityType.value;
            const categoryFilter = selectedType ? `&categories=${selectedType}` : "";

            const apiUrl = 'https://api.geoapify.com/v2/places?filter=circle:${lon},${lat},5000${categoryFilter}&limit=10&apiKey=${API_KEY}';

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error ("Failed to retrieve places");

                const data = await response.json();
                const places = data.features;

                if (places.length > 0) {
                    const randomPlace = places[Math.floor(Math.random() * places.length)];
                    const name = randomPlace.properties.name || "Unamed Place";
                    const address = randomPlace.properties.formatted || "Address Unavailable";

                    activityResult.textContent = `Visit: ${name} – ${address}`;
                  } else {
                    activityResult.textContent = "No mathcing locations found. Please try something different!";
                  }
                } catch (error) {
                    console.error("Error retrieving places:", error);
                    activityResult.textContent = "Sorry, something went wrong!";
                }
            }, () => {
                activityResult.textContent = "Unable to get location";
            });

        });
});
        
        
    

    