//4353 data points
//copenhagen
//59999,14419,Leon,London,,14430,3.5,,4,"[['First Timer but enjoyed it', 'One of the lastest very good chain'], ['09/14/2017', '09/11/2017']]",/Restaurant_Review-g186338-d12718774-Reviews-Leon-London_England.html,d12718774,51.5134,-0.13647

// var corner1 = L.latLng(30.735139, -50.49296),
//   // corner2 = L.latLng(76.47299, 45.75348),
//   corner2 = L.latLng(81.47299, 46.75348),
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

var markers = L.layerGroup();

var compareRows = 0;
var clickedMarkers = [];
var isCityPresent = false;

var cityFilterValues = [];
var priceFilterValues = [];
var dietaryFilterValues = [];
var ratingFilterValues = [];
var cuisineFilterValues = [];
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

function parseCuisine2(cuisineVal) {
  cuisineVal = cuisineVal.substring(1, cuisineVal.length - 1);
  cuisineVal = cuisineVal.replaceAll(" Options", "");
  cuisineVal = cuisineVal.replaceAll(" Friendly", "");
  cuisineVal = cuisineVal.replaceAll("'", "");
  // cuisineVal = cuisineVal.split(", ");
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
  // console.log(isDisplayFavorites);

  if (document.getElementById("city-filters").value == "") {
    // console.log("no cities");
    document.getElementById("instructions").style.visibility = "visible";
    isCityPresent = false;
  }

  if (
    isDisplayFavorites == true ||
    document.getElementById("city-filters").value != ""
  ) {
    if (document.getElementById("city-filters").value != "") {
      isCityPresent = true;
      document.getElementById("instructions").style.visibility = "hidden";
    }

    d3.csv("final_reduced.csv", function (i, totalData) {
      var filteredData = totalData.filter(function (rest) {
        var isValidCity = false;
        var isValidPrice = false;
        var isValidRating = false;
        var isValidCuisine = false;
        var isValidDiet = false;

        var parsedCuisineVals = parseCuisine(rest.CuisineStyle);

        if (isDisplayFavorites) {
          if (favoriteName.includes(rest.Name)) {
            console.log("display favorites in here: ", favoriteName);
            return true;
          }
        } else {
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
        }
      });

      // console.log(totalData[3]);
      // console.log(filteredData[3]);
      console.log("\n\n\n");
      console.log("filtereData length from filters: ", filteredData.length);
      console.log(filteredData);

      filteredData.forEach(function (element) {
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
          '<div id="content" style="overflow-y:scroll;overflow-x:scroll">' +
          "<h1>" +
          name +
          "</h1>" +
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

function displayData2(evt, params) {
  // console.log("in display data");
  var isDisplayFavorites = false;
  // console.log(evt);
  if (evt == "favorites") {
    isDisplayFavorites = true;
    // console.log(evt, isDisplayFavorites);
  } else {
    parseArg(evt, params);
  }

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

    d3.csv("final_csv_small2.csv", function (i, totalData) {
      var filteredData = totalData.filter(function (rest) {
        var isValidCity = false;
        var isValidPrice = false;
        var isValidRating = false;
        var isValidCuisine = false;
        var isValidDiet = false;

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
          dietaryFilterValues.includes(parseCuisine2(rest.CuisineStyle)) ||
          dietaryFilterValues.length == 0
        ) {
          isValidDiet = true;
        }
        if (
          cuisineFilterValues.includes(parseCuisine2(rest.CuisineStyle)) ||
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
      // console.log(filteredData);
      createSunBurst(filteredData);
    });
  }
}

function createSunBurst(filteredData) {
  document.getElementById("sunchart").remove();

  d3.select("#sunchart").selectAll("*").remove();

  console.log("filtereData length from sunburst: ", filteredData.length);
  console.log(filteredData);

  var nest = d3
    .nest()
    .key(function (d) {
      return d.City;
    })
    .key(function (d) {
      return d.CuisineStyle;
    })
    .key(function (d) {
      return d.PriceRange;
    })
    .key(function (d) {
      return d.Rating;
    })
    .key(function (d) {
      return d.Name;
    })
    .entries(filteredData);

  var root1 = { key: "World", values: nest };

  var data = {
    name: "World",
    children: root1.values.map(function (City) {
      return {
        name: City.key,
        children: City.values.map(function (CuisineStyle) {
          return {
            name: CuisineStyle.key,
            children: CuisineStyle.values.map(function (PriceRange) {
              return {
                name: PriceRange.key,
                children: PriceRange.values.map(function (Rating) {
                  return {
                    name: Rating.key,
                    children: Rating.values.map(function (Name) {
                      return {
                        name: Name.key,
                        size: Name.values.length,
                      };
                    }),
                  };
                }),
              };
            }), //end of map(function(country){
          };
        }), //end of map(function(region){
      };
    }), //end of map(function(major){
  }; //end of var declaration
  // console.log(data);

  var partition = (data) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => d.size)
      .sort((a, b) => b.value - a.value);
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  };
  var color = d3
    .scaleOrdinal()
    .range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
  var format = d3.format(",d");
  var width = 600;
  var height = 750;
  var radius = width / 6;
  var arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));
  const root = partition(data);
  // console.log(root);
  root.each((d) => (d.current = d));
  // const svg = d3.select(DOM.svg(width, width))

  // var parentSunburst = document.getElementById("sunburst_parent");
  var parentSunburst = document.getElementById("sunchart_container");

  var svg = document.createElement("svg");
  svg.id = "sunchart";
  parentSunburst.appendChild(svg);

  svg = d3
    .select("#sunchart")
    .append("svg")
    .style("width", width)
    .style("height", width)
    .style("font", "10px sans-serif");
  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);
  const path = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .enter()
    .append("path")
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr("fill-opacity", (d) =>
      arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
    )
    .attr("d", (d) => arc(d.current));

  path
    .filter((d) => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);

  path.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .map((d) => d.data.name)
        .reverse()
        .join("/")}\n${format(d.value)}`
  );

  const label = g
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .enter()
    .append("text")
    .attr("dy", "0.35em")
    .attr("fill-opacity", (d) => +labelVisible(d.current))
    .attr("transform", (d) => labelTransform(d.current))
    .text((d) => d.data.name);

  const parent = g
    .append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

  function clicked(p) {
    parent.datum(p.parent || root);

    root.each(
      (d) =>
        (d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        })
    );

    const t = g.transition().duration(750);

    path
      .transition(t)
      .tween("data", (d) => {
        const i = d3.interpolate(d.current, d.target);
        return (t) => (d.current = i(t));
      })
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attrTween("d", (d) => () => arc(d.current));

    label
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      })
      .transition(t)
      .attr("fill-opacity", (d) => +labelVisible(d.target))
      .attrTween("transform", (d) => () => labelTransform(d.current));
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
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

function addToTable(values, clickedMarkers) {
  var popupTable = document.getElementById("myPopupTable");
  popupTable.classList.toggle("show");
  setTimeout(function () {
    popupTable.classList.toggle("show");
  }, 2500);

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

  const fav_popup = document.createElement("div");
  fav_popup.className = "popup";
  const fav_span = document.createElement("span");
  fav_span.className = "popuptext";
  fav_span.id = "myPopup";
  fav_span.innerHTML = "Added to favorites";
  fav_popup.appendChild(fav_span);

  var nameCell = row.insertCell(0);
  var cuisineCell = row.insertCell(1);
  var ratingCell = row.insertCell(2);
  var priceRangeCell = row.insertCell(3);

  row.appendChild(fav_popup);
  row.appendChild(favorite_button);
  row.appendChild(delete_button);

  // nameCell.innerHTML = values[0];
  cuisineCell.innerHTML = values[3];
  ratingCell.innerHTML = values[4];
  priceRangeCell.innerHTML = values[5];
  nameCell.innerHTML =
    "<a href = https://" +
    values[7] +
    ' target= "_blank" rel="noreferrer">' +
    values[0] +
    "</a>";

  favorite_button.addEventListener("click", () => {
    var restName = values[0];

    if (!favoriteName.includes(restName)) {
      favoriteName.push(restName);
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

      var popup = document.getElementById("myPopup");

      popup.classList.toggle("show");
      setTimeout(function () {
        popup.classList.toggle("show");
      }, 2000);

      delete_fav.addEventListener("click", () => {
        favoriteName.splice(favoriteName.indexOf(restName), 1);
        document.getElementById(fav.id).remove();
        displayData("favorites", "");
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
