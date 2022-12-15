// set the dimensions and margins of the graph
var margin3 = {top: 100, right: 30, bottom: 120, left: 50},
    width = 1000 - margin3.left - margin3.right,
    height = 750 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#percentage_stacked_bar_chart")
	.append("svg")
    .attr("width", width + margin3.left + margin3.right)
    .attr("height", height + margin3.top + margin3.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

// Parse the Data
d3.csv("Data/DistrictsOccurrencesWithOthers.csv", function(data) {

	data.sort(function(b, a) {
		return a.Total - b.Total;
	});
	
	// List of subgroups = header of the csv files = soil condition here
	var subgroups = data.columns.slice(1)
	
	// List of groups = species here = value of the first column called group -> I show them on the X axis
	var groups = d3.map(data, function(d){return(d.Name)}).keys()

	// Add X axis
	var x = d3.scaleBand()
		.domain(groups)
		.range([0, width])
		.padding([0.2])
	svg3.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 100])
		.range([ height, 0 ]);
	svg3.append("g")
		.call(d3.axisLeft(y));

	// color palette = one color per subgroup
	var color = d3.scaleOrdinal()
		.domain(subgroups)
		.range(["pink", "white", "cyan", "yellow", "fuchsia", "lime"]);

	// Normalize the data -> sum of each group must be 100!
	dataNormalized = []
	data.forEach(function(d){
    // Compute the total
    tot = 0
    for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    // Now normalize
    for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
	})

	//stack the data? --> stack per subgroup
	var stackedData = d3.stack()
		.keys(subgroups)
		(data)

	var tooltip = d3.select("#stacked_bar_chart_3")
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
		tooltip
        .html("Species: " + subgroupName + "<br>" + "Occurrence: " + subgroupValue+"%")
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
	svg3.append("g")
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
