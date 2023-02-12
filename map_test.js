//Width and height
let w = 1000;
let h = 800;

//Define map projection
let projection = d3.geo
  .mercator()
  .center([132, -28])
  .translate([w / 2, h / 2])
  .scale(1000);

//Define path generator
let path = d3.geo.path().projection(projection);

let color = d3.scale.ordinal().range(["Azure"]);

//Create SVG
let svg = d3
  .select("#svganchor")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

//Load in GeoJSON data
d3.json("aust.json", (json) => {
  //Binding data and creating one path per GeoJSON feature
  svg
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "dimgray")
    .attr("fill", (d, i) => {
      return color(i);
    });

  //States
  svg
    .selectAll("text")
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
      return d.properties.STATE_NAME;
    });

  //Append the name
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", 340)
    .attr("font-size", 90)
    .attr("font-weight", "bold")
    .attr("font-family", "Times New Roman")
    .attr("text-anchor", "middle")
    .attr("opacity", 0.5);
});

d3.csv("australia_data.csv", (data) => {
  // Create a color scale
  let color = d3.scale.category20();

  // Add a scale for bubble size
  let valueExtent = d3.extent(data, (d) => {
    return +d.n;
  });
  let size = d3
    .scaleSqrt()
    .domain(valueExtent) // What's in the data
    .range([1, 20]); // Size of circle in pixel

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
  svg
    .selectAll("myCircles")
    .data(
      data
        .sort((a, b) => {
          return +b.n - +a.n;
        })
        .filter((d, i) => {
          return i < 1000;
        })
    )
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return projection([+d.homelon, +d.homelat])[0];
    })
    .attr("cy", (d) => {
      return projection([+d.homelon, +d.homelat])[1];
    })
    .attr("r", (d) => {
      return size(+d.n + 1) + 2;
    })
    .style("fill", (d) => {
      return color(d.state);
    })
    .attr("stroke-width", 1)
    .attr("fill-opacity", 0.6)
    .on("mouseover", () => {
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", (d) => {
      tooltip.text(d.city + " (" + d.n + " Population)");
      return tooltip
        .style("top", d3.event.pageY - 10 + "px")
        .style("left", d3.event.pageX + 10 + "px");
    });
});
