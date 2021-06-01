var mymap = L.map('mapid').setView([60.3,24.81], 12);
var basemaps = [
    L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",{"attribution": "\u0026copy; \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eOpenStreetMap\u003c/a\u003e contributors \u0026copy; \u003ca href=\"http://cartodb.com/attributions\"\u003eCartoDB\u003c/a\u003e, CartoDB \u003ca href =\"http://cartodb.com/attributions\"\u003eattributions\u003c/a\u003e", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false,"label":"Light Mode"}),
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{ "attribution": "Data by \u0026copy; \u003ca href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false,"label": 'OSM' }),
    L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",{"attribution": "\u0026copy; \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eOpenStreetMap\u003c/a\u003e contributors \u0026copy; \u003ca href=\"http://cartodb.com/attributions\"\u003eCartoDB\u003c/a\u003e, CartoDB \u003ca href =\"http://cartodb.com/attributions\"\u003eattributions\u003c/a\u003e", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false,"label":"Dark Mode"})
]
mymap.addControl(L.control.basemaps({
    basemaps: basemaps,
    position: 'bottomleft'
}));

var mood_values=[]
function get_mood_values(mood_name){
    mood_values=[]
    json_data.features.forEach(element => {
        mood_values.push(element.properties[mood_name])
    });
    return mood_values
}

function classification(mood_values,class_num){
    class_width = Math.ceil((Math.max.apply(Math,mood_values)-Math.min.apply(Math,mood_values))/class_num)
    var classes = [Math.min.apply(Math,mood_values)]
    for(i=0;i<class_num;i++){
        classes.push(classes[classes.length-1]+class_width)
    }
    return classes

}
var interval = classification(get_mood_values('car_m_t'),7)

function getColor(d) {
    return d > interval[6] ? '#800026' :
            d > interval[5] ? '#BD0026' :
            d > interval[4] ? '#E31A1C' :
            d > interval[3] ? '#FC4E2A' :
            d > interval[2] ? '#FD8D3C' :
            d > interval[1] ? '#FEB24C' :
            d > interval[0] ? '#FED976' :
                        '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties['car_m_t']),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    document.getElementById('time').innerHTML = layer.feature.properties['car_m_t'] +' Minute'
    document.getElementById('distance').innerHTML = layer.feature.properties['car_m_d'] +' Meter'
}

var geojson;
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
    
}
L.marker([60.311723398304366,24.816556631694471]).addTo(mymap);
geojson = L.geoJson(json_data, { style: style, onEachFeature: onEachFeature }).addTo(mymap);


function change_mode(){
    let x = document.getElementById("box").selectedIndex;
    let mood_name = document.getElementsByTagName("option")[x].value;
    interval = classification(get_mood_values(mood_name),7)
    function style(feature) {
        return {
            fillColor: getColor(feature.properties[mood_name]),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.6
        };
    }
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        document.getElementById('time').innerHTML = layer.feature.properties[mood_name] +' Minute'
        switch(mood_name){
            case 'walk_t':
                document.getElementById('distance').innerHTML = layer.feature.properties['walk_d'] +' Meter'
                break;
            case 'pt_r_tt':
                document.getElementById('distance').innerHTML = layer.feature.properties['pt_r_tt'] +' Meter'
                break;
            case 'pt_m_tt':
                document.getElementById('distance').innerHTML = layer.feature.properties['pt_r_d'] +' Meter'
                break;
            case 'car_r_t':
                document.getElementById('distance').innerHTML = layer.feature.properties['car_r_t'] +' Meter'
                break;
            case 'car_m_t':
                document.getElementById('distance').innerHTML = layer.feature.properties['car_m_t'] +' Meter'
                break;
        }
    
    }
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        
    }
    mymap.removeLayer(geojson)
    geojson = L.geoJson(json_data, { style: style, onEachFeature: onEachFeature }).addTo(mymap);
    document.getElementById('first').innerHTML=interval[0]+1+" - "+interval[1]
    document.getElementById('second').innerHTML=interval[1]+1+" - "+interval[2]
    document.getElementById('third').innerHTML=interval[2]+1+" - "+interval[3]
    document.getElementById('fourth').innerHTML=interval[3]+1+" - "+interval[4]
    document.getElementById('fifth').innerHTML=interval[4]+1+" - "+interval[5]
    document.getElementById('sixth').innerHTML=interval[5]+1+" - "+interval[6]
    document.getElementById('seventh').innerHTML=interval[6]+1+" - "+interval[7]
    switch(mood_name){
        case 'walk_t':
            document.getElementById('mode').innerHTML = "Walking"
            break
        case 'pt_r_tt':
            document.getElementById('mode').innerHTML = "Public transportation in rush hour traffic"
            break
        case 'pt_m_tt':
            document.getElementById('mode').innerHTML = "Public transportation in midday traffic"
            break
        case 'car_r_t':
            document.getElementById('mode').innerHTML = "Private car in rush hour traffic"
            break
        case 'car_m_t':
            document.getElementById('mode').innerHTML = "Private car in midday traffic"
            break
    }
}

// Loader
$(document).ready(function () {
    $(".Legend").css("display","block");
    $(".heading").css("display","block");
    $(".choose_mode").css("display","block");
    $("#sign").css("display","block");
    $('#loader')
        .hide() 
        .ajaxStart(function () {
            $(this).show();
            
        })
        .ajaxStop(function () {
            $(this).hide();
            $('.Legend').show;
        });
    $('body').css("display","block")

});
