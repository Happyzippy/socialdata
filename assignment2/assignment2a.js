// Assignment 2A

//Intialising the dataset
var dataset = [ 5, 10, 15, 20, 25 ];

//Intialising a simple color set
var colors = d3.scale.category10();


d3.select("body").selectAll("p") 
    .data(dataset)              //Tell the script which dataset to use
    .enter()
    .append("p")                //Append a <p>
    .text(function(d) { return "I can count up to " + d; })  //Insert text to <p> with use of function
    .style("color", function(d, i) {
        return colors(i);       //Apply a new color for each run using i
    })
    .style("font-family", "sans-serif")     //Sets the font family to sans serif
    .style("font-size", "13px");            //Sets the <p> size to 13px