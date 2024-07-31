var mongoAccessToken = localStorage.getItem("mongoAccessToken");
var mongoProjectId = localStorage.getItem("mongoProjectId");
var mongoProvider = localStorage.getItem("mongoProvider");
var mongoRegion = localStorage.getItem("mongoRegion");

const mongoApiUrl = (action) =>
  `https://${mongoRegion}.${mongoProvider}.data.mongodb-api.com/app/${mongoProjectId}/endpoint/data/v1/action/${action}`;

function fetchAPI(collection, data) {
  if (data?.filter?._id) data.filter._id = { $oid: data.filter._id };

  return fetch(apiUrl("find"), {
    method: "POST",
    headers: { Authorization: `Bearer ${mongoAccessToken}` },
    body: JSON.stringify({
      dataSource: "lwd",
      database: "lwd",
      collection: collection,
      limit: 50000,
      ...data,
    }),
  }).then(async (response) => {
    if (response.ok) {
      return response.json();
    } else {
      error = await response.json();
      // fireSnackBar(`createAPI: ${error}`, 'error');
      throw error;
    }
  });
}
