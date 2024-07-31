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
  
    static stringifyLocationHash = (params) =>
      Object.entries(params)
        .map((p) => p.join("="))
        .join("&");
  
    static updateLocationHash = () =>
      (location.hash = Object.entries(this.params)
        .map((p) => p.join("="))
        .join("&"));
  
    static get(key) {
      return this.params[key] ? decodeURI(this.params[key]) : "";
    }
  
    static set(key, value) {
      // if (value) this.params[key] = value;
      // else delete this.params[key];
  
      // this.updateLocationHash();
      
      if (value) {
        (location.hash = Object.entries({...this.params,[key]: value })
        .map((p) => p.join("="))
        .join("&"));
      }else delete this.params[key];
    }
  
    static delete(key) {
      delete this.params[key];
      this.updateLocationHash();
    }
  
    static clear() {
      this.params = { href: this.params.href };
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
  
    static locationHashDiffParams() {
      return (
        JSON.stringify(this.params) === JSON.stringify(this.parseLocationHash())
      );
    }
    static refresh() {
      if (this.locationHashDiffParams()) return;
  
      this.params = this.parseLocationHash();
      this.displayPage(this.get("href"));
    }
  }
  // LwdHashRouter.refresh();
  
  addEventListener("hashchange", () => {
    LwdHashRouter.refresh();
  });
  
  class LwdHashLink extends LwdHTML {
    constructor(attrs = { hash: {} }) {
      super("a", attrs);
      if (this.hash && !attrs.href)
        this.href = LwdHashRouter.stringifyLocationHash(this.hash);
  
      this.onclick = (e) => {
        e.preventDefault();
        if(this.quiet) LwdHashRouter.params = this.hash;
        location.hash = LwdHashRouter.stringifyLocationHash(this.hash);
      };
    }
  }
  