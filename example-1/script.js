var w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;

var timeSeries = d3.timeSeries()//call Timeseries.js module
    .width(w)
    .height(h)
    .timeRange([new Date(2011,6,16),new Date(2013,11,15)])
    .value(function(d){ return d.startTime; })
    .maxY(80)       //how we set y-scale in each of these charts
    .binSize(d3.time.day);


d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){


    //create nested hierarchy based on stations
    var tripsByStation = d3.nest()
        .key(function(d){return d.startStation})    //(groups trips by starting station)
        .entries(rows);

    //create a <div> for each station
    //bind trips data to each station
    var plots = d3.select('.container').selectAll('.plot')
        .data(tripsByStation);      //one plot for each station

    plots
        .enter()
        .append('div').attr('class','plot');    //creating 150 divs

    plots                   //creates one time series plot for each station
        .each(function(d){
            d3.select(this).datum(d.values)
                .call(timeSeries)   //calling timeSeries
                .append('h2')
                .text(d.key);

        })
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

