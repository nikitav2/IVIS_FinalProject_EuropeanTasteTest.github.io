console.log("in sunburst");
// const root = getData();

d3.csv("final_csv.csv", d3.autoType).then(function (data) {
  let groups = d3.group(
    data,
    function (d) {
      return d.City;
    },
    function (d) {
      return d.Cuisine;
    },
    function (d) {
      return d.Name;
    },
    function (d) {
      return d.Price;
    },
    function (d) {
      return d.Rating;
    }
  );

  console.log("before root");

  let root = d3.hierarchy(groups);
  console.log(root);
});

root.each((d) => (d.current = d));
const svg = d3
  // .select(DOM.svg(width, width))
  .select("#sunburst")
  .style("width", "100%")
  .style("height", "auto")
  .style("font", "10px sans-serif");

console.log("after svg");

const g = svg
  .append("g")
  .attr("transform", `translate(${width / 2},${width / 2})`)
  .on("mouseleave", mouseleave);

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
  .attr("d", (d) => arc(d.current))
  .on("mouseover", mouseover);

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

//percentage text
const percentage_text = svg
  .append("text")
  .attr("id", "title")
  .attr("x", width / 2)
  .attr("y", width / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "2.5em");

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
          Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1:
          Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth),
      })
  );
  const t = g.transition().duration(750);

  // Transition the data on all arcs, even the ones that aren’t visible,
  // so that if this transition is interrupted, entering arcs will start
  // the next transition from the desired position.
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

//mouse over
const totalSize = root.descendants()[0].value;
function mouseover(d) {
  var percentage = ((100 * d.value) / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }
  percentage_text.text(percentageString);

  var sequenceArray = d.ancestors().reverse();
  sequenceArray.shift(); // remove root node from the array
  // Fade all the segments.
  d3.selectAll("path").style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  g.selectAll("path")
    .filter(function (node) {
      return sequenceArray.indexOf(node) >= 0;
    })
    .style("opacity", 1);
}
//mouse leave
// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {
  // Deactivate all segments during transition.
  //d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
    .transition()
    .duration(200)
    .style("opacity", 1)
    .on("end", function () {
      d3.select(this).on("mouseover", mouseover);
    });

  percentage_text.text("");
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

// return svg.node();

/*
function getData() {
  console.log("in get data");
  d3.csv("final_csv.csv", d3.autoType).then(function (data) {
    let groups = d3.group(
      data,
      function (d) {
        return d.City;
      },
      function (d) {
        return d.Cuisine;
      },
      function (d) {
        return d.Name;
      },
      function (d) {
        return d.Price;
      },
      function (d) {
        return d.Rating;
      }
    );

    console.log("before root");

    let root = d3.hierarchy(groups);
    console.log(root);
    return root;
  });

  // function visualize(data) {
  //   console.log("in visualize");
  //   function sumWorldwideGross(group) {
  //     return d3.sum(group, function (d) {
  //       return d.Rating;
  //     });
  //   }

  //   let groups = d3.group(
  //     data,
  //     function (d) {
  //       return d.City;
  //     },
  //     function (d) {
  //       return d.Cuisine;
  //     },
  //     function (d) {
  //       return d.Name;
  //     },
  //     function (d) {
  //       return d.Price;
  //     },
  //     function (d) {
  //       return d.Rating;
  //     }
  //   );

  //   console.log("after groups");
  //   console.log(groups);

  //   let root = d3.hierarchy(groups);

  //   console.log(root);
  //   return root;
  // }
}

*/
