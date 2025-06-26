 
// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        // Add animation
        mobileMenu.style.opacity = '0';
        setTimeout(() => {
            mobileMenu.style.transition = 'opacity 0.3s ease-in-out';
            mobileMenu.style.opacity = '1';
        }, 10);
    } else {
        closeMobileMenu();
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    mobileMenu.style.opacity = '0';
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        mobileMenu.style.opacity = '1';
    }, 300);
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!nav.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
    }
});

// Update the updateAdminUI function to also handle mobile menu
const originalUpdateAdminUI = updateAdminUI;
updateAdminUI = function() {
    originalUpdateAdminUI();
    
    const addCarNavMobile = document.getElementById('add-car-nav-mobile');
    if (isAdminMode) {
        if (addCarNavMobile) addCarNavMobile.style.display = 'block';
    } else {
        if (addCarNavMobile) addCarNavMobile.style.display = 'none';
    }
};


    
        // ==========================================
        // SUPABASE CONFIGURATION
        // ==========================================
        
        // REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
        const SUPABASE_URL = 'https://yjtykxikqltahyvddvfk.supabase.co'; // Replace with your project URL
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdHlreGlrcWx0YWh5dmRkdmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTU0NDYsImV4cCI6MjA2NTMzMTQ0Nn0.-BStcU6DdDjMyywimuP_RaVNbNey1UKGTmVTHbkhlpc'; // Replace with your anon key
        
        // Initialize Supabase client
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Admin mode state
        let isAdminMode = false;

        // Car inventory storage
        let carInventory = [];
        // Logo mapping for car makes
// Logo mapping for car makes using mixed CDN sources
const carMakeLogos = {
    'Toyota': 'https://cdn.worldvectorlogo.com/logos/toyota-1.svg',
    'BMW': 'https://www.carlogos.org/car-logos/bmw-logo-2020-blue-white.png',
    'Ford': 'https://www.carlogos.org/car-logos/ford-logo-2017.png',
    'Honda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Honda_logo.svg/60px-Honda_logo.svg.png',
'Kia': 'https://logos-world.net/wp-content/uploads/2021/03/Kia-Logo.png',
    'Nissan': 'https://www.carlogos.org/logo/Nissan-logo-2013-1440x900.png',
    'Volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/60px-Volkswagen_logo_2019.svg.png',
    'Mini': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/MINI_logo.svg/60px-MINI_logo.svg.png'
};


let availableMakes = new Set();
// Car features configuration with icons
const carFeatures = {
    'seats': { name: 'Seats', icon: 'fa-couch' },
    'auction_sheet': { name: 'Auction Sheet', icon: 'fa-file-alt' },
    'warranted_mileage': { name: 'Warranted & Genuine Mileage', icon: 'fa-tachometer-alt' },
    'service_history': { name: 'Full Service History', icon: 'fa-tools' },
    'book_pack': { name: 'Full Book Pack', icon: 'fa-book' },
    'warranty': { name: 'Warranty', icon: 'fa-shield-alt' },
    'import_grade': { name: 'Import ', icon: 'fa-star' },
    'previous_owners': { name: 'Previous Owners', icon: 'fa-users' },
    'sliding_doors': { name: 'Sliding Doors', icon: 'fa-door-open' },
    'electric_mirrors': { name: 'Electric Mirrors', icon: 'fa-car-side' },
    'sat_nav': { name: 'Sat Nav', icon: 'fa-map-marked-alt' },
    'central_locking': { name: 'Central Locking', icon: 'fa-lock' },
    'front_parking_sensors': { name: 'Front Parking Sensors', icon: 'fa-parking' },
    'rear_parking_sensors': { name: 'Rear Parking Sensors', icon: 'fa-parking' },
    'reverse_camera': { name: 'Reverse Camera', icon: 'fa-video' },
    'hud_display': { name: 'HUD Display', icon: 'fa-tv' },
    'auto_beam_headlights': { name: 'Auto-beam Headlights', icon: 'fa-lightbulb' },
    'bluetooth': { name: 'Bluetooth', icon: 'fa-bluetooth-b' },
    'front_fog_lights': { name: 'Front Fog Lights', icon: 'fa-cloud' },
    'air_conditioning': { name: 'Air Conditioning', icon: 'fa-snowflake' },
    'cruise_control': { name: 'Cruise Control', icon: 'fa-tachometer-alt' },
    'leather_seats': { name: 'Leather Seats', icon: 'fa-couch' },
    'navigation': { name: 'Navigation', icon: 'fa-compass' },
    'heated_seats': { name: 'Heated Seats', icon: 'fa-fire' },
    'electric_folding_mirrors': { name: 'Electric Folding Mirrors', icon: 'fa-compress-arrows-alt' },
    'pre_crash_safety': { name: 'Pre-crash Safety', icon: 'fa-car-crash' },
    'lane_assist': { name: 'Lane Assist', icon: 'fa-road' },
    'ulez_exempt': { name: 'ULEZ Exempt', icon: 'fa-leaf' },
    'mot': { name: 'MOT', icon: 'fa-certificate' },
    'keyless_start': { name: 'Keyless Start', icon: 'fa-key' },
    'black_cloth_interior': { name: 'Black Cloth Interior', icon: 'fa-fill-drip' },
    'multimedia_screen': { name: 'Multimedia Screen', icon: 'fa-desktop' }
};


// Generate features checkboxes
function generateFeaturesCheckboxes() {
    let html = '';
    Object.entries(carFeatures).forEach(([key, feature]) => {
        html += `
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition">
                <input type="checkbox" name="features" value="${key}" class="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-300">
                <i class="fas ${feature.icon} text-gray-600 w-4"></i>
                <span class="text-sm">${feature.name}</span>
            </label>
        `;
    });
    return html;
}
// After generateFeaturesCheckboxes function (around line 252), add:
function initializeAddCarForm() {
    const featuresContainer = document.querySelector('#add-car-form .features-container');
    if (featuresContainer && featuresContainer.innerHTML === '') {
        featuresContainer.innerHTML = generateFeaturesCheckboxes();
    }
}



        // ==========================================
        // SUPABASE FUNCTIONS
        // ==========================================

        // Load cars from Supabase
        async function loadCarsFromSupabase() {
            try {
                const { data, error } = await supabase
                    .from('cars')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                console.log('Cars loaded from Supabase:', data);
                
                // Transform Supabase records to our format
                carInventory = data.map(record => ({
                    id: record.id,
                    make: record.make || '',
                    model: record.model || '',
                    year: parseInt(record.year) || 2023,
                    price: parseInt(record.price) || 0,
                    body: record.body || '',
                    fuel: record.fuel || '',
                    mileage: parseInt(record.mileage) || 0,
                    transmission: record.transmission || 'Automatic',
                    image: record.image || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
                    images: record.images || record.image || '',
                    description: record.description || 'No description available.',
                        features: record.features || '' // ADD THIS LINE
                }));

                console.log('Cars loaded successfully:', carInventory.length);
                
                // Update UI with loaded cars
                updateUIWithCars();
                
            } catch (error) {
                console.error('Error loading cars:', error);
                alert('Failed to load cars from database. Using default inventory.');
                
                // Fallback to default cars if Supabase fails
                carInventory = [
                    {
                        id: 1,
                        make: 'Toyota',
                        model: 'Prius',
                        year: 2023,
                        price: 25000,
                        body: 'Sedan',
                        fuel: 'Hybrid',
                        mileage: 15000,
                        transmission: 'Automatic',
                        image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
                        description: 'Efficient hybrid sedan with excellent fuel economy and modern features.'
                    },
                    {
                        id: 2,
                        make: 'BMW',
                        model: 'X5',
                        year: 2022,
                        price: 65000,
                        body: 'SUV',
                        fuel: 'Petrol',
                        mileage: 25000,
                        transmission: 'Automatic',
                        image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800',
                        description: 'Luxury SUV with powerful performance and premium interior.'
                    }
                ];
                updateUIWithCars();
            }
        }

        // Add car to Supabase
        async function addCarToSupabase(carData) {
            try {
                console.log('Adding car to Supabase:', carData);
                
                const { data, error } = await supabase
                    .from('cars')
                    .insert([{
                        make: carData.make,
                        model: carData.model,
                        year: parseInt(carData.year),
                        price: parseInt(carData.price),
                        body: carData.body,
                        fuel: carData.fuel,
                        mileage: parseInt(carData.mileage),
                        transmission: carData.transmission,
                        image: carData.image,
                        images: carData.images,
                        description: carData.description,
                    features: carData.features // ADD THIS LINE

                    }])
                    .select()
                    .single();

                if (error) throw error;

                console.log('Car added successfully:', data);
                
                // Add the new car to our local inventory
                carInventory.push({
                    ...carData,
                    id: data.id
                });
                
                return true;
                
            } catch (error) {
                console.error('Error adding car:', error);
                alert(`Failed to add car to database.\n\nError: ${error.message}`);
                return false;
            }
        }

        // Delete car from Supabase
        async function deleteCarFromSupabase(carId) {
            try {
                const { error } = await supabase
                    .from('cars')
                    .delete()
                    .eq('id', carId);

                if (error) throw error;

                return true;
                
            } catch (error) {
                console.error('Error deleting car:', error);
                alert('Failed to delete car from database.');
                return false;
            }
        }
  // Toggle logo dropdown
function toggleLogoDropdown() {
    const dropdown = document.getElementById('logo-dropdown');
    dropdown.classList.toggle('show');
    
    if (dropdown.classList.contains('show')) {
        updateLogoList(); // Changed from updateLogoGrid
    }
}

// Update logo list based on available inventory
function updateLogoList() {
    const logoList = document.getElementById('logo-list');
    const selectedMake = document.getElementById('search-make').value;
    
    // Get available makes from current inventory
    availableMakes = new Set(carInventory.map(car => car.make));
    
    // Generate logo list HTML
    let listHTML = '';
    Object.entries(carMakeLogos).forEach(([make, logoPath]) => {
        const isAvailable = availableMakes.has(make);
        const isSelected = make === selectedMake;
        const carCount = carInventory.filter(car => car.make === make).length;
        
        listHTML += `
            <li class="logo-item ${!isAvailable ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
                onclick="${isAvailable ? `selectMake('${make}')` : ''}">
                <img src="${logoPath}" alt="${make}" onerror="this.src='https://via.placeholder.com/40x40?text=${make}'">
                <div class="make-info">
                    <span class="make-name">${make}</span>
                    ${isAvailable ? `<span class="car-count">${carCount} cars</span>` : '<span class="car-count">Not available</span>'}
                </div>
            </li>
        `;
    });
    
    logoList.innerHTML = listHTML;
}

// Handle make selection from logo
function selectMake(make) {
    const makeSelect = document.getElementById('search-make');
    makeSelect.value = make;
    
    // Hide dropdown
    document.getElementById('logo-dropdown').classList.remove('show');
    
    // Trigger existing change handler
    handleMakeChange();
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('logo-dropdown');
    const wrapper = event.target.closest('.logo-dropdown-wrapper');
    
    if (!wrapper && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

// Clear selection - add this to your existing clearSearch function
function clearMakeSelection() {
    const makeSelect = document.getElementById('search-make');
    makeSelect.value = '';
    updateLogoList(); // Changed from updateLogoGrid
}

        // Upload image to Supabase Storage
        async function uploadImageToSupabase(file, fileName) {
            try {
                const { data, error } = await supabase.storage
                    .from('car-images')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) throw error;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('car-images')
                    .getPublicUrl(fileName);

                return publicUrl;
                
            } catch (error) {
                console.error('Error uploading image:', error);
                throw error;
            }
        }

        // ==========================================
        // ORIGINAL FUNCTIONS (UNCHANGED)
        // ==========================================

        // Disable right-click context menu
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', function(e) {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+J
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
            // Ctrl+S (Save)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }
        });

        // Disable text selection
        document.addEventListener('selectstart', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });

        // Update UI after loading cars
        function updateUIWithCars() {
            initCarousel();
            updateTotalCars();
            populateSearchDropdowns();
            updateInventory();
        }

        // Toggle admin mode
       async function toggleAdminMode() {
    if (!isAdminMode) {
        const username = prompt('Enter admin username:');
        if (!username) return;
        
        const password = prompt('Enter admin password:');
        if (!password) return;
        
        try {
            // Call the database function to verify login
            const { data, error } = await supabase
                .rpc('verify_admin_login', {
                    input_username: username,
                    input_password: password
                });
            
            if (error) throw error;
            
            if (data === true) {
                isAdminMode = true;
                // Store admin session (expires in 24 hours)
                sessionStorage.setItem('adminSession', JSON.stringify({
                    username: username,
                    timestamp: Date.now(),
                    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                }));
                alert('Admin mode activated!');
                updateAdminUI();
            } else {
                alert('Invalid username or password!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    } else {
        // Logout
        isAdminMode = false;
        sessionStorage.removeItem('adminSession');
        alert('Admin mode deactivated!');
        updateAdminUI();
    }
}


function checkAdminSession() {
    const session = sessionStorage.getItem('adminSession');
    if (session) {
        const data = JSON.parse(session);
        // Check if session is still valid
        if (data.expires > Date.now()) {
            isAdminMode = true;
            updateAdminUI();
        } else {
            // Session expired
            sessionStorage.removeItem('adminSession');
        }
    }
}
        // Update UI based on admin mode
        function updateAdminUI() {
    const addCarNav = document.getElementById('add-car-nav');
    const addCarNavMobile = document.getElementById('add-car-nav-mobile');
    const adminButton = document.getElementById('admin-button');
    
    if (isAdminMode) {
        if (addCarNav) addCarNav.style.display = 'block';
        if (addCarNavMobile) addCarNavMobile.style.display = 'block';
        adminButton.classList.add('admin-active');
        // Subtle change - just a slightly different shade
        adminButton.innerHTML = '<div style="width: 8px; height: 8px; background-color: #9ca3af; border-radius: 2px;"></div>';
    } else {
        if (addCarNav) addCarNav.style.display = 'none';
        if (addCarNavMobile) addCarNavMobile.style.display = 'none';
        adminButton.classList.remove('admin-active');
        // Back to original tiny square
        adminButton.innerHTML = '<div style="width: 8px; height: 8px; background-color: #d1d5db; border-radius: 2px;"></div>';
    }
    
    // Refresh current page to show/hide admin features
    const currentPage = document.querySelector('.page-content.active').id;
    if (currentPage === 'car-detail-page') {
        const detailContent = document.getElementById('car-detail-content');
        const carId = detailContent.getAttribute('data-car-id');
        if (carId) showCarDetail(carId);
    }
}

        // Carousel functionality
        let currentSlide = 1;
        const track = document.getElementById('carouselTrack');
        let totalSlides = 4;

        // Initialize carousel
        function initCarousel() {
            const carouselHTML = carInventory.map((car, index) => `
                <div class="w-full flex-shrink-0 px-2">
                    <div class="relative rounded-2xl overflow-hidden h-[450px] car-card" onclick="showCarDetail('${car.id}')">
                        <img src="${car.image}" alt="${car.make} ${car.model}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-8 text-white">
                            <h3 class="text-3xl font-bold mb-2">${car.make} ${car.model}</h3>
                            <p class="text-2xl font-semibold mb-4">${car.price.toLocaleString()}</p>
                            <button class="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2.5 rounded-full transition-colors">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            track.innerHTML = carouselHTML;
            totalSlides = carInventory.length;
        }

        function updateCarousel() {
            const offset = -currentSlide * 100;
            track.style.transform = `translateX(${offset}%)`;
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateCarousel();
            }
        }

        function previousSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        }

        // Page navigation
        function showPage(pageId) {
            // Check if trying to access add-car page without admin
            if (pageId === 'add-car' && !isAdminMode) {
                alert('You must be logged in as admin to add cars!');
                return;
            }
            
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId + '-page').classList.add('active');
            
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (pageId === 'inventory') {
                updateInventory();
            }
            
             // ADD THESE LINES HERE (around line 305):
    if (pageId === 'add-car') {
        initializeAddCarForm();
    }
            // Populate dropdowns when showing home page
            if (pageId === 'home') {
                setTimeout(() => {
                    populateSearchDropdowns();
                }, 100);
            }
        }

        // Update inventory display
        function updateInventory() {
            const inventoryGrid = document.getElementById('inventory-grid');
            const carCount = document.getElementById('car-count');
            
            carCount.textContent = carInventory.length;
            
            inventoryGrid.innerHTML = carInventory.map(car => `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden car-card" onclick="showCarDetail('${car.id}')">
                    <img src="${car.image}" alt="${car.make} ${car.model}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold">${car.make} ${car.model}</h3>
                        <p class="text-gray-600 text-sm">${car.year} • ${car.fuel}</p>
                        <p class="text-gray-600 text-sm">${car.mileage.toLocaleString()} km</p>
                        <p class="text-xl font-bold text-cyan-500 mt-2">${car.price.toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
        }

      

        // Image gallery functions
let currentImageIndex = 0;

function changeMainImage(imageUrl, index) {
    const mainImage = document.getElementById('main-car-image');
    if (mainImage) {
        mainImage.src = imageUrl;
        currentImageIndex = index;
        updateThumbnailSelection(index);
    }
}

function updateThumbnailSelection(activeIndex) {
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    thumbnails.forEach((thumb, index) => {
        if (index === activeIndex) {
            thumb.classList.add('ring-2', 'ring-cyan-500', 'opacity-100');
            thumb.classList.remove('opacity-60');
        } else {
            thumb.classList.remove('ring-2', 'ring-cyan-500', 'opacity-100');
            thumb.classList.add('opacity-60');
        }
    });
}



          // Show car detail
        function showCarDetail(carId) {
            const car = carInventory.find(c => c.id === carId);
            if (!car) return;
            
            const detailContent = document.getElementById('car-detail-content');
            detailContent.setAttribute('data-car-id', carId);
            // Add this section in the car detail HTML where you want features to appear
const featuresHTML = car.features ? `
    <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <i class="fas fa-check-circle text-cyan-500"></i>
            Vehicle Features
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            ${car.features.split(',').map(feature => {
                const featureData = carFeatures[feature];
                return featureData ? `
                    <div class="flex items-center gap-2 text-md">
                        <i class="fas ${featureData.icon} text-cyan-500"></i>
                        <span>${featureData.name}</span>
                    </div>
                ` : '';
            }).join('')}
        </div>
    </div>
` : '';
            
            const deleteButton = isAdminMode ? `
                <button onclick="deleteCar('${car.id}')" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center gap-2">
                    <i class="fas fa-trash"></i> Delete Car
                </button>
            ` : '';
            
            detailContent.innerHTML = `
                <div class="max-w-7xl mx-auto">
                    <!-- Modern Header with Background -->
                    <div class="relative bg-gradient-to-r from-gray-900 to-gray-700 rounded-t-3xl overflow-hidden mb-8">
                        <div class="absolute inset-0 bg-black opacity-30"></div>
                        <div class="relative z-10 p-8 text-white">
                            <h1 class="text-4xl md:text-5xl font-bold mb-2">${car.make} ${car.model}</h1>
                            <p class="text-xl opacity-90">${car.year} • ${car.body} • ${car.fuel}</p>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-2 gap-8">
                        <!-- Image Gallery Section -->
                        <!-- Image Gallery Section -->
<div class="space-y-4">
    <!-- Main Image -->
    <div class="relative overflow-hidden rounded-2xl shadow-2xl">
        <img id="main-car-image" src="${car.image}" alt="${car.make} ${car.model}" class="w-full h-[400px] object-cover">
        <div class="absolute top-4 right-4 bg-cyan-500 text-white px-4 py-2 rounded-full font-semibold">
            ${car.year}
        </div>
        ${car.images && car.images.split(',').length > 1 ? `
            <div class="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                <i class="fas fa-images mr-1"></i> ${car.images.split(',').length} Photos
            </div>
        ` : ''}
    </div>
    
    <!-- Thumbnail Gallery -->
    ${car.images && car.images.split(',').length > 1 ? `
        <div class="bg-gray-100 rounded-xl p-3">
            <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
                ${car.images.split(',').map((img, index) => `
                    <div class="relative cursor-pointer group" onclick="changeMainImage('${img.trim()}', ${index})">
                        <img src="${img.trim()}" 
                             alt="${car.make} ${car.model} - Image ${index + 1}" 
                             class="thumbnail-image w-full h-16 md:h-20 object-cover rounded-lg transition-all duration-200 
                                    ${index === 0 ? 'ring-2 ring-cyan-500 opacity-100' : 'opacity-60 hover:opacity-100'}"
                             onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found'">
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 rounded-lg transition-opacity"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : ''}

                        <!-- Details Section -->
                        <div class="space-y-6">
                            <!-- Price Card -->
                            <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
                                <p class="text-lg mb-2">Our Price</p>
                                <p class="text-5xl font-bold mb-4">${car.price.toLocaleString()}</p>
                                <p class="text-sm opacity-90">*Includes all fees except registration</p>
                            </div>

                            <!-- Specifications -->
                            <div class="bg-white rounded-2xl shadow-lg p-6">
                                <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <i class="fas fa-clipboard-list text-cyan-500"></i>
                                    Vehicle Specifications
                                </h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center py-3 border-b hover:bg-gray-50 px-2 rounded transition">
                                        <span class="text-gray-600 flex items-center gap-2">
                                            <i class="fas fa-car text-cyan-500"></i> Make
                                        </span>
                                        <span class="font-medium">${car.make}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-3 border-b hover:bg-gray-50 px-2 rounded transition">
                                        <span class="text-gray-600 flex items-center gap-2">
                                            <i class="fas fa-tag text-cyan-500"></i> Model
                                        </span>
                                        <span class="font-medium">${car.model}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-3 border-b hover:bg-gray-50 px-2 rounded transition">
                                        <span class="text-gray-600 flex items-center gap-2">
                                            <i class="fas fa-calendar text-cyan-500"></i> Year
                                        </span>
                                        <span class="font-medium">${car.year}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-3 border-b hover:bg-gray-50 px-2 rounded transition">
                                        <span class="text-gray-600 flex items-center gap-2">
                                            <i class="fas fa-car-side text-cyan-500"></i> Body Type
                                        </span>
                                        <span class="font-medium">${car.body}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded transition">
                                        <span class="text-gray-600 flex items-center gap-2">
                                            <i class="fas fa-road text-cyan-500"></i> Mileage
                                        </span>
                                        <span class="font-medium">${car.mileage.toLocaleString()} km</span>
                                    </div>
                                    
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="bg-gray-50 rounded-2xl p-6">
                                <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <i class="fas fa-info-circle text-cyan-500"></i>
                                    About This Vehicle
                                </h3>
                                <p class="text-gray-700 leading-relaxed">${car.description}</p>
                            </div>
                            ${featuresHTML} 

                            <!-- Action Buttons -->
                            <div class="flex gap-4">
                                <button onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'}); showPage('home');" 
                                    class="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-4 rounded-xl font-semibold transition duration-200 flex items-center justify-center gap-2 shadow-lg">
                                    <i class="fas fa-phone"></i> Contact Us
                                </button>
                                
                                ${deleteButton}
                            </div>

                            <!-- Trust Badges -->
                            <div class="grid grid-cols-3 gap-4 pt-4">
                                <div class="text-center">
                                    <i class="fas fa-shield-alt text-cyan-500 text-2xl mb-2"></i>
                                    <p class="text-xs text-gray-600">Certified Quality</p>
                                </div>
                                <div class="text-center">
                                    <i class="fas fa-award text-cyan-500 text-2xl mb-2"></i>
                                    <p class="text-xs text-gray-600">Best Price</p>
                                </div>
                                <div class="text-center">
                                    <i class="fas fa-handshake text-cyan-500 text-2xl mb-2"></i>
                                    <p class="text-xs text-gray-600">Trusted Dealer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Similar Cars Section -->
                    <div class="mt-12">
                        <h3 class="text-2xl font-semibold mb-6">You May Also Like</h3>
                        <div class="grid md:grid-cols-3 gap-6">
                            ${carInventory
                                .filter(c => c.id !== car.id && (c.body === car.body || c.make === car.make))
                                .slice(0, 3)
                                .map(similarCar => `
                                    <div class="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition" onclick="showCarDetail('${similarCar.id}')">
                                        <img src="${similarCar.image}" alt="${similarCar.make} ${similarCar.model}" class="w-full h-48 object-cover">
                                        <div class="p-4">
                                            <h4 class="font-semibold">${similarCar.make} ${similarCar.model}</h4>
                                            <p class="text-gray-600 text-sm">${similarCar.year} • ${similarCar.fuel}</p>
                                            <p class="text-xl font-bold text-cyan-500 mt-2">${similarCar.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            showPage('car-detail');
            // Reset image gallery to first image
currentImageIndex = 0;
setTimeout(() => {
    updateThumbnailSelection(0);
}, 100);

showPage('car-detail');
        }

        // Handle contact form
        function handleContactForm(e) {
            e.preventDefault();
            alert('Thank you for your inquiry! We will contact you soon.');
            e.target.reset();
        }

        // Populate search dropdowns with actual inventory data
        function populateSearchDropdowns() {
            const makeSelect = document.getElementById('search-make');
            const modelSelect = document.getElementById('search-model');
            const bodySelect = document.getElementById('search-body');
            const fuelSelect = document.getElementById('search-fuel');
            
            if (!makeSelect || !bodySelect || !fuelSelect) {
                console.log('Search dropdowns not found, retrying...');
                setTimeout(() => {
                    populateSearchDropdowns();
                }, 500);
                return;
            }
            
            // Get unique makes from inventory
            const makes = [...new Set(carInventory.map(car => car.make))].sort();
            
            // Clear and populate ONLY make dropdown initially
            makeSelect.innerHTML = '<option value="">Make (Any)</option>';
            makes.forEach(make => {
                const option = document.createElement('option');
                option.value = make;
                option.textContent = make;
                makeSelect.appendChild(option);
            });
            
            // Clear all other dropdowns - they should be empty until make is selected
            modelSelect.innerHTML = '<option value="">Model (Any)</option>';
            bodySelect.innerHTML = '<option value="">Body Type (Any)</option>';
            fuelSelect.innerHTML = '<option value="">Fuel (Any)</option>';
            
            console.log('Dropdowns initialized - only Make populated');
        }

        // Handle make dropdown change
        function handleMakeChange() {
            const makeSelect = document.getElementById('search-make');
            const modelSelect = document.getElementById('search-model');
            const bodySelect = document.getElementById('search-body');
            const fuelSelect = document.getElementById('search-fuel');
            
            const selectedMake = makeSelect.value;
            
            // Clear model dropdown first
            modelSelect.innerHTML = '<option value="">Model (Any)</option>';
            
            if (!selectedMake) {
                // If no make selected, clear all dropdowns
                bodySelect.innerHTML = '<option value="">Body Type (Any)</option>';
                fuelSelect.innerHTML = '<option value="">Fuel (Any)</option>';
                return;
            }
            
            // Get cars for selected make
            const carsForMake = carInventory.filter(car => car.make === selectedMake);
            
            // Populate model dropdown
            const models = [...new Set(carsForMake.map(car => car.model))].sort();
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
            
            // Update body and fuel dropdowns based on selected make
            updateBodyAndFuelDropdowns();
        }

        // Handle model dropdown change
        function handleModelChange() {
            updateBodyAndFuelDropdowns();
        }

        // Update body type and fuel dropdowns based on selected filters
        function updateBodyAndFuelDropdowns() {
            const makeSelect = document.getElementById('search-make');
            const modelSelect = document.getElementById('search-model');
            const bodySelect = document.getElementById('search-body');
            const fuelSelect = document.getElementById('search-fuel');
            
            const selectedMake = makeSelect.value;
            const selectedModel = modelSelect.value;
            
            // If no make is selected, keep dropdowns empty
            if (!selectedMake) {
                bodySelect.innerHTML = '<option value="">Body Type (Any)</option>';
                fuelSelect.innerHTML = '<option value="">Fuel (Any)</option>';
                return;
            }
            
            // Filter cars based on selections
            let filteredCars = carInventory.filter(car => car.make === selectedMake);
            
            if (selectedModel) {
                filteredCars = filteredCars.filter(car => car.model === selectedModel);
            }
            
            // Get unique body types and fuel types from filtered cars
            const bodyTypes = [...new Set(filteredCars.map(car => car.body))].sort();
            const fuelTypes = [...new Set(filteredCars.map(car => car.fuel))].sort();
            
            // Update body type dropdown
            bodySelect.innerHTML = '<option value="">Body Type (Any)</option>';
            bodyTypes.forEach(body => {
                const option = document.createElement('option');
                option.value = body;
                option.textContent = body;
                bodySelect.appendChild(option);
            });
            
            // Update fuel type dropdown
            fuelSelect.innerHTML = '<option value="">Fuel (Any)</option>';
            fuelTypes.forEach(fuel => {
                const option = document.createElement('option');
                option.value = fuel;
                option.textContent = fuel;
                fuelSelect.appendChild(option);
            });
            
            console.log(`Filtered: Make=${selectedMake}, Model=${selectedModel}, Bodies=${bodyTypes}, Fuels=${fuelTypes}`);
        }

        // Add car form submission - UPDATED FOR SUPABASE
        document.getElementById('add-car-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const imageFiles = document.getElementById('car-images').files;
            if (imageFiles.length === 0) {
                alert('Please select at least one image');
                return;
            }
            
            const selectedFeatures = [];
document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
    selectedFeatures.push(checkbox.value);
});
            // Show loading message
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Uploading images and adding car...';
            submitButton.disabled = true;
            
            try {
                // Upload images to Supabase Storage
                const imageUrls = [];
                
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i];
                    const fileName = `${Date.now()}-${i}-${file.name}`;
                    
                    try {
                        const url = await uploadImageToSupabase(file, fileName);
                        imageUrls.push(url);
                    } catch (error) {
                        console.error('Failed to upload image:', error);
                        // Continue with other images
                    }
                }
                
                if (imageUrls.length === 0) {
                    alert('Failed to upload images. Please try again.');
                    return;
                }
                
                const newCar = {
                    make: document.getElementById('car-make').value,
                    model: document.getElementById('car-model').value,
                    year: parseInt(document.getElementById('car-year').value),
                    price: parseInt(document.getElementById('car-price').value),
                    body: document.getElementById('car-body').value,
                    fuel: document.getElementById('car-fuel').value,
                    mileage: parseInt(document.getElementById('car-mileage').value) || 0,
                    transmission: document.getElementById('car-transmission').value,
                    image: imageUrls[0], // First image as main
                    images: imageUrls.join(','), // All images as comma-separated string
                        features: selectedFeatures.join(','), // Store as comma-separated string
                    description: document.getElementById('car-description').value || 'No description available.'
                };
                
                // Add to Supabase
                const success = await addCarToSupabase(newCar);
                
                if (success) {
                    alert('Car added successfully!');
                    this.reset();
                    document.getElementById('image-preview').innerHTML = '';
                    showPage('inventory');
                    updateUIWithCars();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add car. Please try again.');
            } finally {
                // Reset button
                submitButton.textContent = 'Add Car';
                submitButton.disabled = false;
            }
        });

        // Handle image preview
        document.getElementById('car-images').addEventListener('change', function(e) {
            const files = e.target.files;
            const preview = document.getElementById('image-preview');
            preview.innerHTML = '';
            
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const div = document.createElement('div');
                    div.className = 'relative';
                    div.innerHTML = `
                        <img src="${e.target.result}" class="w-full h-24 object-cover rounded">
                        <span class="absolute top-0 right-0 bg-cyan-500 text-white text-xs px-2 py-1 rounded-bl">${index + 1}</span>
                    `;
                    preview.appendChild(div);
                };
                reader.readAsDataURL(file);
            });
        });

        // Delete car - UPDATED FOR SUPABASE
        async function deleteCar(carId) {
            if (!isAdminMode) {
                alert('You must be logged in as admin to delete cars!');
                return;
            }
            
            if (confirm('Are you sure you want to delete this car?')) {
                // Show loading
                const deleteButton = event.target;
                deleteButton.textContent = 'Deleting...';
                deleteButton.disabled = true;
                
                // Delete from Supabase
                const success = await deleteCarFromSupabase(carId);
                
                if (success) {
                    // Remove from local inventory
                    carInventory = carInventory.filter(car => car.id !== carId);
                    alert('Car deleted successfully!');
                    showPage('inventory');
                    updateUIWithCars();
                } else {
                    // Reset button if failed
                    deleteButton.textContent = 'Delete Car';
                    deleteButton.disabled = false;
                }
            }
        }

        // Search functionality
        function performSearch() {
            const make = document.getElementById('search-make').value;
            const model = document.getElementById('search-model').value;
            const body = document.getElementById('search-body').value;
            const fuel = document.getElementById('search-fuel').value;
            
            const results = carInventory.filter(car => {
                return (!make || car.make === make) &&
                       (!model || car.model === model) &&
                       (!body || car.body === body) &&
                       (!fuel || car.fuel === fuel);
            });
            
            const resultsGrid = document.getElementById('search-results-grid');
            if (results.length === 0) {
                resultsGrid.innerHTML = '<p class="text-center text-gray-600 col-span-4">No cars found matching your criteria.</p>';
            } else {
                resultsGrid.innerHTML = results.map(car => `
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden car-card" onclick="showCarDetail('${car.id}')">
                        <img src="${car.image}" alt="${car.make} ${car.model}" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="text-lg font-semibold">${car.make} ${car.model}</h3>
                            <p class="text-gray-600">${car.year} • ${car.fuel} • ${car.body}</p>
                            <p class="text-xl font-bold text-cyan-500 mt-2">${car.price.toLocaleString()}</p>
                        </div>
                    </div>
                `).join('');
            }
            
            showPage('search-results');
        }

        // Clear search
        function clearSearch() {
                clearMakeSelection(); // Add this line
            document.getElementById('search-make').value = '';
            document.getElementById('search-model').value = '';
            document.getElementById('search-body').value = '';
            document.getElementById('search-fuel').value = '';
            
            // Reset dropdowns
            handleMakeChange();
        }

        // Sort cars
        function sortCars(sortBy) {
            switch(sortBy) {
                case 'newest':
                    carInventory.sort((a, b) => b.year - a.year);
                    break;
                case 'price-low':
                    carInventory.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    carInventory.sort((a, b) => b.price - a.price);
                    break;
                case 'mileage-low':
                    carInventory.sort((a, b) => a.mileage - b.mileage);
                    break;
            }
            updateInventory();
        }

        // Handle sell car form submission
        document.getElementById('sell-car-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for submitting your car details! Our team will contact you soon with an offer.');
            this.reset();
            showPage('home');
        });

        // Update total cars count
        function updateTotalCars() {
            const totalCarsElement = document.getElementById('total-cars');
            if (totalCarsElement) {
                totalCarsElement.textContent = carInventory.length;
            }
        }

        // Handle contact page form submission
        function handleContactPageForm(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you within 24 hours.');
            e.target.reset();
        }

        // ==========================================
        // INITIALIZE ON PAGE LOAD
        // ==========================================
     // Replace your window.addEventListener('load', ...) at the bottom with this:

// Replace your entire window.addEventListener('load', ...) at the bottom with this:

window.addEventListener('load', function() {
    // Check admin session
    checkAdminSession();
    
    // Load cars from Supabase
    loadCarsFromSupabase();
    
    // Initialize admin UI
    updateAdminUI();
    
    // Initialize features container after a short delay to ensure DOM is ready
    setTimeout(() => {
        const featuresContainer = document.querySelector('#add-car-form .features-container');
        if (featuresContainer) {
            console.log('Initializing features on page load...');
            featuresContainer.innerHTML = generateFeaturesCheckboxes();
        }
    }, 500);
});

   
   
   