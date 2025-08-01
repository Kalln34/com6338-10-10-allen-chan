document.getElementById("getTimesBtn").addEventListener("click", async () => {
      const venueName = document.getElementById("venueName").value.trim();
      const venueCity = document.getElementById("venueCity").value.trim();
      const venueCountry = document.getElementById("venueCountry").value.trim();
      const resultBox = document.getElementById("result");

      const API_KEY = 'pub_3b7edace4dc54d1bbf238c03ae8549fb'

       if (!venueName || !venueCity) {
        resultBox.innerHTML = "Please enter venue name and city.";
        return;
      }

      resultBox.innerHTML = "searching now...";

         try {
    
        const venueData = {
          api_key_public: API_KEY,
          venue_name: venueName,
          venue_address: venueCity + (venueCountry ? ", " + venueCountry : "")
        };

        const regRes = await fetch("https://besttime.app/api/v1/venues/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(venueData)
        });

        const regJson = await regRes.json();

        if (!regJson || !regJson.success || !regJson.venue_id) {
          resultBox.innerHTML = "❌ Could not register venue. " + (regJson.message || "");
          return;
        }

        const venueId = regJson.venue_id;

        const forecastRes = await fetch(`https://besttime.app/api/v1/forecasts/populartimes?venue_id=${venueId}&api_key_public=${API_KEY}`);
        const forecastJson = await forecastRes.json();

        if (!forecastJson || !forecastJson.analysis || !forecastJson.analysis.length) {
          resultBox.innerHTML = "No popular time data available.";
          return;
        }

        const today = new Date().getDay() - 1; 
        const todayData = forecastJson.analysis[today] || forecastJson.analysis[0];

        resultBox.innerHTML = `<h3>${venueName}</h3>
          <strong>${todayData.day_info.day_text}</strong><br>
          Busy Hours: ${todayData.busy_hours.join(", ")}`;
      } catch (err) {
        console.error(err);
        resultBox.innerHTML = "An error occurred while fetching data.";
      }
    });