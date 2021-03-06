

//make some fake data;

data = d3.range(0,1050).map(function(d) {
    return {
        "x":300 + Math.random()*650,
        "y":50 + Math.random()*500,
        "value":(Math.random()*Math.random())*25}
})

data.sort(function(a,b){return a-b})


//map it to some elements and data
circles = d3.select("svg").append("g").selectAll("circle").data(data)


//make a color scale:
range = data.map(function(d) {return d.value})

fillings = d3.scale.linear()
    .domain(d3.extent(range))
    .range(["white","red"])


circles
    .enter()
    .append("circle")
    .attr("cx",function(d) {return d.x})
    .attr("cy",function(d) {return d.y})
    .attr("r",function(d) {return d.value})
    .style("fill",function(d) {return fillings(d.value) } )

var whichValue = "value"
var scaletype = "linear"

changeFillings = function() {
    tops = d3.scale.category20().range()
    var newTop = tops[Math.floor(Math.random() * tops.length)];

    var localdata = data.map(function(d) {
                return d[whichValue]
            })
    fillings = d3.scale.linear()
        .domain(d3.extent(localdata))
        .range(["white",newTop])

    if (scaletype=="quantile") {
    //breaks = [0,.25,.5,.75,1].map(function(n) {return d3.quantile(localdata,n)})
    fillings = d3.scale.quantile()
        .domain(localdata)
        .range(["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"].reverse())
    }

    circles
        .transition().duration(1000)
        .style("fill",function(d) {return fillings(d[whichValue]) } )

}



d3.selectAll("button").on("click",function(d) {

    //Choose the orientation randomly.



    
    variable = d3.select(this).attr("id")

    if (variable=="orientation") {
        //clunk.
        bar.selectAll("rect").remove()
        orientation = orientation=="horizontal"?"vertical":"horizontal"
    } else if (variable=="scaletype") {
        scaletype = scaletype=="linear"?"quantile":"linear"
    } else {
       whichValue = variable
    }
    changeFillings()
    colorbar.scale(fillings);
    colorbar = Colorbar()
    .origin([50,20])
    .scale(fillings)
    .barlength(300)
    .thickness(20)
    .orient(orientation)
    .title("Hover to update the pointer")

   pointer = d3.selectAll("#colorbar")
    .transition().duration(700)
    .call(colorbar);
    //    colorbar.scale(fillings).title("Hover to update the
    //    pointer").update()
})

//OK, now the actual colorbar stuff:

var orientation = "vertical"
colorbar = Colorbar()
    .origin([50,20])
    .thickness(100)
    .scale(fillings).barlength(300).thickness(20)
    .orient(orientation)
    .title("Hover to update the pointer")

bar =  d3.selectAll("svg").append("g").attr("id","colorbar")

pointer = d3.selectAll("#colorbar").call(colorbar)

circles
    .on("mouseover",function(d) {pointer.pointTo(d[whichValue])})


