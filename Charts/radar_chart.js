// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
	width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#radarChart")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Data/TemporalData.csv", function(data) {

	var ticks = [-20,-10,0,10,20,30,40];
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'
				, 'Dec'];
	
	var radialScale = d3.scaleLinear()
						.domain([-20,40])
						.range([0,180]);

	ticks.forEach(t =>
		svg3.append("circle")
			.attr("cx", 300)
			.attr("cy", 300)
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("r", radialScale(t))
			);
			
	ticks.forEach(t =>
		svg3.append("text")
			.attr("x", 305)
			.attr("y", 300 - radialScale(t))
			.text(t.toString())
			);
	
	function angleToCoordinate(angle, value){
		let x = Math.cos(angle) * radialScale(value);
		let y = Math.sin(angle) * radialScale(value);
		return {"x": 300 + x, "y": 300 - y};
	}
	
	for (var i = 0; i < months.length; i++) {
		
		let ft_name = months[i];
		let angle = (Math.PI / 2) + (2 * Math.PI * i / months.length);
		let line_coordinate = angleToCoordinate(angle, 75);
		let label_coordinate = angleToCoordinate(angle, 75.5);

		//draw axis line
		svg3.append("line")
			.attr("x1", 300)
			.attr("y1", 300)
			.attr("x2", line_coordinate.x)
			.attr("y2", line_coordinate.y)
			.attr("stroke","black");

		//draw axis label
		svg3.append("text")
			.attr("x", label_coordinate.x)
			.attr("y", label_coordinate.y)
			.text(ft_name);
	}
	console.log(data)
	for (let i=0; i<96; i++){
		let angle=(Math.PI / 2) + (2 * Math.PI * i / months.length);
		data[i].mean=angleToCoordinate(angle,data[i].mean)
		}
		
	var coordinates_data = d3.nest() 
		.key(function(d) { return d.year;})
		.entries(data)
	
	let line = d3.line()
		.x(function(d){return +d.x})
		.y(function(d){return +d.y});
	
	var color=['red','gold','blue','cornflowerblue','pink','mediumvioletred','lightsteelblue'
				,'yellowgreen']
	
	// Draw the lines
	for(let i=0; i<8; i++){
		let coordinates=[]
		for(let k=0; k<12; k++){
			coordinates.push(coordinates_data[i].values[k].mean)
		}
		//console.log(coordinates)
		svg3.append("path")
			.datum(coordinates)
			.attr("fill", color[i])
			.attr("stroke", color[i])
			.attr("stroke-width", 1.5)
			.attr("d", line)
			.attr("stroke-opacity", 0.5)
			.attr("opacity", 0.2);
	}

})