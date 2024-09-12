console.log("scraper.js gh");

ratings = {
  e: "explicit",
  q: "questionable",
  s: "general",
  g: "general",
  m: "questionable",
  a: "explicit",
};
// '' 'general' 'sensitive' 'questionable' 'explicit'
// https://danbooru.donmai.us/wiki_pages/howto:rate

Array.prototype.uniq = function () {
  return [...new Set(this)];
};

function renderImportBtn(rawSourceUrl, onclick) {
  let sourceUrlParams = new URL(rawSourceUrl);
  sourceUrlParams.hash = "";
  sourceUrlParams.searchParams.delete("tags");
  let sourceUrl = String(sourceUrlParams);

  importBtn = new LwdContainer({ id: sourceUrl, className: "importBtn" });
  importBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onclick(sourceUrl);
  };

  if (JSON.parse(localStorage.getItem("lwdImported"))?.includes(sourceUrl)) {
    importBtn.classList.add("imported");
    importBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
  }

  return importBtn;
}

async function createImage(imageData) {
  hostImagePomise = imageHost.upload(imageData.sourceToHost);
  imageData = await validateImageData(imageData);
  imageData.addedTags = imageData.tags;
  console.log("createImage", imageData);

  hostedImage = await hostImagePomise;
  console.log(hostedImage);
  imageData.cropedThumbUrl = hostedImage.thumb.url;
  imageData.thumbUrl = hostedImage.medium.url;
  imageData.imageUrl = hostedImage.image.url;
  imageData.hostedId = hostedImage.id;

  return Api.create("images", imageData).then(([response]) => {
    window.snackbar.fire("Image Added", "success");
    LwdHashRouter.set("lwdId", response.id);
    updateLwdImported(imageData.externalHosts[0]);

    return response;
  });
}

async function updateImage(imageLwdId, scrapeFunction) {
  imageDataPromise = scrapeFunction();

  lwdImageDataPromise = Api.read("images", { id: `eq.${imageLwdId}` }).then(
    ([response]) => response
  );

  lwdImageData = await lwdImageDataPromise;
  if (!lwdImageData)
    return window.snackbar.fire("lwdImageData not found", "error");

  imageData = await validateImageData(await imageDataPromise);

  addedTags = imageData.tags.filter((t) => !lwdImageData.tags.includes(t));
  lwdImageData.tags = lwdImageData.tags.concat(imageData.tags).uniq();
  if (addedTags.length > 0 && lwdImageData.addedTags)
    lwdImageData.addedTags = lwdImageData.addedTags.concat(addedTags).uniq();
  else if (addedTags.length > 0) lwdImageData.addedTags = addedTags;

  if (!lwdImageData.rating) lwdImageData.rating = imageData.rating;

  lwdImageData.externalHosts = lwdImageData.externalHosts.concat(
    imageData.externalHosts
  );

  if (lwdImageData.lwdOrder == lwdImageData.postedAt)
    delete lwdImageData.lwdOrder;
  if (lwdImageData.postedAt > imageData.postedAt)
    lwdImageData.postedAt = imageData.postedAt;

  imageLwdId.synced = true;

  // imageData = await validateImageData(imageData);
  console.log("updateImage", lwdImageData, imageData);

  delete lwdImageData._id;

  return Api.update("images", { id: `eq${imageLwdId}` }, lwdImageData).then(
    ([response]) => {
      window.snackbar.fire("Tags Added", "success");
      LwdHashRouter.set("lwdId", imageLwdId);
      updateLwdImported(imageData.externalHosts[0]);

      return response;
    }
  );
}

async function validateImageData(imageData) {
  if (!imageData.rating) imageData.rating = "";
  if (!imageData.tags) imageData.tags = [];
  if (!Array.isArray(imageData.externalHosts))
    imageData.externalHosts = [location.href];
  if (!imageData.postedAt) imageData.postedAt = new Date().toJSON();
  if (!imageData.lwdOrder) imageData.lwdOrder = imageData.postedAt;

  if (imageData.tags.length > 0 || imageData.addedTags.length > 0)
    [imageData.addedTags, imageData.addedTags] = await applyAlias(imageData);

  if (!imageData.addedTags) delete imageData.addedTags;

  return imageData;
}

function applyAlias(imageData) {
  return Mongo.find("aliases", {}).then(({ documents: aliases }) => {
    imageData.tags = loopTagsToApplyAlias(imageData.tags, aliases);

    if (imageData.addedTags)
      imageData.addedTags = loopTagsToApplyAlias(imageData.addedTags, aliases);

    return [imageData.tags, imageData.addedTags];
  });
}

function loopTagsToApplyAlias(tags, aliases) {
  return tags
    .reduce((acc, tag) => [...acc, matchAlias(aliases, tag)], [])
    .flat()
    .uniq()
    .sort();
}

function matchAlias(aliases, tag) {
  return aliases.find(({ from }) => from == tag)?.to || tag;
}

async function updateLwdImported(externalHost) {
  lwdImported = JSON.parse(localStorage.getItem("lwdImported") || "[]");
  newLwdImported = [...lwdImported, externalHost];
  localStorage.setItem("lwdImported", JSON.stringify(newLwdImported));
}

// Call to load images in lwd to host to know which are saved
function loadLwdImported() {
  return Mongo.find("images", { projection: { _id: 1, hosts: 1 } }).then(
    ({ documents: images }) => {
      lwdImagesIds = images
        .filter(({ hosts }) => hosts[location.host])
        .reduce((acc, { _id, hosts }) => {
          acc[_id] = hosts[location.host];
          return acc;
        }, {});
      console.log("lwdImagesIds", lwdImagesIds);
      localStorage.setItem("lwdImagesIds", JSON.stringify(lwdImagesIds));
      window.snackbar.fire("Loaded all images imported to Lwd", "success");
    }
  );
}
