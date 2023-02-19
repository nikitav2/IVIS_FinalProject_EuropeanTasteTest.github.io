const center = { lat: 52.5, lng: 17.5 };
const map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 5,
  center: new google.maps.LatLng(center),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  styles: [
    {
      stylers: [
        {
          saturation: 75,
        },
        {
          lightness: 30,
        },
      ],
    },
  ],
  // bound camera to Europe and prevent zooming out
  minZoom: 4,
  restriction: {
    latLngBounds: {
      north: 70,
      south: 35,
      east: 25,
      west: -10,
    },
  },
});

//iterate through data
$.get("data.csv", function (data) {
  //   console.log(data);

  // replace commas in the data with unique placeholder
  data = data.replace(/"(.*?)"/g, (str) => str.replaceAll(",", " ###COMMA###"));

  var lines = data.split("\n");
  console.log(lines.length);

  // iterate through each line of the data
  for (var i = 1; i < 7; i++) {
    var values = lines[i].split(",");
    // values = values.replaceAll("###COMA###", ",");
    // console.log(values);

    // extract relevant information to display in content box
    var latValue = parseFloat(values[12]);
    var lonValue = parseFloat(values[13]);
    var name = values[2];
    var cuisine = values[4].split("###COMMA###");
    var rating = values[6];
    var price = values[7];
    var num_reviews = Number(values[8]).toFixed(0);
    var trip_advisor_link = "www.tripadvisor.com" + values[10];
    // console.log("ta_link: ", trip_advisor_link);

    //Rating,Price Range,Number of Reviews,Reviews,URL_TA,

    var markerPosition = new google.maps.LatLng(latValue, lonValue);
    var markers = new google.maps.Marker({
      position: markerPosition,
      map: map,
      title: name,
    });

    var content =
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
      "<a href =" +
      trip_advisor_link +
      ">" +
      name +
      "</a>" +
      "</span>" +
      "</div>" +
      "</div>";

    var hover_content = name;

    const popup = new google.maps.InfoWindow({
      content: content,
      ariaLabel: name,
    });

    const hover_popup = new google.maps.InfoWindow({
      content: hover_content,
      ariaLabel: name,
    });

    // add listener to open info window when clicked
    google.maps.event.addListener(
      markers,
      "click",
      (function (markers, content) {
        return function () {
          popup.setContent(content);
          console.log("this is content: ", content);
          popup.open(map, markers);
          map.setZoom(15);
          map.setCenter(markers.getPosition());
          console.log("this is location: ", markers.title);
        };
      })(markers, content)
    );

    // add listener to close info window <-- doesn't work yet
    google.maps.event.addListener(markers, "closeclick", () => {
      map.setZoom(5);
      map.setCenter(center);
    });

    //add listener to open smaller popup when hover over
    google.maps.event.addListener(
      markers,
      "mouseover",
      (function (markers, hover_content) {
        return function () {
          hover_popup.setContent(hover_content);
          hover_popup.open(map, markers);
        };
      })(markers, hover_content)
    );

    google.maps.event.addListener(
      markers,
      "mouseout",
      (function (markers, hover_content) {
        return function () {
          hover_popup.close();
        };
      })(markers, hover_content)
    );
  }
});
