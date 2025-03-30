// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const sampleMetadata = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}:${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const selectedSample = samples.filter(s => s.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = selectedSample.otu_ids;
    const otu_labels = selectedSample.otu_labels;
    const sample_values = selectedSample.sample_values;

    // Build a Bubble Chart
    let bubbleTitle = `Bacteria Cultures per Sample`;
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    }];
    
    let bubbleLayout = {
      title: bubbleTitle,
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTitle = `Top 10 Bacteria Cultures Found`;
    
    
    let top10Values = sample_values.slice(0,10).reverse();
    let top10OtuIds = otu_ids.slice(0,10).reverse();
    let top10Labels = otu_labels.slice(0,10).reverse(); 

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let top10OtuIdsFormatted = top10OtuIds.map(id => `OTU ${id}`);
    
    let barData = [{
      type: 'bar',
      x: top10Values,
      y: top10OtuIdsFormatted,
      text: top10Labels,
      orientation: 'h'
    }];
    let barLayout = {
      title: barTitle,
      xaxis: { title: "Number of Bacteria"},
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
