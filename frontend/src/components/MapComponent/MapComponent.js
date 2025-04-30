

document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([40.7128, -74.0060], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const searchInput = document.querySelector('.search-input');

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchInput.parentNode.appendChild(suggestionsContainer);

    async function searchLocation(query) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&featuretype=city&limit=1`);
        const data = await response.json();
        return data;
    }
    let timeout;
    const favorite = document.querySelector(".fav");
    favorite.addEventListener('click', function(){
        if(document.querySelector('.info-card:first-child p').textContent !== "No area selected"){
            //let newFave = document.querySelector('.info-card:first-child p').textContent.slice(47, 111).split(", ");
            let newFave = document.querySelector('.info-card:first-child p').textContent.slice(47, 
                document.querySelector('.info-card:first-child p').textContent.indexOf("\n", 47));

            if(localStorage.getItem("total")){
                let total = parseInt(localStorage.getItem("total"))
                localStorage.setItem("total", ++total)
            }else{
                localStorage.setItem("total", 1)
            }
            localStorage.setItem(JSON.parse(localStorage.getItem("total")), newFave);
        }
    })
    searchInput.addEventListener('input', function() {
        
        if (timeout) clearTimeout(timeout);

        const query = this.value;
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        timeout = setTimeout(async () => {
            try {   
                const suggestions = await searchLocation(query);
                suggestionsContainer.innerHTML = ''
                
                if (suggestions.length > 0) {
                    suggestionsContainer.style.display = 'block';

                    suggestions.forEach(result => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.textContent = result.display_name;
                        div.addEventListener('click', async () => {
                            searchInput.value = result.display_name;
                            suggestionsContainer.style.display = 'none';

                            const latlng = [parseFloat(result.lat), parseFloat(result.lon)];
                            window.searchMarker = L.marker(latlng).addTo(map);
                            
                            try {
                                const response = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${result.osm_type[0].toUpperCase()}${result.osm_id}&format=geojson&polygon_geojson=1&admin_level=8`);
                                const geojsonData = await response.json();
                                
                                const selectedAreaCard = document.querySelector('.info-card:first-child p');
                                selectedAreaCard.innerHTML = `
                                    <strong>Location:</strong> ${result.display_name}<br>
                                `;

                                if (window.geojsonLayer) {
                                    map.removeLayer(window.geojsonLayer);
                                }
                                window.geojsonLayer = L.geoJSON(geojsonData, {
                                    style: function(feature) {
                                        return {
                                            color: '#3388ff',
                                            weight: 2,
                                            opacity: 1,
                                            fillOpacity: 0.2,
                                            fillColor: '#3388ff'
                                        };
                                    },
                                    onEachFeature: function(feature, layer) {
                                        if (feature.properties && feature.properties.name) {
                                            layer.bindPopup(feature.properties.name);
                                        }
                                    }
                                }).addTo(map);

                                map.fitBounds(window.geojsonLayer.getBounds());
                            } catch (error) {
                                console.error('Error fetching GeoJSON:', error);
                            }
                        });

                        suggestionsContainer.appendChild(div);
                    });
                } else {
                    suggestionsContainer.innerHTML = '<div class="no-results">No results found</div>';
                }
            } catch (error) {
                console.error('Error searching location:', error);
            }
        }, 300);
    });
}); 
