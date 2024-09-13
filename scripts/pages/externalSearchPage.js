var externalSearchPage,
  externalSearchGalery,
  externalImageList,
  lastExternalSearch,
  focusedExternalImage,
  loadedExternalPage,
  lastExternalPage;
const externalPageSize = mobile ? 15 : 72;
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
    focusedExternalImage = {
      ...externalImageList.find((image) => image.id == imageId),
      index: externalImageList.findIndex((image) => image.id == imageId),
    };

    // // resetAsideContent();
    if (focusedExternalImage?.id) {
      externalSearchGalery.focusItem(focusedExternalImage);
      // renderLwdImageData(focusedExternalImage);
      // renderTagList(focusedExternalImage.tags);
    } else {
      externalSearchGalery.closeFocus();
      // renderGaleryPageActions();
    }
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
    focusedExternalImage = undefined;
    LwdHashRouter.delete("imageId");
  });
  galery.addSwipeListeners();

  return galery;
}

function serializeGaleryItems(images, page) {
  return images.slice((page - 1) * pageSize, page * pageSize).map((image) => ({
    ...image,
    id: `image-id-${image.id}`,
    info: `${image.score ? `S${image.score}` : "NS"} | T${image?.tags?.length}`,
    hash: { ...LwdHashRouter.params, imageId: image.id },
    imgOriginal: image.srcOriginal,
    thumbUrl: image.srcThumb,
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
    LwdHashRouter.set("imageId", item.id);
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
