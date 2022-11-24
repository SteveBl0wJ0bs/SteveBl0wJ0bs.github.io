// set the dimensions and margins of the graph
var margin = {top: 500, right: 90, bottom: 100, left: 60},
    width = 1500 - margin.left - margin.right,
    height = 500

// append the svg object to the body of the page
var svg4 = d3.select("#dotDensityMap")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
	.style("margin-bot", "10px")

// Map and projection
var projection4 = d3.geoMercator()
    .center([11, 46])                // GPS of location to zoom on
    .scale(165000)                       // This is like the zoom
    .translate([ width/2, height/2 ])
	
d3.json("Data/Circoscrizioni.geojson", function(json){	
    
	// Draw the map
    svg4.append("g")
        .selectAll("path")
        .data(json.features)
        .enter().append("path")
            .attr("fill", "lawngreen")
            .attr("d", d3.geoPath()
                .projection(projection4)
            )
            .style("stroke", "#fff")
})

d3.csv("Data/TreesPosition.csv", (data) => {
	
	// Add dots
	svg4.selectAll("myCircles")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return projection([d.Longitude, d.Latitude])[0] } )
		.attr("cy", function (d) { return projection([d.Longitude, d.Latitude])[1] } )
		.attr("r", 4)
		.style("fill", "red")

})