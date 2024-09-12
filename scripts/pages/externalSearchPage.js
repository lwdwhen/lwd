var externalSearchPage,
  externalSearchGalery,
  externalImageList,
  lastExternalSearch,
  focusedExternalImage,
  loadedExternalPage,
  lastExternalPage;
const externalPageSize = 72;
const externalSortBy = (sortDirection = false);

function createExternalSearchPage() {
  externalSearchPage = document.querySelector(`page[href='external_search']`);
}

async function renderExternalSearchPage() {
  let externalSearch = LwdHashRouter.get("external_search")?.trim();
  let imageId = LwdHashRouter.get("imageId");
  let currentPage = parseInt(LwdHashRouter.get("page")) || 1;
  console.log("renderExternalSearchPage", externalSearch, imageId, currentPage);

  let rerenderNedded = false;
  if (externalSearch != lastExternalSearch) {
    console.log(
      "externalSearch!=lastExternalSearch",
      externalSearch,
      lastExternalSearch
    );
    externalImageList = await externalApi.fetchRule34xxx(externalSearch);
    lastExternalSearch = externalSearch;
    lastExternalPage = Math.ceil(externalImageList.length / externalPageSize);
    rerenderNedded = true;
  }

  if (currentPage != loadedExternalPage) {
    console.log(
      "currentPage != loadedExternalPage",
      currentPage,
      "!=",
      loadedExternalPage
    );
    loadedExternalPage = currentPage;
    rerenderNedded = true;
  }

  if (rerenderNedded) {
    externalSearchPage.innerHTML = "";
    externalSearchPage.append(
      (externalSearchGalery = renderGalery(
        externalImageList,
        loadedExternalPage
      ))
    );

    let pagination = new LwdPagination(lastExternalPage, currentPage);
    externalSearchPage.append(pagination);
    pagination.set("onPageSelection", (originalFunction) => (getPage) => {
      let pageNumber = getPage();
      originalFunction(getPage);
      LwdHashRouter.set("page", pageNumber);
    });

    // preloadImages(imageList.map((image) => image.src.thumb));
  }

  if (imageId != focusedExternalImage?.id) {
    console.log(
      "imageId != focusedExternalImage",
      imageId,
      "!=",
      focusedExternalImage?.id
    );
    focusedImage = {
      ...imageList[imageIndex],
      index: imageList.findIndex((image) => image._id == imageId),
    };

    // // resetAsideContent();
    // if (focusedImage?._id) {
    //   galeryGalery.focusItem(focusedImage);
    //   // renderLwdImageData(focusedImage);
    //   renderTagList(focusedImage.tags);
    // } else {
    //   galeryGalery.closeFocus();
    //   renderGaleryPageActions();
    // }
  }
}

async function searchImages(searchString) {
  searchString = searchString.trim();
  if (searchString == lastSearch) return imageList;

  return Mongo.find("images", {
    filter: { ...searchTagsFilter(searchString), delete: { $ne: true } },
    sort: { [sortBy || "lwdOrder"]: sortDirection || -1 },
  }).then(({ documents }) => documents);
}

function searchTagsFilter(searchString) {
  searchTags = searchString
    .split(" ")
    .filter((t) => !!t)
    .reduce(
      (acc, tagName) => {
        tagName[0] == "-"
          ? acc.negative.push(tagName.slice(1))
          : acc.positive.push(tagName);
        return acc;
      },
      { positive: [], negative: [] }
    );

  if (searchTags.positive.length + searchTags.negative.length > 0) {
    console.log("searchTagsFilter", searchTags);

    tagFilter = { $and: [] };

    if (searchTags.positive.length)
      tagFilter.$and.push({ tags: { $all: searchTags.positive } });

    searchTags.negative.forEach((tagName) =>
      tagFilter.$and.push({ tags: { $not: { $all: [tagName] } } })
    );

    return tagFilter;
  }
}

function renderGalery(images, page) {
  let params = { imgControl: { snapshot: true } };
  let galery = new LwdGalery(serializeGaleryItems(images, page), params);
  galery.set("focusItem", (originalFunction) => (focusedItem) => {
    if (imageClickAction(focusedItem)) originalFunction(focusedItem);
  });
  galery.set("closeFocus", (originalFunction) => (focusedItem) => {
    originalFunction(focusedItem);
    focusedImage = undefined;
    LwdHashRouter.delete("imageId");
  });
  galery.addSwipeListeners();

  return galery;
}

function serializeGaleryItems(images, page) {
  return images.slice((page - 1) * pageSize, page * pageSize).map((image) => ({
    ...image,
    id: `image-id-${image._id}`,
    info: `${image.score ? `S${image.score}` : "NS"} | T${image?.tags?.length}`,
    hash: { ...LwdHashRouter.params, imageId: image._id },
  }));
}

function imageClickAction(item) {
  _id = item.id;
  // _id = item.id.split("-").pop();
  if (document.querySelector(".delete-mode")) {
    if (confirm("Are you sure you want to delete this image?")) {
      Mongo.update("images", { _id }, { $set: { delete: true } }).then(() => {
        document.querySelector(`#${item.id}`).parentElement.remove();
      });
    }
    return false;
  } else {
    LwdHashRouter.set("imageId", item._id);
    // resetAsideContent();
    // renderLwdImageData(item);
    // renderTagList(item.tags);
    return true;
  }
}

function preloadImages(array) {
  if (!preloadImages.list) preloadImages.list = [];

  var list = preloadImages.list;
  for (var i = 0; i < array.length; i++) {
    var img = new Image();
    img.onload = () => {
      var index = list.indexOf(this);
      if (index !== -1) {
        // remove image from the array once it's loaded
        // for memory consumption reasons
        list.splice(index, 1);
      }
    };
    list.push(img);
    img.src = array[i];
  }
}
