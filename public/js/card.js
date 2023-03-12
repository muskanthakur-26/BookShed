const flexContainer = document.querySelector(".flexbox");
const search = document.querySelector(".search_yt");
search.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  //   console.log(data);
  const credentials = [...data.entries()];
  //   console.log(credentials);
  const name = document.querySelector('[type="search"]').value;
  flexContainer.innerHTML = "";
  fetch("http://localhost:3000/api/search/", {
    method: "POST",
    body: JSON.stringify({
      key: name,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      for (item in json) {
        // console.log(json[item].id.videoId);

        createCard(json[item].id.videoId);
      }
    });
});

// console.log(flexContainer);

// const box = `
//   <div id='box'>
//     <button id='button-1'>Button</button>
//   </div>`;
// // flexContainer.insertAdjacentHTML('afterend',box)
// flexContainer.append(box);

function createCard(videoId) {
  const card = document.createElement("div");
  card.className = "card";

  const vid_frame = document.createElement("iframe");
  vid_frame.className = "vid_frame";
  vid_frame.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
  const title = document.createElement("div");
  title.className = "title";

  card.appendChild(vid_frame);
  card.appendChild(title);
  flexContainer.append(card);
}
