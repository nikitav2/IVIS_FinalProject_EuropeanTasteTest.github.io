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

    // d3.json("aust.json", function (error, data) {
    //     if (error) throw error

    //     var overlay = new google.maps.OverlayView();

    //     overlay.onAdd = function () {

    //         var layer = d3.select(this.getPanes().overlayLayer).append("div")


    //         overlay.draw = function () {

    //             var projection = this.getProjection(), padding = 10;

    //             layer.select('svg').remove();

    //             var w = 900;
    //             var h = 600;

    //             var color = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
    //             var heat_color = d3.scale.linear().domain([0, 1]).range(['#b2df8a', '#ff7f00']).interpolate(d3.interpolateHcl);

    //             var overlayProjection = this.getProjection();

    //             // Turn the overlay projection into a d3 projection
    //             var googleMapProjection = function (coordinates) {
    //                 var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
    //                 var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
    //                 return [pixelCoordinates.x, pixelCoordinates.y];
    //             }

    //             var path = d3.geo.path().projection(googleMapProjection);

    //             var svg = layer.append("svg")
    //                 .attr('width', w)
    //                 .attr('height', h)

    //             var g = svg.selectAll("g")
    //                 .data(data)
    //                 .enter()
    //                 .append("g");

    //             g.selectAll("path")
    //                 .data(function (d) {
    //                     return d.comuni;
    //                 })
    //                 .enter()
    //                 .append("path")
    //                 .attr("d", path)
    //                 .attr('class', 'state selected')
    //                 .style("fill", function (d, i) {
    //                     return color[i % color.length];
    //                 })
    //                 .style('opacity', .7);

    //         }
    //     }
    //     overlay.setMap(map);

    // });
