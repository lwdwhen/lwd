function createSideSection() {
  sideSection = document.createElement("section");
  document.body.append(sideSection);
  sideSection.id = "side-section";
  sideSection.className = "explandable";
  sideSection.onmouseenter = () => {
    document.querySelector("#top-section").classList.add("expanded");
    document.querySelector("#side-section").classList.add("expanded");
  };
  sideSection.onmouseleave = () => {
    document.querySelector("#top-section").classList.remove("expanded");
    document.querySelector("#side-section").classList.remove("expanded");
  };

  mobileToogleBtn = new LwdContainer({ id: "mobile-toogle-btn" });

  sideSectionPinBtn = new LwdContainer({ id: "side-section-pin" });
  sideSection.append(sideSectionPinBtn);
  sideSectionPinBtn.onclick = () => {
    document.querySelector("#top-section").classList.toggle("pinned");
    document.querySelector("#side-section").classList.toggle("pinned");
  };

  sideSectionContent = document.createElement("aside");
  sideSection.append(sideSectionContent);
  sideSectionContent.id = "side-section-content";

  sideSectionContent.append(createGaleryPageActions());
  sideSectionContent.append(createTagList());
  // sideSectionContent.append(createTagListStructure());

  return sideSection;
}

function resetAsideContent() {
  sideSectionContent.childNodes.forEach((child) => (child.hidden = true));

  tagListContainer.querySelectorAll("ul").forEach((tagGroup) => {
    tagGroup.hidden = true;
    tagGroup.querySelectorAll("li").forEach((li) => li.remove());
  });
}

function createTagList() {
  tagListContainer = new LwdContainer({ id: "tag-list", hidden: true });

  ["favorite", ...Object.keys(categoriesOrder)].forEach((category) => {
    tagGroup = new LwdList([], { className: category, hidden: true });
    tagListContainer.append(tagGroup);
    tagGroup.append(new LwdHeader(4, { textContent: category }));
  });

  return tagListContainer;
}

async function renderTagList(tags) {
  tagListContainer.hidden = false;
  appendToSeach = (sign, tagName) =>
    (document.querySelector("#top-search input").value += ` ${
      sign + tagName
    } `);

  tags.sort().forEach((tagName) => {
    tag = allTags.find((tag) => tag.name == tagName);
    category = tag?.category || "unknown";

    tagGroup = tagListContainer.querySelector(`.${category}`);
    tagGroup.hidden = false;

    tagGroup.append((tagItem = new LwdListItem()));

    attrs = { textContent: "+", onclick: () => appendToSeach("", tagName) };
    tagItem.append(new LwdP(attrs));

    attrs = { textContent: "-", onclick: () => appendToSeach("-", tagName) };
    tagItem.append(new LwdP(attrs));

    hashLink = { href: "galery", galerySearch: tagName };
    tagItem.append(new LwdHashLink(hashLink, { textContent: tagName }));

    tagItem.append(new LwdP({ textContent: tag?.count }));
  });
}

function createGaleryPageActions() {
  galeryActionsContainer = new LwdContainer({
    id: "galery-actions",
    hidden: true,
  });

  galeryActionsContainer.append((deleteTile = new LwdTile()));
  deleteTile.append(new LwdSvg("delete"));
  deleteTile.onclick = () => document.body.classList.toggle("delete-mode");

  galeryActionsContainer.append((externalSearchTile = new LwdTile()));
  externalSearchTile.append(new LwdSvg("externalLink"));
  externalSearchTile.onclick = () => externalSearchModal.open();
  galeryActionsContainer.append((externalSearchModal = new LwdModal()));

  return galeryActionsContainer;
}

async function renderGaleryPageActions() {
  resetAsideContent();
  galeryActionsContainer.hidden = false;
}

function createLwdImageForm() {
  imageDataForm = new LwdForm({ id: "image-data", hidden: true });

  imageDataForm.append(new LwdInput({ name: "_id", hidden: true }));

  scoreInput = new LwdInput({ name: "score", type: "range", min: 1, max: 99 });
  imageDataForm.append(scoreInput);
  scoreInput.oninput = ({ target }) =>
    (document.querySelector("#score-value").textContent = `S${target.value}`);

  imageDataForm.append(new LwdInput({ name: "lwdOrder" }));

  imageDataForm.append(new LwdP({ id: "score-value" }));

  ratingsOptions = ratings.map((r) => ({ textContent: r, value: r }));
  ratingInput = new LwdSelect(ratingsOptions, { name: "rating" });
  imageDataForm.append(ratingInput);

  imageDataForm.append(new LwdInput({ name: "postedAt" }));

  externalLinkTile = new LwdTile({ id: "external-link", title: "hosts" });
  imageDataForm.append(externalLinkTile);
  externalLinkTile.append(new LwdSvg("externalLink"));

  poolTile = new LwdTile({ id: "pool", title: "pool" });
  imageDataForm.append(poolTile);
  poolTile.append(new LwdSvg("pool"));

  favoriteTile = new LwdTile({ id: "favorite", title: "favorite" });
  imageDataForm.append(favoriteTile);
  favoriteTile.append(new LwdSvg("heart"));

  saveTile = new LwdTile({ id: "save", title: "save" });
  imageDataForm.append(saveTile);
  saveTile.append(new LwdSvg("ok"));
  saveTile.onclick = submitLwdImageData;

  sauceTile = new LwdTile({ id: "sauce", title: "sauce" });
  imageDataForm.append(sauceTile);
  sauceTile.append(new LwdSvg("globe"));

  aiTagsTile = new LwdTile({ id: "ai-tags", title: "ai-tags" });
  imageDataForm.append(aiTagsTile);
  aiTagsTile.append(new LwdSvg("globe"));

  return imageDataForm;
}

async function renderLwdImageForm(image) {
  imageDataForm.hidden = false;

  imageDataForm.querySelector("[name=_id]").value = image._id;
  imageDataForm.querySelector("[name=score]").value = image.score || 1;
  displayScore = image.score ? `S${image.score}` : "NS";
  imageDataForm.querySelector("#score-value").textContent = displayScore;
  imageDataForm.querySelector("[name=lwdOrder]").value = image.lwdOrder;
  imageDataForm.querySelector("[name=rating]").value = image.rating;
  imageDataForm.querySelector("[name=postedAt]").value = image.postedAt;

  sauceTile.onclick = () => redirectToLiveSauce(image.imgOriginal, image._id);
  aiTagsTile.onclick = async () => {
    if (document.querySelector("#ai-tags-modal"))
      document.querySelector("#ai-tags-modal").open();
    else imageDataForm.append(await renderAiTagsSuggestions(image));
  };
}

function submitLwdImageData() {
  console.log(imageDataForm.getFormData());
}

function renderImagePools(imageId) {
  // Pools that contain the img
  // await fetchAPI('pools', {filter: {images: {$in: ["6623c75d44b66091214a8185"]}}}).then((r)  => r.documents)
  // imgs from pool
  // await fetchAPI('images', {filter: {_id: {$in: [{$oid: "6623d65144b66091214d4721"}]}}}).then((r)  => r.documents)
}

async function renderAiTagsSuggestions(image) {
  document.querySelector(":not(.pinned) > #side-section-pin")?.click();

  aiTagsPromise = requestToGenerateAiTags(image.imgOriginal);

  aiTagsModal = new LwdModal({ id: "ai-tags-modal" });
  aiTagsModal.header.textContent = "Ai Generated Tags";

  checkOrUncheckContainer = new LwdContainer({ className: "checkOrUncheck" });
  aiTagsModal.body.append(checkOrUncheckContainer);
  selectAllAiTagsTile = new LwdTile({ textContent: "Check All" });
  checkOrUncheckContainer.append(selectAllAiTagsTile);
  selectAllAiTagsTile.onclick = () => checkOrUncheckAll("check");
  deselectAllAiTagsTile = new LwdTile({ textContent: "Uncheck All" });
  checkOrUncheckContainer.append(deselectAllAiTagsTile);
  deselectAllAiTagsTile.onclick = () => checkOrUncheckAll("uncheck");

  addAiTagsTile = new LwdTile({ textContent: "Add Tags" });
  aiTagsModal.action.append(addAiTagsTile);
  addAiTagsTile.onclick = () => addAiTagsToLwdImage(image._id);

  aiTagsModal.open();

  aiTagsPromise.then(({ rating: aiRating, tags: aiTags }) => {
    aiTags.forEach((tag) =>
      aiTagsModal.body.append(renderAiTagInput(tag, image.tags))
    );
  });

  return aiTagsModal;
}

function renderAiTagInput({ label: aiTag, confidence }, imageTags) {
  container = new LwdContainer();

  if (imageTags.find((tag) => tag == aiTag)) {
    // Image already have this aiTag
    container.append(new LwdLabel({ textContent: aiTag, className: "dupe" }));
  } else {
    inputAttrs = { type: "checkbox", checked: true, name: aiTag };
    container.append(new LwdInput(inputAttrs));
    container.append(new LwdLabel({ textContent: aiTag }));
  }

  return container;
}

async function addAiTagsToLwdImage(imageId) {
  checkedInputs = document.querySelectorAll("#ai-tags-modal input:checked");
  checkedTags = [...checkedInputs].map((input) => input.name);

  checkedTags = await applyAlias(checkedTags);

  console.log("checkedTags", checkedTags);

  if (checkedTags.length < 1) return;

  data = {
    tags: { $each: checkedTags, $sort: 1 },
    addedTags: { $each: checkedTags, $sort: 1 },
  };
  return updateManyAPI("images", { _id: imageId }, { $push: data }).then(
    (response) => {
      fireSnackBar("Tags added", "success");
      return response;
    }
  );
}

function checkOrUncheckAll(check) {
  if (check == "check") query = ":not(:checked)";
  else query = ":checked";

  document
    .querySelectorAll(`#ai-tags-modal input${query}`)
    .forEach((input) => input.click());
}
