// fetch attempts

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Check if the data is already stored in localStorage
    const userId = localStorage.getItem("uid");
    if (!localStorage.getItem(userId)) {
      fetch("json/attempts.json")
        .then((response) => response.json())
        .then((jsonData) => {
          console.log(jsonData);
          const jsonString = JSON.stringify(jsonData);
          const uid = localStorage.getItem("uid");
          localStorage.setItem(uid, jsonString);
        });
    }
  } catch (error) {
    console.log(error);
  }
});

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

      for (const question of data) {
        const challengeDiv = document.getElementById(
          `question-${question.question_id}`
        );
        if (challengeDiv) {
          challengeDiv.addEventListener("click", () => {
            populateModal(question);
            showModal();
            resetForm(question.question_id);
            displaySolvedBy(question.solved_by); // New line to display users who solved the question
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

// Function to display users who solved the question
function displaySolvedBy(users) {
  const solvedByContainer = document.getElementById("solved-by-container");
  solvedByContainer.innerHTML = ""; // Clear previous content

  const usersList = users.split(", ");
  for (const user of usersList) {
    const userElement = document.createElement("div");
    userElement.textContent = user;
    solvedByContainer.appendChild(userElement);
  }
}

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
      console.log(data);

      const userName = document.getElementById("user_id");
      const userScore = document.getElementById("user_score");

      userName.innerText += " " + data[0].user_name;
      userScore.innerText += " " + data[0].user_score;

      // Get all solved question IDs
      const solvedQuestionIds = data.map((entry) => entry.question_id);

      // Loop through divs with question IDs and color them green if solved
      const challengeDivs = document.querySelectorAll(".challenge");
      challengeDivs.forEach((div) => {
        const questionId = parseInt(div.id.split("-")[1]);
        if (solvedQuestionIds.includes(questionId)) {
          div.style.backgroundColor = "#0B6623";
        }
      });
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
    switchPage(null, 1);
  };

  // Close the modal when clicking anywhere outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      switchPage(null, 1);
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
        // document
        //   .getElementById(`question-${questionId}`)
        //   .classList.add("correct");

        console.log("question id" + questionId);
        // Update user score on correct answer
        const userScore = document.getElementById("user_score");
        userScore.innerText = "User Score: " + result.userScore;
      } else {
        const error = await response.json();
        alert(error.message);

        if (error.message === "Wrong Answer") {
          const userId = localStorage.getItem("uid");
          const jsonData = JSON.parse(localStorage.getItem(userId));
          const questionIdParsed = parseInt(questionId);

          // Find the object corresponding to the question ID
          const questionObject = jsonData.find(
            (obj) => obj.question_id === questionIdParsed
          );

          console.log(questionObject.attempts);

          console.log(document.getElementById(`question-${questionIdParsed}`));

          if (questionObject) {
            // Update the attempts count for that question
            questionObject.attempts -= 1;

            if (questionObject.attempts <= 0) {
              window.location.href = "dashboard.html";
              const questionDiv = document.getElementById(
                `question-${questionIdParsed}`
              );
              // if (questionDiv) {
              //   questionDiv.style.display = "none";
              // }
            }
            // Save the updated JSON data back to localStorage
            localStorage.setItem(userId, JSON.stringify(jsonData));
          }
          // localStorage.setItem("qT", retrievedArray[qId - 1].attempts - 1);
        }
        // console.log(error.message);
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
    localStorage.removeItem("aT");
    localStorage.removeItem("uid");

    window.location.href = "../auth/login.html"; // Replace "login.html" with the actual login page URL
  });
});

//page switch
function switchPage(event, page) {
  // event.stopPropagation(); // Prevent the default behavior of the click event
  if (page === 1) {
    document.getElementById("page1Content").style.display = "block";
    document.getElementById("page2Content").style.display = "none";
    // Show buttons on page 1
    // document.getElementById("page1Buttons").style.display = "block";
  } else if (page === 2) {
    document.getElementById("page1Content").style.display = "none";
    document.getElementById("page2Content").style.display = "block";
    // Hide buttons on page 2
    // document.getElementById("page1Buttons").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Check attempts for each question from localStorage and hide corresponding divs if attempts are 0 or less
    checkAttemptsAndHideDivs();

    // Your existing code for fetching questions and user details goes here...
  } catch (error) {
    console.error("Error:", error);
  }
});

function checkAttemptsAndHideDivs() {
  try {
    const userId = localStorage.getItem("uid");
    const jsonData = JSON.parse(localStorage.getItem(userId));

    if (jsonData) {
      jsonData.forEach((question) => {
        const questionId = question.question_id;
        const attempts = question.attempts;

        if (attempts <= 0) {
          const questionDiv = document.getElementById(`question-${questionId}`);
          if (questionDiv) {
            questionDiv.classList.add("disabled");
          }
        }
      });
    }
  } catch (error) {
    console.error("Error checking attempts:", error);
  }
}
