const socket = io("ws://192.168.0.101:8080");

socket.on("scoreUpdate", (text) => {
  console.log(text);
  const el = document.createElement("li");
  el.innerHTML = text;
  document.querySelector("ul").appendChild(el);
});

document.querySelector("button").onclick = () => {
  const text = document.querySelector("input").value;
  socket.emit("scoreUpdate", text);
};

// Regular Websockets

// const socket = new WebSocket('ws://localhost:8080');

// // Listen for messages
// socket.onmessage = ({ data }) => {
//     console.log('Message from server ', data);
// };

// document.querySelector('button').onclick = () => {
//     socket.send('hello');
// }

let loginForm = document.getElementById("myForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  const formData = {
    username,
    password,
  };

  try {
    const res = await fetch("192.168.0.101:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
});
