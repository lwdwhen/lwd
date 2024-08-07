if (Mongo.ready()) createLwd();
if (Mongo.ready()) window.onload = renderLwd;

var allTags;
const categoriesOrder = {
  artist: 1,
  copyright: 2,
  character: 3,
  species: 4,
  general: 5,
  unknown: 6,
  lore: 7,
  meta: 8,
  invalid: 9,
};
const ratings = ["general", "sensitive", "questionable", "explicit"];

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
    if (data) location.reload();
  });
}

async function createLwd() {
  // lastSearch = undefined;
  // deleteMode = false;
  // sortBy = LwdHashRouter.get("sortBy");
  // sortDirection = LwdHashRouter.get("sortDirection");
  // ratingFilter = "";
  // imageList = [];
  allTags = JSON.parse(localStorage.getItem("allTags")) || [];
  // watchlists = [];
  // formatedTags = JSON.parse(localStorage.getItem("formatedTags"));

  // autocompleteTags = allTags.map((tag) => ({
  //   textContent: tag.name,
  //   className: tag.category,
  // }));
}

async function renderLwd() {
  document.body.outerHTML = "<body></body>";

  document.body.append((sideSection = createSideSection()));
  document.body.append((topSection = createTopSection()));

  pagesDefinitions = [
    { href: "galery", onCreate: createGaleryPage, onRender: renderGaleryPage },
    // { href: "manage/tags", onCreate: () => {}, onRender: renderTagManagement },
    // { href: "watchlist", onCreate: () => {}, onRender: renderWatchlistPage },
    { href: "settings", onCreate: () => {}, onRender: () => {} },
  ];
  // LwdHashRouter.createPages(pagesDefinitions, (params) => new LwdPage(params));

  LwdHashRouter.createPages(pagesDefinitions);
}
