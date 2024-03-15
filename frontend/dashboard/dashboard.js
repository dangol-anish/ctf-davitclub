document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("aT");

    const response = await fetch("http://localhost:8888/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : "",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("Failed to fetch dashboard data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
