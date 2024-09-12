const externalApi = class {
  static fetchRule34xxx(search) {
    return fetch(
      `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=600&tags=${search}`
    )
      .then((response) => response.json())
      .then((response) => {
        return response.map((image) => ({
          id: image.id,
          src: image.file_url,
          tags: image.tags.split(" "),
          domain: "https://rule34.xxx",
          href: `https://rule34.xxx/index.php?page=post&s=view&id=${image.id}`,
          source: image.source,
        }));
      })
      .catch((e) => console.log("cant fetch from fetchRule34xxx", e));
  }
};
