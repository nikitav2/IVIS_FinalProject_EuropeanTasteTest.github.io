var corner1 = L.latLng(29.735139, -34.49296),
  corner2 = L.latLng(81.47299, 46.75348),
  bounds = L.latLngBounds(corner1, corner2);

var mapOptions = {
  //   center: [29.735139, -34.49296],
  maxBounds: bounds,
  center: [52.505, 17.5],
  zoom: 4,
  minZoom: 4,
  zoomDelta: 0.25,
  bounceAtZoomLimits: false,
};

// Creating a map object
var map = new L.map("map", mapOptions);

// Creating a Layer object
var layer = new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png");

// Adding layer to the map
map.addLayer(layer);

var marker = L.marker([51.5, -0.09]).addTo(map);

var compareRows = 0;
var clickedMarkers = [];

// $.get("data.csv", function (data) {
//   data = data.replace(/"(.*?)"/g, (str) => str.replaceAll(",", " ###COMMA###"));
//   var lines = data.split("\n");

//   for (var i = 1; i < 7; i++) {
//     var values = lines[i].split(",");

//     // extract relevant information to display in content box
//     var latValue = parseFloat(values[12]);
//     var lonValue = parseFloat(values[13]);
//     var name = values[2];

//     var cuisine = values[4].split("###COMMA###");
//     var rating = values[6];
//     var price = values[7];
//     var num_reviews = Number(values[8]).toFixed(0);

//     var trip_advisor_link = "www.tripadvisor.com" + values[10];
//     values = [
//       name,
//       latValue,
//       lonValue,
//       cuisine,
//       rating,
//       price,
//       num_reviews,
//       trip_advisor_link,
//     ];
//     // console.log("ta_link: ", trip_advisor_link);

//     //Rating,Price Range,Number of Reviews,Reviews,URL_TA,

//     var clicked_content =
//       '<div id="content">' +
//       "<h1>" +
//       name +
//       "</h1>" +
//       "</div>" +
//       "<div>" +
//       "<span>" +
//       "<b>Cuisines offered:</b> " +
//       cuisine +
//       "</span>" +
//       "</div>" +
//       "<div>" +
//       "<span>" +
//       "<b>Rating:</b> " +
//       rating +
//       "/5.0" +
//       "</span>" +
//       "</div>" +
//       "<div>" +
//       "<span>" +
//       "<b>Price range:</b> " +
//       price +
//       "</span>" +
//       "</div>" +
//       "<div>" +
//       "<span>" +
//       "<b>Number of Reviews:</b> " +
//       num_reviews +
//       "</span>" +
//       "</div>" +
//       "<div>" +
//       "<span>" +
//       "<b>Trip Advisor Link:</b> " +
//       "<a href =" +
//       trip_advisor_link +
//       ">" +
//       name +
//       "</a>" +
//       "</span>" +
//       "</div>" +
//       "</div>";

//     var hover_content = name;
//     var marker = new L.marker([latValue, lonValue])
//       .addTo(map)
//       .bindPopup(clicked_content)
//       .on("click", function (e) {
//         addToTable(values);
//       });

//     marker.bindTooltip(hover_content);
//   }
// });

d3.csv("data.csv", function (i, crime) {
  crime.forEach(function (element) {
    var latValue = parseFloat(element.lat);
    var lonValue = parseFloat(element.lng);
    var name = element.Name;

    var cuisine = element.CuisineStyle;
    var rating = element.Rating;
    var price = element.PriceRange;
    var num_reviews = Number(element.NumberofReviews).toFixed(0);
    var trip_advisor_link = "www.tripadvisor.com" + element.URL_TA;

    var values = [
      name,
      latValue,
      lonValue,
      cuisine,
      rating,
      price,
      num_reviews,
      trip_advisor_link,
    ];

    var clicked_content =
      '<div id="content">' +
      "<h1>" +
      name +
      "</h1>" +
      "</div>" +
      "<div>" +
      "<span>" +
      "<b>Cuisines offered:</b> " +
      cuisine +
      "</span>" +
      "</div>" +
      "<div>" +
      "<span>" +
      "<b>Rating:</b> " +
      rating +
      "/5.0" +
      "</span>" +
      "</div>" +
      "<div>" +
      "<span>" +
      "<b>Price range:</b> " +
      price +
      "</span>" +
      "</div>" +
      "<div>" +
      "<span>" +
      "<b>Number of Reviews:</b> " +
      num_reviews +
      "</span>" +
      "</div>" +
      "<div>" +
      "<span>" +
      "<b>Trip Advisor Link:</b> " +
      "<a href = https://" +
      trip_advisor_link +
      ' target= "_blank" rel="noreferrer">' +
      name +
      "</a>" +
      "</span>" +
      "</div>" +
      "</div>";

    var hover_content = name;
    var marker = new L.marker([latValue, lonValue])
      .addTo(map)
      .bindPopup(clicked_content)
      .on("click", function (e) {
        console.log(clicked_content);
        if (!clickedMarkers.includes(hover_content)) {
          clickedMarkers.push(hover_content);
          addToTable(values, clickedMarkers);
        }
      });

    marker.bindTooltip(hover_content);
  });
});

function addToTable(values, clickedMarkers) {
  compareRows = compareRows + 1;
  var table = document.getElementById("compareVals");
  var row = table.insertRow(compareRows);

  const delete_button = document.createElement("button");
  var id_val = "deleteButton" + values[0];
  var row_id_val = "row" + values[0];
  row.id = row_id_val;

  delete_button.id = id_val;
  delete_button.className = "delete";
  delete_button.innerText = "Delete";

  var nameCell = row.insertCell(0);
  var cuisineCell = row.insertCell(1);
  var ratingCell = row.insertCell(2);
  var priceRangeCell = row.insertCell(3);
  row.appendChild(delete_button);

  nameCell.innerHTML = values[0];
  cuisineCell.innerHTML = values[3];
  ratingCell.innerHTML = values[4];
  priceRangeCell.innerHTML = values[5];

  delete_button.addEventListener("click", () => {
    clickedMarkers.splice(clickedMarkers.indexOf(values[0]), 1);
    document.getElementById(delete_button.id).remove();
    var name = delete_button.id.substring(12);
    var row_id = "row" + name;
    document.getElementById(row_id).remove();
    compareRows = compareRows - 1;
  });
}
