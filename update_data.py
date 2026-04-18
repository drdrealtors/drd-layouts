import pandas as pd
import os
import re
import json
import requests

# Paths
EXCEL_PATH = r'C:\Anti_gravity_project\DRD_WhatsApp_Bot\Plots_Data.xlsx'
IMAGE_ROOT = 'Layout_Images'
OUTPUT_PATH = 'data_v3.js'

# Mapping between Excel Layout Name and Folder Name
FOLDER_MAPPING = {
    'DRD ANISAM GARDENS': 'DRD Anisam',
    'DRD BALADHANDAYUTHABANI GARDEN': 'DRD Baladhandayudhabani',
    'DRD VELAVAN GARDEN': 'DRD Velavan',
    'DRD KANDA ENCLAVE': 'DRD Kandha',
    'DRD KUMARAN GARDEN': 'DRD Kumaran',
    'DRD SHANMUGA GARDEN': 'DRD Shanmuga',
    'DRD SKANDA ENCLAVE': 'DRD Skanda Enclave'
}

def format_price(value):
    if pd.isna(value) or value == 0:
        return ""
    if value >= 10000000:
        return f"{value/10000000:.1f}Cr"
    if value >= 100000:
        return f"{value/100000:.1f}L"
    return f"{value:,.0f}"

def get_coords(url):
    if pd.isna(url) or not isinstance(url, str) or 'http' not in url:
        return None
    try:
        r = requests.get(url, allow_redirects=True, timeout=5)
        # Match @lat,lng or q=lat,lng
        match = re.search(r'(@|q=)([-0-9.]+),([-0-9.]+)', r.url)
        if match:
            return [float(match.group(2)), float(match.group(3))]
    except Exception as e:
        print(f"Error resolving coordinate for {url}: {e}")
    return None

def process_data():
    print("Reading Excel...")
    df = pd.read_excel(EXCEL_PATH)
    
    # Pre-process layouts in Excel
    layout_data = {}
    for name, group in df.groupby('Layout_Name'):
        # Filter status
        available = group[group['Status'] == 'Available']
        
        # Prices
        prices = group['Total_Price'].dropna()
        p_min = format_price(prices.min()) if not prices.empty else "N/A"
        p_max = format_price(prices.max()) if not prices.empty else "N/A"
        price_range = f"{p_min} - {p_max}" if p_min != p_max else p_min
        
        # Coordinates
        gps_url = group['GPS Location'].dropna().iloc[0] if not group['GPS Location'].dropna().empty else None
        coords = get_coords(gps_url) if gps_url else None
        
        layout_data[name] = {
            'plots_count': len(group),
            'available_count': len(available),
            'price_range': price_range,
            'total_area': float(group['Area_SqFt'].sum()),
            'coords': coords
        }

    # Gather all folders in Layout_Images
    all_layouts = []
    if not os.path.exists(IMAGE_ROOT):
        print(f"Error: {IMAGE_ROOT} folder not found.")
        return

    folders = [f for f in os.listdir(IMAGE_ROOT) if os.path.isdir(os.path.join(IMAGE_ROOT, f))]
    
    # Exclude system folders
    excluded = ['01 All Layouts', '02 DRD Taglines', '03 House Models']
    folders = [f for f in folders if f not in excluded]

    processed_folders = set()

    # Step 1: Add folders that match Excel mapping
    for excel_name, folder_name in FOLDER_MAPPING.items():
        if folder_name in folders:
            folder_path = os.path.join(IMAGE_ROOT, folder_name)
            images = [os.path.join(folder_path, f).replace('\\', '/') for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            plans = [os.path.join(folder_path, f).replace('\\', '/') for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
            
            # Special case: Merge DRD Skanda Enclave House into DRD Skanda Enclave (Only if it exists)
            # (Note: I deleted this folder in previous turn based on user request to remove unwanted image)
            
            data = layout_data.get(excel_name, {
                'plots_count': 0,
                'available_count': 0,
                'price_range': "Contact for Price",
                'total_area': 0,
                'coords': None
            })
            
            all_layouts.append({
                'name': excel_name,
                'plots_count': data['plots_count'],
                'available_count': data['available_count'],
                'price_range': data['price_range'],
                'total_area': data['total_area'],
                'coords': data['coords'],
                'images': images,
                'plans': plans
            })
            processed_folders.add(folder_name)

    # Step 2: Add remaining folders (even if not in Excel)
    for folder in folders:
        if folder in processed_folders or 'house' in folder.lower():
            continue
            
        folder_path = os.path.join(IMAGE_ROOT, folder)
        images = [os.path.join(folder_path, f).replace('\\', '/') for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        plans = [os.path.join(folder_path, f).replace('\\', '/') for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
        
        # Try to find matching Excel data by name if not in mapping
        data = layout_data.get(folder.upper(), {
            'plots_count': 0,
            'available_count': 0,
            'price_range': "Contact for Price",
            'total_area': 0,
            'coords': None
        })
        
        all_layouts.append({
            'name': folder,
            'plots_count': data['plots_count'],
            'available_count': data['available_count'],
            'price_range': data['price_range'],
            'total_area': data['total_area'],
            'coords': data['coords'],
            'images': images,
            'plans': plans
        })

    # Write data_v3.js
    with open(OUTPUT_PATH, 'w') as f:
        f.write("const LAYOUT_DATA = ")
        json.dump(all_layouts, f, indent=2)
        f.write(";")
    
    print(f"Successfully generated {OUTPUT_PATH} with {len(all_layouts)} layouts.")

if __name__ == "__main__":
    process_data()
