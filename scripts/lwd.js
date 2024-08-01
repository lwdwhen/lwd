if (Mongo.ready()) createLwd();

async function login() {
  document.querySelector("[name=login]").setAttribute("disabled", true);
  mongoUrl = document.querySelector("[name=mongoUrl]").value;
  username = document.querySelector("[name=username]").value;
  password = document.querySelector("[name=password]").value;
  imgbbApiKey = document.querySelector("[name=imgbbApiKey]").value;

  Mongo.projectId = mongoUrl.match(/\/data-[\w-]*/)[0].slice(1);
  mongoRegionDotProvider = mongoUrl.match(/\/\/[\w-]*\.[\w]*/)[0].slice(2);
  Mongo.provider = mongoRegionDotProvider.split(".")[1];
  Mongo.region = mongoRegionDotProvider.split(".")[0];

  Mongo.auth(username, password).then((data) => {
    document.querySelector("[name=login]").removeAttribute("disabled");
    if(data)location.reload();
  });
}

async function createLwd() {
  document.body.outerHTML = "<body></body>";
  allTags = JSON.parse(localStorage.getItem("allTags")) || [];
}

