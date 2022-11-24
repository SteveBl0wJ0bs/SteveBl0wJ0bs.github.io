function draw_waffle_chart(path, div) {
    var total = 0;
	var subtotal = 0;
    var width,
        height,
        widthSquares = 10,
        heightSquares = 10,
        squareSize = 25,
        squareValue = 0,
        gap = 1,
        theData = [];

    d3.csv(path, function(error, data) {
        var subgroups = data.columns.slice(1)
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["pink", "white", "cyan", "yellow", "fuchsia", "lime"]);
        //total
        total = d3.sum(data, function(d) {
            return d.Occurrences;
        });

        //value of a square
        squareValue = total / (widthSquares * heightSquares);

        //remap data
        data.forEach(function(d, i) {
            d.Occurrences = +d.Occurrences;
            d.units = Math.ceil(d.Occurrences / squareValue);
			if(d.Name == "Others")
				d.units = 100-subtotal;
			subtotal = subtotal + d.units;
            theData = theData.concat(
                Array(d.units + 1).join(1).split('').map(function() {
                    return {
                        squareValue: squareValue,
                        units: d.units,
                        Occurrences: d.Occurrences,
                        groupIndex: i
                    };
                })
            );
        });

        width = (squareSize * widthSquares) + widthSquares * gap + 25;
        height = (squareSize * heightSquares) + heightSquares * gap + 25;

        var waffle = d3.select(div)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .selectAll("div")
            .data(theData)
            .enter()
            .append("rect")
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("fill", function(d) {
                return color(d.groupIndex);
            })
            .attr("x", function(d, i) {
                //group n squares for column
                col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr("y", function(d, i) {
                row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            })
            .append("title")
            .text(function(d, i) {
                return "Name: " + data[d.groupIndex].Name + "\nOccurrences: " + d.Occurrences + "\nPercentage: " + d.units + "%"
            });
	});
}