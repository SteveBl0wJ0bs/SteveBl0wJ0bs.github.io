// set the dimensions and margins of the graph
var margin = {top: 500, right: 90, bottom: 100, left: 60},
    width = 1500 - margin.left - margin.right,
    height = 500

// append the svg object to the body of the page
var svg3 = d3.select("#oxygenMap")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
	.style("margin-bot", "10px")

// Map and projection
var projection3 = d3.geoMercator()
    .center([11, 46])                // GPS of location to zoom on
    .scale(165000)                       // This is like the zoom
    .translate([ width/2, height/2 ])
	
// Data and color scale
var data3 = d3.map();
var colorScale3 = d3.scaleQuantize()
	.domain([580, 50000])
	.range(d3.schemeBlues[9])
	
// Load external data and boot
d3.queue()
	.defer(d3.json, "Data/Circoscrizioni.geojson")
	.defer(d3.csv, "Data/DistrictsOxygenProduction.csv", function(d) {data3.set(d.District, +d.OxygenProduction);})
	.await(ready);

function ready(error, topo) {

	// Draw the map
	svg3.append("g")
		.selectAll("path")
		.data(topo.features)
		.enter()
		.append("path")
		// draw each country
		.attr("d", d3.geoPath()
			.projection(projection3)
		)
		// set the color of each country
		.attr("fill", function (d) {
			d.total = data3.get(d.properties.nome) || 0;
			return colorScale3(d.total);
		})
		.append("title")
        .text(function(d) {
			d.total = data3.get(d.properties.nome) || 0;
            return "District: " + d.properties.nome + "\n" + "Oxygen: " + d.total 
			+ "\n" + "Area: " + d.properties.area 
			//+ "\n" + "NumberOfTrees: " + d.Occurrences;
        });
    }

