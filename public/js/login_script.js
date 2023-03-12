const form = document.querySelector(".form-signin");
console.log(form);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);
  const data = new FormData(e.target);
  console.log(data);
  const credentials = [...data.entries()];
  // console.log(credentials);
  fetch("http://localhost:3000/api/login/", {
    method: "POST",
    body: JSON.stringify({
      fname: credentials[0][1],
      lname: credentials[1][1],
      email: credentials[2][1],
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status === "ok") {
        window.location.assign("http://localhost:3000/home.html");
      } else {
        alert("Wrong Credentials");
      }
    });
});
