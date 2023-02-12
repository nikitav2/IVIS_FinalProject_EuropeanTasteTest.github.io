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
