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

      // Add event listeners to challenge divs
      for (let i = 1; i <= 30; i++) {
        const challengeDiv = document.getElementById(`question-${i}`);
        if (challengeDiv) {
          challengeDiv.addEventListener("click", () => {
            const question = data.find((q) => q.question_id === i);
            if (question) {
              populateModal(question);
              showModal();
              resetForm(question.question_id); // Reset the form with the question ID
            } else {
              console.error("Question not found");
            }
          });
        }
      }
    } else {
      console.error("Failed to fetch dashboard data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

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

function resetForm(questionId) {
  const answerForm = document.getElementById("answer-form");
  answerForm.reset(); // Reset the form
  answerForm.setAttribute("data-question-id", questionId); // Set the question ID in the form's data attribute
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
    const userId = localStorage.getItem("uid"); // Implement a function to get user ID
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
        alert(result.message); // Display success message
      } else {
        const error = await response.json();
        alert(error.message); // Display error message
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
