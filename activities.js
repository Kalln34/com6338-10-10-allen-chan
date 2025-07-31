document.addEventListener("DOMContentLoaded", () => {
    const boredBtn = document.getElementById("boredBtn");
    const activityResult = document.getElementById("activityResult");
    const currentYear = document.getElementById("currentYear");

    currentYear.textContent = new Date().getFullYear();

    boredBtn.addEventListener("click", async () => {
        activityResult.textContent = "Finding something fun...";
        try {
            const response = await fetch("https://www.boredapi.com/api/activity/");
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            const data = await response.json();
            activityResult.textContent = `How about: ${data.activity}`;
            } catch (error) {
                activityResult.textContent = "Sorry! Could not find a fun idea right now.";
                console.error("Error finding activity:", error);
            }
      });
})