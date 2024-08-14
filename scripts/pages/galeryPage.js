var galeryPage,
  galeryGalery,
  imageList,
  lastSearch,
  focusedImage,
  loadedPage,
  lastPage;
const pageSize = 72;
const sortBy = sortDirection = false;

function createGaleryPage() {
  galeryPage = document.querySelector(`page[href='galery']`);
  let searchString = LwdHashRouter.get("search")?.trim();
  searchImages(searchString).then((images) => {
    imageList = images;
    lastSearch = searchString;
  });
}

async function renderGaleryPage() {
  let galerySearch = LwdHashRouter.get("galerySearch")?.trim();
  let imageId = LwdHashRouter.get("imageId");
  let currentPage = parseInt(LwdHashRouter.get("page"));
  console.log("renderGaleryPage", galerySearch, imageId, currentPage);

  if (galerySearch != lastSearch) {
    console.log("galerySearch != lastSearch", galerySearch, "!=", lastSearch);
    imageList = await searchImages(galerySearch);
    lastSearch = galerySearch;
    lastPage = Math.ceil(imageList.length / pageSize);
  }

  if (currentPage != loadedPage) {
    console.log("currentPage != loadedPage", currentPage, "!=", loadedPage);
    loadedPage = currentPage || 1;

    galeryPage.innerHTML = "";
    galeryPage.append((galeryGalery = renderGalery(imageList, loadedPage)));

    let pagination = new LwdPagination(lastPage, currentPage);
    galeryPage.append(pagination);
    pagination.set("onPageSelection", (originalFunction) => (getPage) => {
      let pageNumber = getPage();
      originalFunction(getPage);
      LwdHashRouter.set("page", pageNumber);
      //   galeryPage
      //     .querySelector("galery")
      //     .replaceWith(renderGalery(imageList, pageNumber));
    });

    // preloadImages(imageList.map((image) => image.src.thumb));
  }

  if (imageId != focusedImage?._id) {
    console.log("imageId != focusedImage", imageId, "!=", focusedImage?._id);
    focusedImage = findImage(imageId);

    // resetAsideContent();
    if (focusedImage?._id) {
      galeryGalery.focusItem(focusedImage);
      renderLwdImageData(focusedImage);
      renderTagList(focusedImage.tags);
    } else {
      galeryGalery.closeFocus();
      // displayGaleryPageActions();
    }
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
    LwdHashRouter.delete("imageId");
  });

  return galery;
}

function serializeGaleryItems(images, page) {
  return images.slice((page - 1) * pageSize, page * pageSize).map((image) => ({
    ...image,
    id: `image-id-${image._id}`,
    info: `${image.score ? `S${image.score}` : "NS"} | T${image?.tags?.length}`,
    // thumb:
    //   image.src?.thumb ||
    //   image.src?.sample ||
    //   image.src?.original ||
    //   image.imgThumb,
    // src:
    //   image.src?.original ||
    //   image.src?.sample ||
    //   image.src?.thumb ||
    //   image.imgOriginal,
    // tags: image.tags,
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
