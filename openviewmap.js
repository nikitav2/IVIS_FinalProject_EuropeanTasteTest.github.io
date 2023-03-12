//4353 data points
var corner1 = L.latLng(29.735139, -34.49296),
  corner2 = L.latLng(81.47299, 46.75348),
  bounds = L.latLngBounds(corner1, corner2);

var mapOptions = {
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
// displayBarChart();
// formatData();

var markers = L.layerGroup();

var compareRows = 0;
var clickedMarkers = [];
var isCityPresent = false;

var cityFilterValues = [];
var priceFilterValues = [];
var dietaryFilterValues = [];
var ratingFilterValues = [];
var cuisineFilterValues = [];
// var favoriteName = ["Bagels & Beans", "Campo Di Fiori", "C"];
var favoriteName = [];

function parseCuisine(cuisineVal) {
  cuisineVal = cuisineVal.substring(1, cuisineVal.length - 1);
  cuisineVal = cuisineVal.replaceAll(" Options", "");
  cuisineVal = cuisineVal.replaceAll(" Friendly", "");
  cuisineVal = cuisineVal.replaceAll("'", "");
  cuisineVal = cuisineVal.split(", ");
  // console.log("in parseCuisine: ", cuisineVal);
  return cuisineVal;
}

function parseArg(evt, params) {
  var toAdd = false;
  var value = "";
  if ("selected" in params) {
    toAdd = true;
    value = params["selected"];
  } else {
    toAdd = false;
    value = params["deselected"];
  }

  if (evt == "city-filters") {
    if (toAdd) {
      cityFilterValues.push(value);
    } else {
      cityFilterValues.splice(cityFilterValues.indexOf(value), 1);
    }
  }

  if (evt == "price-filters") {
    if (toAdd) {
      priceFilterValues.push(value);
    } else {
      priceFilterValues.splice(priceFilterValues.indexOf(value), 1);
    }
  }

  if (evt == "restriction-filters") {
    if (toAdd) {
      dietaryFilterValues.push(value);
    } else {
      dietaryFilterValues.splice(dietaryFilterValues.indexOf(value), 1);
    }
  }

  if (evt == "rating-filters") {
    if (toAdd) {
      ratingFilterValues.push(value);
    } else {
      ratingFilterValues.splice(ratingFilterValues.indexOf(value), 1);
    }
  }

  if (evt == "cuisine-filters") {
    if (toAdd) {
      cuisineFilterValues.push(value);
    } else {
      cuisineFilterValues.splice(cuisineFilterValues.indexOf(value), 1);
    }
  }
  // console.log(cityFilterValues);
  // console.log(priceFilterValues);
  // console.log(dietaryFilterValues);
  // console.log(ratingFilterValues);
  // console.log(cuisineFilterValues);
}

function displayData(evt, params) {
  // console.log("in display data");
  var isDisplayFavorites = false;
  // console.log(evt);
  if (evt == "favorites") {
    isDisplayFavorites = true;
    // console.log(evt, isDisplayFavorites);
  } else {
    parseArg(evt, params);
  }

  markers.clearLayers();
  console.log(isDisplayFavorites);

  if (
    document.getElementById("city-filters").value == "" &&
    !isDisplayFavorites
  ) {
    // console.log("no cities");
    document.getElementById("instructions").style.visibility = "visible";
  } else if (
    isDisplayFavorites == true ||
    document.getElementById("city-filters").value != ""
  ) {
    isCityPresent = true;
    // console.log("in second part of is");
    // console.log("city is present");
    document.getElementById("instructions").style.visibility = "hidden";

    d3.csv("data.csv", function (i, totalData) {
      var filteredData = totalData.filter(function (rest) {
        var isValidCity = false;
        var isValidPrice = false;
        var isValidRating = false;
        var isValidCuisine = false;
        var isValidDiet = false;

        var parsedCuisineVals = parseCuisine(rest.CuisineStyle);

        if (isDisplayFavorites) {
          // console.log("display favorites in here");
          if (favoriteName.includes(rest.Name)) {
            return true;
          }
        }

        if (cityFilterValues.includes(rest.City)) {
          isValidCity = true;
        }

        if (
          priceFilterValues.includes(rest.PriceRange) ||
          priceFilterValues.length == 0
        ) {
          isValidPrice = true;
        }
        if (
          ratingFilterValues.includes(rest.Rating) ||
          ratingFilterValues.length == 0
        ) {
          isValidRating = true;
        }
        if (
          dietaryFilterValues.every((v) => parsedCuisineVals.includes(v)) ||
          dietaryFilterValues.length == 0
        ) {
          isValidDiet = true;
        }
        if (
          cuisineFilterValues.every((v) => parsedCuisineVals.includes(v)) ||
          cuisineFilterValues.length == 0
        ) {
          isValidCuisine = true;
        }

        return (
          isValidCity &&
          isValidPrice &&
          isValidRating &&
          isValidDiet &&
          isValidCuisine
        );
      });

      // console.log(totalData[3]);
      // console.log(filteredData[3]);
      console.log("filtereData length: ", filteredData.length);

      filteredData.forEach(function (element) {
        // console.log(unpack(element, "CuisineStyle"));
        // console.log(unpack(element, "City"));

        var latValue = parseFloat(element.lat);
        var lonValue = parseFloat(element.lng);
        var name = element.Name;

        var cuisine = parseCuisine(element.CuisineStyle);

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
          // .addTo(map)
          .bindPopup(clicked_content)
          .on("click", function (e) {
            // console.log(clicked_content);
            if (!clickedMarkers.includes(hover_content)) {
              clickedMarkers.push(hover_content);
              addToTable(values, clickedMarkers);
            }
          });

        marker.bindTooltip(hover_content);
        markers.addLayer(marker);
      });

      markers.addTo(map);
    });
  }
}

function displayBarChart() {
  console.log("here");
  var margin = { top: 10, right: 30, bottom: 20, left: 30 },
    width = 500,
    height = 500;

  // append the svg object to the body of the page
  var svg = d3
    .select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv("data.csv", function (data) {
    var subgroups = data.columns.slice(1);
    // console.log("in data: ", data.columns.slice(1));
    console.log("in data: ", data.columns);

    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function (d) {
          return d.City;
        })
      )
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.City);
      })
      .attr("y", function (d) {
        return y(d.Rating);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.Rating);
      })
      .attr("fill", "#69b3a2");

    /*
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3
      .map(data, function (d) {
        return d.group;
      })
      .keys();

    // Add X axis
    var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Another scale for subgroup position?
    var xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    // color palette = one color per subgroup
    var color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    // Show the bars
    svg
      .append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d.group) + ",0)";
      })
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xSubgroup(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", function (d) {
        return color(d.key);
      });
      */
  });
}

function formatData() {
  d3.csv("data.csv", function (data) {
    var root = d3
      .hierarchy(
        {
          values: d3
            .nest()
            .key(function (d) {
              return d.City;
            })
            .entries(data),
        },
        function (d) {
          return d.values;
        }
      )
      .sum(function (d) {
        return d.Rating;
      });

    console.log(root);
  });
}

function addToTable(values, clickedMarkers) {
  compareRows = compareRows + 1;
  var table = document.getElementById("compareVals");
  var row = table.insertRow(compareRows);

  const delete_button = document.createElement("button");
  const delete_icon = document.createElement("span");
  delete_icon.className = "material-symbols-outlined md-48";
  delete_icon.appendChild(document.createTextNode("delete"));
  delete_button.append(delete_icon);
  var id_val = "deleteButton" + values[0];
  var row_id_val = "row" + values[0];
  row.id = row_id_val;

  delete_button.id = id_val;
  delete_button.className = "delete";
  // delete_button.innerText = "Delete";

  const favorite_button = document.createElement("button");
  const favorite_icon = document.createElement("span");
  favorite_icon.className = "material-symbols-outlined md-48";
  favorite_icon.appendChild(document.createTextNode("star"));
  var fav_id_val = "favoriteButton" + values[0];
  favorite_button.id = fav_id_val;
  favorite_button.className = "favorite";
  favorite_button.append(favorite_icon);
  // favorite_button.innerText = "Favorite";

  var nameCell = row.insertCell(0);
  var cuisineCell = row.insertCell(1);
  var ratingCell = row.insertCell(2);
  var priceRangeCell = row.insertCell(3);

  row.appendChild(favorite_button);
  row.appendChild(delete_button);

  nameCell.innerHTML = values[0];
  cuisineCell.innerHTML = values[3];
  ratingCell.innerHTML = values[4];
  priceRangeCell.innerHTML = values[5];

  favorite_button.addEventListener("click", () => {
    var restName = values[0];

    if (!favoriteName.includes(restName)) {
      favoriteName.push(restName);
      // console.log("here");
      var fav = document.createElement("div");
      fav.className = "favoriteRow";
      fav.id = "fav" + restName;
      fav.appendChild(document.createTextNode(restName));

      const delete_fav = document.createElement("button");
      const delete_fav_icon = document.createElement("span");
      delete_fav_icon.className = "material-symbols-outlined";
      delete_fav_icon.appendChild(document.createTextNode("delete"));
      delete_fav.append(delete_fav_icon);
      delete_fav.className = "delete_fav";

      fav.appendChild(delete_fav);
      document.getElementById("favorite-section").appendChild(fav);

      delete_fav.addEventListener("click", () => {
        favoriteName.splice(favoriteName.indexOf(restName), 1);
        document.getElementById(fav.id).remove();
      });
    }
  });

  delete_button.addEventListener("click", () => {
    clickedMarkers.splice(clickedMarkers.indexOf(values[0]), 1);
    document.getElementById(delete_button.id).remove();
    var name = delete_button.id.substring(12);
    var row_id = "row" + name;
    document.getElementById(row_id).remove();
    compareRows = compareRows - 1;
  });
}
