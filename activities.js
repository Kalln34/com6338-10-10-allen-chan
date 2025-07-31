document.addEventListener("DOMContentLoaded", () => {
    const boredBtn = document.getElementById("boredBtn");
    const activityResult = document.getElementById("activityResult");
    const currentYear = document.getElementById("currentYear");

    currentYear.textContent = new Date().getFullYear();

    boredBtn.addEventListener("click", async () => {
        activityResult.textContent = "Finding something fun...";


        const type =activityType.value;
        let apiUrl = "https://www.boredapi.com/api/activity/";

        if (type) {
            apiUrl += `?type=${type}`;
        }
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Could not fetch activity");
        

        try {
            const response = await fetch("https://www.boredapi.com/api/activity/");
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            

            const data = await response.json();
            
            if (data && data.activity) {
                activityResult.textContent = `How about: ${data.activity}`;
            } else {
                activityResult.textContent = "Hmm, unable to find something for that option. Please try something different.";
            }
            } catch (error) {
                activityResult.textContent = "Sorry! Could not find a fun idea right now.";
                console.error("Error finding activity:", error);
            }
      });
});