const select = id => document.getElementById(id);
const log = out => console.log(out);

let scrollpage = 0;

promiseCastle = loadJSON('castle.json')
promiseCastle.then(function(coords) {
    coords.forEach(addSVG)
    
})
function addSVG(xy) {
    var cast = select('castle');

    var classes = ['circle1', 'circle2', 'circle3','circle4']
    var colors = ['#ffffff','#D7FFFA', '#BCDAFF','#499dd1', '#2bbddf', '#E3D2FF'];
    var color = colors[Math.floor(Math.random() * colors.length)];
    var classname = classes[Math.floor(Math.random() * classes.length)]

    var bright = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bright.setAttribute("cx", xy[0]-150)
    bright.setAttribute("cy", xy[1]-360)
    bright.setAttribute("r", 2.5)
    bright.setAttribute("fill-opacity", "20%")
    bright.setAttribute("fill", color)
    bright.setAttribute("class", classname)
    cast.appendChild(bright)

    var halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    halo.setAttribute("cx", xy[0]-150)
    halo.setAttribute("cy", xy[1]-360)
    halo.setAttribute("r", 1.5)
    halo.setAttribute("fill-opacity", "10%")
    halo.setAttribute("fill", color)
    bright.setAttribute("class", classname)
    cast.appendChild(halo)

}

function scrollTo(num) {
    var element_to_scroll_to = document.getElementById('anchor' + num);
    log('anchor' + num)
    element_to_scroll_to.scrollIntoView();

}


async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json(); // Now available in global scope
	return dataset;
}

document.onkeydown = function(e) { 
    switch (e.keyCode) { 
        case 38: 
            if(scrollpage > 0) {
                scrollpage--;
                scrollTo(scrollpage); 
                break;
            }
            break;
        case 40: 
            scrollpage++;
            scrollTo(scrollpage);
            break; 
    } 
}; 

function initGraphs() {
    plotLollipop();
    plotArc();
    plotScatter();
    plotBar();
    plotsecondBar();
    plotFinale();
}

function plotLollipop() {

    // set the dimensions and margins of the graph
    var margin = {top: 70, right: 50, bottom: 30, left: 80},
        width = 1100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var container = d3.select("#firstViz");


    // append the svg object to the body of the page
    var svg = container
    .append("svg")
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom)
        .attr("svg-content-responsive", "true")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = container.append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "30px") 
    //.style("text-decoration", "underline") 
    .attr("class", "titles") 
    .text("Most Common Words Used In Disney Songs");

    // Parse the Data
    d3.csv("over100.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 600])
        .range([ 0, width]);
        svg.append("g").attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.lyrics; }))
    .padding(1);
    svg.append("g").attr("class", "y axis")
    .call(d3.axisLeft(y));


    // Lines
    svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
        .attr("x1", function(d) { return x(d.count); })
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.lyrics); })
        .attr("y2", function(d) { return y(d.lyrics); })
        .attr("class", "line").attr("stroke", "#ffffff")
        .style("opacity", 0.5);

    // Circles
    svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function(d) { return x(d.count); })
        .attr("cy", function(d) { return y(d.lyrics); })
        .attr("r", "4")
        .attr("class", "point")
        .style("fill", "#BCD9FF")
        .attr("stroke-width", "1px")
        .attr("stroke", "white")
        .attr("stroke-opacity", ".5")
        .style("opacity", ".9")
        .on("mouseover", function(d) {	
            d3.select(event.currentTarget)
            .style("fill", "white")
            .attr("r", "10");
            tooltip.html(d.lyrics + '<br>' + d.count)	
            .style("opacity", .9)
            .style("font-size", "10px")		
            .style("left", (d3.event.pageX+15) + "px")     
            .style("top", (d3.event.pageY + 16) + "px");			
            })					
        .on("mouseout", function(d) {	
            d3.select(event.currentTarget)
            .style("fill", "#BCD9FF")
            .attr("r", "4");;
            	
            tooltip.transition()		
                .duration(500)
                .style("opacity", 0);	
        });
    })
    


}

function plotArc() {
    var margin = {top: 20, right: 30, bottom: 20, left: 30},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    
    // append the svg object to the body of the page
    var container = d3.select("#secondViz")
    var svg = container
        .append("svg")
        .attr("svg-content-responsive", "true")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = container.append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    

        // List of node names
        var allNodes = disney.nodes.map(function(d){return d.node})
    
        // A linear scale to position the nodes on the X axis
        var x = d3.scalePoint()
        .range([0, width])
        .domain(allNodes)
    
        // Add the circle for the nodes
        color = {1: "#91B6D9", 2: "#BD9EEF", 3: "#9EEFB8"}
        svg
        .selectAll("mynodes")
        .data(disney.nodes)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(x(d.node))})
            .attr("cy", height-30)
            .attr("r", 2)
            .style("fill", function(d) { return color[d.group]})
    
        // And give them a label
        svg
        .selectAll("mylabels")
        .data(disney.nodes)
        .enter()
        .append("text")
            .attr("x", function(d){ return(x(d.node))})
            .attr("y", height-10)
            .text(function(d){ return(d.node.toUpperCase())})
            .style("text-anchor", "middle")
            .style("font-size", "5px")
            .attr("class", "label")
    
        // Add links between nodes. Here is the tricky part.
        // In my input data, links are provided between nodes -id-, NOT between node names.
        // So I have to do a link between this id and the name
        var idToNode = {};
        disney.nodes.forEach(function (n) {
            idToNode[n.id] = n;
        })    
        
    
        // Cool, now if I do idToNode["2"].name I've got the name of the node with id 2
    
        // Add the links
        svg
        .selectAll('mylinks')
        .data(disney.links)
        .enter()
        .append('path')
        .attr('d', function (d) {
            start = x(idToNode[d.source].node)    // X position of start node on the X axis
            end = x(idToNode[d.target].node)      // X position of end node
            return ['M', start, height-30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // This means we're gonna build an elliptical arc
            (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .attr("class", function(d) { return "path" + d.source })
        .style("fill", "none")
        .attr("stroke-width", function(d) { if(d.value < 30) {return 0;} else {return d.value/2-25}})
        .attr("stroke", "white")
        .attr("opacity", ".1").on("click", function(d) {
            d3.selectAll("path").style("opacity", "0")	
            d3.select(event.currentTarget)
            .style("stroke", "#91B6D9")
            .style("opacity", ".5")
            .attr("r", "10");
            tooltip.html(d.value)	
            .style("opacity", .9)
            .style("font-size", "20px")		
            .style("left", (d3.event.pageX+15) + "px")     
            .style("top", (d3.event.pageY + 16) + "px");	
            })								
        .on("mouseout", function(d) {
            d3.selectAll("path").style("opacity", ".1")	
            d3.select(event.currentTarget)
            .style("opacity", ".1")
            .style("stroke", "white")
            tooltip.transition()		
            .duration(500)
            .style("opacity", 0);	
        });

        svg.selectAll("text").on("click", function(d) {
            console.log(d3.selectAll(".path" + d.id))
            console.log(d.id)
            d3.selectAll("path").style("opacity", "0")	
            d3.selectAll(".path" + d.id).style("opacity", ".1")
        }).on("mouseout", function(d) {
            d3.selectAll("path").style("opacity", ".1")	
        });

        svg.append("text")
        .attr("x", (width / 2)-10)             
        .attr("y", 0 - (margin/2))
        .attr("text-anchor", "middle") 
        .style("fill", "white") 
        .style("font-size", "12px") 
        //.style("text-decoration", "underline") 
        .attr("class", "titles") 
        .text("Relationship Between Most Common Words");

        svg.append("text")
        .attr("x", (width / 2)-10)             
        .attr("y", 20)
        .attr("text-anchor", "middle") 
        .style("fill", "white") 
        .style("font-size", "5px") 
        //.style("text-decoration", "underline") 
        .text("Click arc lines for tooltip, or words to display only the relationships including that word.");

        svg.append("circle")
        .attr("cx", (width / 2)-80)             
        .attr("cy", 10)
        .attr("r", 3)
        .style("fill" , "#91B6D9")

        svg.append("text")
        .attr("x", (width / 2)-60)             
        .attr("y", 11)
        .attr("text-anchor", "middle") 
        .style("fill", "white") 
        .style("font-size", "5px") 
        //.style("text-decoration", "underline") 
        .text("positive words");

        svg.append("circle")
        .attr("cx", (width / 2)+20)             
        .attr("cy", 10)
        .attr("r", 3)
        .style("fill" , "#BD9EEF")

        svg.append("text")
        .attr("x", (width / 2)+40)             
        .attr("y", 11)
        .attr("text-anchor", "middle") 
        .style("fill", "white") 
        .style("font-size", "5px") 
        //.style("text-decoration", "underline") 
        .text("neutral words");
    

}

function plotScatter() {
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    //var color = d3.scaleOrdinal(d3[categorical[0]);
    var colorScale = d3.scaleOrdinal()
    .domain([1, 2 ])
    .range([ '#BCD9FF', "#E6BCFF"])

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    var container = d3.select("#thirdViz")

    var tooltip = container.append("div")	
    .attr("class", "tooltipscatter")				
    .style("opacity", 0);

    var svg = container.append("svg")
    .attr("svg-content-responsive", "true")
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("sent.csv", function(error, data) {
    if (error) throw error;


    x.domain(d3.extent(data, function(d) { return d.pos; })).nice();
    y.domain(d3.extent(data, function(d) { return d.neg; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("% OF POSITIVE WORDS")
        .attr("font-size", "20px");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("% OF NEGATIVE WORDS")
        .attr("font-size", "20px")

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.pos); })
        .attr("cy", function(d) { return y(d.neg); })
        .style("fill", function(d) { return colorScale(d.group); })
        .style("opacity", "0.7").on("click", function(d) {	
            d3.select(event.currentTarget)
            .style("fill", "white")
            .attr("r", "10");
            tooltip.html('Song: ' + d.Song + '<br>' + 'Movie: ' + d.Movie + '<br>' + 'Sentiment: ' + d.compound)	
            .style("opacity", 1)
            .style("font-size", "15px")		
            .style("left", (d3.event.pageX+15) + "px")     
            .style("top", (d3.event.pageY - 16) + "px");			
            })					
        .on("mouseout", function(d) {	
            d3.select(event.currentTarget)
            .style("fill", function(d) { return colorScale(d.group);})
            .attr("r", "4");;
            	
            tooltip.transition()		
                .duration(500)
                .style("opacity", 0);	
        });;

    var legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);
  
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text(function(d) { if (d==1) {return "LEANS POSITIVE"} else {return "LEANS NEGATIVE"}; });

    svg.append("text")
    .attr("x", (width / 2)-10)             
    .attr("y", 30)
    .attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "12px") 
    //.style("text-decoration", "underline") 
    .text("Click on points to display tooltip.");
  
  });

  svg.append("text")
  .attr("x", (width / 2)-10)             
  .attr("y", 0 - (margin/2))
  .attr("text-anchor", "middle") 
  .style("fill", "white") 
  .style("font-size", "20px") 
  //.style("text-decoration", "underline") 
  .attr("class", "titles") 
  .text("Disney Songs - Percent of Positive vs Negative Words");
}

function plotBar() {
    var margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 250
      };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var container = d3.select("#fourthViz")
    var tooltip = container.append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    
    var svg = container.append("svg")
        .attr("svg-content-responsive", "true")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
          .range([0, width]);

    var y = d3.scaleBand()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .ticks(10, "%");

    var yAxis = d3.axisLeft(y);

    d3.csv("pos_movies.csv", function(error, data) {
      if (error) throw error;

      x.domain([0, d3.max(data, function(d) { return d.compound; })]);

      y.domain(data.map(function(d) { return d.Movie; }))
        .paddingInner(0.5)
        .paddingOuter(0.6);


      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "translate(" + (width+60)/2 + ",50)")
          .attr("y", -5)
          .style("text-anchor", "end")
          .style("font-size", "20px")
          .text("Percent Positive");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("fill", '#BCD9FF')
          .attr("height", y.bandwidth())
          .attr("y", function(d) { return y(d.Movie); })
          .attr("width", function(d) { return x(d.compound); })
          .style("opacity", ".8").on("mouseover", function(d) {	
            tooltip.html(parseFloat(d.compound).toFixed(3))	
            .style("opacity", 1)
            .style("font-size", "15px")		
            .style("left", (d3.event.pageX+15) + "px")     
            .style("top", (d3.event.pageY - 16) + "px");			
            })					
        .on("mouseout", function(d) {	
            	
            tooltip.transition()		
                .duration(500)
                .style("opacity", 0);	
        });;;

          svg.append("text")
        .attr("x", (width / 2)-10)             
        .attr("y", 0 - (margin/2))
        .attr("text-anchor", "middle") 
        .style("fill", "white") 
        .style("font-size", "20px") 
        //.style("text-decoration", "underline") 
        .attr("class", "titles") 
        .text("Top 10 Positive Movies Based on Song Sentiment Average");

		
    });
   
}

function plotsecondBar() {
    var margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 250
    };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var container = d3.select("#fifthViz")

    var tooltip = container.append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    var svg = container.append("svg")
        .attr("svg-content-responsive", "true")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleBand()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .ticks(10, "%");

    var yAxis = d3.axisLeft(y);

    d3.csv("neg_movies.csv", function(error, data) {
    if (error) throw error;

    x.domain([0, d3.max(data, function(d) { return d.compound; })]);

    y.domain(data.map(function(d) { return d.Movie; }))
        .paddingInner(0.5)
        .paddingOuter(0.6);


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + (width+100)/2  + ",50)")
        .attr("y", -5)
        .style("text-anchor", "end")
        .style("font-size", "20px")
        .text("Percent Negative");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("fill", '#E6BCFF')
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.Movie); })
        .attr("width", function(d) { if (d.compound < 0) {return 0} else {return x(d.compound)}; })
        .style("opacity", ".8").on("mouseover", function(d) {	
            tooltip.html(parseFloat(d.compound).toFixed(3))	
            .style("opacity", 1)
            .style("font-size", "15px")		
            .style("left", (d3.event.pageX+15) + "px")     
            .style("top", (d3.event.pageY - 16) + "px");			
            })					
        .on("mouseout", function(d) {	
            	
            tooltip.transition()		
                .duration(500)
                .style("opacity", 0);	
        });;;

    svg.append("text")
    .attr("x", (width / 2)-10)             
    .attr("y", 0 - (margin/2))
    .attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "20px") 
    //.style("text-decoration", "underline") 
    .attr("class", "titles") 
    .text("Top 10 Negative Movies Based on Song Sentiment Average");

    
});

}

function plotFinale() {

    var margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 250
    };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var container = d3.select('#lastViz')
    var svg = container.append("svg")
    .attr("svg-content-responsive", "true")
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var rect = svg
    .append('rect')
    .attr('x', '10')
    .attr('y', '10')
    .attr('width', '200')
    .attr('height',' 200')
    .attr('fill', '#1A1D25')
    .attr('stroke', '5px')
    .style('stroke', 'white')

    var text = svg.append('text')
    .attr('x', '37')
    .attr('y', '80')
    //.attr("text-anchor", "middle") 
    .style("fill", "#BCD9FF") 
    .style("font-size", "20px")
    .style("font-family", "Oswald")
    .text('Most Positive Song:')

    var name = svg.append('text')
    .attr('x', '37')
    .attr('y', '137')
    //.attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "25px")
    .style("font-family", "Mouse Memoirs")
    .text('SAY IT WITH A SLAP')

    var movie = svg.append('text')
    .attr('x', '33')
    .attr('y', '167')
    //.attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "25px")
    .style("font-family", "Mouse Memoirs")
    .text('(fun and fancy free)')

    var rect2 = svg
    .append('rect')
    .attr('x', '220')
    .attr('y', '10')
    .attr('width', '200')
    .attr('height',' 200')
    .attr('fill', '#1A1D25')
    .attr('stroke', '5px')
    .style('stroke', 'white')

    var text2 = svg.append('text')
    .attr('x', '247')
    .attr('y', '80')
    //.attr("text-anchor", "middle") 
    .style("fill", "#BCD9FF") 
    .style("font-size", "20px")
    .style("font-family", "Oswald")
    .text('Most Negative Song:')

    var name = svg.append('text')
    .attr('x', '247')
    .attr('y', '137')
    //.attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "25px")
    .style("font-family", "Mouse Memoirs")
    .text('SAVAGES (pocahontas)')


    var rect3 = svg
    .append('rect')
    .attr('x', '10')
    .attr('y', '220')
    .attr('width', '200')
    .attr('height',' 200')
    .attr('fill', '#1A1D25')
    .attr('stroke', '5px')
    .style('stroke', 'white')

    var text3 = svg.append('text')
    .attr('x', '37')
    .attr('y', '280')
    //.attr("text-anchor", "middle") 
    .style("fill", "#BCD9FF") 
    .style("font-size", "20px")
    .style("font-family", "Oswald")
    .text('Most Positive Movie:')

    var name3 = svg.append('text')
    .attr('x', '37')
    .attr('y', '330')
    //.attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "25px")
    .style("font-family", "Mouse Memoirs")
    .text('SOFIA THE FIRST:')
    

    var nextline = svg.append('text')
    .attr('x', '37')
    .attr('y', '360')
    //.attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "25px")
    .style("font-family", "Mouse Memoirs")
    .text('THE FLOATING PALACE')

    var rect4 = svg
    .append('rect')
    .attr('x', '220')
    .attr('y', '220')
    .attr('width', '200')
    .attr('height',' 200')
    .attr('fill', '#1A1D25')
    .attr('stroke', '5px')
    .style('stroke', 'white')

    var text4 = svg.append('text')
    .attr('x', '247')
    .attr('y', '280')
    //.attr("text-anchor", "middle") 
    .style("fill", "#BCD9FF") 
    .style("font-size", "20px")
    .style("font-family", "Oswald")
    .text('Most Negative Movie:')

    var name = svg.append('text')
    .attr('x', '247')
    .attr('y', '330')
    //.attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "25px")
    .style("font-family", "Mouse Memoirs")
    .text('ELENA OF AVALOR:')

    var arg = svg.append('text')
    .attr('x', '247')
    .attr('y', '360')
    //.attr("text-anchor", "middle") 
    .style("fill", "white") 
    .style("font-size", "25px")
    .style("font-family", "Mouse Memoirs")
    .text('REALM OF THE JAQUINS')
}




window.addEventListener('DOMContentLoaded', scroll)
window.addEventListener('DOMContentLoaded', initGraphs)
