class LwdHashRouter {
  static params = {};
  static href = "";

  static parseLocationHash = () =>
    Object.fromEntries(
      location.hash
        .slice(1)
        .split("&")
        .map((h) => h.split("="))
        .filter(([key, ...value]) => !!key)
    );

  static updateLocationHash = () =>
    (location.hash = Object.entries(this.params)
      .map((p) => p.join("="))
      .join("&"));

  static get(key) {
    return this.params[key] ? decodeURI(this.params[key]) : "";
  }

  static set(key, value) {
    if (value) this.params[key] = value;
    else delete this.params[key];

    this.updateLocationHash();
  }

  static delete(key) {
    delete this.params[key];
    this.updateLocationHash();
  }

  static clear() {
    params = { href: this.params.href };
    this.updateLocationHash();
  }

  static renderPage({ href }) {
    let page = document.createElement("page");
    page.setAttribute("href", href);
    return page;
  }

  // pagesDefinitions = [{ href, onCreate, onRender }]
  static createPages(pagesDefinitions, funcRenderPage = this.renderPage) {
    pagesDefinitions.forEach((params) => {
      document.body.append(funcRenderPage(params));
      params.onCreate();
    });
    LwdHashRouter.refresh();
    // // href: 'lwd', onCreate: () => {}, onRender: () => {}
    // Object.entries(pathsAndFunctions).forEach(([href, routingFunction]) => {
    //   let pageLoadFunc = () =>{
    //     this.displayPage(href)
    //     routingFunction()
    //   }

    //   document.querySelector("main").append(funcRenderPage({ href, pageLoadFunc }));

    //   this[routingFunction.name] = async () => {
    //     LwdGenericRouter.displayPage(pathname);
    //     routingFunction(params);
    //   };

    // });

    // if (this.get('page') == pathname)
    //     setTimeout(() => this[routingFunction.name](this.hashParams), 5);
  }

  static hideAllPages() {
    document.querySelectorAll("page").forEach((page) => (page.hidden = true));
  }

  static displayPage(href) {
    this.hideAllPages();
    let page = document.querySelector(`page[href='${href}']`);
    console.log("displayPage", href, page);
    if (page) page.hidden = false;
    if (page) page.onRender();
    this.href = href;
    this.set("href", href);
  }

  static refresh() {
    this.params = this.parseLocationHash();
    if (this.get("href") != this.href) this.displayPage(this.get("href"));
  }
}
// LwdHashRouter.refresh();

addEventListener("hashchange", () => {
  LwdHashRouter.refresh();
});
