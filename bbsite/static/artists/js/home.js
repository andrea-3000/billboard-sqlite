// Global container for our winner data
window.artists = {
  params: {}
};

// fetchData
function fetchData() {
  $.get("./api/?")
    .done(function(data) {
      window.artists.data = data;
      // Re-render the bar chart
      window.artists.bar.render();
    })
    .fail(function(){
      console.log("Could not load data");
      alert("Could not load data");
  });
}

// init wires up watchers on selections and fetches new data
function init(){

  function updateSelections() {
    var params = window.artists.params || {};
    fetchData();
  }

  // Initialize bar chart
  initBar(window.artists);
  updateSelections();
}

// Call init on DOMReady
$(init);
