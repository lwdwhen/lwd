
var mainSearchFuntion = () => {}

function createTopSection() {
  topSection = document.createElement("section");
  document.body.append(topSection);
  topSection.id = "top-section";
  topSection.className = "explandable";
  if (mobile) topSection.className += " mobile";
  topSection.onmouseenter = (e) => e.target.classList.add("expanded");
  topSection.onmouseleave = (e) => e.target.classList.remove("expanded");

  topSection.append((mobileSideSectionOpenner = new LwdSvg("info")));
  mobileSideSectionOpenner.id = "side-section-focus";
  mobileSideSectionOpenner.classList.add("toogle-mobile");
  mobileSideSectionOpenner.onclick = () =>
    sideSection.classList.toggle("mobile");

  topSection.append(createGalerySearch());
  topSection.append(createTopNavMenu());

  topSection.append((mobileNavOpenner = new LwdSvg("menuBurger")));
  mobileNavOpenner.id = "nav-focus";
  mobileNavOpenner.classList.add("toogle-mobile");
  mobileNavOpenner.onclick = toogleMobileNavFocus;

  return topSection;
}

function toogleMobileNavFocus() {
  topSection.classList.toggle("nav-focus");
}

function createGalerySearch() {
  seachForm = document.createElement("form");
  //   document.querySelector("#top-section").append(seachForm);
  seachForm.id = "search";

  topSearch = new LwdAutocomplete(
    allTags.map((tag) => ({
      textContent: tag.name,
      className: tag.category,
    }))
  );
  topSearch.id = "top-search";
  seachForm.append(topSearch);

  searchBtn = document.createElement("button");
  seachForm.append(searchBtn);
  searchBtn.id = "search-btn";
  searchBtn.textContent = "S";
  searchBtn.onclick = (e) => {
    e.preventDefault();
    mainSearchFuntion(topSearch.value);
  };

  // sortBySelection = document.createElement("select");
  // seachForm.append(sortBySelection);
  // sortBySelection.id = "sort-by";

  // renderSortOption("Organized Date", "name");
  // renderSortOption("Added Date", "createdAt");
  // renderSortOption("Posted Date", "date");
  // renderSortOption("Score", "score");

  // filterSelection = document.createElement("select");
  // seachForm.append(filterSelection);
  // filterSelection.id = "filter-by";

  return seachForm;
}

// function renderSortOption(text, value) {
//   option = document.createElement("option");
//   document.querySelector("#sort-by").append(option);
//   option.textContent = text;
//   option.value = value;
// }

function createTopNavMenu() {
  topNavMenu = new LwdNav({ id: "nav-menu" });

  topNavMenu.append(createTopNavLink("galery", "Galery"));
  topNavMenu.append(createTopNavLink("settings", "Settings"));
  topNavMenu.append(createTopNavLink("external_search", "External Search"));

  return topNavMenu;
}

function createTopNavLink(href, textContent) {
  return new LwdHashLink({ href }, { textContent });
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
