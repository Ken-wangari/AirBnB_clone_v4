$(document).ready(function () {
    const HOST = "http://127.0.0.1:5001";
    const amenities = {};
    const cities = {};
    const states = {};

    $('ul li input[type="checkbox"]').change(function (e) {
        const el = e.target;
        let target;
        switch (el.id) {
            case "state_filter":
                target = states;
                break;
            case "city_filter":
                target = cities;
                break;
            case "amenity_filter":
                target = amenities;
                break;
        }
        if (el.checked) {
            target[el.dataset.name] = el.dataset.id;
        } else {
            delete target[el.dataset.name];
        }
        if (el.id === "amenity_filter") {
            $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
        } else {
            $(".locations h4").text(
                Object.keys(Object.assign({}, states, cities)).sort().join(", ")
            );
        }
    });

    // get status of API
    $.getJSON(`${HOST}/api/v1/status/`, function (data) {
        if (data.status === "OK") {
            $("div#api_status").addClass("available");
        } else {
            $("div#api_status").removeClass("available");
        }
    });

    // fetch data about places
    $.post({
        url: `${HOST}/api/v1/places_search`,
        data: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            data.forEach(function (place) {
                $("section.places").append(
                    `<article>
                    <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                    </div>
                    <div class="information">
                    <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}</div>
                    <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? "s" : ""}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
                    </div> 
                    <div class="description">
                    ${place.description}
                    </div>
                    </article>`
                );
            });
        },
        dataType: "json",
    });

    // search places
    $(".filters button").click(searchPlace);
    searchPlace();

    // fetch places
    function searchPlace() {
        $.post({
            url: `${HOST}/api/v1/places_search`,
            data: JSON.stringify({
                amenities: Object.values(amenities),
                states: Object.values(states),
                cities: Object.values(cities),
            }),
            headers: {
                "Content-Type": "application/json",
            },
            success: function (data) {
                $("section.places").empty();
                data.forEach(function (place) {
                    $("section.places").append(
                        `<article>
                        <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                        <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}</div>
                        <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? "s" : ""}</div>
                        <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
                        </div> 
                        <div class="description">
                        ${place.description}
                        </div>
                        <div class="reviews" data-place="${place.id}">
                        <h2></h2>
                        <ul></ul>
                        </div>
                        </article>`
                    );
                    fetchReviews(place.id);
                });
            },
            dataType: "json",
        });
    }

    function fetchReviews(placeId) {
        $.getJSON(`${HOST}/api/v1/places/${placeId}/reviews`, function (data) {
            $(`.reviews[data-place="${placeId}"] h2`)
                .text(`${data.length} Reviews <span id="toggle_review">show</span>`);
            $(`.reviews[data-place="${placeId}"] h2 #toggle_review`).click({ placeId: placeId }, function (e) {
                const reviews = $(`.reviews[data-place="${e.data.placeId}"] ul`);
                if (reviews.css("display") === "none") {
                    reviews.css("display", "block");
                    data.forEach(function (review) {
                        $.getJSON(`${HOST}/api/v1/users/${review.user_id}`, function (user) {
                            reviews.append(
                                `<li>
                                <h3>From ${user.first_name} ${user.last_name} the ${review.created_at}</h3>
                                <p>${review.text}</p>
                                </li>`
                            );
                        });
                    });
                } else {
                    reviews.css("display", "none");
                }
            });
        });
    }
});

