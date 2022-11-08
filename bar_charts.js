// set the dimensions and margins of the graph
var margin = {top: 10, right: 90, bottom: 120, left: 60},
    width = 1500 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#bar_charts")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("Data/Categories.csv", function(data) {

	// Sorting data
	data.sort(function(b, a) {
		return a.Occurrence - b.Occurrence;
	});
	
	// Taking only first 30 most important categories since there are too many of them.
	data=data.slice(0,30);
	
	// X axis
	var x = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.map(function(d) { return d.SpeciesName; }))
		.padding(0.2);
	svg2.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 1100])
		.range([ height, 0]);
	svg2.append("g")
		.call(d3.axisLeft(y));

	// Bars
	svg2.selectAll("mybar")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", function(d) { return x(d.SpeciesName); })
		.attr("width", x.bandwidth())
		.attr("fill", "#7AFF33")
		// no bar at the beginning thus:
		.attr("height", function(d) { return height - y(0); }) // always equal to 0
		.attr("y", function(d) { return y(0); })

	// Animation
	svg2.selectAll("rect")
		.transition()
		.duration(2000)
		.attr("y", function(d) { return y(d.Occurrence); })
		.attr("height", function(d) { return height - y(d.Occurrence); })
		.delay(function(d,i){console.log(i) ; return(i*100)})
	
})