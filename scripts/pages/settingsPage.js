var settingsPage;

function createSettingsPage() {
  settingsPage = document.querySelector(`page[href='settings']`);

  rLink = new LwdA({
    textContent: "rule34.xxx",
    href: setupMongoURL(
      "https://rule34.xxx/index.php?page=post&s=list&tags=all"
    ),
  });

  settingsPage.append(rLink);
  settingsPage.append(new LwdP({ textContent: "logout", onclick: logout }));
  settingsPage.append(
    new LwdP({
      textContent: "snackbar",
      onclick: () => window.snackbar.fire("11"),
    })
  );
}

async function renderSettingsPage() {}

async function setupMongoURL(url) {
  return (
    url +
    `#mongoProjectId=${Mongo.projectId}&mongoProvider=${Mongo.provider}&mongoRegion=${Mongo.region}&imageHostApiKey=${imageHost.apiKey}`
  );
}
