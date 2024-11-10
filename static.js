imageMapResize();

var padding = { top: 20, right: 40, bottom: 0, left: 0 },
  w = 500 - padding.left - padding.right,
  h = 500 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [],
  color = d3.scale.category20();
var data = [
  {
    label: "Connor Forde",
    value: "connor",
    pfp: "resources/images/connor.png",
  },
  {
    label: "Dylan McKenzie",
    value: "dylan",
    pfp: "resources/images/dylan.png",
  },
  { label: "Daniel Adams", value: "dan", pfp: "resources/images/dan.png" },
  {
    label: "Matthew Jordan",
    value: "matthew",
    pfp: "resources/images/matthew.png",
  },
  {
    label: "Charlotte McKnight",
    value: "charlotte",
    pfp: "resources/images/charlotte.png",
  },
  { label: "Aaron Millen", value: "aaron", pfp: "resources/images/aaron.png" },
  {
    label: "James Liam Butler",
    value: "james",
    pfp: "resources/images/james.png",
  },
  {
    label: "Dylan Brânda",
    value: "branda",
    pfp: "resources/images/branda.png",
  },
];
var svg = d3
  .select("#chart")
  .append("svg")
  .data([data])
  .attr("width", w + padding.left + padding.right)
  .attr("height", h + padding.top + padding.bottom);
var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  );
var vis = container.append("g");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1;
  });
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

arcs
  .append("path")
  .attr("fill", function (d, i) {
    return color(i);
  })
  .attr("d", function (d) {
    return arc(d);
  });
// add the text
arcs
  .append("text")
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")translate(" +
      (d.outerRadius - 10) +
      ")"
    );
  })
  .attr("text-anchor", "end")
  .text(function (d, i) {
    return data[i].label;
  });
container.on("click", spin);

var imageCool = document.getElementById("imageCool");

imageCool.addEventListener("animationend", function () {
  imageCool.style.display = "none";
  imageCool.classList.remove("animate");
});

function spin(d) {
  container.on("click", null);
  //all slices have been seen, all done
  if (oldpick.length == data.length) {
    container.on("click", null);
    return;
  }
  var ps = 360 / data.length,
    pieslice = Math.round(1440 / data.length),
    rng = Math.floor(Math.random() * 1440 + 360);

  rotation = Math.round(rng / ps) * ps;

  picked = Math.round(data.length - (rotation % 360) / ps);
  picked = picked >= data.length ? picked % data.length : picked;
  if (oldpick.indexOf(picked) !== -1) {
    d3.select(this).call(spin);
    return;
  } else {
    oldpick.push(picked);
  }
  rotation += 90 - Math.round(ps / 2);
  vis
    .transition()
    .duration(5000)
    .attrTween("transform", rotTween)
    .each("end", function () {
      //mark question as seen
      d3.select(".slice:nth-child(" + (picked + 1) + ") path");
      //populate question
      d3.select("#question h1").text(data[picked].label);
      oldrotation = rotation;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#ff0", "#0ff", "#f0f", "#0f0"], // You can customize the colors
      });

      var audio = new Audio("resources/audio/" + data[picked].value + ".mp3");
      audio.play();

      imageCool.src = data[picked].pfp;
      imageCool.style.display = "block";
      imageCool.classList.add("animate");

      /* Comment the below line for restrict spin to sngle time */
      container.on("click", spin);
    });
}
//make arrow
svg
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (w + padding.left + padding.right) +
      "," +
      (h / 2 + padding.top) +
      ")"
  )
  .append("path")
  .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
  .style({ fill: "white" });
//draw spin circle
container
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 60)
  .style({ fill: "white", cursor: "pointer" });
//spin text
container
  .append("text")
  .attr("x", 0)
  .attr("y", 15)
  .attr("text-anchor", "middle")
  .text("SPIN")
  .style({ "font-weight": "bold", "font-size": "30px" });

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

function getRandomNumbers() {
  var array = new Uint16Array(1000);
  var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
  if (
    window.hasOwnProperty("crypto") &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    window.crypto.getRandomValues(array);
  } else {
    //no support for crypto, get crappy random numbers
    for (var i = 0; i < 1000; i++) {
      array[i] = Math.floor(Math.random() * 100000) + 1;
    }
  }
  return array;
}
