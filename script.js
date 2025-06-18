// PolyMandi Frontend JavaScript
// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';
let currentLanguage = 'hi';
let chatSessionId = generateSessionId();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadFeaturedProducts();
    loadTrendingProducts();
    initializeLanguage();
    loadCategoryCounts(); // Load category counts
    updateCartUI(); // Initialize cart UI
    setTimeout(() => showWelcomeMessage(), 1000);
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const voiceSearchBtn = document.getElementById('voiceSearch');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    searchInput.addEventListener('input', debounce(showSearchSuggestions, 300));
    
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', startVoiceSearch);
    }

    // Language selector
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function(e) {
            changeLanguage(e.target.value);
        });
    }

    // User menu dropdown
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
        
        document.addEventListener('click', function() {
            userDropdown.classList.add('hidden');
        });
    }

    // Category navigation
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterByCategory(category);
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('bg-green-50', 'text-green-600'));
            this.classList.add('bg-green-50', 'text-green-600');
        });
    });

    // Chat widget
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');

    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                chatInput.focus();
            }
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatWindow.classList.add('hidden');
        });
    }

    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendChatMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Hero section buttons
    const aiChatBtn = document.querySelector('.bg-gradient-to-r button:first-of-type');
    const becomeSellerBtn = document.querySelector('.bg-gradient-to-r button:last-of-type');
    
    if (aiChatBtn) {
        aiChatBtn.addEventListener('click', function() {
            const chatWindow = document.getElementById('chatWindow');
            if (chatWindow) {
                chatWindow.classList.remove('hidden');
                const chatInput = document.getElementById('chatInput');
                if (chatInput) chatInput.focus();
            }
        });
    }
    
    if (becomeSellerBtn) {
        becomeSellerBtn.addEventListener('click', function() {
            showSellerRegistrationModal();
        });
    }

    // Login/Register buttons
    const userMenuItems = document.querySelectorAll('#userDropdown a');
    userMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            if (action.includes('लॉगिन') || action.includes('Login')) {
                showLoginModal();
            } else if (action.includes('रजिस्टर') || action.includes('Register')) {
                showRegisterModal();
            }
        });
    });
}

// Language Management
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('polymandi_language') || 'hi';
    changeLanguage(savedLanguage);
}

function changeLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('polymandi_language', language);
    
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = language;
    }
    
    updateUIText(language);
    loadCategoryCounts(); // Reload category counts for new language
    
    // Show notification
    showNotification(getTranslation('language_changed', language), 'info');
}

function updateUIText(language) {
    const translations = {
        hi: {
            search_placeholder: 'उत्पाद खोजें... (HDPE, LDPE, PP, PVC)',
            account: 'अकाउंट',
            all_categories: 'सभी श्रेणियां',
            featured_products: 'फीचर्ड प्रोडक्ट्स',
            trending_products: 'ट्रेंडिंग प्रोडक्ट्स',
            view_all: 'सभी देखें →',
            language_changed: 'भाषा बदल दी गई'
        },
        en: {
            search_placeholder: 'Search products... (HDPE, LDPE, PP, PVC)',
            account: 'Account',
            all_categories: 'All Categories',
            featured_products: 'Featured Products',
            trending_products: 'Trending Products',
            view_all: 'View All →',
            language_changed: 'Language changed'
        },
        'hi-en': {
            search_placeholder: 'Products search kariye... (HDPE, LDPE, PP, PVC)',
            account: 'Account',
            all_categories: 'Sabhi Categories',
            featured_products: 'Featured Products',
            trending_products: 'Trending Products',
            view_all: 'Sabhi dekhen →',
            language_changed: 'Language change ho gayi'
        }
    };

    const langData = translations[language] || translations.hi;
    
    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = langData.search_placeholder;
    }
}

function getTranslation(key, language = currentLanguage) {
    const translations = {
        hi: {
            language_changed: 'भाषा बदल दी गई',
            search_error: 'खोज में त्रुटि हुई',
            loading: 'लोड हो रहा है...',
            error: 'त्रुटि',
            success: 'सफलता',
            no_products: 'कोई उत्पाद नहीं मिला',
            chat_error: 'चैट में समस्या हुई',
            voice_not_supported: 'वॉयस सर्च समर्थित नहीं है'
        },
        en: {
            language_changed: 'Language changed',
            search_error: 'Search error occurred',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            no_products: 'No products found',
            chat_error: 'Chat error occurred',
            voice_not_supported: 'Voice search not supported'
        },
        'hi-en': {
            language_changed: 'Language change ho gayi',
            search_error: 'Search mein error hua',
            loading: 'Load ho raha hai...',
            error: 'Error',
            success: 'Success',
            no_products: 'Koi products nahi mile',
            chat_error: 'Chat mein problem hui',
            voice_not_supported: 'Voice search supported nahi hai'
        }
    };

    return translations[language]?.[key] || translations.hi[key] || key;
}

// Search Functionality
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/?query=${encodeURIComponent(query)}&language=${currentLanguage}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
            displaySearchResults(data.products);
        } else {
            showNotification(getTranslation('no_products'), 'warning');
        }
    } catch (error) {
        console.error('Search error:', error);
        showNotification(getTranslation('search_error'), 'error');
        
        // Fallback to mock search results for development
        displaySearchResults([
            {
                id: 1,
                name_hi: `${query} - खोज परिणाम`,
                name_en: `${query} - Search Result`,
                name_hinglish: `${query} - Search Result`,
                description_hi: 'खोज के आधार पर मिला उत्पाद',
                description_en: 'Product found based on search',
                description_hinglish: 'Search ke basis par mila product',
                price_per_kg: 85.00,
                minimum_order_kg: 100,
                tags: ['Search', 'Result'],
                image_urls: ['https://images.unsplash.com/photo-1567789884554-0b844b597180?w=300']
            }
        ]);
    } finally {
        showLoading(false);
    }
}

function showSearchSuggestions(query) {
    if (!query || typeof query !== 'string' || query.length < 2) {
        hideSearchSuggestions();
        return;
    }
    
    // Mock suggestions - in real app, fetch from API
    const suggestions = [
        'HDPE Natural Granules',
        'LDPE Transparent Granules',
        'PP Homopolymer',
        'PVC Rigid Granules',
        'Recycled PET Granules'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
    
    displaySearchSuggestions(suggestions);
}

function displaySearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    // Clear existing suggestions
    suggestionsContainer.innerHTML = '';
    
    if (suggestions.length === 0) {
        suggestionsContainer.classList.add('hidden');
        return;
    }
    
    // Populate suggestions
    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm';
        suggestionDiv.textContent = suggestion;
        suggestionDiv.addEventListener('click', function() {
            document.getElementById('searchInput').value = suggestion;
            hideSearchSuggestions();
            performSearch();
        });
        suggestionsContainer.appendChild(suggestionDiv);
    });
    
    suggestionsContainer.classList.remove('hidden');
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('hidden');
    }
}

// Category counts based on mock data
function getCategoryCounts() {
    // Return realistic counts as specified in requirements
    const baseCounts = {
        'HDPE': 120,
        'LDPE': 85,
        'PP': 95,
        'PVC': 70,
        'PET': 45,
        'Recycled': 200
    };
    
    return baseCounts;
}

// Load and update category counts
async function loadCategoryCounts() {
    try {
        // Try to get real counts from API
        const response = await fetch(`${API_BASE_URL}/products/categories/counts`);
        if (response.ok) {
            const counts = await response.json();
            updateCategoryDisplay(counts);
            return;
        }
    } catch (error) {
        console.log('Using mock category counts');
    }
    
    // Fallback to mock counts
    const counts = getCategoryCounts();
    updateCategoryDisplay(counts);
}

function updateCategoryDisplay(counts) {
    const categoryNames = {
        hi: {
            'HDPE': 'HDPE',
            'LDPE': 'LDPE', 
            'PP': 'PP',
            'PVC': 'PVC',
            'PET': 'PET',
            'Recycled': 'रीसाइकल्ड'
        },
        en: {
            'HDPE': 'HDPE',
            'LDPE': 'LDPE',
            'PP': 'PP', 
            'PVC': 'PVC',
            'PET': 'PET',
            'Recycled': 'Recycled'
        }
    };
    
    const names = categoryNames[currentLanguage] || categoryNames.hi;
    
    // Update category links with counts
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        const category = link.dataset.category;
        if (category && category !== 'all' && counts[category]) {
            const span = link.querySelector('span');
            if (span) {
                const count = counts[category];
                const productText = currentLanguage === 'hi' ? 'प्रोडक्ट्स' : 'Products';
                span.innerHTML = `${names[category] || category}<br><small class="text-xs opacity-75">${count}+ ${productText}</small>`;
            }
        }
    });
}

// Additional utility functions

// Filter by category functionality
function filterByCategory(category) {
    const allProducts = getAllMockProducts();
    let filteredProducts = allProducts;
    
    if (category && category !== 'all') {
        filteredProducts = allProducts.filter(product => 
            product.category === category
        );
    }
    
    // Display filtered products in both featured and trending sections
    displayProducts(filteredProducts.slice(0, 8), 'featuredProducts');
    displayProducts(filteredProducts.slice(8, 16), 'trendingProducts');
    
    // Update section titles
    const featuredTitle = document.querySelector('#featuredProducts').previousElementSibling?.querySelector('h2');
    const trendingTitle = document.querySelector('#trendingProducts').previousElementSibling?.querySelector('h2');
    
    if (featuredTitle && trendingTitle) {
        const categoryName = category === 'all' ? 
            (currentLanguage === 'hi' ? 'सभी प्रोडक्ट्स' : 'All Products') :
            category;
            
        featuredTitle.textContent = currentLanguage === 'hi' ? 
            `${categoryName} - फीचर्ड` : `${categoryName} - Featured`;
        trendingTitle.textContent = currentLanguage === 'hi' ? 
            `${categoryName} - ट्रेंडिंग` : `${categoryName} - Trending`;
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Loading functions
function showLoading(show = true) {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        if (show) {
            loadingModal.classList.remove('hidden');
        } else {
            loadingModal.classList.add('hidden');
        }
    }
}

// Search results display
function displaySearchResults(products) {
    const resultsContainer = document.createElement('div');
    resultsContainer.innerHTML = `
        <div class="container mx-auto px-4 py-8">
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 class="text-2xl font-bold mb-4">
                    ${currentLanguage === 'hi' ? 'खोज परिणाम' : 'Search Results'}
                    <span class="text-sm font-normal text-gray-500">(${products.length} ${currentLanguage === 'hi' ? 'परिणाम' : 'results'})</span>
                </h2>
                <div id="searchResults" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                </div>
            </div>
        </div>
    `;
    
    // Insert results after hero section
    const heroSection = document.querySelector('.hero-section') || document.querySelector('main').firstElementChild;
    if (heroSection && heroSection.nextElementSibling) {
        heroSection.parentNode.insertBefore(resultsContainer, heroSection.nextElementSibling);
    } else if (heroSection) {
        heroSection.parentNode.appendChild(resultsContainer);
    }
    
    // Display products in search results
    displayProducts(products, 'searchResults');
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('hidden');
    }
}

// Voice search functionality
function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification(getTranslation('voice_not_supported'), 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    recognition.maxAlternatives = 1;
    
    recognition.onstart = function() {
        const voiceBtn = document.getElementById('voiceSearch');
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash text-red-500"></i>';
        }
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = transcript;
            performSearch();
        }
    };
    
    recognition.onend = function() {
        const voiceBtn = document.getElementById('voiceSearch');
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    };
    
    recognition.onerror = function(event) {
        showNotification('Voice search error: ' + event.error, 'error');
        const voiceBtn = document.getElementById('voiceSearch');
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    };
    
    recognition.start();
}

// Chat functionality
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput?.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            currentLanguage === 'hi' ? 
                'नमस्ते! मैं आपकी प्लास्टिक ग्रेन्यूल्स की जरूरतों में मदद कर सकता हूं।' :
                'Hello! I can help you with your plastic granules requirements.',
            currentLanguage === 'hi' ? 
                'कृपया बताएं आप किस प्रकार के प्लास्टिक की तलाश में हैं - HDPE, LDPE, PP, PVC, या PET?' :
                'Please let me know what type of plastic you are looking for - HDPE, LDPE, PP, PVC, or PET?',
            currentLanguage === 'hi' ? 
                'हमारे पास सर्वोत्तम गुणवत्ता के ग्रेन्यूल्स उपलब्ध हैं। क्या आपका कोई विशिष्ट आवश्यकता है?' :
                'We have the best quality granules available. Do you have any specific requirements?'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'ai');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`;
    
    messageDiv.innerHTML = `
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            sender === 'user' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-800'
        }">
            <p class="text-sm">${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show welcome message
function showWelcomeMessage() {
    const welcomeMessage = currentLanguage === 'hi' ? 
        'PolyMandi में आपका स्वागत है! AI चैट के लिए क्लिक करें।' :
        'Welcome to PolyMandi! Click for AI chat assistance.';
        
    showNotification(welcomeMessage, 'info');
}

// Debounce function for search suggestions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generate session ID
function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Product Loading
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/featured/list?limit=8`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products, 'featuredProducts');
    } catch (error) {
        console.log('Using mock featured products');
        displayMockProducts('featuredProducts');
    }
}

async function loadTrendingProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/trending/list?limit=8`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products, 'trendingProducts');
    } catch (error) {
        console.log('Using mock trending products');
        displayMockProducts('trendingProducts');
    }
}

function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card animate-fade-in-up';
    
    const nameField = currentLanguage === 'hi' ? 'name_hi' : 
                     currentLanguage === 'hi-en' ? 'name_hinglish' : 'name_en';
    const descField = currentLanguage === 'hi' ? 'description_hi' : 
                     currentLanguage === 'hi-en' ? 'description_hinglish' : 'description_en';
    
    const productName = product[nameField] || product.name_en || 'Product Name';
    const productDesc = product[descField] || product.description_en || 'Product Description';
    
    card.innerHTML = `
        <div class="relative">
            <img src="${product.image_urls?.[0] || 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=300'}" 
                 alt="${productName}" 
                 class="product-image w-full">
            ${product.is_featured ? '<div class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">Featured</div>' : ''}
            ${product.is_trending ? '<div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">Trending</div>' : ''}
        </div>
        <div class="p-4">
            <h3 class="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">${productName}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-3">${productDesc}</p>
            <div class="flex flex-wrap gap-1 mb-3">
                ${(product.tags || []).slice(0, 3).map(tag => `<span class="product-tag">#${tag}</span>`).join('')}
            </div>
            <div class="flex items-center justify-between">
                <div class="price-badge">₹${product.price_per_kg}/kg</div>
                <div class="text-sm text-gray-500">Min: ${product.minimum_order_kg}kg</div>
            </div>
            <div class="mt-3 flex space-x-2">
                <button class="btn-primary flex-1 text-sm py-2" onclick="viewProduct(${product.id})">
                    ${currentLanguage === 'hi' ? 'देखें' : 'View'}
                </button>
                <button class="btn-secondary text-sm py-2 px-4" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Mock data for development
function getAllMockProducts() {
    return [
        {
            id: 1,
            name_hi: 'प्रीमियम HDPE ग्रेन्यूल्स',
            name_en: 'Premium HDPE Granules',
            name_hinglish: 'Premium HDPE Granules',
            description_hi: 'उच्च गुणवत्ता वाले HDPE ग्रेन्यूल्स। प्लास्टिक बैग, बोतल और पाइप बनाने के लिए आदर्श।',
            description_en: 'High-quality HDPE granules. Ideal for making plastic bags, bottles and pipes.',
            description_hinglish: 'High-quality HDPE granules. Plastic bags, bottles aur pipes banane ke liye ideal.',
            price_per_kg: 85.00,
            minimum_order_kg: 100,
            category: 'HDPE',
            tags: ['HDPE', 'Premium', 'High Quality'],
            image_urls: ['https://images.unsplash.com/photo-1567789884554-0b844b597180?w=500'],
            is_featured: true,
            is_trending: false,
            company_name: 'PlasticCorp India',
            company_location: 'Mumbai, Maharashtra',
            company_rating: 4.5,
            seller_contact: '+91-9876543210',
            availability: 'In Stock',
            specifications: {
                'Density': '0.95 g/cm³',
                'Melt Index': '2.5 g/10min',
                'Tensile Strength': '25 MPa',
                'Color': 'Natural/White'
            }
        },
        {
            id: 2,
            name_hi: 'इको-फ्रेंडली LDPE',
            name_en: 'Eco-Friendly LDPE',
            name_hinglish: 'Eco-Friendly LDPE',
            description_hi: 'पर्यावरण के अनुकूल LDPE ग्रेन्यूल्स। फिल्म और फ्लेक्सिबल पैकेजिंग के लिए बेहतरीन।',
            description_en: 'Environment-friendly LDPE granules. Excellent for films and flexible packaging.',
            description_hinglish: 'Environment-friendly LDPE granules. Films aur flexible packaging ke liye excellent.',
            price_per_kg: 78.50,
            minimum_order_kg: 150,
            category: 'LDPE',
            tags: ['LDPE', 'Eco-Friendly', 'Films'],
            image_urls: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=500'],
            is_featured: false,
            is_trending: true,
            company_name: 'Green Plastics Ltd',
            company_location: 'Pune, Maharashtra',
            company_rating: 4.3,
            seller_contact: '+91-8765432109',
            availability: 'In Stock',
            specifications: {
                'Density': '0.92 g/cm³',
                'Melt Index': '4.0 g/10min',
                'Tensile Strength': '12 MPa',
                'Color': 'Natural'
            }
        },
        {
            id: 3,
            name_hi: 'इंडस्ट्रियल PP ग्रेड',
            name_en: 'Industrial PP Grade',
            name_hinglish: 'Industrial PP Grade',
            description_hi: 'औद्योगिक उपयोग के लिए PP ग्रेन्यूल्स। कंटेनर और ऑटो पार्ट्स के लिए मजबूत।',
            description_en: 'PP granules for industrial use. Strong for containers and auto parts.',
            description_hinglish: 'Industrial use ke liye PP granules. Containers aur auto parts ke liye strong.',
            price_per_kg: 92.00,
            minimum_order_kg: 200,
            category: 'PP',
            tags: ['PP', 'Industrial', 'Container'],
            image_urls: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500'],
            is_featured: true,
            is_trending: true,
            company_name: 'Industrial Polymers',
            company_location: 'Chennai, Tamil Nadu',
            company_rating: 4.7,
            seller_contact: '+91-7654321098',
            availability: 'In Stock',
            specifications: {
                'Density': '0.90 g/cm³',
                'Melt Index': '12 g/10min',
                'Tensile Strength': '35 MPa',
                'Color': 'Natural/Black'
            }
        },
        {
            id: 4,
            name_hi: 'मेडिकल ग्रेड PVC',
            name_en: 'Medical Grade PVC',
            name_hinglish: 'Medical Grade PVC',
            description_hi: 'मेडिकल उपकरण के लिए विशेष PVC ग्रेन्यूल्स। उच्च शुद्धता और सुरक्षा।',
            description_en: 'Special PVC granules for medical equipment. High purity and safety.',
            description_hinglish: 'Medical equipment ke liye special PVC granules. High purity aur safety.',
            price_per_kg: 95.00,
            minimum_order_kg: 50,
            category: 'PVC',
            tags: ['PVC', 'Medical', 'High Purity'],
            image_urls: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'],
            is_featured: false,
            is_trending: false,
            company_name: 'MedPoly Solutions',
            company_location: 'Hyderabad, Telangana',
            company_rating: 4.8,
            seller_contact: '+91-6543210987',
            availability: 'Limited Stock',
            specifications: {
                'Density': '1.38 g/cm³',
                'Shore Hardness': 'A85',
                'Tensile Strength': '52 MPa',
                'Color': 'Clear/White'
            }
        },
        {
            id: 5,
            name_hi: 'फूड ग्रेड PET',
            name_en: 'Food Grade PET',
            name_hinglish: 'Food Grade PET',
            description_hi: 'खाद्य पैकेजिंग के लिए सुरक्षित PET ग्रेन्यूल्स। FDA अप्रूव्ड।',
            description_en: 'Safe PET granules for food packaging. FDA approved.',
            description_hinglish: 'Food packaging ke liye safe PET granules. FDA approved.',
            price_per_kg: 105.00,
            minimum_order_kg: 100,
            category: 'PET',
            tags: ['PET', 'Food Grade', 'FDA Approved'],
            image_urls: ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500'],
            is_featured: true,
            is_trending: false,
            company_name: 'SafePack Polymers',
            company_location: 'Delhi, NCR',
            company_rating: 4.6,
            seller_contact: '+91-5432109876',
            availability: 'In Stock',
            specifications: {
                'Density': '1.38 g/cm³',
                'Intrinsic Viscosity': '0.85 dl/g',
                'Acetaldehyde': '<1 ppm',
                'Color': 'Crystal Clear'
            }
        },        {
            id: 6,
            name_hi: 'रीसाइकल्ड प्लास्टिक मिक्स',
            name_en: 'Recycled Plastic Mix',
            name_hinglish: 'Recycled Plastic Mix',
            description_hi: 'पर्यावरण के लिए अच्छे रीसाइकल्ड प्लास्टिक ग्रेन्यूल्स। कम कीमत में गुणवत्ता।',
            description_en: 'Environment-friendly recycled plastic granules. Quality at lower cost.',
            description_hinglish: 'Environment ke liye acche recycled plastic granules. Kam price mein quality.',
            price_per_kg: 45.00,
            minimum_order_kg: 500,
            category: 'Recycled',
            tags: ['Recycled', 'Eco-Friendly', 'Budget'],
            image_urls: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500'],
            is_featured: false,
            is_trending: true,
            company_name: 'EcoRecycle India',
            company_location: 'Bangalore, Karnataka',
            company_rating: 4.2,
            seller_contact: '+91-4321098765',
            availability: 'In Stock',
            specifications: {
                'Mixed Content': 'HDPE 40%, LDPE 30%, PP 30%',
                'Contamination Level': '<2%',
                'Moisture Content': '<0.5%',
                'Color': 'Mixed Colors'
            }
        },
        {
            id: 7,
            name_hi: 'हाई इंपैक्ट HDPE',
            name_en: 'High Impact HDPE',
            name_hinglish: 'High Impact HDPE',
            description_hi: 'मजबूत और टिकाऊ HDPE ग्रेन्यूल्स। औद्योगिक उपयोग के लिए आदर्श।',
            description_en: 'Strong and durable HDPE granules. Ideal for industrial applications.',
            description_hinglish: 'Strong aur durable HDPE granules. Industrial applications ke liye ideal.',
            price_per_kg: 88.00,
            minimum_order_kg: 200,
            category: 'HDPE',
            tags: ['HDPE', 'High Impact', 'Industrial'],
            image_urls: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=500'],
            is_featured: true,
            is_trending: false,
            company_name: 'Heavy Duty Plastics',
            company_location: 'Surat, Gujarat',
            company_rating: 4.4,
            seller_contact: '+91-3210987654',
            availability: 'In Stock',
            specifications: {
                'Density': '0.96 g/cm³',
                'Impact Strength': 'High',
                'Tensile Strength': '28 MPa',
                'Color': 'Black/Natural'
            }
        },
        {
            id: 8,
            name_hi: 'फ्लेक्सिबल LDPE फिल्म',
            name_en: 'Flexible LDPE Film Grade',
            name_hinglish: 'Flexible LDPE Film Grade',
            description_hi: 'फ्लेक्सिबल पैकेजिंग के लिए विशेष LDPE ग्रेन्यूल्स। उत्कृष्ट स्ट्रेच गुण।',
            description_en: 'Special LDPE granules for flexible packaging. Excellent stretch properties.',
            description_hinglish: 'Flexible packaging ke liye special LDPE granules. Excellent stretch properties.',
            price_per_kg: 82.00,
            minimum_order_kg: 100,
            category: 'LDPE',
            tags: ['LDPE', 'Film Grade', 'Flexible'],
            image_urls: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'],
            is_featured: false,
            is_trending: true,
            company_name: 'FlexiPack Solutions',
            company_location: 'Ahmedabad, Gujarat',
            company_rating: 4.6,
            seller_contact: '+91-2109876543',
            availability: 'In Stock',
            specifications: {
                'Density': '0.918 g/cm³',
                'Melt Index': '2.0 g/10min',
                'Dart Impact': '150 g',
                'Color': 'Natural/Clear'
            }
        }
    ];
}

// Product detail modal functions
function viewProduct(productId) {
    const product = getAllMockProducts().find(p => p.id == productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    showProductDetailModal(product);
}

function showProductDetailModal(product) {
    const nameField = currentLanguage === 'hi' ? 'name_hi' : 
                     currentLanguage === 'hi-en' ? 'name_hinglish' : 'name_en';
    const descField = currentLanguage === 'hi' ? 'description_hi' : 
                     currentLanguage === 'hi-en' ? 'description_hinglish' : 'description_en';
    
    const productName = product[nameField] || product.name_en;
    const productDesc = product[descField] || product.description_en;
    
    const texts = {
        hi: {
            specifications: 'विशिष्टताएं',
            seller: 'विक्रेता',
            rating: 'रेटिंग',
            location: 'स्थान',
            contact: 'संपर्क',
            availability: 'उपलब्धता',
            quantity: 'मात्रा (kg)',
            addToCart: 'कार्ट में जोड़ें',
            buyNow: 'अभी खरीदें',
            contactSeller: 'विक्रेता से संपर्क करें',
            close: 'बंद करें'
        },
        en: {
            specifications: 'Specifications',
            seller: 'Seller',
            rating: 'Rating',
            location: 'Location',
            contact: 'Contact',
            availability: 'Availability',
            quantity: 'Quantity (kg)',
            addToCart: 'Add to Cart',
            buyNow: 'Buy Now',
            contactSeller: 'Contact Seller',
            close: 'Close'
        }
    };
    
    const t = texts[currentLanguage] || texts.en;
    
    const modalHTML = `
        <div id="productDetailModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-2xl font-bold text-gray-800">${productName}</h2>
                        <button onclick="closeProductDetailModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <img src="${product.image_urls?.[0] || 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=500'}" 
                                 alt="${productName}" 
                                 class="w-full h-64 object-cover rounded-lg">
                            

                            <div class="mt-4">
                                <h3 class="font-semibold text-lg mb-2">${t.specifications}</h3>
                                <div class="space-y-2">
                                    ${Object.entries(product.specifications || {}).map(([key, value]) => `
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">${key}:</span>
                                            <span class="font-medium">${value}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                                <p class="text-gray-700 mb-4">${productDesc}</p>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-2xl font-bold text-green-600">₹${product.price_per_kg}/kg</span>
                                    <span class="text-sm text-gray-500">Min: ${product.minimum_order_kg}kg</span>
                                </div>
                                <div class="flex flex-wrap gap-1 mb-4">
                                    ${(product.tags || []).map(tag => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">#${tag}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div class="border-t pt-4 mb-4">
                                <h3 class="font-semibold text-lg mb-2">${t.seller}</h3>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Company:</span>
                                        <span class="font-medium">${product.company_name}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">${t.rating}:</span>
                                        <span class="flex items-center">
                                            <span class="font-medium">${product.company_rating}</span>
                                            <i class="fas fa-star text-yellow-400 ml-1"></i>
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">${t.location}:</span>
                                        <span class="font-medium">${product.company_location}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">${t.availability}:</span>
                                        <span class="font-medium text-green-600">${product.availability}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">${t.quantity}</label>
                                    <input type="number" id="productQuantity" value="${product.minimum_order_kg}" 
                                           min="${product.minimum_order_kg}" class="w-full border rounded-lg px-3 py-2">
                                </div>
                                
                                <div class="grid grid-cols-2 gap-3">
                                    <button onclick="addToCartFromModal(${product.id})" class="btn-secondary">
                                        <i class="fas fa-cart-plus mr-2"></i>${t.addToCart}
                                    </button>
                                    <button onclick="buyNowFromModal(${product.id})" class="btn-primary">
                                        <i class="fas fa-shopping-bag mr-2"></i>${t.buyNow}
                                    </button>
                                </div>
                                
                                <button onclick="contactSellerFromModal('${product.seller_contact}')" 
                                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    <i class="fas fa-phone mr-2"></i>${t.contactSeller}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('productDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeProductDetailModal() {
    const modal = document.getElementById('productDetailModal');
    if (modal) {
        modal.remove();
    }
}

function addToCartFromModal(productId) {
    const quantity = document.getElementById('productQuantity')?.value || 1;
    addToCart(productId, parseInt(quantity));
    showNotification(
        currentLanguage === 'hi' ? 'कार्ट में जोड़ा गया' : 'Added to cart', 
        'success'
    );
}

function buyNowFromModal(productId) {
    const quantity = document.getElementById('productQuantity')?.value || 1;
    addToCart(productId, parseInt(quantity));
    closeProductDetailModal();
    showNotification(
        currentLanguage === 'hi' ? 'ऑर्डर प्रक्रिया शुरू की गई' : 'Order process initiated', 
        'success'
    );
    // Here you would redirect to checkout or open checkout modal
}

function contactSellerFromModal(phoneNumber) {
    const message = currentLanguage === 'hi' ? 
        'नमस्ते, मुझे आपके प्रोडक्ट में रुचि है।' : 
        'Hello, I am interested in your product.';
    
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('polymandi_cart')) || [];

function addToCart(productId, quantity = 1) {
    const product = getAllMockProducts().find(p => p.id == productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name_en,
            price: product.price_per_kg,
            quantity: quantity,
            image: product.image_urls?.[0]
        });
    }
    
    localStorage.setItem('polymandi_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartBadge = document.querySelector('.cart-badge');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

// Modal functions for login, register, etc.
function showLoginModal() {
    const modalHTML = `
        <div id="loginModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">
                        ${currentLanguage === 'hi' ? 'लॉगिन' : 'Login'}
                    </h2>
                    <button onclick="closeModal('loginModal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form onsubmit="handleLogin(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'फोन नंबर/ईमेल' : 'Phone/Email'}
                        </label>
                        <input type="text" id="loginEmail" required 
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="${currentLanguage === 'hi' ? 'आपका फोन नंबर या ईमेल' : 'Your phone or email'}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'पासवर्ड' : 'Password'}
                        </label>
                        <input type="password" id="loginPassword" required 
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="${currentLanguage === 'hi' ? 'आपका पासवर्ड' : 'Your password'}">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input type="checkbox" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                            <span class="ml-2 text-sm text-gray-600">
                                ${currentLanguage === 'hi' ? 'मुझे याद रखें' : 'Remember me'}
                            </span>
                        </label>
                        <a href="#" class="text-sm text-green-600 hover:text-green-800">
                            ${currentLanguage === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                        </a>
                    </div>
                    
                    <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        ${currentLanguage === 'hi' ? 'लॉगिन करें' : 'Login'}
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        ${currentLanguage === 'hi' ? 'अकाउंट नहीं है?' : "Don't have an account?"}
                        <button onclick="closeModal('loginModal'); showRegisterModal();" class="text-green-600 hover:text-green-800 font-medium">
                            ${currentLanguage === 'hi' ? 'रजिस्टर करें' : 'Register'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showRegisterModal() {
    const modalHTML = `
        <div id="registerModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">
                        ${currentLanguage === 'hi' ? 'रजिस्टर करें' : 'Register'}
                    </h2>
                    <button onclick="closeModal('registerModal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form onsubmit="handleRegister(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'पूरा नाम' : 'Full Name'}
                        </label>
                        <input type="text" id="registerName" required 
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="${currentLanguage === 'hi' ? 'आपका पूरा नाम' : 'Your full name'}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                        </label>
                        <input type="tel" id="registerPhone" required 
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="${currentLanguage === 'hi' ? '+91 XXXXXXXXXX' : '+91 XXXXXXXXXX'}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'ईमेल' : 'Email'}
                        </label>
                        <input type="email" id="registerEmail" required 
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="${currentLanguage === 'hi' ? 'आपका ईमेल' : 'Your email'}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'पासवर्ड' : 'Password'}
                        </label>
                        <input type="password" id="registerPassword" required 
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="${currentLanguage === 'hi' ? 'मजबूत पासवर्ड बनाएं' : 'Create strong password'}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'उपयोगकर्ता प्रकार' : 'User Type'}
                        </label>
                        <select id="registerUserType" required 
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="buyer">${currentLanguage === 'hi' ? 'खरीदार' : 'Buyer'}</option>
                            <option value="seller">${currentLanguage === 'hi' ? 'विक्रेता' : 'Seller'}</option>
                        </select>
                    </div>
                    
                    <div class="flex items-center">
                        <input type="checkbox" id="agreeTerms" required class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="agreeTerms" class="ml-2 text-sm text-gray-600">
                            ${currentLanguage === 'hi' ? 'मैं नियम और शर्तों से सहमत हूं' : 'I agree to terms and conditions'}
                        </label>
                    </div>
                    
                    <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        ${currentLanguage === 'hi' ? 'रजिस्टर करें' : 'Register'}
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        ${currentLanguage === 'hi' ? 'पहले से अकाउंट है?' : 'Already have an account?'}
                        <button onclick="closeModal('registerModal'); showLoginModal();" class="text-green-600 hover:text-green-800 font-medium">
                            ${currentLanguage === 'hi' ? 'लॉगिन करें' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showSellerRegistrationModal() {
    const modalHTML = `
        <div id="sellerModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">
                        ${currentLanguage === 'hi' ? 'विक्रेता के रूप में रजिस्टर करें' : 'Register as Seller'}
                    </h2>
                    <button onclick="closeModal('sellerModal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form onsubmit="handleSellerRegistration(event)" class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                ${currentLanguage === 'hi' ? 'कंपनी का नाम' : 'Company Name'}
                            </label>
                            <input type="text" id="companyName" required 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="${currentLanguage === 'hi' ? 'आपकी कंपनी का नाम' : 'Your company name'}">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                ${currentLanguage === 'hi' ? 'संपर्क व्यक्ति' : 'Contact Person'}
                            </label>
                            <input type="text" id="contactPerson" required 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="${currentLanguage === 'hi' ? 'संपर्क व्यक्ति का नाम' : 'Contact person name'}">
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                ${currentLanguage === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                            </label>
                            <input type="tel" id="sellerPhone" required 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="${currentLanguage === 'hi' ? '+91 XXXXXXXXXX' : '+91 XXXXXXXXXX'}">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                ${currentLanguage === 'hi' ? 'ईमेल' : 'Email'}
                            </label>
                            <input type="email" id="sellerEmail" required 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="${currentLanguage === 'hi' ? 'कंपनी ईमेल' : 'Company email'}">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'पूरा पता' : 'Complete Address'}
                        </label>
                        <textarea id="sellerAddress" required rows="3"
                                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="${currentLanguage === 'hi' ? 'कंपनी का पूरा पता' : 'Complete company address'}"></textarea>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                ${currentLanguage === 'hi' ? 'राज्य' : 'State'}
                            </label>
                            <select id="sellerState" required 
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">${currentLanguage === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
                                <option value="maharashtra">Maharashtra</option>
                                <option value="gujarat">Gujarat</option>
                                <option value="tamil-nadu">Tamil Nadu</option>
                                <option value="karnataka">Karnataka</option>
                                <option value="delhi">Delhi</option>
                                <option value="punjab">Punjab</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                ${currentLanguage === 'hi' ? 'GST नंबर' : 'GST Number'}
                            </label>
                            <input type="text" id="gstNumber" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   placeholder="${currentLanguage === 'hi' ? 'GST नंबर (वैकल्पिक)' : 'GST Number (optional)'}">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ${currentLanguage === 'hi' ? 'उत्पाद श्रेणियां' : 'Product Categories'}
                        </label>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <label class="flex items-center">
                                <input type="checkbox" name="categories" value="HDPE" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <span class="ml-2 text-sm">HDPE</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="categories" value="LDPE" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <span class="ml-2 text-sm">LDPE</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="categories" value="PP" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <span class="ml-2 text-sm">PP</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="categories" value="PVC" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <span class="ml-2 text-sm">PVC</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="categories" value="PET" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <span class="ml-2 text-sm">PET</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="categories" value="Recycled" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <span class="ml-2 text-sm">${currentLanguage === 'hi' ? 'रीसाइकल्ड' : 'Recycled'}</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="flex items-center">
                        <input type="checkbox" id="sellerAgreeTerms" required class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                        <label for="sellerAgreeTerms" class="ml-2 text-sm text-gray-600">
                            ${currentLanguage === 'hi' ? 'मैं विक्रेता नियम और शर्तों से सहमत हूं' : 'I agree to seller terms and conditions'}
                        </label>
                    </div>
                    
                    <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        ${currentLanguage === 'hi' ? 'विक्रेता के रूप में रजिस्टर करें' : 'Register as Seller'}
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        ${currentLanguage === 'hi' ? 'सामान्य अकाउंट चाहिए?' : 'Need a regular account?'}
                        <button onclick="closeModal('sellerModal'); showRegisterModal();" class="text-green-600 hover:text-green-800 font-medium">
                            ${currentLanguage === 'hi' ? 'यहां रजिस्टर करें' : 'Register here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Fix the displayMockProducts function closure issue
function displayMockProducts(containerId) {
    const mockProducts = getAllMockProducts().slice(0, 8); // Get first 8 products
    displayProducts(mockProducts, containerId);
}
