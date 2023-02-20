function openCityFilter() {
  document.getElementById("city_dropdown").classList.toggle("show");

  window.onclick = function (e) {
    if (!e.target.matches(".dropbtn")) {
      var myDropdown = document.getElementById("city_dropdown");
      if (myDropdown.classList.contains("show")) {
        myDropdown.classList.remove("show");
      }
    }
  };
}

function openDietaryFilter() {
  document.getElementById("dietary_dropdown").classList.toggle("show");

  window.onclick = function (e) {
    if (!e.target.matches(".dropbtn")) {
      var myDropdown = document.getElementById("dietary_dropdown");
      if (myDropdown.classList.contains("show")) {
        myDropdown.classList.remove("show");
      }
    }
  };
}

function openPriceRangeFilter() {
  document.getElementById("price_range_dropdown").classList.toggle("show");

  window.onclick = function (e) {
    if (!e.target.matches(".dropbtn")) {
      var myDropdown = document.getElementById("price_range_dropdown");
      if (myDropdown.classList.contains("show")) {
        myDropdown.classList.remove("show");
      }
    }
  };
}

function openRatingsFilter() {
  document.getElementById("ratings_dropdown").classList.toggle("show");

  window.onclick = function (e) {
    if (!e.target.matches(".dropbtn")) {
      var myDropdown = document.getElementById("ratings_dropdown");
      if (myDropdown.classList.contains("show")) {
        myDropdown.classList.remove("show");
      }
    }
  };
}
