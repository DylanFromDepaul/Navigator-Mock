// Mock Orders data for Order Search
export const mockOrders = [
  {
    id: 5824,
    name: 'Google Presentation Setup',
    client_name: 'Google',
    event_date: '2025-04-14',
    location: 'Meeting Room 1',
    status: 'confirmed',
    sales_manager: 'David Calvillo',
    primary_contact: 'Avery Andrews',
    total: 7200
  },
  {
    id: 6102,
    name: 'Encore Meeting Setup',
    client_name: 'Encore',
    event_date: '2025-04-20',
    location: 'Boardroom 3',
    status: 'confirmed',
    sales_manager: 'Eder Castillo',
    primary_contact: 'Mark Johnson',
    total: 8400
  },
  {
    id: 6117,
    name: 'WWDC 2025 Setup',
    client_name: 'Apple',
    event_date: '2025-04-25',
    location: 'Grand Ballroom 2',
    status: 'confirmed',
    sales_manager: 'Dylan Neal',
    primary_contact: 'Tim Hanson',
    total: 15000
  },
  {
    id: 6118,
    name: 'Pharma Conference Operation',
    client_name: 'Pfizer',
    event_date: '2025-05-01',
    location: 'Meeting Room 3',
    status: 'confirmed',
    sales_manager: 'Sarah Brown',
    primary_contact: 'Emily Rodriguez',
    total: 2400
  },
  {
    id: 6115,
    name: 'Microsoft Ignite Teardown',
    client_name: 'Microsoft',
    event_date: '2025-05-07',
    location: 'Grand Ballroom 1',
    status: 'confirmed',
    sales_manager: 'Darren Lins',
    primary_contact: 'Satya Nadella',
    total: 11400
  },
  {
    id: 6101,
    name: 'Company Retreat Strike',
    client_name: 'AbbVie',
    event_date: '2025-05-08',
    location: 'Meeting Room 2',
    status: 'confirmed',
    sales_manager: 'David Calvillo',
    primary_contact: 'Jessica Miller',
    total: 0
  }
];

// Mock Jobs data for Job Search
export const mockJobs = [
  {
    job_id: 27205,
    order_id: 5824,
    name: 'Meeting Room Setup',
    room: 'Meeting Room 1',
    start_time: '2025-04-14T08:00:00',
    end_time: '2025-04-14T12:00:00',
    account_name: 'Google',
    sales_manager: 'David Calvillo',
    job_total: 3500
  },
  {
    job_id: 26940,
    order_id: 5824,
    name: 'AV Equipment Teardown',
    room: 'Meeting Room 1',
    start_time: '2025-04-14T17:00:00',
    end_time: '2025-04-14T19:00:00',
    account_name: 'Google',
    sales_manager: 'David Calvillo',
    job_total: 1200
  },
  {
    job_id: 27323,
    order_id: 6102,
    name: 'Board Meeting',
    room: 'Boardroom 3',
    start_time: '2025-04-20T09:00:00',
    end_time: '2025-04-20T16:00:00',
    account_name: 'Encore',
    sales_manager: 'Eder Castillo',
    job_total: 8400
  },
  {
    job_id: 28438,
    order_id: 6117,
    name: 'Developer Conference',
    room: 'Grand Ballroom 2',
    start_time: '2025-04-25T07:00:00',
    end_time: '2025-04-28T19:00:00',
    account_name: 'Apple',
    sales_manager: 'Dylan Neal',
    job_total: 15000
  },
  {
    job_id: 28495,
    order_id: 6118,
    name: 'Pharmaceutical Conference',
    room: 'Meeting Room 3',
    start_time: '2025-05-01T08:00:00',
    end_time: '2025-05-01T17:00:00',
    account_name: 'Pfizer',
    sales_manager: 'Sarah Brown',
    job_total: 2400
  },
  {
    job_id: 27482,
    order_id: 6115,
    name: 'Tech Conference Teardown',
    room: 'Grand Ballroom 1',
    start_time: '2025-05-07T15:00:00',
    end_time: '2025-05-07T23:00:00',
    account_name: 'Microsoft',
    sales_manager: 'Darren Lins',
    job_total: 11400
  }
];

// Mock Job Equipment data
export const mockJobEquipment = {
  1: [
    { id: 1, name: "Wireless Microphone", quantity: 2, price: 150 },
    { id: 2, name: "Speaker System", quantity: 1, price: 300 }
  ],
  2: [
    { id: 3, name: "Projector", quantity: 1, price: 250 },
    { id: 4, name: "HDMI Cable", quantity: 2, price: 25 },
    { id: 5, name: "Projection Screen", quantity: 1, price: 150 }
  ],
  3: [
    { id: 6, name: "LED Lights", quantity: 4, price: 100 },
    { id: 7, name: "Lighting Controller", quantity: 1, price: 200 }
  ]
};

// Mock Equipment List
export const mockEquipment = [
  {
    id: 1,
    name: "Wireless Microphone",
    price: 150,
    description: "Professional handheld wireless microphone with 30-foot range"
  },
  {
    id: 2,
    name: "Speaker System",
    price: 300,
    description: "Portable PA speaker system suitable for rooms up to 3000 sq ft"
  },
  {
    id: 3,
    name: "Projector",
    price: 250,
    description: "4K HD projector with 5000 lumens of brightness"
  },
  {
    id: 4,
    name: "HDMI Cable",
    price: 25,
    description: "25-foot HDMI cable"
  },
  {
    id: 5,
    name: "Projection Screen",
    price: 150,
    description: "8' x 8' projection screen"
  },
  {
    id: 6,
    name: "LED Lights",
    price: 100,
    description: "RGB LED stage lighting"
  },
  {
    id: 7,
    name: "Lighting Controller",
    price: 200,
    description: "DMX lighting controller for LED lights"
  },
  {
    id: 8,
    name: "Basic AV Package",
    price: 500,
    description: "Package including projector, screen, and speaker",
    isPackage: true,
    items: [3, 5, 2]
  },
  {
    id: 9,
    name: "Presentation Package",
    price: 750,
    description: "Complete presentation setup with wireless mic",
    isPackage: true,
    items: [1, 2, 3, 4, 5]
  }
];

// Mock Sales Managers data
export const mockSalesManagers = [
  {
    id: 1,
    name: 'David Calvillo',
    email: 'david.calvillo@example.com',
    department: 'Corporate Events',
    active: true
  },
  {
    id: 2,
    name: 'Eder Castillo',
    email: 'eder.castillo@example.com',
    department: 'Social Events',
    active: true
  },
  {
    id: 3,
    name: 'Dylan Neal',
    email: 'dylan.neal@example.com',
    department: 'Tech Conferences',
    active: true
  },
  {
    id: 4,
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    department: 'Medical Events',
    active: true
  },
  {
    id: 5,
    name: 'Darren Lins',
    email: 'darren.lins@example.com',
    department: 'Corporate Events',
    active: true
  }
];

// Update equipment catalog to match the screenshot
export const equipmentCatalog = [
  { id: 1, name: '10\'6"x18\'8" Screen Kit - Front Projection', price: 350.00, rate: 350.00, category: 'Screens' },
  { id: 2, name: '10\'6"x18\'8" Screen Kit - Rear Projection', price: 425.00, rate: 425.00, category: 'Screens' },
  { id: 3, name: '11\'6"x19\'8" Screen Kit - Front Projection', price: 375.00, rate: 375.00, category: 'Screens' },
  { id: 4, name: '12\'x21\'4" Screen Kit - Front Projection', price: 400.00, rate: 400.00, category: 'Screens' },
  { id: 5, name: '12\'x36\' Screen Kit - Rear Projection', price: 675.00, rate: 675.00, category: 'Screens' },
  { id: 6, name: '6\'x10\'6" Screen Kit - Front Projection', price: 175.00, rate: 175.00, category: 'Screens' },
  { id: 7, name: '7\'6"x13\'4" Screen Kit - Front Projection', price: 225.00, rate: 225.00, category: 'Screens' },
  { id: 8, name: '7\'6"x13\'4" Screen Kit - Rear Projection', price: 275.00, rate: 275.00, category: 'Screens' },
  { id: 9, name: '9\'x16\' Screen Kit - Front Projection', price: 250.00, rate: 250.00, category: 'Screens' },
  { id: 10, name: '9\'x16\' Screen Kit - Rear Projection', price: 325.00, rate: 325.00, category: 'Screens' },
  { id: 11, name: 'Analog Way Ascender Switcher - 12x4', price: 550.00, rate: 550.00, category: 'Video' },
  { id: 12, name: 'Analog Way NeXtage Switcher - 8x2', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 13, name: 'Audio - Digital Recording Package', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 14, name: 'Audio - House Sound - PC Audio', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 15, name: 'Audio - House Sound Patch', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 16, name: 'Audio - Line Array (Floor Supported)', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 17, name: 'Audio - Powered Speaker Package', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 18, name: 'Audio - Speakers Line Array(Flown)', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 19, name: 'Audio - Tabletop Microphone', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 20, name: 'Audio/Video Computer Interface Package', price: 0.00, rate: 0.00, category: 'Audio/Video' },
  { id: 21, name: 'Basic Boardroom Package', price: 258.00, rate: 258.00, category: 'Packages' },
  { id: 22, name: 'Camera - Broadcast HD w/Tripod & Lens', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 23, name: 'Camera Package - HD/SD Camcorder w/Tripod', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 24, name: 'Communications - Wired/Wireless Clearcom', price: 0.00, rate: 0.00, category: 'Communications' },
  { id: 25, name: 'EMP Meeting Package', price: 0.00, rate: 0.00, category: 'Packages' },
  { id: 26, name: 'Flipchart Package', price: 0.00, rate: 0.00, category: 'Presentation' },
  { id: 27, name: 'HSIA - Hard Wired Internet', price: 0.00, rate: 0.00, category: 'Internet' },
  { id: 28, name: 'HSIA - Simple WiFi', price: 0.00, rate: 0.00, category: 'Internet' },
  { id: 29, name: 'HSIA - Superior WiFi', price: 0.00, rate: 0.00, category: 'Internet' },
  { id: 30, name: 'HSIA - WiFi Dedicated Bandwidth', price: 0.00, rate: 0.00, category: 'Internet' },
  { id: 31, name: 'HSIA - Wireless Networking for Printer/Computer', price: 278.00, rate: 278.00, category: 'Internet' },
  { id: 32, name: 'Lighting - Corporate Branding Gobo Package', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 33, name: 'Lighting - Digital Lighting Board', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 34, name: 'Lighting - Floor Supported Back Wash', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 35, name: 'Lighting - Intelligent Lighting Package', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 36, name: 'Lighting - LED Up-Lighting Package (10)', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 37, name: 'Lighting - Podium Lighting Package', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 38, name: 'Lighting - Stage Back Light', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 39, name: 'Lighting - Stage Wash - 4 Lights', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 40, name: 'Lighting - Stage Wash - 6 Light', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 41, name: 'Lighting Package - Deluxe', price: 0.00, rate: 0.00, category: 'Lighting' },
  { id: 42, name: 'Meeting Room Projector Package', price: 74.54, rate: 74.54, category: 'Packages' },
  { id: 43, name: 'Microphone - Handheld Wireless', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 44, name: 'Microphone - Lavalier Wireless', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 45, name: 'Microphone Package - 4 Table Mics', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 46, name: 'Monitor - 24" LCD Computer Display', price: 0.00, rate: 0.00, category: 'Display' },
  { id: 47, name: 'Monitor - 55" LCD Display', price: 0.00, rate: 0.00, category: 'Display' },
  { id: 48, name: 'PC Laptop Computer', price: 0.00, rate: 0.00, category: 'Computers' },
  { id: 49, name: 'Podium - Executive Wood w/Microphone', price: 0.00, rate: 0.00, category: 'Furniture' },
  { id: 50, name: 'Presentation Remote Clicker', price: 0.00, rate: 0.00, category: 'Accessories' },
  { id: 51, name: 'Projector - 6000 Lumen LCD', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 52, name: 'Sound System - Medium Sized Room', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 53, name: 'Spandex Cover', price: 0.00, rate: 0.00, category: 'Accessories' },
  { id: 54, name: 'Tripod Screen 8\'', price: 57.5, rate: 57.5, category: 'Screens' },
  { id: 55, name: 'Video Switcher - Small Format', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 56, name: 'HDMI Cable', price: 0.00, rate: 0.00, category: 'Accessories' },
  { id: 57, name: 'Projector', price: 17.04, rate: 17.04, category: 'Video' },
  { id: 58, name: 'Marker Flipchart 4 Color', price: 3.00, rate: 3.00, category: 'Accessories' },
  { id: 59, name: 'Pad Flipchart Paper Plain', price: 18.00, rate: 18.00, category: 'Accessories' },
  { id: 60, name: 'DaLite A Frame Folding Flipchart', price: 120.00, rate: 120.00, category: 'Presentation' },
  { id: 61, name: 'Wi-Fi Connections 3 Mbps', price: 25.00, rate: 25.00, category: 'Internet' },
  { id: 62, name: 'Video Playback Package', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 63, name: 'Confidence Monitor - 55"', price: 0.00, rate: 0.00, category: 'Display' },
  { id: 64, name: 'MacBook Pro Laptop', price: 0.00, rate: 0.00, category: 'Computers' },
  { id: 65, name: 'Digital Audio Mixer - 16 Channel', price: 0.00, rate: 0.00, category: 'Audio' },
  { id: 66, name: 'Video Distribution Amplifier', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 67, name: 'Blu-ray Player', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 68, name: 'HDMI to SDI Converter', price: 0.00, rate: 0.00, category: 'Video' },
  { id: 69, name: 'Wireless Presentation System', price: 0.00, rate: 0.00, category: 'Presentation' },
  { id: 70, name: 'Lectern - Modern Black', price: 0.00, rate: 0.00, category: 'Furniture' },
  { id: 71, name: 'VGA Cable - 25ft', price: 15.00, rate: 15.00, category: 'Accessories' },
  { id: 72, name: 'DisplayPort Cable - 15ft', price: 20.00, rate: 20.00, category: 'Accessories' },
  { id: 73, name: 'USB-C to HDMI Adapter', price: 12.50, rate: 12.50, category: 'Accessories' },
  { id: 74, name: 'Power Strip - 6 Outlet', price: 8.00, rate: 8.00, category: 'Power' },
  { id: 75, name: 'Power Distribution Unit - 20A', price: 75.00, rate: 75.00, category: 'Power' },
  { id: 76, name: 'Pipe and Drape - 10\'x10\' Section', price: 125.00, rate: 125.00, category: 'Decor' },
  { id: 77, name: 'Stage Riser - 4\'x8\' (24" Height)', price: 95.00, rate: 95.00, category: 'Staging' },
  { id: 78, name: 'Stage Stairs', price: 45.00, rate: 45.00, category: 'Staging' },
  { id: 79, name: 'Crowd Barrier - 8\' Section', price: 35.00, rate: 35.00, category: 'Staging' },
  { id: 80, name: 'Media Server with Playback Software', price: 350.00, rate: 350.00, category: 'Video' },
  { id: 81, name: 'Streaming Encoder', price: 275.00, rate: 275.00, category: 'Video' },
  { id: 82, name: 'Video Scaler', price: 125.00, rate: 125.00, category: 'Video' },
  { id: 83, name: 'Wireless In-Ear Monitor System', price: 85.00, rate: 85.00, category: 'Audio' },
  { id: 84, name: 'Speaker Stand', price: 15.00, rate: 15.00, category: 'Audio' },
  { id: 85, name: 'Microphone Stand', price: 10.00, rate: 10.00, category: 'Audio' },
  { id: 86, name: 'Walkie Talkie - Two-Way Radio', price: 18.00, rate: 18.00, category: 'Communications' },
  { id: 87, name: 'USB Presentation Clicker', price: 12.00, rate: 12.00, category: 'Accessories' },
  { id: 88, name: 'Easel Stand', price: 15.00, rate: 15.00, category: 'Accessories' },
  { id: 89, name: 'Conference Phone', price: 75.00, rate: 75.00, category: 'Communications' },
  { id: 90, name: 'Streaming Camera Kit', price: 225.00, rate: 225.00, category: 'Video' },
  { id: 91, name: 'LED Video Wall - 3m x 2m', price: 1200.00, rate: 1200.00, category: 'Video' },
  { id: 92, name: 'Boundary Microphone', price: 45.00, rate: 45.00, category: 'Audio' },
  { id: 93, name: 'Gooseneck Microphone', price: 40.00, rate: 40.00, category: 'Audio' },
  { id: 94, name: 'Shure Wireless Microphone System - 4 Channel', price: 250.00, rate: 250.00, category: 'Audio' },
  { id: 95, name: 'Subwoofer - 18"', price: 120.00, rate: 120.00, category: 'Audio' },
  { id: 96, name: 'Digital Mixing Console - 32 Channel', price: 350.00, rate: 350.00, category: 'Audio' },
  { id: 97, name: 'Moving Head Light', price: 85.00, rate: 85.00, category: 'Lighting' },
  { id: 98, name: 'LED Par Can Light', price: 25.00, rate: 25.00, category: 'Lighting' },
  { id: 99, name: 'Fresnel Spotlight - 650W', price: 45.00, rate: 45.00, category: 'Lighting' },
  { id: 100, name: 'Lighting Truss - 10\' Section', price: 65.00, rate: 65.00, category: 'Staging' },
  { id: 101, name: 'DMX Lighting Controller - Advanced', price: 175.00, rate: 175.00, category: 'Lighting' },
  { id: 102, name: 'Hazer/Fog Machine', price: 95.00, rate: 95.00, category: 'Special Effects' },
  { id: 103, name: 'Confetti Cannon', price: 120.00, rate: 120.00, category: 'Special Effects' },
  { id: 104, name: 'Dance Floor - 12\'x12\'', price: 250.00, rate: 250.00, category: 'Staging' },
  { id: 105, name: 'Teleprompter System', price: 225.00, rate: 225.00, category: 'Video' },
  { id: 106, name: 'Green Screen Kit - 10\'x12\'', price: 85.00, rate: 85.00, category: 'Video' },
  { id: 107, name: 'Cable Ramp - 3 Channel', price: 35.00, rate: 35.00, category: 'Power' },
  { id: 108, name: 'Extension Cord - 50\'', price: 12.00, rate: 12.00, category: 'Power' },
  { id: 109, name: 'Monitor - 65" 4K LED Display', price: 350.00, rate: 350.00, category: 'Display' },
  { id: 110, name: 'Monitor - 85" 4K LED Display', price: 550.00, rate: 550.00, category: 'Display' },
  { id: 111, name: 'Laser Projector - 10,000 Lumen', price: 650.00, rate: 650.00, category: 'Video' },
  { id: 112, name: 'Digital Audio Recorder', price: 65.00, rate: 65.00, category: 'Audio' },
  { id: 113, name: 'In-Ear Monitoring System - 4 Pack', price: 180.00, rate: 180.00, category: 'Audio' },
  { id: 114, name: 'Multicamera Switching System', price: 325.00, rate: 325.00, category: 'Video' },
  { id: 115, name: 'Backdrop - Stretch Fabric 10\'x8\'', price: 135.00, rate: 135.00, category: 'Decor' },
  { id: 116, name: 'Wireless Audio Transmitter/Receiver', price: 85.00, rate: 85.00, category: 'Audio' },
  { id: 117, name: 'Projector Screen - Fast Fold 9\'x12\'', price: 175.00, rate: 175.00, category: 'Screens' },
  { id: 118, name: 'Lectern Microphone - Shure MX412', price: 55.00, rate: 55.00, category: 'Audio' },
  { id: 119, name: 'Event iPad Controller', price: 95.00, rate: 95.00, category: 'Computers' },
  { id: 120, name: 'Live Streaming Package - Complete', price: 750.00, rate: 750.00, category: 'Video' },
  { id: 1, name: 'Projector - Standard', rate: 200, price: 200, category: 'Video' },
  { id: 2, name: 'Projector - HD', rate: 350, price: 350, category: 'Video' },
  { id: 3, name: 'Audio - Wireless Microphone', rate: 75, price: 75, category: 'Audio' },
  { id: 4, name: 'Audio - Tabletop Microphone', rate: 65, price: 65, category: 'Audio' },
  { id: 5, name: 'Audio - Powered Speaker Package', rate: 180, price: 180, category: 'Audio' },
  { id: 6, name: 'Audio - Line Array Speaker System', rate: 450, price: 450, category: 'Audio' },
  { id: 7, name: 'LED Screen 55"', rate: 250, price: 250, category: 'Video' },
  { id: 8, name: 'LED Screen 75"', rate: 450, price: 450, category: 'Video' },
  { id: 9, name: 'Video - Laptop', rate: 125, price: 125, category: 'Computer' },
  { id: 10, name: 'Video - HDMI Cable (6ft)', rate: 15, price: 15, category: 'Accessories' },
  { id: 11, name: 'Video - Switcher', rate: 175, price: 175, category: 'Video' },
  { id: 12, name: 'Flipchart with Markers', rate: 45, price: 45, category: 'Presentation' },
  { id: 13, name: 'Wi-Fi Dedicated Connection', rate: 150, price: 150, category: 'Network' },
  { id: 14, name: 'Podium with Microphone', rate: 125, price: 125, category: 'Furniture' },
  { id: 15, name: 'Basic Presentation Package', rate: 350, price: 350, category: 'Bundle' },
  { id: 16, name: 'Conference Audio Package', rate: 275, price: 275, category: 'Bundle' },
  { id: 17, name: 'Lighting - Basic Stage Wash', rate: 180, price: 180, category: 'Lighting' },
  { id: 18, name: 'Lighting - UP Lights', rate: 35, price: 35, category: 'Lighting' },
  { id: 19, name: '10\'6"x18\'8" Screen Kit - Front Projection', rate: 350, price: 350, category: 'Video' },
  { id: 20, name: 'DJ Booth Setup', rate: 275, price: 275, category: 'Entertainment' },
];

// Add this to your mockData.js file to inspect how clients are handled
export const getClientsMap = () => {
  // Create mapping of client names to their IDs
  const clientsMap = {};
  mockOrders.forEach(order => {
    if (order.client_name) {
      clientsMap[order.client_name] = true;
    }
  });
  console.log("Available clients:", clientsMap);
  return clientsMap;
};

// Log the IDs of orders in mockData to troubleshoot
console.log('Available order IDs:', mockOrders.map(order => order.id)); 