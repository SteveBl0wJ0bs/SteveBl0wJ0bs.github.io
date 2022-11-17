// set the dimensions and margins of the graph
var margin2 = {top: 10, right: 90, bottom: 120, left: 60},
    width = 1500 - margin2.left - margin2.right,
    height = 650 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#bar_chart")
	.append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Parse the Data
d3.csv("Data/AverageCanopyAndOccurrences.csv", function(data) {

	// Sorting data
	data.sort(function(b, a) {
		return a.Occurrence - b.Occurrence;
	});
	
	// Taking only first 15 most important categories since there are too many of them.
	data=data.slice(0,15);
	
	// X axis
	var x = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.map(function(d) { return d.Name; }))
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

	var tooltip = d3.select("#bar_chart")
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("width", "160px")
		.style("font-size", "16px")
		.style("position", "absolute")
		.style("margin-top", "350px")
		
	var mouseover = function(d) {
		var occurrenceValue = d.Occurrence;
		var avgCanopyCover = d.CanopyCover;
		tooltip.html("Occurrence: " + occurrenceValue + "<br>" + "AverageCanopyCover(m2): " + avgCanopyCover)
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
	
	svg2.append("g")
		.call(d3.axisLeft(y));

	// Bars
	svg2.selectAll("mybar")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", function(d) { return x(d.Name); })
		.attr("width", x.bandwidth())
		.attr("fill", "#7AFF33")
		// no bar at the beginning thus:
		.attr("height", function(d) { return height - y(0); }) // always equal to 0
		.attr("y", function(d) { return y(0); })
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave)

	// Animation
	svg2.selectAll("rect")
		.transition()
		.duration(2000)
		.attr("y", function(d) { return y(d.Occurrence); })
		.attr("height", function(d) { return height - y(d.Occurrence); })
		.delay(function(d,i){console.log(i) ; return(i*100)})
	
})