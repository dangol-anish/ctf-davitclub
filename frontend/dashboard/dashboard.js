// get questions
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

      for (let i = 1; i <= 30; i++) {
        const challengeDiv = document.getElementById(`question-${i}`);
        if (challengeDiv) {
          challengeDiv.addEventListener("click", () => {
            const question = data.find((q) => q.question_id === i);
            if (question) {
              populateModal(question);
              showModal();
              resetForm(question.question_id);
            } else {
              console.error("Question not found");
            }
          });
        }
      }
    } else {
      window.location.href = "../auth/login.html";
      return;
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// get user details
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("aT");

    if (!uid || !token) {
      // Redirect to login page if either uid or token is missing
      window.location.href = "../auth/login.html";
      return;
    }

    const response = await fetch("http://localhost:8888/dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : "",
      },
      body: JSON.stringify({ uid }),
    });

    if (response.status === 200) {
      const data = await response.json();

      const userName = document.getElementById("user_id");
      const userScore = document.getElementById("user_score");

      userName.innerText += " " + data[0].user_name;
      userScore.innerText += " " + data[0].user_score;
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// populate divs with questions
function populateModal(question) {
  document.getElementById("modal-title").innerText = question.question_title;
  document.getElementById("modal-description").innerText =
    question.question_description;
  document.getElementById("modal-category").innerText =
    "Category: " + question.question_category;
  document.getElementById("modal-points").innerText =
    "Points: " + question.question_points;
}

function showModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  // Close the modal when clicking on the close button
  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal when clicking anywhere outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// reset form when it is closed so that the previous answers are not sent to future response
function resetForm(questionId) {
  const answerForm = document.getElementById("answer-form");
  answerForm.reset();
  answerForm.setAttribute("data-question-id", questionId);
}

// Add an event listener for form submission
document
  .getElementById("answer-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const answer = document.getElementById("answer").value;
    const questionId = document
      .getElementById("answer-form")
      .getAttribute("data-question-id");
    const userId = localStorage.getItem("uid");
    const requestBody = {
      questionId: questionId,
      userId: userId,
      userAnswer: answer,
    };

    console.log(requestBody);

    const token = localStorage.getItem("aT");

    try {
      const response = await fetch("http://localhost:8888/dashboard/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? token : "",
        },
        body: JSON.stringify(requestBody),
      });

      console.log(response);

      if (response.status === 200) {
        const result = await response.json();
        alert(result.message);
        // Update user score on correct answer
        const userScore = document.getElementById("user_score");
        userScore.innerText = "User Score: " + result.userScore;
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

//logout
document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById("logout");

  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Clear local storage items
    localStorage.clear("aT");
    localStorage.clear("uid");

    window.location.href = "../auth/login.html"; // Replace "login.html" with the actual login page URL
  });
});
