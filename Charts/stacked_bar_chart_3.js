// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 120, left: 50},
    width = 3000 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var sv5 = d3.select("#stacked_bar_chart_3")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.style("background", "#FEB459")
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("Data/AllTreeDistrictsOccurrences.csv", function(data) {

	data.sort(function(a, b) {
		return a["Total"] - b ["Total"];
	});
	
	// List of subgroups = header of the csv files = soil condition here
	var subgroups = data.columns.slice(1)
	// removing the total column from subgroups
	subgroups.pop()
	
	// List of groups = species here = value of the first column called group -> I show them on the X axis
	var groups = d3.map(data, function(d){return(d.Name)}).keys()

	// Add X axis
	var x = d3.scaleBand()
		.domain(groups)
		.range([0, width + 2000])
		.padding([0.5])
	sv5.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-90)")
		.style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 1100])
		.range([ height, 0 ]);
	sv5.append("g")
		.call(d3.axisLeft(y));

	// color palette = one color per subgroup
	var color = d3.scaleOrdinal()
		.domain(subgroups)
		.range(["white", "cyan", "yellow", "fuchsia", "lime"]);

	//stack the data? --> stack per subgroup
	var stackedData = d3.stack()
		.keys(subgroups)
		(data)

	var tooltip = d3.select("#stacked_bar_chart_2")
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("width", "230px")
		.style("font-size", "16px")
		.style("position", "absolute")
		.style("margin-top", "80px")
		.style("margin-left", "120px")
		
	var mouseover = function(d) {
		var subgroupName = d3.select(this.parentNode).datum().key;
		var subgroupValue = d.data[subgroupName];
		tooltip.html("Name: " + subgroupName + "<br>" + "Occurrence: " + subgroupValue)
        .style("opacity", 1)
	}
	
	var mousemove = function(d) {
		tooltip
			.style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
			.style("top", (d3.mouse(this)[1]) + "px")
	}
  
	var mouseleave = function(d) {
		tooltip.style("opacity", 0)
	}

	// Show the bars
	sv5.append("g")
		.selectAll("g")
		// Enter in the stack data = loop key per key = group per group
		.data(stackedData)
		.enter().append("g")
		.attr("fill", function(d) { return color(d.key); })
		.attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
		.selectAll("rect")
		// enter a second time = loop subgroup per subgroup to add all rectangles
		.data(function(d) { return d; })
			.enter().append("rect")
			.attr("x", function(d) { return x(d.data.Name); })
			.attr("y", function(d) { return y(d[1]); })
			.attr("height", function(d) { return y(d[0]) - y(d[1]); })
			.attr("width",x.bandwidth())
			.attr("stroke", "grey")
			.on("mouseover", mouseover)
			.on("mouseleave", mouseleave)

})
