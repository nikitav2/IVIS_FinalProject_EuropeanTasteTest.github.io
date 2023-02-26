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

$.get("data.csv", function (data) {
  data = data.replace(/"(.*?)"/g, (str) => str.replaceAll(",", " ###COMMA###"));
  var lines = data.split("\n");

  for (var i = 1; i < 7; i++) {
    var values = lines[i].split(",");

    // extract relevant information to display in content box
    var latValue = parseFloat(values[12]);
    var lonValue = parseFloat(values[13]);
    var name = values[2];
    var cuisine = values[4].split("###COMMA###");
    var rating = values[6];
    var price = values[7];
    var num_reviews = Number(values[8]).toFixed(0);
    // var trip_advisor_link = "www.tripadvisor.com" + values[10];
    // console.log("ta_link: ", trip_advisor_link);

    //Rating,Price Range,Number of Reviews,Reviews,URL_TA,

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
      // "<div>" +
      // "<span>" +
      // "<b>Trip Advisor Link:</b> " +
      // "<a href =" +
      // trip_advisor_link +
      // ">" +
      // name +
      // "</a>" +
      // "</span>" +
      // "</div>" +
      "</div>";

    var hover_content = name;
    var hover_popup = L.popup();

    var marker = L.marker([latValue, lonValue]).addTo(map);

    marker.bindPopup("Long description with extra formatting ...");
    marker.bindTooltip("Short description");
    marker.on("mouseover", showHideTooltip);
    marker.on("click", clickHideTooltip);

    // marker
    //   .on("click", (event) => {
    //     console.log(clicked_content);
    //     event.target.bindPopup(clicked_content).openPopup();
    //   })
    //   .on("mouseover", (event) => {
    //     console.log("hovered over");
    //     event.target
    //       .bindTooltip(hover_content, { noHide: false })
    //       .openTooltip();
    //     event.setStyle;
    //   })
    //   .on("mouseout", (event) => {
    //     console.log("hovered out");
    //     event.target.closePopup();
    //   });
  }
});

function showHideTooltip() {
  var mytooltip = this.getTooltip();
  if (this.isPopupOpen()) {
    // Popup is open, set opacity to 0 (invisible)
    mytooltip.setOpacity(0.0);
  } else {
    // Popup is cosed, set opacity back to visible
    mytooltip.setOpacity(0.9);
  }
}

function clickHideTooltip() {
  var mytooltip = this.getTooltip();
  mytooltip.setOpacity(0.0);
}
