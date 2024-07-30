var accessToken = localStorage.getItem("accessToken");
var projectIdMongo = localStorage.getItem("projectIdMongo");
var providerMongo = localStorage.getItem("providerMongo");
var regionMongo = localStorage.getItem("regionMongo");

const authUrl = () =>
  `https://${regionMongo}.${providerMongo}.services.cloud.mongodb.com/api/client/v2.0/app/${projectIdMongo}/auth/providers/local-userpass/login`;
const findUrl = () =>
  `https://${regionMongo}.${providerMongo}.data.mongodb-api.com/app/${projectIdMongo}/endpoint/data/v1/action/findOne`;

async function autorize(e) {
  let btn = e.target;
  btn.setAttribute("disabled", true);
  mongoUrl = document.querySelector("[name=mongoUrl]").value;
  username = document.querySelector("[name=username]").value;
  password = document.querySelector("[name=password]").value;

  projectIdMongo = mongoUrl.match(/\/data-[\w-]*/)[0].slice(1);
  regionDotProvider = mongoUrl.match(/\/\/[\w-]*\.[\w]*/)[0].slice(2);
  providerMongo = regionDotProvider.split(".")[1];
  regionMongo = regionDotProvider.split(".")[0];

  response = await fetch(authUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  btn.removeAttribute("disabled");
  accessToken = await response.json().then((data) => data.access_token);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("projectIdMongo", projectIdMongo);
  localStorage.setItem("providerMongo", providerMongo);
  localStorage.setItem("regionMongo", regionMongo);

  if (response.ok) location.reload();
}

async function isAutorized() {
  return fetch(findUrl(), {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    // headers: {
    //   "Content-Type": "application/json",
    //   "Access-Control-Request-Headers": "*",
    //   Authorization: `Bearer ${access_token}`,
    //   Accept: "application/json",
    // },
    body: JSON.stringify({
      dataSource: "lwd",
      database: "lwd",
      collection: "images",
      // projection: { _id: 1 },
    }),
  })
    .then((r) => r.ok)
    .catch(() => false);
}

// document.querySelector("button").onclick = autorize;
// document.body.style.backgroundColor = "black";

// access_token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiNjZhNzFjZDczOTFhN2E0YTgwNGVlNTQ1IiwiZXhwIjoxNzIyMzE1NDY4LCJpYXQiOjE3MjIzMTM2NjgsImlzcyI6IjY2YTg2YmM0NGE5ZWNhZmFjN2M5ZjU3ZiIsImp0aSI6IjY2YTg2YmM0NGE5ZWNhZmFjN2M5ZjU4MSIsInN0aXRjaF9kZXZJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInN0aXRjaF9kb21haW5JZCI6IjY2YTcxY2Q3MzkxYTdhNGE4MDRlZTU0NSIsInN1YiI6IjY2YTcyNWQ0MTMyZTVlMjY4OTlkMzA5NiIsInR5cCI6ImFjY2VzcyJ9.BB-IjouUGSAaLWriFOUxmug-qlBt_t6v591D_eJcW6c"

// https://data.mongodb-api.com/app/data-isconam/endpoint/data/v1
// mongoUrl = https://sa-east-1.aws.services.cloud.mongodb.com/api/client/v2.0/app/data-isconam/auth/providers/local-userpass/login
// 		  'https://sa-east-1.aws.data.mongodb-api.com/app/data-isconam/endpoint/data/v1/action/
