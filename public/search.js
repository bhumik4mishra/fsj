const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (!query) {
    alert("Please enter a search term!");
    return;
  }

  // Fetch results from backend servlet
  fetch(`http://localhost:8080/kisaan-search/search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data.results && data.results.length > 0) {
        let resultHTML = "<h3>Search Results:</h3><ul>";
        data.results.forEach(item => {
          resultHTML += `<li><strong>${item.name}</strong> (${item.category}) - ₹${item.price} <br> ${item.description}</li>`;
        });
        resultHTML += "</ul>";
        document.body.innerHTML += resultHTML; // Display results
      } else {
        alert("No products found!");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while searching.");
    });
});

// Allow pressing Enter key to search
searchInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
