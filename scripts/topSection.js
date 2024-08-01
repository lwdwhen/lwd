function createTopSection() {
  topSection = document.createElement("section");
  document.body.append(topSection);
  topSection.id = "top-section";
  topSection.className = "explandable";
  topSection.onmouseenter = (e) => e.target.classList.add("expanded");
  topSection.onmouseleave = (e) => e.target.classList.remove("expanded");

  topSection.append(createGalerySearch())
//   topSection.append(createNavMenu());

  return topSection;
}

function createGalerySearch() {
  seachForm = document.createElement("form");
//   document.querySelector("#top-section").append(seachForm);
  seachForm.id = "search";

  topSearch = new LwdAutocomplete(autocompleteTags);
  topSearch.id = "top-search";
  seachForm.append(topSearch);

  searchBtn = document.createElement("button");
  seachForm.append(searchBtn);
  searchBtn.id = "search-btn";
  searchBtn.textContent = "S";
  searchBtn.onclick = (e) => {
    e.preventDefault();
    routeToGaleryPage(topSearch.value);
  };

  sortBySelection = document.createElement("select");
  seachForm.append(sortBySelection);
  sortBySelection.id = "sort-by";

  renderSortOption("Organized Date", "name");
  renderSortOption("Added Date", "createdAt");
  renderSortOption("Posted Date", "date");
  renderSortOption("Score", "score");

  filterSelection = document.createElement("select");
  seachForm.append(filterSelection);
  filterSelection.id = "filter-by";

  return seachForm;
}

function renderSortOption(text, value) {
  option = document.createElement("option");
  document.querySelector("#sort-by").append(option);
  option.textContent = text;
  option.value = value;
}

// function createNavMenu() {
//   navMenu = document.createElement("nav");
//   //   document.querySelector("#top-section").append(navMenu);
//   navMenu.id = "nav-menu";

//   galeryLink = new LwdHashLink({
//     textContent: "Galery",
//     hash: { href: "galery" },
//   });
//   navMenu.append(galeryLink);
//   // galeryLink.set('onclick', (originalFunction) => (event) => {
//   // 	originalFunction()

//   // })
//   renderNavMenuBtn("All Images", () => LwdRouter.toIndex({}));
//   renderNavMenuBtn("Watchlist", () => LwdRouter.toWatchlist());
//   renderNavMenuBtn("Image Management", () =>
//     LwdRouter.toManageImages("66278e83b4ae49e")
//   );
//   renderNavMenuBtn("Tag Management", () => LwdRouter.toManageTags({}));
//   renderNavMenuBtn("Pool Management", () => LwdRouter.toManagePools({}));
//   renderNavMenuBtn("Sync Tags", () => syncTags());

//   return navMenu;
// }

// function renderNavMenuBtn(text, onclick) {
//   navBtn = document.createElement("li");
//   document.querySelector("#nav-menu").append(navBtn);
//   navBtn.textContent = text;
//   navBtn.onclick = onclick;
//   return navBtn;
// }
