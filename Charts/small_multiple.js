function draw_small_multiple(name, id) {
    // set the dimensions and margins of the graph
    var margin2 = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 60
        },
        width2 = 400 - margin2.left - margin2.right,
        height2 = 300 - margin2.top - margin2.bottom;

    // append the svg object to the body of the page
    var svg2 = d3.select(id)
        .append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin2.left + "," + margin2.top + ")");

    //Read the data
    d3.csv("Data/TreeInformation.csv", function(data) {

        data = data.filter(function(obj) {
            return (obj.Name == name);
        });

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 40])
            .range([0, width2]);
        svg2.append("g")
            .attr("transform", "translate(0," + height2 + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 8000])
            .range([height2, 0]);
        svg2.append("g")
            .call(d3.axisLeft(y));

        // Color scale: give me a specie name, I return a color
        var color = d3.scaleOrdinal()
            .domain(["Celtis australis", "Aesculus hippocastanum", "Carpinus betulus", "Tilia cordata", "Platanus x hispanica", "Tilia x europaea"])
            .range(["cyan", "yellow", "fuchsia", "lime", "red", "blue"])

        // Add dots
        svg2.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return x(d.Height);
            })
            .attr("cy", function(d) {
                return y(d.CarbonStorage);
            })
            .attr("r", 7)
            .style("fill", function(d) {
                return color(d.Name);
            })
			.append("title")
            .text(function() {
                return "Name: " + name;
            });
    })

}
