const path="samples.json";


// Fetch the JSON data and console.log it
d3.json(path).then((importedData)=>{
    
    var data=importedData;
    console.log(data);
    
    var dataLength=data.samples.length;
    var individualIDs=[];
    

    
    for (var i=0; i<dataLength; i++){
        var pushData=data.samples[i].id;
        individualIDs.push(pushData);
    };
    


    var select = document.getElementById("selDataset");  
    for (i=0; i<individualIDs.length; i++){
        var id = individualIDs[i];
        var el = document.createElement("option");
        el.text = id;
        el.value = i;
        select.add(el);
    }
    
    //Actions when switching Test Subject Id 
    d3.select("select").on("change", function() {
    
        //Remove all data from demographic info
        d3.selectAll("li").remove();
        

       //Select an index of the Test Subject Id
        var value=d3.select("select").node().value;
        //console.log(value);
        
        //Add demographic info
        var ethnicity=data.metadata[value].ethnicity;
        var gender=data.metadata[value].gender;
        var age=data.metadata[value].age;
        var location=data.metadata[value].location;
        var bbtype=data.metadata[value].bbtype;
        var wfreq=data.metadata[value].wfreq;

        demographic=d3.select("#sample-metadata");
        demographic=demographic.append("li").text(`Ethnicity: ${ethnicity}`);
        demographic=demographic.append("li").text(`Gender: ${gender}`);
        demographic=demographic.append("li").text(`Age: ${age}`);
        demographic=demographic.append("li").text(`Location: ${location}`);
        demographic=demographic.append("li").text(`Bbtype: ${bbtype}`);
        demographic=demographic.append("li").text(`Wfreq: ${wfreq}`);
    
        //OTU values
        var individualOTUValues=data.samples[value].sample_values;

        //OTU labels
        var individualOTULabels=data.samples[value].otu_ids;

        //OTU hovertext
        var individualOTUText=data.samples[value].otu_labels;

        //slice top 10 OTUs found in that individual
        var individualOTUValues_bar=individualOTUValues.slice(0, 10);
        var individualOTUText_bar=individualOTUText.slice(0,10);
        var individualOTULabels_bar=individualOTULabels.slice(0, 10);
        
        individualOTULabels_bar=individualOTULabels_bar.map(label=>`OTU ${label}`);
    
        // Reverse the array
        individualOTULabels_bar=individualOTULabels_bar.reverse();
        individualOTUValues_bar=individualOTUValues_bar.reverse();
        individualOTUText_bar=individualOTUText_bar.reverse();

    
        // Trace for Individual
        var trace = {
            x: individualOTUValues_bar,
            y: individualOTULabels_bar,
            text: individualOTUText_bar,
            type: "bar",
            orientation: "h"
        };

        var traceBubble = {
            x:individualOTULabels,
            y:individualOTUValues,
            text:individualOTUText,
            mode: 'markers',
            marker:{
                size:individualOTUValues,
                color:individualOTULabels,
                
            },
           type: "bubble"
        };
        var layout = {
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "OTU Sample Values"},
        }

        
        
        var traceGauge={
                value: wfreq,
                color:"red",
                title: { text: "Weekly washing frequency of the individual" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [null, 9] }},
                        
                };

        Plotly.newPlot("bubble", [traceBubble], layout);
        Plotly.newPlot("bar", [trace]);
        Plotly.newPlot("gauge", [traceGauge]);

        
        
        
    });

});

// Promise Pending
const dataPromise = d3.json(path);
//console.log("Data Promise: ", dataPromise);