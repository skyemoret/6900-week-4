/**
 * Created by skyemoret on 2/4/16.
 */

d3.timeSeries = function(){
    //internal variables (will need some default values that can be overwritten later)
    var w = 800,
        h = 600,
        m = {t:25,r:50,b:25,l:50},  //margins around the drawing
        chartWidth = w - m.l - m.r,
        chartHeight = h - m.t - m.b,
        timeRange = [new Date(), new Date()],   //new Date() puts in today's date
        binSize = d3.time.day,
        maxY = 250,
        scaleX = d3.time.scale().range([0,chartWidth]).domain(timeRange),
        scaleY = d3.scale.linear().range([chartHeight,0]).domain([0,maxY]),
        valueAccessor = function(d){return d.startTime};


    //exports function
    function exports(selection) {
        console.log(binSize);

        chartWidth = w - m.l - m.r;
        chartHeight = h - m.t - m.b;

        scaleX.range([0, chartWidth]).domain(timeRange);
        scaleY.range([chartHeight, 0]).domain([0, maxY]);

        var layout = d3.layout.histogram()  //create the histogram layout
            .value(valueAccessor)   //valueAccessor & timeRange are below
            .range(timeRange)
            .bins(binSize.range(timeRange[0], timeRange[1]));

        /*d3.time.week.range(date1, date2);*/ //FIGURE OUT WHAT TIME INTERVAL I WANT

        //take the data and use a histogram layout to transform into a series of (x,y)
        //DRAW HERE!
        selection.each(function(_d){
            //'selection' --> d3.select('.plot')
            var data = layout(_d);
            console.log(data);

            //appending DOM elements
            var line = d3.svg.line()
                .x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
                .y(function(d){ return scaleY(d.y)})
                .interpolate('basis');
            var area = d3.svg.area()
                .x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
                .y0(chartHeight)
                .y1(function(d){ return scaleY(d.y)})
                .interpolate('basis');
            var axisX = d3.svg.axis()
                .orient('bottom')
                .scale(scaleX)
                .ticks(d3.time.year);

            var svg = d3.select(this).append('svg').datum(data)
                .attr('width', w)
                .attr('height',h);

                svg.append('g') //LINE
                    .attr('class','line')
                    .append('path')
                    .attr('transform','translate('+m.l+','+m.t+')')
                    .attr('d',line);        //what is this 'd' ??
                svg.append('g') //AREA
                    .attr('class','area')
                    .append('path')
                    .attr('transform','translate('+m.l+','+m.t+')')
                    .attr('d',area);        //what is this 'd' ??
                svg.append('g') //AXIS
                    .attr('class','axis')
                    .attr('transform','translate('+m.l+','+(m.t+chartHeight)+')')
                    .call(axisX);

        })
    }


    //getter and setter functions (allows access and modification of internal functions)
    exports.width = function(_x){
        if(!arguments.length) return w; //if there is no argument, return the default
        w = _x;     //if user does write an argument, use it!
        return this;    //returns exports
    }

    exports.height = function(_x) {
        if (!arguments.length) return h;
        h = _x;
        return this;
    }

    exports.timeRange = function(_r){
        if (!arguments.length) return timeRange;
        timeRange = _r;
        return this;
    }

    exports.binSize = function(interval){
        if (!arguments.length) return binSize;
        binSize =interval;
        return this;
    }

    exports.value = function(accessor){
        if (!arguments.length) return valueAccessor ;
         valueAccessor =accessor;
        return this;
    }


    return exports;
}
