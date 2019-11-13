// @TODO: YOUR CODE HERE!
// Setting the dimensions for the SVG container
var svgHeight = 960;
var svgWidth = 900;

// margins
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg container
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(stateData) {
    console.log(stateData);

// Cast the hours value to a number for each piece of tvData
    stateData.forEach(function(data) {
       data.poverty = +data.poverty;
       data.healthcare = +data.healthcare;
    });
    // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xLinearScale = d3.scaleLinear()
     .domain([0, d3.max(stateData, d => d.poverty)])
     .range([0, width]);
//   .padding(0.1);

// Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(stateData, d => d.healthcare)])
     .range([height, 0]);

// Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
// Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
    var circleGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // .attr("width", xBandScale.bandwidth())
    // .attr("height", d => chartHeight - yLinearScale(d.hours));
// Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
});
// Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);
  // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {

        toolTip.show(data, this);
})

        // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });
  
      // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("font-weight", "14px helvetica")
        .style("fill", "black")
        .text("Healtcare(%)");
  
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .style("font-weight", "14px helvetica")
        .style("fill", "black")
        .text("Poverty (%)");

}).catch(function(error) {
    console.log(error);
  
});
  
