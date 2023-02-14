const center = { lat: 52.5, lng: 17.5 };
const map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 5,
    center: new google.maps.LatLng(center),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{
        "stylers": [{
            "saturation": 75
        }, {
            "lightness": 30
        }]
    }],
    // bound camera to Europe and prevent zooming out
    minZoom: 5,
    restriction: {
        latLngBounds: {
            north: 70,
            south: 35,
            east: 25,
            west: -10,
        },
    },
});

// add a sample marker to the map
const markerPos = { lat: 59.349253, lng: 18.067822 };
const marker = new google.maps.Marker({
    position: markerPos,
    map: map,
    title: "7/11",
});

// create a pop up for the marker
const contentString = 
    '<div id="content">' +
    "<h1 id='firstHeading' class='firstHeading' 7/11 ></h1>" +
    '<div id="bodyContent">' +
    "<p><b>7/11</b> is known for its hot dogs & fried onions. </p>" +
    "</div>" +
    "</div>";

const infowindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: "7/11",
});

// zoom into marker and show pop up when clicked
marker.addListener("click", () => {
    map.setZoom(15);
    map.setCenter(marker.getPosition());

    infowindow.open({
        anchor: marker,
        map,
    });
});

// FIX: not resetting position when closed
infoWindow.addListener('closeclick', ()=>{
    map.setZoom(5);
    map.setCenter(center);
});