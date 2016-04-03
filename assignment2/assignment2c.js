//Assignment 2d

//Width and height
var margin = {top: 10, bottom: 30, right: 30, left: 30},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Intialising empty arrays
var dataset_2006 = [],
    dataset_2014 = [],
    dataset_2016 = [];

//Telling x and y the amounts of pixel it have available 
var xScale = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.3);

var yScale = d3.scale.linear()
                .range([height, 0]);

//Binding x and y to the axes
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left")
              .ticks(10);

        
//Creating a svg canvas for the bar chart
var svgc = d3.select("body").append("svg")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append("g")
                           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//loading the csv file and call a counter function to make a dataset
d3.csv("SFPD_Tenderloin_Incidents_Jan_2016.csv", function(data) {
    dataset_2016 = countDaysOfWeek(data);
})

d3.csv("SFPD_Tenderloin_Incidents_Jan_2014.csv", function(data) {
    dataset_2014 = countDaysOfWeek(data);
});

d3.csv("SFPD_Tenderloin_Incidents_Jan_2006.csv", function(data) {
    dataset_2006 = countDaysOfWeek(data);
    
    /*
    Running the setup for the bar chart to showcase the data for 2006 when
    loading the website.
    Only setting the x and y domain one time since changing the axes for each
    dataset will have a negativ effect when comparing the datasets
    */
    xScale.domain(data.map(function(d) { return d.DayOfWeek; }));
    yScale.domain([0, d3.max(dataset_2006, function(d) { return d.Frequency; })]);
    
    //Appending xAxis to the bottom of the canvas
    svgc.append("g")
        .attr("class", "x axis barChart")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    //Appending yAxis to the left side of the canvas
    svgc.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")  //Appending a label to the yAxis
          .attr("transform", "rotate(-90)")
          .attr("y", 3) 
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Frequency");
    
    svgc.selectAll(".bar")
        .data(dataset_2006)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.DayOfWeek); })
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) { return yScale(d.Frequency); })
        .attr("height", function(d) { return height - yScale(d.Frequency); });
    });

//Adding a listner to the radio buttons
d3.selectAll("input").on("change", change);

//A function that update the bar chart to a new dataset
function change() {
    //Depending on which botton was checked is the respected
    //transition function called
    if (this.value == 2016) {   
        transition2016();
    } else if (this.value == 2014) {
        transition2014();
    } else{
        transition2006(); 
    }
}

//Transition functions that updates the rect
function transition2016() {
    
    svgc.selectAll("rect") //Select the rect
        .data(dataset_2016) 
        .transition()       // Adding a transition
        .duration(700)      //with duration and delay
        .delay(function (d, i){return i*100;})
        .attr("y", function(d) { return yScale(d.Frequency);})  //Sending the Frequency to y
        .attr("height", function(d) { return height - yScale(d.Frequency); }); //in order to get pixels
     
}

//Transition function for 2014 dataset
function transition2014() {
    
    svgc.selectAll("rect")
        .data(dataset_2014)
        .transition()
        .duration(700)
        .delay(function (d, i){return i*100;})
        .attr("y", function(d) { return yScale(d.Frequency);})
        .attr("height", function(d) { return height - yScale(d.Frequency); });
     
}

//Transition function for 2006 dataset
function transition2006() {
    y.domain([0, d3.max(dataset_2006, function(d) { return d.Frequency; })]);
    
    svgc.selectAll("rect")
        .data(dataset_2006)
        .transition()
        .duration(700)
        .delay(function (d, i){return i*100;})
        .attr("y", function(d) { return yScale(d.Frequency);})
        .attr("height", function(d) { return height - yScale(d.Frequency); });
}

//Counters for each day of the week
var countMonday = 0,
    countTuesday = 0,
    countWednesday = 0,
    countThursday = 0,
    countFriday = 0,
    countSaturday = 0,
    countSunday = 0;
    
//A counter function to count each frequency of a day
function countDaysOfWeek(data) {
    //Resetting the counters with each call
    countMonday = 0,
    countTuesday = 0,
    countWednesday = 0,
    countThursday = 0,
    countFriday = 0,
    countSaturday = 0,
    countSunday = 0;
    //A for loop that inspect each index in the data set
    for(var i = 0; i < data.length; ++i){
        if(data[i].DayOfWeek == "Monday"){
            countMonday++;
        } else if (data[i].DayOfWeek =="Tuesday" ){
            countTuesday++;
        } else if (data[i].DayOfWeek == "Wednesday" ){
            countWednesday++;
        } else if (data[i].DayOfWeek == "Thursday" ) {
            countThursday++;
        } else if (data[i].DayOfWeek == "Friday" ){
            countFriday++;
        } else if (data[i].DayOfWeek == "Saturday"){
            countSaturday++;
        } else {
            countSunday++;
        }
    }
    //Return an array with objects and values
    return [{DayOfWeek: "Monday", Frequency: countMonday},
           {DayOfWeek: "Tuesday", Frequency: countTuesday},
           {DayOfWeek: "Wednesday", Frequency: countWednesday},
           {DayOfWeek: "Thursday", Frequency: countThursday},
           {DayOfWeek: "Friday", Frequency: countFriday},
           {DayOfWeek: "Saturday", Frequency: countSaturday},
           {DayOfWeek: "Sunday", Frequency: countSunday}];
}