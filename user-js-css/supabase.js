// password gxScPZm3yuxhleZj

const Api = class Supabase {
  static #baseApiUrl = "https://egywgecebbxmfvrvgupq.supabase.co/rest/v1";
  static apiKey = localStorage.getItem("Supabase.apiKey");
  static #headers = () => ({
    apikey: Supabase.apiKey,
    Authorization: `Bearer ${Supabase.apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    Prefer: "return=representation",
  });

  static #fetch({ table, method, select = [], filter = {}, body = false }) {
    let selectParam = select.length == 0 ? "" : `select=${select.join(",")}&`;
    let queryParams = `${selectParam}${Supabase.queryToString(filter)}`;

    let params = { method, headers: Supabase.#headers() };
    if (body) params.body = JSON.stringify(body);

    return fetch(`${Supabase.#baseApiUrl}/${table}?${queryParams}`, params);
  }

  // static CRUD
  static create(table, body, select = ["*"]) {
    return Supabase.#fetch({ table, method: "POST", body, select }).then(
      (response) => response.json()
    );
  }

  static read(table, filter = {}, select = ["*"]) {
    return Supabase.#fetch({ table, method: "GET", filter, select }).then(
      (response) => response.json()
    );
  }

  static update(table, filter, body, select = ["*"]) {
    let method = "PATCH";
    return Supabase.#fetch({ table, method, filter, body, select }).then(
      (response) => response.json()
    );
  }

  static delete(table, filter, select = ["*"]) {
    return Supabase.#fetch({ table, method: "DELETE", filter, select }).then(
      (response) => response.json()
    );
  }

  static queryToString(query) {
    return Object.entries(query).reduce(
      (acc, [key, value]) => acc + `${key}=${value}&`,
      ""
    );
  }

  static queryToObject(query) {
    return query.split("&").reduce((acc, condition) => {
      [column, operatorValue] = condition.split("=");
      return { ...acc, [column]: operatorValue };
    }, {});
  }
};
