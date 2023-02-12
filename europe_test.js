//Width and height
let w = 1000;
let h = 1000;

//Define map projection
let projection = d3.geo
  .mercator()
  .center([0, 60])
  .translate([w / 3, h / 3])
  .scale(650);

//Define path generator
let path = d3.geo.path().projection(projection);

let color = d3.scale.ordinal().range(["Azure"]);

//Create SVG
let svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
let g = svg.append("g");

// //Load in GeoJSON data
d3.json("europe.json", (json) => {
  d3.csv("europe_capital.csv", (data) => {
    let tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("padding", "15px")
      .style("font", "12px sans-serif")
      .style("background", "#03bafc")
      .style("border", "0px")
      .style("border-radius", "8px")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("a simple tooltip");

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        return projection([d.capital_lng, d.capital_lat])[0];
      })
      .attr("cy", (d) => {
        return projection([d.capital_lng, d.capital_lat])[1];
      })
      .attr("r", 5)
      .style("fill", "red")
      .on("mouseover", () => {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d) => {
        tooltip.text(d.capital);
        return tooltip
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      });
  });

  //Binding data and creating one path per GeoJSON feature
  g.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "dimgray")
    .attr("fill", (d, i) => {
      return color(i);
    });

  //States
  g.selectAll("text")
    .data(json.features)
    .enter()
    .append("text")
    .attr("fill", "darkslategray")
    .attr("transform", (d) => {
      return "translate(" + path.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text((d) => {
      return d.properties.name;
    });

  //Append the name
  g.append("text")
    .attr("x", 0)
    .attr("y", 340)
    .attr("font-size", 30)
    .attr("font-weight", "bold")
    .attr("font-family", "Times New Roman")
    .attr("text-anchor", "middle")
    .attr("opacity", 0.5);
});

var zoom = d3.behavior.zoom().on("zoom", function () {
  g.attr(
    "transform",
    "translate(" +
      d3.event.translate.join(",") +
      ")scale(" +
      d3.event.scale +
      ")"
  );
  g.selectAll("circle").attr("d", path.projection(projection));
  g.selectAll("path").attr("d", path.projection(projection));
});

svg.call(zoom);
