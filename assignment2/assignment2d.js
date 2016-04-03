//Assignment 2D

// Variables
var chart_height =500;
var chart_width = 700;
var margin = {top: 20, right: 50, bottom: 10, left: 50};
var colorPalette = d3.scale.category10();

var projection, mapData, centroidData, datapoints, svg, mapGroup, districtNameGroup, datapointGroup, centroidGroup;

// Render the map if all data is present using the draw helping functions
function renderMap(selector){
  if(mapData != null & centroidData != null & datapoints != null){
      drawMap(mapData);
      drawDatapoints(datapoints, selector);
      drawCentroids(centroidData, selector);
  }
}

function drawMap(dataset){
  // Start by estimating scale and offset to match svg size
  // Initial guess
  scale = 100000;
  centroid = [-122.44804426246323, 37.78237676674143];
  projection = d3.geo.mercator().scale([scale]).center(centroid).translate([chart_width/2, chart_height/2]);
  var path = d3.geo.path().projection(projection)

  //Second pass to adjust scale and offset
  bounds  = path.bounds(dataset);
  var hscale  = scale*chart_width  / (bounds[1][0] - bounds[0][0]);
  var vscale  = scale*chart_height / (bounds[1][1] - bounds[0][1]);
  var scale   = (hscale < vscale) ? hscale: vscale;
  var offset  = [chart_width - (bounds[0][0] + bounds[1][0])/2,
                  chart_height - (bounds[0][1] + bounds[1][1])/2];

  // get final projection
  projection = d3.geo.mercator().scale([scale]).center(centroid).translate(offset);

  // Draw map features from geojson
  var path = d3.geo.path().projection(projection)
  mapGroup.selectAll("path")
    .data(dataset.features)
    .enter()
    .append("path")
    .attr({
      d:path,
      class: "district"
    });
  
  // Add district names
  districtNameGroup.selectAll("text").data(dataset.features).enter()
    .append("text").text(d => d.properties.DISTRICT).attr({
      x: d => path.centroid(d)[0],
      y: d => path.centroid(d)[1],
      "text-anchor":"middle",
      class: "districtText",
    });
}

// Draw the prostitution incidents on the map
function drawDatapoints(dataset, selector){
  // Select and filter datapoints
  var dp = datapointGroup.selectAll("circle.datapoint").data(dataset.filter((d,i) => i%5==1));

  // add svg DOM elements
  dp.enter()
    .append("circle")
    .attr({
      class:"datapoint",
    });

  // Update the data
  dp.attr({
      cx: d => projection([d.lon, d.lat])[0],
      cy: d => projection([d.lon, d.lat])[1],
      //fill: (d,i) => colorPalette(d[selector]),
      r: 2,
    });

  // Remove extra svg elements from DOM
  dp.exit().remove();
}

// Draw kMeans centroids
function drawCentroids(dataset, selector){
  // Select data 
  var data = dataset[selector];
  
  var centroids = centroidGroup.selectAll("circle.centroid").data(data)

  // Add svg DOM
  centroids.enter()
    .append("circle")
    .attr({
      cx: d => projection([d.lon, d.lat])[0],
      cy: d => projection([d.lon, d.lat])[1],
      r: 0,
      fill: (d,i) => colorPalette(i),
      class:"centroid",
    });

  // update svg DOM
  centroids.transition().duration(1000).ease("elastic").attr({
      cx: d => projection([d.lon, d.lat])[0],
      cy: d => projection([d.lon, d.lat])[1],
      r: 5,
    });

  //Remove excess DOM
  centroids.exit().remove();
}

// initializer function
function init(){
  console.log("starting Init")
  // Load Data and call render when the data is loaded
  d3.json("../emil/week8/sfpddistricts.geojson", function(json) {
      mapData = json;
      renderMap('k6');
  });

  d3.csv("../emil/week8/prostitution_coordinates.csv", 
    function(line){
      return {
        lon:+line['X'],
        lat:+line['Y'],
        k2: +line['k2'],
        k3: +line['k3'],
        k4: +line['k4'],
        k5: +line['k5'],
        k6: +line['k6'],
      }
    },
    function(data) {
      datapoints = data
      attachSvgElements()
      renderMap('k6');
    });

  d3.json("../emil/week8/prostitution_centroids.json",
    function(data) {
      centroidData = data
      renderMap('k6');
    });
}

function attachSvgElements(){
  //Add map svg elements
  svg = d3.select("#d_map")
  .append("svg")
  .attr("width", chart_width + margin.left + margin.right)
  .attr("height", chart_height + margin.top + margin.bottom);

  mapGroup = svg.append("g").attr("class", "mapGroup");
  datapointGroup = svg.append("g").attr("class", "datapointGroup");
  districtNameGroup = svg.append("g").attr("class", "districtNameGroup");
  centroidGroup = svg.append("g").attr("class", "centroidGroup");

  // Add Slider svg elements
  svg2 = d3.select("#d_slider").append("svg")
      .attr("width", chart_width/2 + margin.left + margin.right)
      .attr("height", 50 + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 50 / 2 + ")")
      .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d=>d).tickSize(2).ticks(4).tickPadding(12))

  slider = svg2.append("g").attr("class", "slider").call(brush);

  slider.selectAll(".extent,.resize").remove();

  slider.select(".background")
      .attr("height", 50);

  handle = slider.append("circle")
      .attr("class", "handle")
      .attr("transform", "translate(0," + 50 / 2 + ")")
      .attr("r", 7);

  slider.call(brush.event).transition().duration(750).call(brush.extent([2,2])).call(brush.event);
}

// extra variables for slider
var x = d3.scale.linear().domain([2, 6]).range([0, chart_width/2]).clamp(true);
var brush = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed);
var svg2, slider, handle;
var oldValue = 0;

//Click handler for the slider
function brushed() {
  var value = brush.extent()[0];
  
  if (d3.event.sourceEvent) { // not a programmatic event
    value = Math.round(x.invert(d3.mouse(this)[0]));
    brush.extent([value, value]);
  }
  // if new value of centroids from kMeans is selected redraw centroids (animate)
  if(oldValue != value){
    if(mapData != null & centroidData != null & datapoints != null){
      drawCentroids(centroidData, "k"+value);
    }
    handle.transition().duration(300).attr("cx", x(value));
  }

  oldValue = value;
}

init();