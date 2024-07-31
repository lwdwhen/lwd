if (await isAutorized()) createLwd();

function createLwd() {
  document.body.outerHTML = "<body></body>";
  allTags = JSON.parse(localStorage.getItem("allTags")) || [];
}
