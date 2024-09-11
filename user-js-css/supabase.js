// password gxScPZm3yuxhleZj

class Supabase {
  static #baseApiUrl = "https://egywgecebbxmfvrvgupq.supabase.co/rest/v1";
  static apiKey = localStorage.getItem("Supabase.apiKey");
  static #headers = () => ({
    apikey: Supabase.apiKey,
    Authorization: `Bearer ${Supabase.apiKey}`,
    "Content-Type": "application/json",
  });

  // static CRUD
  static create(table, data) {
    return fetch(`${Supabase.#baseApiUrl}/${table}`, {
      method: "POST",
      headers: Supabase.#headers(),
      body: JSON.stringify(data),
    });
  }

  static read(table, query = {}, select = ["*"]) {
    let selectParam = `select=${select.join(",")}&`;
    let queryParams = `${selectParam}${Supabase.queryToString(query)}`;

    return fetch(`${Supabase.#baseApiUrl}/${table}?${queryParams}`, {
      method: "GET",
      headers: Supabase.#headers(),
    });
  }

  static update(table, query, data) {
    let queryParams = `${Supabase.queryToString(query)}`;

    return fetch(`${Supabase.#baseApiUrl}/${table}?${queryParams}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(data),
    });
  }

  static delete(table, query) {
    let queryParams = `${Supabase.queryToString(query)}`;

    return fetch(`${Supabase.#baseApiUrl}/${table}?${queryParams}`, {
      method: "DELETE",
      headers: headers(),
    });
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
}
