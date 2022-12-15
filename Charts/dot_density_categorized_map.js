// set the dimensions and margins of the graph
var margin = {top: 500, right: 90, bottom: 100, left: 60},
    width = 1500 - margin.left - margin.right,
    height = 500

// append the svg object to the body of the page
var svg5 = d3.select("#dotDensityCategorizedMap")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
	.style("margin-bot", "10px")

// Map and projection
var projection5 = d3.geoMercator()
    .center([11, 46])                // GPS of location to zoom on
    .scale(165000)                       // This is like the zoom
    .translate([ width/2, height/2 ])
	
d3.json("Data/Circoscrizioni.geojson", function(json){	
    
	// Draw the map
    svg5.append("g")
        .selectAll("path")
        .data(json.features)
        .enter().append("path")
            .attr("fill", "lawngreen")
            .attr("d", d3.geoPath()
                .projection(projection5)
            )
            .style("stroke", "#fff")
})

d3.csv("Data/TreesPosition.csv", (data2) => {
	
	data2 = data2.filter(object =>{
		
		return object.Name=="Celtis Australis" || object.Name=="Aesculus hippocastanum"
		|| object.Name=="Carpinus betulus" || object.Name== "Tilia cordata"
		|| object.Name=="Platanus x hispanica" || object.Name=="Tilia x europaea"
		|| object.Name=="Acer campestre" || object.Name=="Cupressus"
		|| object.Name=="Sophora japonica" ||object.Name=="Prunus cerasifera"
	});
	// Create a color scale
    var color = d3.scaleOrdinal()
		.domain(["Celtis Australis", "Aesculus hippocastanum", "Carpinus betulus", 
		"Tilia cordata", "Platanus x hispanica", "Tilia x europaea", "Acer campestre", 
		"Cupressus", "Sophora japonica", "Prunus cerasifera" ])
		.range([ "red", "black", "grey", "yellow", "blue", "purple", "fuchsia", "olive", "pink", 
		"chocolate"])
	
	// Add dots
	svg5.selectAll("myCircles")
		.data(data2)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return projection([d.Longitude, d.Latitude])[0] } )
		.attr("cy", function (d) { return projection([d.Longitude, d.Latitude])[1] } )
		.attr("r", 4)
		.style("fill", function(d){ return color(d.Name) })
		.append("title")
            .text(function(d) {
                return "Name: " + d.Name;
            });
})