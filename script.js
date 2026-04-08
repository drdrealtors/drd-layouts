let map;
let roadLayer;
let satelliteLayer;
let markers = [];
let polyline;
let activeLayout = null;
let currentGalleryItems = [];
let currentGalleryIndex = 0;

const LAYOUT_CENTERS = {
    'DRD BALADHANDAYUTHABANI GARDEN': [10.95, 76.85],
    'DRD SKANDA ENCLAVE': [10.942, 76.808]
};

const LANDMARKS = [
    { name: 'Isha Yoga Center 🕉️', coords: [10.9427, 76.6826] },
    { name: 'Kovaipudur Road Junction', coords: [10.9161, 76.9248] }
];

const SIRUVANI_ROAD_PATH = [
    [10.9161, 76.9248], // Entry
    [10.9329, 76.8778],
    [10.9442, 76.8322],
    [10.9567, 76.7758],
    [10.9427, 76.6826]  // Toward Isha
];

async function initMap() {
    // Center of all layouts approx
    const defaultCenter = [10.96, 76.85];
    
    map = L.map('map', {
        zoomControl: false
    }).setView(defaultCenter, 13);

    roadLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ',
        className: 'map-tiles-road'
    });

    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    roadLayer.addTo(map);

    // Zoom control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    try {
        const data = LAYOUT_DATA;
        
        // Fill missing coords if needed
        data.forEach(item => {
            if (!item.coords && LAYOUT_CENTERS[item.name]) {
                item.coords = LAYOUT_CENTERS[item.name];
            }
        });

        loadLayoutList(data);
        plotMarkers(data);
        plotLandmarks();
        drawSiruvaniRoad();
        drawConnections(data);

        // Auto-center map to fit all points
        const validCoords = data.filter(d => d.coords).map(d => d.coords);
        if (validCoords.length > 0) {
            map.fitBounds(L.latLngBounds([...validCoords, ...LANDMARKS.map(l => l.coords)]), { padding: [100, 100] });
        }

        setupSidebarToggle();
        setupSearch();
        setupMapControls();

    } catch (e) {
        console.error("Error loading layout data", e);
    }
}

function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    
    toggleBtn.onclick = () => {
        sidebar.classList.toggle('collapsed');
    };
}

function setupSearch() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');

    const doSearch = () => {
        const query = input.value.toLowerCase();
        const filtered = LAYOUT_DATA.filter(item => 
            item.name.toLowerCase().includes(query) || 
            (item.location && item.location.toLowerCase().includes(query))
        );
        loadLayoutList(filtered);
    };

    input.oninput = doSearch;
    btn.onclick = doSearch;
}

function setupMapControls() {
    document.getElementById('btn-zoom-in').onclick = () => map.zoomIn();
    document.getElementById('btn-zoom-out').onclick = () => map.zoomOut();
    document.getElementById('btn-locate').onclick = () => {
        map.locate({setView: true, maxZoom: 16});
    };

    map.on('locationfound', (e) => {
        L.circle(e.latlng, e.accuracy).addTo(map);
        L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
    });
}

function loadLayoutList(data) {
    const list = document.getElementById('layout-list');
    list.innerHTML = '';
    
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'layout-card';
        div.innerHTML = `
            <span class="badge">Available: ${item.available_count}</span>
            <h3>${item.name}</h3>
            <div class="stats">
                <span><i class="icon-area"></i> ${item.total_area.toLocaleString()} sqft</span>
                <span><i class="icon-price"></i> ${item.price_range}</span>
            </div>
        `;
        div.onclick = () => focusLayout(item);
        list.appendChild(div);
    });
}

function plotMarkers(data) {
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <svg width="27" height="43" viewBox="0 0 27 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 23.625 13.5 43 13.5 43C13.5 43 27 23.625 27 13.5C27 6.04416 20.9558 0 13.5 0Z" fill="#EA4335"/>
                <circle cx="13.5" cy="13.5" r="5.5" fill="white"/>
            </svg>
        `,
        iconSize: [27, 43],
        iconAnchor: [13.5, 43]
    });

    data.forEach(item => {
        if (!item.coords) return;
        
        const marker = L.marker(item.coords, { icon: customIcon }).addTo(map);
        marker.bindTooltip(item.name, { 
            permanent: true, 
            direction: 'bottom', 
            offset: [0, 5],
            className: 'marker-tooltip layout-tooltip' 
        });
        
        marker.on('click', () => focusLayout(item));
        markers.push({ name: item.name, marker });
    });
}

function plotLandmarks() {
    const landmarkIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="pin landmark-pin"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 20]
    });

    LANDMARKS.forEach(l => {
        L.marker(l.coords, { icon: landmarkIcon }).addTo(map)
            .bindTooltip(l.name, { 
                permanent: true, 
                direction: 'top', 
                className: 'marker-tooltip landmark-tooltip' 
            });
    });
}

function drawSiruvaniRoad() {
    L.polyline(SIRUVANI_ROAD_PATH, {
        color: '#3498db',
        weight: 6,
        opacity: 0.4,
        lineJoin: 'round'
    }).addTo(map).bindTooltip("Siruvani Main Road 🛣️", { sticky: true, className: 'road-tooltip' });
}

function drawConnections(data) {
    const coords = data.filter(d => d.coords).map(d => d.coords);
    if (coords.length < 2) return;

    // Draw a dashed polyline connecting them
    polyline = L.polyline(coords, {
        color: '#d4af37',
        weight: 3,
        dashArray: '10, 10',
        opacity: 0.6
    }).addTo(map);
}

function focusLayout(item) {
    if (!item.coords) {
        alert("GPS Coordinates for " + item.name + " are not available yet.");
        return;
    }

    // Close mobile menu if open
    document.getElementById('sidebar').classList.remove('mobile-open');

    map.flyTo(item.coords, 16, {
        duration: 1.5
    });

    showInfoPanel(item);
}

function showInfoPanel(item) {
    const panel = document.getElementById('info-panel');
    const content = panel.querySelector('.info-content');
    
    let imagesHtml = '';
    if (item.images && item.images.length > 0) {
        imagesHtml = `
            <div class="inner-padding" style="padding: 20px;">
                <h4 style="margin-bottom: 12px; font-size: 1rem; color: #555;">Visual Layout & Photos</h4>
                <div class="gallery">
                    ${item.images.map((img, idx) => `<img src="${img}" alt="Layout Image" onclick="openModal(${idx}, '${item.name}', ${JSON.stringify(item.images).replace(/"/g, '&quot;')})">`).join('')}
                </div>
            </div>
        `;
    }

    let plansHtml = '';
    if (item.plans && item.plans.length > 0) {
        plansHtml = `
            <div class="inner-padding" style="padding: 0 20px 20px 20px;">
                <h4 style="margin-bottom: 12px; font-size: 1rem; color: #555;">Layout Plans (PDF)</h4>
                <div class="plans-list" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${item.plans.map(plan => {
                        const filename = plan.split('/').pop();
                        return `<a href="${plan}" target="_blank" class="plan-btn" style="background: #f8f9fa; color: #4285F4; padding: 10px 15px; border-radius: 8px; border: 1px solid #dee2e6; text-decoration: none; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">📄 ${filename}</a>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    const headerImg = item.images && item.images.length > 0 ? item.images[0] : 'Layout_Images/02 DRD Taglines/Logo.jpeg';

    content.innerHTML = `
        <img src="${headerImg}" class="info-header-img" alt="${item.name}">
        <div class="info-header" style="padding: 20px; border-bottom: 1px solid #eee; margin-bottom: 0;">
            <div class="info-title">
                <h2 style="color: #202124; font-size: 1.5rem; margin-bottom: 4px;">${item.name}</h2>
                <div style="display: flex; align-items: center; gap: 10px; color: #70757a; font-size: 0.9rem;">
                    <span style="color: #188038; font-weight: 600;">Available Now</span>
                    <span>•</span>
                    <span>${item.plots_count} Plots Total</span>
                </div>
            </div>
            <div class="price-tag" style="background: #e8f0fe; color: #1967d2; border: none; font-size: 0.9rem;">${item.price_range}</div>
        </div>
        <div class="info-body">
            <div style="padding: 20px; color: #3c4043; line-height: 1.6; font-size: 0.95rem;">
                <p>Experience the premium living at ${item.name}. Total development area of ${item.total_area.toLocaleString()} sq.ft. feature ${item.plots_count} individual residential plots.</p>
            </div>
            ${plansHtml}
            ${imagesHtml}
            <div style="padding: 20px; border-top: 1px solid #eee; display: flex; gap: 10px;">
                <a href="https://wa.me/919655766666?text=I'm interested in ${item.name}" target="_blank" style="flex: 1; background: #188038; color: #fff; text-align: center; padding: 12px; border-radius: 25px; text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style="width: 20px; filter: brightness(0) invert(1);"> Enquire Now
                </a>
                <button onclick="window.print()" style="padding: 12px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer;">🖨️</button>
            </div>
        </div>
    `;

    panel.classList.remove('hidden');
    // Ensure search box and controls shift if sidebar is open (handled by CSS)
}

// Mobile Toggle
document.getElementById('btn-list-mobile').onclick = () => {
    document.getElementById('sidebar').classList.toggle('mobile-open');
};

// Map Controls
document.getElementById('btn-road').onclick = (e) => {
    map.removeLayer(satelliteLayer);
    roadLayer.addTo(map);
    e.target.classList.add('active');
    document.getElementById('btn-satellite').classList.remove('active');
};

document.getElementById('btn-satellite').onclick = (e) => {
    map.removeLayer(roadLayer);
    satelliteLayer.addTo(map);
    e.target.classList.add('active');
    document.getElementById('btn-road').classList.remove('active');
};

document.querySelector('.close-btn').onclick = () => {
    document.getElementById('info-panel').classList.add('hidden');
};

// Modal Functions
function openModal(index, name, items) {
    currentGalleryIndex = index;
    currentGalleryItems = items;
    
    updateModalContent(name);
    document.getElementById('image-modal').style.display = "block";
}

function updateModalContent(name) {
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    
    modalImg.src = currentGalleryItems[currentGalleryIndex];
    captionText.innerHTML = `${name} (${currentGalleryIndex + 1} / ${currentGalleryItems.length})`;
}

function nextModalImage() {
    if (currentGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryItems.length;
    updateModalContent(activeLayout ? activeLayout.name : "DRD Realtors");
}

function prevModalImage() {
    if (currentGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    updateModalContent(activeLayout ? activeLayout.name : "DRD Realtors");
}

document.querySelector('.modal-next').onclick = (e) => {
    e.stopPropagation();
    nextModalImage();
};

document.querySelector('.modal-prev').onclick = (e) => {
    e.stopPropagation();
    prevModalImage();
};

document.getElementById('image-modal').onclick = (e) => {
    if (e.target.id === 'image-modal') {
        document.getElementById('image-modal').style.display = "none";
    }
};

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('image-modal').style.display = "none";
};

// Keypress navigation
document.addEventListener('keydown', (e) => {
    if (document.getElementById('image-modal').style.display === "block") {
        if (e.key === "ArrowRight") nextModalImage();
        if (e.key === "ArrowLeft") prevModalImage();
        if (e.key === "Escape") document.getElementById('image-modal').style.display = "none";
    }
});

// Extra Styles for Marker
const style = document.createElement('style');
style.innerHTML = `
    .custom-marker .pin {
        width: 16px;
        height: 16px;
        background: #d4af37;
        border: 4px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.4);
    }
    .marker-tooltip {
        background: #1e1e1e;
        color: #d4af37;
        border: 1px solid #d4af37;
        font-weight: 600;
        font-family: 'Outfit', sans-serif;
    }
    .landmark-pin {
        background: #9b59b6 !important;
        width: 12px !important;
        height: 12px !important;
    }
    .landmark-tooltip {
        color: #fff !important;
        border-color: #9b59b6 !important;
    }
    .road-tooltip {
        background: #34495e;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
    }
`;
document.head.appendChild(style);

initMap();
