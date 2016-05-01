window.onload = function() {
  init();
}

// data
var height = 250;
var width = 600;
var margin = {top: 20, right: 70, bottom: 50, left: 50};

var buf;

function init(){
  data = [{x:26762, label:'elite', img:"Grafik/elite.svg"},
  {x:167302, label:'glad', img:"Grafik/glad.svg"},
  {x:12940, label:'ok', img:"Grafik/ok.svg"},
  {x:406, label:'mellem', img:"Grafik/mellem.svg"},
  {x:1360, label:'sur', img:"Grafik/sur.svg"}]
  console.log(data)
  buf = initializeSVGBarChart(d3.select("body"), data, xlabel="Control visits");
}


function initializeSVGBarChart(element, data, xlabel=""){
  var svg = element.append("svg")
    .attr({
      class: "barChart",
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom,
    });

  var xAxisG = svg.append('g').attr("class","axis xaxis").attr("transform", "translate("+margin.right+","+margin.top+")");
  var yAxisG = svg.append('g').attr("class","axis yaxis").attr("transform", "translate("+margin.right+","+ (height+margin.top) +")");
  var dataG = svg.append('g').attr("transform", "translate("+margin.right+","+margin.top+")");

  
  yAxisG.append('text').attr({
  x:width/2,
  y:45,
  class: "xlabel",
  }).style("text-anchor","middle").text(xlabel);
  

  var xscale = d3.scale.linear()
  .domain([0, d3.max(data, d => d.x)])
  .range([0, width]);

  var yscale = d3.scale.ordinal()
  .domain(data.map(d=>d.img))
  .rangeBands([0, height])
  .rangeRoundBands([0, height], .1);

  xAxisG.call(d3.svg.axis().scale(yscale).orient("left").tickFormat(""));
  yAxisG.call(d3.svg.axis().scale(xscale).orient("bottom").innerTickSize(-height).tickPadding(10));

  filter = e=>true;

  var chart = {svg, dataG, xAxisG, yAxisG, data, xscale, yscale, filter, renderSVGBarChart};

  renderSVGBarChart(chart);

  var image_size = 60

  var ticks = svg.select(".xaxis").selectAll(".tick")
                    .data(data)
                    .append("svg:image")
                    .attr({
                      x:-image_size-10,
                      y:-image_size/2
                    })
                    .attr("xlink:href", function(d) {return d.img})
                    .attr("width", image_size)
                    .attr("height", image_size);

  return chart;
}

function renderSVGBarChart(chart){

  bars = chart.dataG.selectAll("rect").data(chart.data);

  bars.enter().append("rect").attr({
    y: d => chart.yscale(d.img),
    x: chart.xscale(0),
    width: 0,
    height:chart.yscale.rangeBand(),
  });


  bars.transition().duration(500).ease("linear").attr({          
    y: d => chart.yscale(d.img),
    x: chart.xscale(0),
    width: d=> chart.xscale(d.x),
    height:chart.yscale.rangeBand(),
  });
  bars.append("svg:title").text(d=>d.x);

  bars.exit().remove();
}