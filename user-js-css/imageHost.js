console.log("imageHost.js gh");
window.addEventListener("load", () => {
  console.log("imageHost.js gh load LwdHashRouter", LwdHashRouter.params);
  imageHost.apiKey ||= LwdHashRouter.storeAndDelete("imageHostApiKey");
  imageHost.authToken ||= LwdHashRouter.storeAndDelete("imageHostAuthToken");
});
class imageHost {
  static apiKey = localStorage.getItem("imageHostApiKey");
  static authToken = localStorage.getItem("imageHostAuthToken");

  static async ready() {
    return !!imageHost.apiKey;
  }

  static async auth(apiKey) {
    localStorage.setItem("imageHostApiKey", apiKey);
    imageHost.apiKey = apiKey;
    return !!apiKey;
  }

  static async upload(source) {
    uploadUrl = "https://api.imgbb.com/1/upload";
    method = "POST";
    return fetch(`${uploadUrl}?${imageHost.apiKey}&image=${source}`, { method })
      .then((response) => response.json())
      .then((response) => response.data);
  }

  static async delete(hostedId) {
    generalUrl = "https://when-lwd.imgbb.com/json";
    method = "POST";

    formData = new formData();
    formData.append("auth_token", imageHost.authToken);
    formData.append("pathname", "/");
    formData.append("action", "delete");
    formData.append("single", "true");
    formData.append("delete", "image");
    formData.append("deleting[id]", hostedId);

    return fetch(generalUrl, { method })
      .then((response) => response.json())
      .then((response) => response.data);
  }
}
