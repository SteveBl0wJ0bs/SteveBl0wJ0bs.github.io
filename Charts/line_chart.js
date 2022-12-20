// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
	width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#lineChart")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Data/TemporalData.csv", function(data) {
		
	// group the data: I want to draw one line per group
	var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
		.key(function(d) { return d.year;})
		.entries(data);
	
	// Add X axis --> it is a date format
	var x = d3.scaleLinear()
		.domain([0, 11])
		.range([ 0, width ]);
		
	var tickLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x)
			.ticks(12)
			.tickFormat(function(d,i){ return tickLabels[i];}));
			
	// Add Y axis
	var y = d3.scaleLinear()
		.domain([d3.min(data, function(d) { return +d.min; })
		, d3.max(data, function(d) { return +d.max; })])
		.range([ height, 0 ]);
	svg.append("g")
		.call(d3.axisLeft(y)
			.tickFormat(function(d){ return String(d)+ '\u00B0C';}));
			
	// color palette
	var res = sumstat.map(function(d){ return d.key }) // list of group names
	var color_line1 = d3.scaleOrdinal()
		.domain(res)
		.range(['firebrick','goldenrod','navy','darkcyan','hotpink','purple','lightslategrey','seagreen'])
	
	var color_dots = d3.scaleOrdinal()
		.domain(res)
		.range(['red','gold','blue','cornflowerblue','pink','mediumvioletred','lightsteelblue','yellowgreen'])
		
	  // Color scale: give me a specie name, I return a color
	var color_line2 = d3.scaleOrdinal()
		.domain(res)
		.range(['orangered','yellow','dodgerblue','cyan','mistyrose','magenta','silver','lime'])

	// Draw the line
	svg.selectAll(".line")
		.data(sumstat)
		.enter()
		.append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color_line1(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
			return d3.line()
            .x(function(d) { return (x(d.month)); })
            .y(function(d) { return (y(+d.min)); })
				(d.values)
        })

	// Draw the line
	svg.selectAll(".line")
		.data(sumstat)
		.enter()
		.append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color_line2(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
			return d3.line()
				.x(function(d) { return (x(d.month)); })
				.y(function(d) { return (y(+d.max)); })
				(d.values)
        })
	
	  // Add dots
	svg.selectAll("dot")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d,i) { return x(d.month); } )
		.attr("cy", function (d,i) { return y(+d.mean); } )
		.attr("r", 4)
		.style("fill", function (d) { return color_dots(d.year); } )

})