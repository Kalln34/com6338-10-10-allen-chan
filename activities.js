document.addEventListener("DOMContentLoaded", () => {
    const boredBtn = document.getElementById("boredBtn");
    const activityResult = document.getElementById("activityResult");
    const currentYear = document.getElementById("currentYear");
    const activityType = document.getElementById("activityType");
    const locationInput = document.getElementById("locationInput");

    currentYear.textContent = new Date().getFullYear();


    findBtn.addEventListener("click", async () => {
        activityResult.textContent = "Finding something to do...";

        const location = locationInput.value.trim();
    if (!location) {
      activityResult.textContent = "Please enter a location.";
      return;
    }

    const GEOAPIFY_API_KEY = "935a4f1e531431889e2ce2c02564d7b"; 

    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&limit=1&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.features || geocodeData.features.length === 0) {
        activityResult.textContent = "Could not find that location.";
        return;
      }

    
      const selectedType = activityType.value;
      const categoryFilter = selectedType ? `&categories=${selectedType}` : "";
      const radius = 5000; 

      const placesUrl = `https://api.geoapify.com/v2/places?filter=circle:${lon},${lat},${radius}${categoryFilter}&limit=10&apiKey=${GEOAPIFY_API_KEY}`;
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();

      const places = placesData.features;
      if (!places || places.length === 0) {
        activityResult.textContent = "No attractions found nearby.";
        return;
      }

      const randomPlace = places[Math.floor(Math.random() * places.length)];
      const name = randomPlace.properties.name || "Unnamed Place";
      const address = randomPlace.properties.formatted || "Address Unavailable";

      activityResult.innerHTML = `<strong>${name}</strong><br>${address}`;
    } catch (error) {
      console.error("Error:", error);
      activityResult.textContent = "An error occurred while finding attractions.";
    }
  });
});





       
        
        
    

    