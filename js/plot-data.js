// d3.select("p").style("color", "green");
// d3.select("body").append("p").text("Third paragraph.");
// // d3.select("body").append("p").text("Hey Tom");

// var circle = d3.selectAll("circle");
// circle.data([32, 57, 112]);
// circle.attr("r", function (d) { return Math.sqrt(d); });


function plotBars(data, divId, width, height) {
    // https://datawanderings.com/2019/10/20/tutorial-advanced-bar-chart-in-d3-js-v-5/
    // Init SVG
    var margin = 5;
    var padding = 5;
    var adj = 20;
    var svg = d3.select(divId).append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-" + adj + " -" + adj + " " + (width + adj) + " " + (height + adj * 2))
        .style("padding", padding)
        .style("margin", margin)
        .classed("svg-content", true);
    // Scales
    var xScale = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05);
    var yScale = d3.scaleLinear()
        .rangeRound([0, height]);
    xScale.domain(data.map(function (d) { return d.label }))
    yScale.domain([d3.max(data, function (d) { return d.val; }), 0]);
    // Axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));
    // Add data
    svg.selectAll("div")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xScale(d.label);
        })
        .attr("y", function (d) {
            return yScale(d.val);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d.val);
        });
}

function plotCalendar(dateText,monthText, divId, width){
    // var parseTime = d3.timeParse("%e %B"),
    //     date = parseTime(dateText + " " + monthText);
    // console.log(date);

    // Construct 28 day grid
    var dates = Array.from({ length: 28 }, (x, i) => i+1);
    // console.log(dates);
    var spacing = 1,
        daySquareLength = 25,
        rounding = 0.4,
        borderGapOutside = 20,
        width = daySquareLength * spacing * 7 + borderGapOutside;

    var height = daySquareLength * spacing * 5 + borderGapOutside/2;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var border = svg.append("g")
        .attr("id","calendar-border");
    
    border.append("text")
        .attr("x",width/2 + borderGapOutside/2)
        .attr("y",15)
        .text(monthText)
        .attr("class","month");
    
    // Draw box around whole thing.
    border.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("rx", daySquareLength * rounding)
        .attr("ry", daySquareLength * rounding)
        .attr("class","outside-line");
    // Draw box around dates
    border.append("rect")
        .attr("width", daySquareLength * spacing * 7)
        .attr("height", daySquareLength * spacing * 4)
        .attr("rx", daySquareLength * rounding)
        .attr("ry", daySquareLength * rounding)
        .attr("class", "date-line")
        .attr("transform", "translate("+borderGapOutside/2+"," + daySquareLength + ")");
    
    var dateDisplay = border.append("g")
        .attr("class","date-display")
        .attr("transform","translate("+borderGapOutside/2+","+daySquareLength+")" );

    var dateSquareGroups = dateDisplay.selectAll("g")
        .data(dates)
        .enter()
        .append("g")
        .attr("id", function (d) {
            return "day-" + d;
        })
        // Hide all of these groups - we unhide the one we want
        .attr("visibility", "hidden")
        .attr("transform", function (d, i) {
            return "translate("+i %7  * daySquareLength*spacing + "," + Math.floor(i/7) * daySquareLength*spacing + ")";
        });

    dateSquareGroups.append("rect")
        .attr("width", daySquareLength)
        .attr("height", daySquareLength)
        .attr("rx",daySquareLength*rounding)
        .attr("ry",daySquareLength*rounding);

    dateSquareGroups.append("text")
        .attr("x", daySquareLength/2 + 5)
        .attr("y", daySquareLength / 2)
        .text(function (d) { return d; });

    // Only show the specified date
    d3.select("#day-" + dateText).attr("visibility","visible");
    
    if (dateText == "29" || dateText == "30" || dateText == "31") {
        // Show last day in month as that date
        d3.select("#day-28").attr("visibility", "visible");
        d3.select("#day-28").select("text").text(dateText);
    }

}