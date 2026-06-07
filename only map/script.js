let map;
let roadLayer;
let satelliteLayer;
let markers = [];
const REFERRAL_CODE = "DRD_STANDALONE";

const SIRUVANI_ROAD_PATH = [[10.93875, 76.68902], [10.93883, 76.74503], [10.95018, 76.784], [10.96681, 76.83299], [10.9733, 76.8614], [10.97282, 76.91282], [10.985, 76.94003]];

function initMap() {
    try {
        console.log("Map Start");
        // Standard Leaflet Setup
        map = L.map('map', { 
            zoomControl: false,
            minZoom: 3
        }).setView([10.96, 76.85], 13);

        // Standard OpenStreetMap - Direct URL (no {s})
        roadLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{y}/{x}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        roadLayer.on('tileerror', function(error) {
            console.error('Tile failed to load:', error.url);
        });

        satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg', {
            attribution: 'Tiles &copy; Esri'
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Load Data from data.js
        if (typeof LAYOUT_DATA !== 'undefined' && Array.isArray(LAYOUT_DATA)) {
            loadLayoutList(LAYOUT_DATA);
            plotMarkers(LAYOUT_DATA);
            setupSearch(LAYOUT_DATA);
            setupLayoutDropdown(LAYOUT_DATA);
            drawRoads();
        }

        setupSidebarToggle();
        
        // Force refresh map size after initial load
        setTimeout(() => {
            map.invalidateSize();
            console.log("Map Invalidated");
        }, 1000);

    } catch (error) {
        console.error("Map initialization failed:", error);
    }
}

function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    toggleBtn.onclick = () => {
        sidebar.classList.toggle('collapsed');
        setTimeout(() => map.invalidateSize(), 400);
    };
}

function loadLayoutList(data) {
    const list = document.getElementById('layout-list');
    list.innerHTML = '';
    
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'layout-card';
        const cents = item.total_area ? (item.total_area / 435.6).toFixed(2) : 'N/A';
        
        div.innerHTML = `
            <span class="badge" style="background: ${item.available_count > 0 ? '#188038' : '#ea4335'};">
                ${item.available_count > 0 ? `Available: ${item.available_count}` : 'Sold Out'}
            </span>
            <h3>${item.name}</h3>
            <div class="stats">
                <span>📍 ${cents} Cents</span>
            </div>
        `;
        div.onclick = () => focusLayout(item);
        list.appendChild(div);
    });
}

function plotMarkers(data) {
    // Clear existing markers from map
    markers.forEach(m => map.removeLayer(m.marker));
    markers = [];

    data.forEach(item => {
        if (!item.coords) return;
        
        // Custom DivIcon for premium look
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div class="pin"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker(item.coords, { icon: customIcon }).addTo(map)
            .bindTooltip(item.name, {
                permanent: true,
                direction: 'top',
                className: 'custom-tooltip'
            });
        
        marker.on('click', () => focusLayout(item));
        markers.push({ name: item.name, marker });
    });
}

function focusLayout(item) {
    if (!item.coords) {
        showInfoPanel(item);
        return;
    }
    map.flyTo(item.coords, 16, {
        animate: true,
        duration: 1.5
    });
    showInfoPanel(item);
}

function showInfoPanel(item) {
    const panel = document.getElementById('info-panel');
    const content = panel.querySelector('.info-content');
    
    const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]');
    const totalSqFt = item.total_area ? item.total_area.toLocaleString() + ' Sq.Ft' : 'Call';
    const waLink = `https://wa.me/919655766666?text=${encodeURIComponent(`Interest in ${item.name} (Ref: ${REFERRAL_CODE})`)}`;

    content.innerHTML = `
        <img src="../${images[0] || 'Layout_Images/02 DRD Taglines/Logo.jpeg'}" class="info-header-img">
        <div style="padding:20px;">
            <h2>${item.name}</h2>
            <p style="color:#666; margin:10px 0;">Available Plots: <strong>${item.available_count}</strong></p>
            <p style="color:#1967d2; font-weight:700;">Total Area: ${totalSqFt}</p>
            
            <div class="gallery" style="display:flex; gap:5px; overflow-x:auto; margin-top:15px;">
                ${images.map(img => `<img src="../${img}" style="width:80px; border-radius:4px;">`).join('')}
            </div>

            <a href="${waLink}" target="_blank" style="display:block; background:#188038; color:white; text-align:center; padding:12px; border-radius:25px; text-decoration:none; margin-top:20px; font-weight:700;">
                Enquire for Price
            </a>
        </div>
    `;
    panel.classList.remove('hidden');
}

function drawRoads() {
    L.polyline(SIRUVANI_ROAD_PATH, { color: '#000', weight: 5, opacity: 0.5, dashArray: '10, 10' }).addTo(map);
}

function setupSearch(data) {
    const searchInput = document.getElementById('search-input');
    searchInput.oninput = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = data.filter(d => d.name.toLowerCase().includes(query));
        loadLayoutList(filtered);
        plotMarkers(filtered); // Filter markers on map too
    };
}

function setupLayoutDropdown(data) {
    const dropdown = document.getElementById('layout-dropdown');
    data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.name;
        opt.textContent = item.name;
        dropdown.appendChild(opt);
    });
    dropdown.onchange = (e) => {
        const item = data.find(d => d.name === e.target.value);
        if (item) focusLayout(item);
    };
}

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

document.querySelector('.close-btn').onclick = () => document.getElementById('info-panel').classList.add('hidden');

window.onload = initMap;
