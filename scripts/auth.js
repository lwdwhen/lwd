mongoAccessToken = localStorage.getItem("mongoAccessToken");
mongoProjectId = localStorage.getItem("mongoProjectId");
mongoProvider = localStorage.getItem("mongoProvider");
mongoRegion = localStorage.getItem("mongoRegion");

imgbbApiKey = localStorage.getItem("imgbbApiKey");

authUrl = () =>
  `https://${mongoRegion}.${mongoProvider}.services.cloud.mongodb.com/api/client/v2.0/app/${mongoProjectId}/auth/providers/local-userpass/login`;
findUrl = () =>
  `https://${mongoRegion}.${mongoProvider}.data.mongodb-api.com/app/${mongoProjectId}/endpoint/data/v1/action/findOne`;
mongoApiUrl = (action) =>
  `https://${mongoRegion}.${mongoProvider}.data.mongodb-api.com/app/${mongoProjectId}/endpoint/data/v1/action/${action}`;

function llog() {
  console.log("declared in mongoApi");
}
async function autorize(e) {
  btn = document.querySelector("[name=login]");
  btn.setAttribute("disabled", true);
  mongoUrl = document.querySelector("[name=mongoUrl]").value;
  username = document.querySelector("[name=username]").value;
  password = document.querySelector("[name=password]").value;
  imgbbApiKey = document.querySelector("[name=imgbbApiKey]").value;

  mongoProjectId = mongoUrl.match(/\/data-[\w-]*/)[0].slice(1);
  mongoRegionDotProvider = mongoUrl.match(/\/\/[\w-]*\.[\w]*/)[0].slice(2);
  mongoProvider = mongoRegionDotProvider.split(".")[1];
  mongoRegion = mongoRegionDotProvider.split(".")[0];

  response = await fetch(authUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  btn.removeAttribute("disabled");
  mongoAccessToken = await response.json().then((data) => data.access_token);
  localStorage.setItem("mongoAccessToken", mongoAccessToken);
  localStorage.setItem("mongoProjectId", mongoProjectId);
  localStorage.setItem("mongoProvider", mongoProvider);
  localStorage.setItem("mongoRegion", mongoRegion);

  if (response.ok) location.reload();
}

async function isAutorized() {
  try {
    return fetch(findUrl(), {
      method: "POST",
      headers: { Authorization: `Bearer ${mongoAccessToken}` },
      // headers: {
      //   "Content-Type": "application/json",
      //   "Access-Control-Request-Headers": "*",
      //   Authorization: `Bearer ${mongoAccessToken}`,
      //   Accept: "application/json",
      // },
      body: JSON.stringify({
        dataSource: "lwd",
        database: "lwd",
        collection: "images",
        projection: { _id: 1 },
      }),
    })
      .then((r) => r.ok)
      .catch(() => false);
  } catch (e) {
    return false;
  }
}

// document.querySelector("button").onclick = autorize;
// document.body.style.backgroundColor = "black";

// access_token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiNjZhNzFjZDczOTFhN2E0YTgwNGVlNTQ1IiwiZXhwIjoxNzIyMzE1NDY4LCJpYXQiOjE3MjIzMTM2NjgsImlzcyI6IjY2YTg2YmM0NGE5ZWNhZmFjN2M5ZjU3ZiIsImp0aSI6IjY2YTg2YmM0NGE5ZWNhZmFjN2M5ZjU4MSIsInN0aXRjaF9kZXZJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInN0aXRjaF9kb21haW5JZCI6IjY2YTcxY2Q3MzkxYTdhNGE4MDRlZTU0NSIsInN1YiI6IjY2YTcyNWQ0MTMyZTVlMjY4OTlkMzA5NiIsInR5cCI6ImFjY2VzcyJ9.BB-IjouUGSAaLWriFOUxmug-qlBt_t6v591D_eJcW6c"

// https://data.mongodb-api.com/app/data-isconam/endpoint/data/v1
// mongoUrl = https://sa-east-1.aws.services.cloud.mongodb.com/api/client/v2.0/app/data-isconam/auth/providers/local-userpass/login
// 		  'https://sa-east-1.aws.data.mongodb-api.com/app/data-isconam/endpoint/data/v1/action/
