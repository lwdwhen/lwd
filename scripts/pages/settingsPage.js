var settingsPage;

function createSettingsPage() {
  settingsPage = document.querySelector(`page[href='settings']`);

  rLink = new LwdA({
    textContent: "rule34.xxx",
    href: setupVarsURL(
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
  settingsPage.append(
    new LwdP({
      textContent: `document.body.clientWidth ${document.body.clientWidth}x${document.body.clientHeight}`,
    })
  );
  settingsPage.append(
    new LwdP({
      textContent: `screen.width ${screen.width}x${screen.height}`,
    })
  );
  settingsPage.append(
    new LwdP({
      textContent: `window.innerWidth ${window.innerWidth}x${window.innerHeight}`,
    })
  );
  settingsPage.append(
    new LwdP({
      textContent: `window.devicePixelRatio ${window.devicePixelRatio}`,
    })
  );
}

async function renderSettingsPage() {}

function setupVarsURL(url) {
  return (
    url +
    `#mongoProjectId=${Mongo.projectId}&mongoProvider=${Mongo.provider}&mongoRegion=${Mongo.region}&imageHostApiKey=${imageHost.apiKey}`
  );
}
