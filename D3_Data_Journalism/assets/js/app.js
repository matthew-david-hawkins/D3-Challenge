// // Basic plot w/ plotly
// d3.csv("/assets/data/data.csv").then(function(data) {
//     console.log(data);
//     income = data.map(d => d.income);
//     obesity = data.map(d => d.obesity);
//     console.log(income)
//     // Create Plotly trace object
//     var data = [{
//         x: income,
//         y: obesity,
//         mode: "markers"
//     }];

//     // Create Plotly layout object
//     var layout1 = {
//         title: "Fatness vs income"
//     };

//     // Slam the plotly plot into the webpage
//     Plotly.newPlot("scatter", data, layout1);
//   });

// Basic plot with D3

// Define the dimensions for the graphic
var svgWidth = 855; // md-col-9 is 855 px
var svgHeight = 500;0

// Put an scalable vector graphic element into the HTML at id="scatter"
var mysvg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Define the margins that chart will have within the svg element
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
    };

// Define the pixel range that the chart will have within the svg element
var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom

// Create a group within the svg for the data markers
var markerGroup = mysvg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Use promise object to load csv data
d3.csv("/assets/data/data.csv").then(function(data) {

    console.log(data)
    // define scaling functions which transform data into pixel locations
    var scaleX = d3.scaleLinear()
        .domain([d3.min(data, d => d.income), d3.max(data, d => d.income)])  // domain is the range of the data
        .range([0, width]);  // range is the range of the pixels

    var scaleY = d3.scaleLinear()
        .domain([d3.min(data, d => d.obesity), d3.max(data, d => d.obesity)])  // domain is the range of the data
        .range([height, 0]);  // range is the range of the pixels

    // bind the data to circle markers
    circleGroup = markerGroup.selectAll("circle")
        .data(data) // bind data to circles
        .enter().append("circle") // for new data, append a circle
        .attr("cx", d => scaleX(d.income)) // put the circle at correct pixel via calculation
        .attr("cy", d => scaleY(d.obesity)) 
        .attr("r", 8)
        .attr("fill", "blue")
        .attr("stroke", "blue")
        .attr("stroke-width", "8")
        .attr("text", "t")
        .attr("opacity", "0.5")

    textGroup = markerGroup.selectAll("text")
        .data(data) // bind data to circles
        .enter().append("text") // for new data, append a circle
        .attr("class", "markertext")
        .attr("dx", d => scaleX(d.income) -6) // put the circle at correct pixel via calculation
        .attr("dy", d => scaleY(d.obesity) +3) 
        .text(d => d.abbr)
        .attr("fill", "white")

    // add left axis to chart
    var leftAxis = d3.axisLeft(scaleY);
    var bottomAxis = d3.axisBottom(scaleX);

    // within the marker group add another group for bottom axis
    markerGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    markerGroup.append("g")
        .call(leftAxis);

    // Add axis labels to markerGroup
    markerGroup.append("text")
        .attr("x", width/2 - margin.left)
        .attr("y", height) // Shift down to bottom of the chart group
        .attr("dy", margin.bottom*0.6) // shift down extra
        .text("Income")

    markerGroup.append("text")
        .attr("x", 0 - margin.left)
        .attr("y", height/2)
        .text("Obesity")

    // define tooltip parameters
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      //.offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>income: ${d.income}<br>obesity: ${d.obesity}`);
      });
    
    
    // define tooltip parameters
    var toolTippointer = d3.tip()
      .attr("class", "tooltippointer")
      .html("")

    textGroup.call(toolTip);
    textGroup.call(toolTippointer);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
      toolTippointer.show();
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide();
        toolTippointer.hide();
      });

});




