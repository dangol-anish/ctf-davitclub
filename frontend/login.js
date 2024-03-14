document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = {
    userEmail: document.getElementById("email").value,
    userPassword: document.getElementById("password").value,
  };

  try {
    const response = await fetch("http://localhost:8888/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: form.userEmail,
        userPassword: form.userPassword,
      }),
    });

    if (response.status === 200) {
      console.log("Logged in");
      const data = await response.json();
      console.log(data);

      window.location.href = "dashboard.html";
    } else {
      console.error("Failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
