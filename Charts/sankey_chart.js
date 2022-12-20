// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 750,
    height = 800;

// append the svg object to the body of the page
var svg = d3.select("#sankeyChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Color scale used
var color = d3.scaleOrdinal(d3.schemeCategory20);

// Set the sankey diagram properties
var sankey = d3.sankey()
	.nodeWidth(36)
    .nodePadding(20)
    .size([width, height]);

// load the data
d3.json("Data/FluxCarbonData.json", function(error, graph) {

	// Constructs a new Sankey generator with the default settings.
	sankey
		.nodes(graph.nodes)
		.links(graph.links)
		.layout(1);

	// add in the links
	var link = svg.append("g")
		.selectAll(".link")
		.data(graph.links)
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("d", sankey.link() )
		.style("stroke-width", function(d) { return Math.max(1,d.dy); })
		.sort(function(a, b) { return b.dy - a.dy; })
		.append("title")
		.text(function(d){
			return "Number of trees:"+" "+d.value
			+"\n"+"Carbon storage:"+" "+d.carbon+"kg"});

	// add in the nodes
	var node = svg.append("g")
		.selectAll(".node")
		.data(graph.nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; })
		.call(d3.drag()
        .subject(function(d) { return d; })
        .on("start", function() { this.parentNode.appendChild(this); }));
		
	// add the rectangles for the nodes
	node
		.append("rect")
		.attr("height", function(d) { return d.dy; })
		.attr("width", sankey.nodeWidth())
		.style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
		.style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
		.append("title")

	// add in the title for the nodes
    node
		.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy/2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
		.filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
});

// append the svg object to the body of the page
var svg2 = d3.select("#sankeyChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("Data/FluxEuroData.json", function(error, graph) {

	// Constructs a new Sankey generator with the default settings.
	sankey
		.nodes(graph.nodes)
		.links(graph.links)
		.layout(1);

	// add in the links
	var link = svg2.append("g")
		.selectAll(".link")
		.data(graph.links)
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("d", sankey.link() )
		.style("stroke-width", function(d) { return Math.max(1,d.dy); })
		.sort(function(a, b) { return b.dy - a.dy; })
		.append("title")
		.text(function(d){
			return "Number of trees:"+" "+d.value
			+"\n"+"Euro saved:"+" "+d.euro});

	// add in the nodes
	var node = svg2.append("g")
		.selectAll(".node")
		.data(graph.nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; })
		.call(d3.drag()
        .subject(function(d) { return d; })
        .on("start", function() { this.parentNode.appendChild(this); }));
	// add the rectangles for the nodes
	node
		.append("rect")
		.attr("height", function(d) { return d.dy; })
		.attr("width", sankey.nodeWidth())
		.style("fill", function(d) { 
		console.log(d.name.replace(/ .*/, ""))
		return d.color = color(d.name.replace(/ .*/, "")); })
		.style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
		.append("title")

	// add in the title for the nodes
    node
		.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy/2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
		.filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
});
