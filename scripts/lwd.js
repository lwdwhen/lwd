createLwd()

async function createLwd() {
  if (!(await isAutorized())) return;
  document.body.outerHTML = "<body></body>";
  allTags = JSON.parse(localStorage.getItem("allTags")) || [];
}

class test {}