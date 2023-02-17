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

  data = data.replace(/"(.*?)"/g, (str) => str.replaceAll(",", "###COMMA###"));
  var lines = data.split("\n");
  console.log(lines.length);

  for (var i = 1; i < 7; i++) {
    var values = lines[i].split(",");
    // values = values.replaceAll("###COMA###", ",");
    // console.log(values);

    var latValue = parseFloat(values[12]);
    // console.log("this is lat: ", latValue);
    var lonValue = parseFloat(values[13]);
    // console.log("this is lon: ", lonValue);

    var name = values[2];
    var markerPosition = new google.maps.LatLng(latValue, lonValue);
    // var markerPosition = { lat: Number(latValue), lng: Number(lonValue) };
    var markers = new google.maps.Marker({
      position: markerPosition,
      map: map,
      title: name,
    });

    var content = '<div id="content">' + "<h1>" + name + "</h1>" + "</div>";

    const popup = new google.maps.InfoWindow({
      content: content,
      ariaLabel: name,
    });

    // markers.addListener("click", () => {
    //   map.setZoom(15);
    //   console.log(markers.getPosition());
    //   map.setCenter(markers.getPosition());

    //   popup.open({
    //     anchor: markers,
    //     map,
    //   });
    // });

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

    google.maps.event.addListener(markers, "closeclick", () => {
      map.setZoom(5);
      map.setCenter(center);
    });
  }
});

// add a sample marker to the map
// const markerPos = { lat: 59.349253, lng: 18.067822 };
// const marker = new google.maps.Marker({
//   position: markerPos,
//   map: map,
//   title: "7/11",
// });

// // create a pop up for the marker
// const contentString =
//   '<div id="content">' +
//   "<h1 id='firstHeading' class='firstHeading' 7/11 ></h1>" +
//   '<div id="bodyContent">' +
//   "<p><b>7/11</b> is known for its hot dogs & fried onions. </p>" +
//   "</div>" +
//   "</div>";

// const infowindow = new google.maps.InfoWindow({
//   content: contentString,
//   ariaLabel: "7/11",
// });

// // zoom into marker and show pop up when clicked
// marker.addListener("click", () => {
//   map.setZoom(15);
//   map.setCenter(marker.getPosition());

//   infowindow.open({
//     anchor: marker,
//     map,
//   });
// });

// FIX: not resetting position when closed
// infowindow.addListener("closeclick", () => {
//   map.setZoom(5);
//   map.setCenter(center);
// });
