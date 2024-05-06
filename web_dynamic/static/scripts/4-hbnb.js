const HOST = "0.0.0.0";

$(document).ready(function () {
  const amen = {};
  $("#check_amen").change(function () {
    if ($(this).is(":checked"))
      amen[$(this).data("name")] = $(this).data("id");
    else delete amen[$(this).data("name")];
    const objNames = Object.keys(amen);
    $(".amenities h4").text(objNames.sort().join(", "));
  });

  apiStatus();
  searchPlacesFetchAmenities();
});

function apiStatus() {
  const apiUrl = "http://0.0.0.0:5001/api/v1/status/";
  $.get(apiUrl, function (data, status) {
    if (data.status === "OK" && status === "success") {
      $("#api_status").addClass("available");
    } else {
      $("#api_status").removeClass("available");
    }
  });
}

function searchPlacesFetchAmenities() {
  const PLACES_URL = `http://${HOST}:5001/api/v1/places_search/`;
  $.ajax({
    url: PLACES_URL,
    type: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ amenities: Object.values(amen) }),
    success: function (response) {
      $("section.places").empty();
      for (const r of response) {
        const article = [
          "<article>",
          '<div class="title_box">',
          `<h2>${r.name}</h2>`,
          `<div class="price_by_night">$${r.price_by_night}</div>`,
          "</div>",
          '<div class="information">',
          `<div class="max_guest">${r.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${r.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${r.number_bathrooms} Bathroom(s)</div>`,
          "</div>",
          '<div class="description">',
          `${r.description}`,
          "</div>",
          "</article>",
        ];
        $("section.places").append(article.join(""));
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

