// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 90, bottom: 80, left: 60},
	width2 = 1500 - margin2.left - margin2.right,
    height2 = 750 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#scatterplot")
	.append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

//Read the data
d3.csv("Data/TreeInformation.csv", function(data) {

	data=data.filter(function( obj ) {
		return (obj.Name == "Celtis australis" || obj.Name=="Aesculus hippocastanum"
		|| obj.Name=="Carpinus betulus" || obj.Name=="Tilia cordata"
		|| obj.Name=="Platanus x hispanica" || obj.Name=="Tilia x europaea");
	});

	// Add X axis
	var x = d3.scaleLinear()
		.domain([0, 40])
		.range([ 0, width2]);
	svg2.append("g")
		.attr("transform", "translate(0," + height2 + ")")
		.call(d3.axisBottom(x));

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 8000])
		.range([ height2, 0]);
	svg2.append("g")
		.call(d3.axisLeft(y));
	
	// Color scale: give me a specie name, I return a color
	var color = d3.scaleOrdinal()
		.domain(["Celtis australis", "Aesculus hippocastanum", "Carpinus betulus"
		, "Tilia cordata", "Platanus x hispanica", "Tilia x europaea"])
		.range(["cyan", "yellow", "fuchsia", "lime", "red", "blue"])

	// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
	// Its opacity is set to 0: we don't see it by default.
	var tooltip = d3.select("#boxplot")
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
		.style("margin-top", "200px")
		.style("margin-left", "120px")

	// A function that change this tooltip when the user hover a point.
	// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  // Three function that change the tooltip when user hover / move / leave a cell
	var mouseover = function(d) {
		tooltip
			.html("Specie: " + d.Name + "<br>" + "CO2: " + d.CarbonStorage + "kg" +"<br>" + "Height: " + d.Height +"m")
			.style("opacity", 1)
	}

	var mouseleave = function(d) {
		tooltip
			.style("opacity", 0)
  }
	
	// Add dots
	svg2.append('g')
		.selectAll("dot")
		.data(data)
		.enter()
		.append("circle")
			.attr("cx", function (d) { return x(d.Height); } )
			.attr("cy", function (d) { return y(d.CarbonStorage); } )
			.attr("r", 7)
			.style("fill", function (d) { return color(d.Name); } )
		.on("mouseover", mouseover )
		.on("mouseleave", mouseleave )
})
