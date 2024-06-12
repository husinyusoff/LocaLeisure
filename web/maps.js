const activityData = {
    hiking: {
        locations: [
            { name: "Mount Kinabalu", lat: 6.0753, lng: 116.5580 },
            { name: "Cameron Highlands", lat:  4.4703, lng:  101.3769 },
            { name: "Gunung Mulu", lat: 4.0488, lng: 114.8122 }
        ],
        recommendation: "Recommended trails for hiking."
    },
    beach: {
        locations: [
            { name: "Langkawi Islands", lat: 6.3560, lng:99.7925 },
            { name: "Perhentian", lat: 5.9120, lng: 102.7306 },
            { name: "Tioman", lat: 2.7900, lng: 104.1710 }
        ],
        recommendation: "Recommended beaches for a relaxing day."
    },
    museum: {
        locations: [
            { name: "Islamic Arts Museum Malaysia", lat: 3.1412, lng: 101.6877 },
            { name: "Penang State Museum and Art Gallery", lat: 5.4170, lng: 100.3381 },
            { name: "Sarawak State Museum", lat: 1.5597, lng: 110.3446 }
        ],
        recommendation: "Recommended museums to visit."
    }
};

function displayActivity() {
    const activitySelect = document.getElementById('activitySelect').value;
    const locationList = document.getElementById('locationList');
    const locationMessage = document.getElementById('locationMessage');

    if (activitySelect && activityData[activitySelect]) {
        const { locations, recommendation } = activityData[activitySelect];
        locationMessage.textContent = recommendation;
        locationList.innerHTML = locations.map(location => `<p class="location-item" onclick="searchLocation(${location.lat}, ${location.lng})">${location.name}</p>`).join('');
    } else {
        locationMessage.textContent = '';
        locationList.innerHTML = '';
    }
}

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 4.2105, lng: 101.9758 }, // Center of Malaysia
        zoom: 6
    });

    window.map = map; // Make map globally accessible
}

function searchLocation(lat, lng) {
    if (lat && lng) {
        const location = new google.maps.LatLng(lat, lng);
        window.map.setCenter(location);
        new google.maps.Marker({
            map: window.map,
            position: location,
            title: 'Selected Location'
        });
    } else {
        alert("No location selected");
    }
}

// Initialize the map when the window loads
window.onload = initMap;
