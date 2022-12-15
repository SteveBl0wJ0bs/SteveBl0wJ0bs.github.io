// set the dimensions and margins of the graph
var margin = {top: 100, right: 30, bottom: 30, left: 60},
	width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg2 object to the body of the page
var svg2 = d3.select("#ridgelineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//read data
d3.csv("Data/FullTemporalData.csv", function(data) {

    function update(year) {
        var dataFilter = data.filter(function(d) {
            return d.year == year
        })

        // Get the different categories and count them
        var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        var n = categories.length

        // Compute the mean of each group
        allMeans = []
        for (i in categories) {
            currentGroup = categories[i]
            mean = d3.mean(dataFilter, function(d) {
                return +d[currentGroup]
            })
            allMeans.push(mean)
        }

        // Create a color scale using these means.
        var myColor = d3.scaleSequential()
            .domain([0, 20])
            .interpolator(d3.interpolateViridis);

        // Add X axis
        var x = d3.scaleLinear()
            .domain([-10, 30])
            .range([0, width]);
        svg2.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickValues([-10, 0, 10, 20, 30]).tickSize(-height))
            .select(".domain").remove()

        // Create a Y scale for densities
        var y = d3.scaleLinear()
            .domain([0, 0.5])
            .range([height, 0]);

        // Create the Y axis for names
        var yName = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .paddingInner(1)
        svg2.append("g")
            .call(d3.axisLeft(yName).tickSize(0))
            .select(".domain").remove()

        // Compute kernel density estimation for each column:
        var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
        var allDensity = []
        for (i = 0; i < n; i++) {
            key = categories[i]
            density = kde(dataFilter.map(function(d) {
                return d[key];
            }))
            allDensity.push({
                key: key,
                density: density
            })
        }

        // Add areas
        svg2.selectAll("areas")
            .data(allDensity)
            .enter()
            .append("path")
            .attr("transform", function(d) {
                return ("translate(0," + (yName(d.key) - height) + ")")
            })
            .attr("fill", function(d) {
                grp = d.key;
                index = categories.indexOf(grp)
                value = allMeans[index]
                return myColor(value)
            })
            .datum(function(d) {
                return (d.density)
            })
            .attr("opacity", 0.7)
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function(d) {
                    return x(d[0]);
                })
                .y(function(d) {
                    return y(d[1]);
                })
            )

    }
    update(1993);

    // When the button's content is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg2.selectAll("path").remove();
        update(selectedYear);
    })
})

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) {
                return kernel(x - v);
            })];
        });
    };
}

function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}