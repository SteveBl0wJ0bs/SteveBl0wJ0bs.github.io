// set the dimensions and margins of the graph
var margin4 = {top: 10, right: 90, bottom: 80, left: 60},
    width4 = 1500 - margin4.left - margin4.right,
    height4 = 650 - margin4.top - margin4.bottom;

// append the svg object to the body of the page
var svg4 = d3.select("#boxplot")
	.append("svg")
	.attr("width", width4 + margin4.left + margin4.right)
	.attr("height", height4 + margin4.top + margin4.bottom)
	.append("g")
	.attr("transform",
          "translate(" + margin4.left + "," + margin4.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("Data/TreeInformation.csv", function(data) {

	data=data.filter(function( obj ) {
		return (obj.Name == "Celtis australis" || obj.Name=="Aesculus hippocastanum"
		|| obj.Name=="Carpinus betulus" || obj.Name=="Tilia cordata"
		|| obj.Name=="Platanus x hispanica" || obj.Name=="Tilia x europaea");
	});

	// Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
	var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
		.key(function(d) { return d.Name;})
		.rollup(function(d) {
			q1 = d3.quantile(d.map(function(g) { return g.Height;}).sort(d3.ascending),.25)
			median = d3.quantile(d.map(function(g) { return g.Height;}).sort(d3.ascending),.5)
			q3 = d3.quantile(d.map(function(g) { return g.Height;}).sort(d3.ascending),.75)
			interQuantileRange = q3 - q1
			min = q1 - 1.5 * interQuantileRange
			max = q3 + 1.5 * interQuantileRange
			return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
		})
		.entries(data)

	// Show the X scale
	var x = d3.scaleBand()
		.range([ 0, width4 ])
		.domain(data.map(function(d) { return d.Name; }))
		.paddingInner(1)
		.paddingOuter(.5)
	svg4.append("g")
		.attr("transform", "translate(0," + height4 + ")")
		.call(d3.axisBottom(x))

	// Show the Y scale
	var y = d3.scaleLinear()
		.domain([0,40])
		.range([height4, 0])
	svg4.append("g").call(d3.axisLeft(y))

	// Show the main vertical line
	svg4
		.selectAll("vertLines")
		.data(sumstat)
		.enter()
		.append("line")
		.attr("x1", function(d){return(x(d.key))})
		.attr("x2", function(d){return(x(d.key))})
		.attr("y1", function(d){return(y(d.value.min))})
		.attr("y2", function(d){return(y(d.value.max))})
		.attr("stroke", "black")
		.style("width", 40)

	// rectangle for the main box
	var boxWidth = 100
	svg4
		.selectAll("boxes")
		.data(sumstat)
		.enter()
		.append("rect")
			.attr("x", function(d){return(x(d.key)-boxWidth/2)})
			.attr("y", function(d){return(y(d.value.q3))})
			.attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
			.attr("width", boxWidth )
			.attr("stroke", "black")
			.style("fill", "#69b3a2")

  // Show the median
	svg4
		.selectAll("medianLines")
		.data(sumstat)
		.enter()
		.append("line")
			.attr("x1", function(d){return(x(d.key)-boxWidth/2) })
			.attr("x2", function(d){return(x(d.key)+boxWidth/2) })
			.attr("y1", function(d){return(y(d.value.median))})
			.attr("y2", function(d){return(y(d.value.median))})
			.attr("stroke", "black")
			.style("width", 80)

	// Add individual points with jitter
	var jitterWidth = 50
	svg4
		.selectAll("indPoints")
		.data(data)
		.enter()
		.append("circle")
			.attr("cx", function(d){return(x(d.Name) - jitterWidth/2 + Math.random()*jitterWidth )})
			.attr("cy", function(d){return(y(d.Height))})
			.attr("r", 4)
			.style("fill", "white")
			.attr("stroke", "black")
})