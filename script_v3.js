let map;
let roadLayer;
let satelliteLayer;
let markers = [];
let polyline;
let activeLayout = null;
let currentGalleryItems = [];
let currentGalleryIndex = 0;

const LAYOUT_CENTERS = {
    'DRD BALADHANDAYUTHABANI GARDEN': [10.9668608, 76.8337816],
    'DRD SKANDA ENCLAVE': [10.9632537, 76.8194371]
};

const LANDMARKS = [
    { name: 'Isha Yoga Center 🕉️', coords: [10.9427, 76.6826] },
    { name: 'Kovaipudur Road Junction', coords: [10.9161, 76.9248] }
];
const SIRUVANI_ROAD_PATH = [[10.93875, 76.68902], [10.93863, 76.68919], [10.9387, 76.68947], [10.93892, 76.68988], [10.93912, 76.69029], [10.93911, 76.69056], [10.93914, 76.69108], [10.93955, 76.69185], [10.93975, 76.69276], [10.93995, 76.69434], [10.93994, 76.69577], [10.93975, 76.6971], [10.93976, 76.69798], [10.93976, 76.69956], [10.93943, 76.70102], [10.93878, 76.7023], [10.93795, 76.70354], [10.93797, 76.70467], [10.93846, 76.70529], [10.9396, 76.70589], [10.94125, 76.70708], [10.94129, 76.70804], [10.94109, 76.70836], [10.94139, 76.70919], [10.94207, 76.71047], [10.94258, 76.71157], [10.94286, 76.7125], [10.94308, 76.71389], [10.94305, 76.71546], [10.94348, 76.71558], [10.94372, 76.71557], [10.94412, 76.71585], [10.94439, 76.71603], [10.94441, 76.71631], [10.9444, 76.7174], [10.94421, 76.71824], [10.94405, 76.71898], [10.94398, 76.71993], [10.94395, 76.72078], [10.94388, 76.72116], [10.94385, 76.72164], [10.94401, 76.72221], [10.94402, 76.72265], [10.94399, 76.72292], [10.94386, 76.72309], [10.94359, 76.72333], [10.94337, 76.72355], [10.94322, 76.72374], [10.94295, 76.72409], [10.94234, 76.72496], [10.94148, 76.72659], [10.94131, 76.72693], [10.94089, 76.72776], [10.9406, 76.7283], [10.94055, 76.72838], [10.94021, 76.72889], [10.93974, 76.72957], [10.93943, 76.73002], [10.93902, 76.73068], [10.93884, 76.73113], [10.93871, 76.73179], [10.93871, 76.73246], [10.93883, 76.73363], [10.93897, 76.73542], [10.93899, 76.73604], [10.93894, 76.73659], [10.93885, 76.73708], [10.93872, 76.73783], [10.93858, 76.73863], [10.93835, 76.73972], [10.93827, 76.74051], [10.9383, 76.74119], [10.93831, 76.74129], [10.93852, 76.74239], [10.93854, 76.74283], [10.93858, 76.74342], [10.9386, 76.74376], [10.93862, 76.74409], [10.93863, 76.74414], [10.93863, 76.74419], [10.93866, 76.74442], [10.93883, 76.74503], [10.93903, 76.74546], [10.93916, 76.74575], [10.93937, 76.74619], [10.9395, 76.74648], [10.93961, 76.74686], [10.93991, 76.748], [10.94005, 76.74852], [10.94035, 76.74963], [10.94041, 76.74979], [10.94088, 76.75093], [10.94125, 76.75184], [10.94141, 76.75224], [10.94142, 76.75227], [10.94195, 76.75334], [10.94202, 76.75348], [10.9425, 76.75483], [10.94274, 76.75553], [10.9428, 76.7557], [10.94345, 76.75755], [10.94351, 76.7579], [10.9434, 76.76126], [10.94338, 76.76343], [10.94346, 76.76526], [10.94353, 76.7655], [10.94411, 76.76741], [10.9444, 76.76849], [10.94451, 76.76941], [10.94453, 76.76989], [10.94461, 76.77018], [10.94467, 76.77028], [10.94473, 76.77038], [10.94493, 76.77072], [10.94521, 76.771], [10.94551, 76.77127], [10.94563, 76.77142], [10.94571, 76.7717], [10.94581, 76.77222], [10.94604, 76.77352], [10.94625, 76.77428], [10.94683, 76.77549], [10.94755, 76.77756], [10.94773, 76.77805], [10.94783, 76.77833], [10.94838, 76.77978], [10.94841, 76.77985], [10.94852, 76.78015], [10.94869, 76.78061], [10.94898, 76.78136], [10.94904, 76.78153], [10.94918, 76.78189], [10.94926, 76.78212], [10.94929, 76.7822], [10.94961, 76.78312], [10.94968, 76.78332], [10.94973, 76.78339], [10.95018, 76.784], [10.95066, 76.78463], [10.95172, 76.78603], [10.95183, 76.78618], [10.95192, 76.78632], [10.95244, 76.78707], [10.9528, 76.7876], [10.95303, 76.78797], [10.95329, 76.78839], [10.95425, 76.78994], [10.95432, 76.79007], [10.95472, 76.7908], [10.95477, 76.79089], [10.95501, 76.79131], [10.95506, 76.79141], [10.9556, 76.79238], [10.95567, 76.79252], [10.95673, 76.79429], [10.95728, 76.79504], [10.9573, 76.79507], [10.95732, 76.7951], [10.95742, 76.79527], [10.9578, 76.79593], [10.95808, 76.79659], [10.9581, 76.79663], [10.95836, 76.79726], [10.95837, 76.79729], [10.95842, 76.7974], [10.95844, 76.79751], [10.95852, 76.79782], [10.95872, 76.79865], [10.95888, 76.79931], [10.9589, 76.7994], [10.95965, 76.80099], [10.95968, 76.80106], [10.96005, 76.80188], [10.96016, 76.80213], [10.96097, 76.80402], [10.96109, 76.80427], [10.9615, 76.80521], [10.96153, 76.80537], [10.96153, 76.8054], [10.96145, 76.80599], [10.96122, 76.80697], [10.96108, 76.80865], [10.961, 76.80905], [10.96088, 76.8097], [10.96053, 76.8115], [10.96051, 76.81177], [10.96052, 76.81206], [10.96068, 76.81259], [10.96115, 76.81436], [10.9614, 76.81548], [10.96147, 76.81565], [10.96156, 76.81587], [10.9616, 76.81592], [10.9621, 76.81672], [10.96231, 76.81705], [10.96253, 76.81746], [10.9633, 76.81924], [10.96372, 76.82], [10.96476, 76.8217], [10.96507, 76.82221], [10.96521, 76.82244], [10.96535, 76.82284], [10.96537, 76.82329], [10.96547, 76.82471], [10.96551, 76.82568], [10.96555, 76.8258], [10.96559, 76.82596], [10.96563, 76.82612], [10.96588, 76.82647], [10.96643, 76.82708], [10.96664, 76.82741], [10.96679, 76.82801], [10.96687, 76.82987], [10.9669, 76.8306], [10.96691, 76.83086], [10.96681, 76.83206], [10.96676, 76.83258], [10.96679, 76.83282], [10.96681, 76.83299], [10.96712, 76.83516], [10.96722, 76.83585], [10.96769, 76.83687], [10.96796, 76.83727], [10.96817, 76.83767], [10.96829, 76.8384], [10.96839, 76.83948], [10.96827, 76.84002], [10.96827, 76.84059], [10.9683, 76.84092], [10.96839, 76.84196], [10.96836, 76.84207], [10.96825, 76.84262], [10.96804, 76.84305], [10.96789, 76.84336], [10.96774, 76.84403], [10.9676, 76.84462], [10.96757, 76.84494], [10.96757, 76.84501], [10.96757, 76.84504], [10.96755, 76.84631], [10.96755, 76.84645], [10.96754, 76.84683], [10.96754, 76.84701], [10.96754, 76.84725], [10.96755, 76.8479], [10.96755, 76.84799], [10.96758, 76.84806], [10.96794, 76.84898], [10.9684, 76.84963], [10.96843, 76.84968], [10.9687, 76.85005], [10.96891, 76.85035], [10.96911, 76.85064], [10.96924, 76.85082], [10.96948, 76.85113], [10.96992, 76.8517], [10.97059, 76.85256], [10.971, 76.8531], [10.97123, 76.85334], [10.97134, 76.85346], [10.97144, 76.85357], [10.97152, 76.85365], [10.97161, 76.85376], [10.97173, 76.85399], [10.97178, 76.85529], [10.972, 76.85636], [10.97208, 76.85675], [10.97215, 76.85709], [10.97217, 76.85713], [10.97229, 76.8575], [10.97254, 76.8582], [10.97266, 76.85857], [10.97283, 76.85904], [10.97297, 76.85946], [10.97323, 76.86016], [10.97325, 76.86021], [10.97328, 76.86051], [10.97329, 76.86087], [10.9733, 76.8614], [10.97328, 76.86173], [10.97327, 76.86184], [10.97329, 76.86196], [10.97332, 76.86221], [10.97338, 76.86235], [10.97349, 76.86258], [10.9735, 76.86259], [10.97387, 76.86334], [10.97407, 76.86373], [10.97408, 76.86377], [10.97411, 76.86392], [10.97426, 76.86449], [10.9743, 76.86467], [10.97437, 76.86493], [10.97437, 76.86522], [10.97438, 76.86591], [10.97434, 76.86619], [10.97422, 76.86711], [10.97405, 76.86847], [10.97404, 76.86849], [10.97388, 76.8693], [10.97377, 76.8699], [10.97361, 76.87071], [10.97322, 76.87194], [10.97311, 76.87295], [10.9731, 76.87303], [10.97304, 76.87389], [10.973, 76.87523], [10.97285, 76.87651], [10.9728, 76.8769], [10.97272, 76.87751], [10.97251, 76.87877], [10.97244, 76.87925], [10.97212, 76.88169], [10.97211, 76.88177], [10.97192, 76.88281], [10.97179, 76.88338], [10.97162, 76.88383], [10.97141, 76.88422], [10.97134, 76.88435], [10.97119, 76.88464], [10.97107, 76.88504], [10.97105, 76.88536], [10.97109, 76.8863], [10.9711, 76.88653], [10.97112, 76.88698], [10.97114, 76.88742], [10.97113, 76.88755], [10.97112, 76.88794], [10.9711, 76.8883], [10.97109, 76.88846], [10.97107, 76.88869], [10.97106, 76.88883], [10.97103, 76.88918], [10.97104, 76.88967], [10.97104, 76.8901], [10.97105, 76.89039], [10.97105, 76.89062], [10.97106, 76.89121], [10.97107, 76.89171], [10.97107, 76.89179], [10.97107, 76.89188], [10.97107, 76.89212], [10.97106, 76.89295], [10.97105, 76.89311], [10.97103, 76.89332], [10.97102, 76.89342], [10.97097, 76.89395], [10.97096, 76.89405], [10.97095, 76.89416], [10.97087, 76.89457], [10.97084, 76.89472], [10.97077, 76.89503], [10.97064, 76.8957], [10.97054, 76.89619], [10.97053, 76.8962], [10.96982, 76.89704], [10.96965, 76.8973], [10.96962, 76.89735], [10.96935, 76.89779], [10.96921, 76.89801], [10.9687, 76.89925], [10.96862, 76.89944], [10.96852, 76.8997], [10.9682, 76.90047], [10.96818, 76.90052], [10.96811, 76.90073], [10.96806, 76.90089], [10.96783, 76.90156], [10.96774, 76.90184], [10.96772, 76.90201], [10.96764, 76.90264], [10.96764, 76.90302], [10.9677, 76.90339], [10.96791, 76.90426], [10.96804, 76.90465], [10.96809, 76.90479], [10.9682, 76.90502], [10.96842, 76.9055], [10.96861, 76.90598], [10.96892, 76.90697], [10.96904, 76.90719], [10.96918, 76.90744], [10.96943, 76.90793], [10.9696, 76.90834], [10.96987, 76.90897], [10.97077, 76.91102], [10.9708, 76.91109], [10.97084, 76.91118], [10.97095, 76.91153], [10.97121, 76.91223], [10.97137, 76.91238], [10.97141, 76.91242], [10.9715, 76.9125], [10.9718, 76.91268], [10.97198, 76.91273], [10.97207, 76.91276], [10.97241, 76.91279], [10.97282, 76.91282], [10.97305, 76.91284], [10.9733, 76.91284], [10.9734, 76.91284], [10.97361, 76.91284], [10.97405, 76.91283], [10.97423, 76.91282], [10.9745, 76.91288], [10.9746, 76.91299], [10.97471, 76.91322], [10.97521, 76.91441], [10.97522, 76.91443], [10.97524, 76.91447], [10.97525, 76.91449], [10.97558, 76.91519], [10.97569, 76.91538], [10.97574, 76.91546], [10.9758, 76.91556], [10.9759, 76.91572], [10.97607, 76.91596], [10.97617, 76.91617], [10.97631, 76.91646], [10.97643, 76.91674], [10.97644, 76.91676], [10.97659, 76.91713], [10.97668, 76.9173], [10.97691, 76.91773], [10.97709, 76.91794], [10.97718, 76.91805], [10.97729, 76.91812], [10.97736, 76.91817], [10.97758, 76.91834], [10.97808, 76.91865], [10.97861, 76.919], [10.97866, 76.91904], [10.97874, 76.91912], [10.97913, 76.91948], [10.97945, 76.91993], [10.97956, 76.92012], [10.97979, 76.92055], [10.97984, 76.92065], [10.98003, 76.92089], [10.98039, 76.92108], [10.98081, 76.92127], [10.98131, 76.92149], [10.98142, 76.92153], [10.98163, 76.92153], [10.98184, 76.92152], [10.98208, 76.92145], [10.98221, 76.92139], [10.98238, 76.92134], [10.98248, 76.92134], [10.98258, 76.92138], [10.98268, 76.92143], [10.98307, 76.92188], [10.98337, 76.92229], [10.98356, 76.92273], [10.98381, 76.92329], [10.98398, 76.92416], [10.98399, 76.92427], [10.98401, 76.9243], [10.98403, 76.92448], [10.98405, 76.92456], [10.98405, 76.92468], [10.98407, 76.9249], [10.98407, 76.92511], [10.98406, 76.92534], [10.98404, 76.92559], [10.98402, 76.92568], [10.98394, 76.92614], [10.98391, 76.9264], [10.98391, 76.92666], [10.98389, 76.9272], [10.98387, 76.92783], [10.98389, 76.92846], [10.98391, 76.92939], [10.98393, 76.93011], [10.98394, 76.93016], [10.98397, 76.93044], [10.98402, 76.93078], [10.98407, 76.93096], [10.98424, 76.93147], [10.98432, 76.9317], [10.98442, 76.93199], [10.98482, 76.9325], [10.98515, 76.93288], [10.98533, 76.93306], [10.98564, 76.9333], [10.98575, 76.93337], [10.98615, 76.93361], [10.98697, 76.93403], [10.98739, 76.93429], [10.98752, 76.93439], [10.98763, 76.93451], [10.98776, 76.93467], [10.9879, 76.93487], [10.98797, 76.93497], [10.98807, 76.93514], [10.98819, 76.93539], [10.98824, 76.93553], [10.98827, 76.93567], [10.98827, 76.93579], [10.98818, 76.93625], [10.98816, 76.93639], [10.988, 76.93688], [10.98789, 76.93743], [10.98782, 76.93832], [10.98775, 76.93918], [10.98775, 76.93931], [10.98778, 76.93957], [10.98789, 76.9399], [10.98797, 76.94008], [10.98804, 76.94037], [10.98817, 76.94074], [10.98831, 76.94117], [10.98835, 76.9413], [10.98837, 76.94144], [10.98834, 76.94152], [10.98828, 76.94159], [10.98816, 76.94158], [10.98807, 76.94156], [10.98739, 76.94147], [10.98728, 76.94147], [10.987, 76.94146], [10.98672, 76.94146], [10.98636, 76.94146], [10.9859, 76.9415], [10.98573, 76.94151], [10.98559, 76.94156], [10.9853, 76.94173], [10.98525, 76.94161], [10.98513, 76.94135], [10.98504, 76.94097], [10.98481, 76.94011], [10.98484, 76.94004], [10.985, 76.94003]];


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
            (item.price_range && item.price_range.toLowerCase().includes(query))
        );
        loadLayoutList(filtered);
        
        // Filter markers on map
        markers.forEach(m => {
            const match = m.name.toLowerCase().includes(query);
            if (match) {
                m.marker.setOpacity(1);
            } else {
                m.marker.setOpacity(query ? 0.2 : 1);
            }
        });
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
        const radius = e.accuracy / 2;
        L.circle(e.latlng, radius, {
            color: '#4285F4',
            fillColor: '#4285F4',
            fillOpacity: 0.15,
            weight: 1
        }).addTo(map);
        
        L.circleMarker(e.latlng, {
            radius: 8,
            color: '#fff',
            fillColor: '#4285F4',
            fillOpacity: 1,
            weight: 2
        }).addTo(map).bindPopup("You are here").openPopup();
    });

    // Right-click to copy coordinates (Google Maps style)
    map.on('contextmenu', (e) => {
        const { lat, lng } = e.latlng;
        const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        const popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`<div style="padding: 10px; cursor: pointer;" onclick="navigator.clipboard.writeText('${coords}'); this.innerHTML='Copied!'; setTimeout(() => this.closest('.leaflet-popup').remove(), 1000);">
                            <strong>${coords}</strong><br>
                            <span style="font-size: 0.8rem; color: #666;">Click to copy</span>
                         </div>`)
            .openOn(map);
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



function findNearestPointOnRoad(plotCoords) {
    let minDistance = Infinity;
    let nearestPoint = SIRUVANI_ROAD_PATH[0];
    
    // Simple point-to-point check for clarity, could be segment-based for more precision
    SIRUVANI_ROAD_PATH.forEach(roadPoint => {
        const dist = Math.sqrt(Math.pow(plotCoords[0] - roadPoint[0], 2) + Math.pow(plotCoords[1] - roadPoint[1], 2));
        if (dist < minDistance) {
            minDistance = dist;
            nearestPoint = roadPoint;
        }
    });
    return nearestPoint;
}

function drawConnections(data) {
    // 1. Highlight the existing Siruvani Main Road on the map perfectly following its curves
    L.polyline(SIRUVANI_ROAD_PATH, {
        color: '#fff',
        weight: 12,
        opacity: 0.6,
        lineJoin: 'round'
    }).addTo(map);
    
    L.polyline(SIRUVANI_ROAD_PATH, {
        color: '#808080',
        weight: 10,
        opacity: 0.3,
        lineJoin: 'round'
    }).addTo(map).bindTooltip("Siruvani Main Road 🛣️", { sticky: true, className: 'road-tooltip' });

    // 2. Connect each plot to the road
    data.forEach(item => {
        if (!item.coords) return;
        
        const roadPoint = findNearestPointOnRoad(item.coords);
        
        L.polyline([item.coords, roadPoint], {
            color: '#d4af37', // Gold connection line
            weight: 4,
            opacity: 0.9
        }).addTo(map).bindTooltip("Access to Main Road", { sticky: true, className: 'road-tooltip' });
    });
}

function focusLayout(item) {
    if (!item.coords) {
        showInfoPanel(item); // Still show info, just no flyTo
        document.getElementById('sidebar').classList.remove('mobile-open');
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
            <div style="padding: 0 20px 20px 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${item.coords[0]},${item.coords[1]}', '_blank')" style="flex: 1; min-width: 140px; background: #4285F4; color: #fff; border: none; padding: 12px; border-radius: 25px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">🚗</span> Directions
                </button>
                <button id="share-btn-panel" onclick="shareLocation('${item.name}', ${item.coords[0]}, ${item.coords[1]})" style="flex: 1; min-width: 140px; background: #fff; color: #4285F4; border: 1px solid #4285F4; padding: 12px; border-radius: 25px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">🔗</span> Share Plot
                </button>
            </div>
            ${plansHtml}
            ${imagesHtml}
            <div style="padding: 20px; border-top: 1px solid #eee; display: flex; gap: 10px;">
                <a href="https://wa.me/919655766666?text=I'm interested in ${item.name}" target="_blank" style="flex: 1; background: #188038; color: #fff; text-align: center; padding: 12px; border-radius: 25px; text-decoration: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style="width: 20px; filter: brightness(0) invert(1);"> Enquire Now
                </a>
                <button onclick="window.print()" style="padding: 12px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer;" title="Print Details">🖨️</button>
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
        background: white !important;
        color: #333 !important;
        border: none !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
        font-weight: 600 !important;
        font-family: 'Outfit', sans-serif !important;
        padding: 5px 12px !important;
        border-radius: 4px !important;
    }
    .layout-tooltip::before { border-top-color: white !important; }
    
    .landmark-pin {
        background: #9b59b6 !important;
        width: 14px !important;
        height: 14px !important;
        border: 2px solid white !important;
    }
    .landmark-tooltip {
        color: #9b59b6 !important;
        background: white !important;
    }
    .road-tooltip {
        background: rgba(40, 40, 40, 0.9);
        color: #fff;
        border: 2px solid #d4af37;
        border-radius: 20px;
        padding: 4px 15px;
        font-weight: 700;
        letter-spacing: 0.5px;
    }
    
    /* Animation for connection lines */
    .leaflet-interactive {
        stroke-dashoffset: 0;
        animation: dash 20s linear infinite;
    }
    @keyframes dash {
        to {
            stroke-dashoffset: -100;
        }
    }
    
    /* Google Maps Blue pulse for user location */
    .leaflet-control-locate {
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
    }
`;
document.head.appendChild(style);

function shareLocation(name, lat, lng) {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const text = `Check out this plot at ${name}: ${url}`;
    
    if (navigator.share) {
        navigator.share({
            title: name,
            text: text,
            url: url
        }).catch(err => {
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('share-btn-panel');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
        }, 2000);
    });
}

initMap();
