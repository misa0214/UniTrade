let items = [];
let messages = {};
let currentChatUser = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeBackToTop();
    initializeNavbar();
    updateItemsDisplay();
    
    // Show welcome message
    showToast('Welcome to UniTrade Campus Marketplace!', 'success');
});

// Show/hide items based on current array
function updateItemsDisplay() {
    const grid = document.getElementById('itemsGrid');
    
    if (items.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="bi bi-box-seam"></i>
                    <h4>No items yet</h4>
                    <p>Be the first to post an item for sale!</p>
                    <button class="btn btn-gradient mt-3" onclick="showPostAd()">
                        <i class="bi bi-plus-circle me-2"></i>Post First Ad
                    </button>
                </div>
            </div>
        `;
    } else {
        grid.innerHTML = items.map(item => `
            <div class="col-lg-4 col-md-6">
                <div class="item-card" onclick="showItemDetails(${item.id})">
                    <div class="item-image">
                        <i class="bi bi-${getIconByCategory(item.category)}"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-price">$${item.price}</div>
                        <div class="item-title">${item.title}</div>
                        <div class="mt-2">
                            <span class="item-condition">${item.condition}</span>
                            <span class="seller-badge">${item.seller}</span>
                        </div>
                        <div class="mt-2">
                            <small class="text-secondary">
                                <i class="bi bi-geo-alt me-1"></i>${item.location || 'Campus'}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Get icon based on category
function getIconByCategory(category) {
    const icons = {
        'textbooks': 'book',
        'electronics': 'laptop',
        'furniture': 'house',
        'fashion': 'bag',
        'sports': 'bicycle'
    };
    return icons[category] || 'box';
}

// Post Ad Function
function showPostAd() {
    Swal.fire({
        title: 'Post New Ad',
        html: `
            <form id="postAdForm" class="text-start">
                <div class="mb-3">
                    <label for="itemTitle" class="form-label">Item Title</label>
                    <input type="text" class="form-control" id="itemTitle" required placeholder="e.g., Calculus Textbook 3rd Edition">
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemPrice" class="form-label">Price ($)</label>
                        <input type="number" class="form-control" id="itemPrice" required min="1" placeholder="25">
                    </div>
                    <div class="col-md-6">
                        <label for="itemCategory" class="form-label">Category</label>
                        <select class="form-select" id="itemCategory" required>
                            <option value="">Select Category</option>
                            <option value="textbooks">Textbooks</option>
                            <option value="electronics">Electronics</option>
                            <option value="furniture">Furniture</option>
                            <option value="fashion">Fashion</option>
                            <option value="sports">Sports</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="itemCondition" class="form-label">Condition</label>
                    <select class="form-select" id="itemCondition" required>
                        <option value="">Select Condition</option>
                        <option value="Like New">Like New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="itemDescription" class="form-label">Description</label>
                    <textarea class="form-control" id="itemDescription" rows="3" required placeholder="Describe the item, its condition, and any important details..."></textarea>
                </div>
                
                <div class="mb-3">
                    <label for="sellerName" class="form-label">Your Name</label>
                    <input type="text" class="form-control" id="sellerName" required placeholder="John D.">
                </div>
                
                <div class="mb-3">
                    <label for="contactMethod" class="form-label">Preferred Contact Method</label>
                    <select class="form-select" id="contactMethod" required>
                        <option value="">Select Contact Method</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="Campus Chat">Campus Chat</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="meetupLocation" class="form-label">Preferred Meetup Location</label>
                    <select class="form-select" id="meetupLocation">
                        <option value="Campus Library">Campus Library</option>
                        <option value="Student Center">Student Center</option>
                        <option value="Collection Desk">Collection Desk</option>
                        <option value="Other">Other (specify in description)</option>
                    </select>
                </div>
                
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-gradient">
                        <i class="bi bi-plus-circle me-2"></i>Post Ad
                    </button>
                </div>
            </form>
        `,
        width: '600px',
        background: 'var(--dark-surface)',
        color: 'var(--text-primary)',
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            document.getElementById('postAdForm').addEventListener('submit', function(e) {
                e.preventDefault();
                submitPostAd();
            });
        }
    });
}

// Submit Post Ad
function submitPostAd() {
    const form = document.getElementById('postAdForm');
    const formData = new FormData(form);
    
    const newItem = {
        id: Date.now(),
        title: document.getElementById('itemTitle').value,
        price: document.getElementById('itemPrice').value,
        category: document.getElementById('itemCategory').value,
        condition: document.getElementById('itemCondition').value,
        description: document.getElementById('itemDescription').value,
        seller: document.getElementById('sellerName').value,
        contactMethod: document.getElementById('contactMethod').value,
        location: document.getElementById('meetupLocation').value,
        createdAt: new Date().toLocaleDateString()
    };
    
    // Add to items array
    items.unshift(newItem);
    
    // Update display
    updateItemsDisplay();
    
    // Close modal and show success
    Swal.close();
    showToast('Item posted successfully! Your ad is now live.', 'success');
}

// Browse Items
function showBrowse() {
    const itemsHtml = items.length > 0 ? items.map(item => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card bg-dark border-secondary h-100" onclick="showItemDetails(${item.id})">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title">${item.title}</h6>
                        <span class="badge bg-primary">${item.category}</span>
                    </div>
                    <p class="card-text text-success fs-5 mb-2">${item.price}</p>
                    <p class="card-text">${item.description.substring(0, 80)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${item.condition} • ${item.seller}</small>
                        <small class="text-info">${item.location}</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('') : '<div class="col-12 text-center"><p>No items found. Post the first ad!</p></div>';

    Swal.fire({
        title: 'Browse Items',
        html: `
            <div class="text-start">
                <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Search items..." id="browseSearch">
                </div>
                <div class="row g-3" id="browseItemsGrid">
                    ${itemsHtml}
                </div>
            </div>
        `,
        width: '90%',
        background: 'var(--dark-surface)',
        color: 'var(--text-primary)',
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            document.getElementById('browseSearch').addEventListener('input', function(e) {
                filterItems(e.target.value);
            });
        }
    });
}

// Filter items based on search
function filterItems(searchTerm) {
    const filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const itemsHtml = filteredItems.length > 0 ? filteredItems.map(item => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card bg-dark border-secondary h-100" onclick="showItemDetails(${item.id})">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title">${item.title}</h6>
                        <span class="badge bg-primary">${item.category}</span>
                    </div>
                    <p class="card-text text-success fs-5 mb-2">${item.price}</p>
                    <p class="card-text">${item.description.substring(0, 80)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${item.condition} • ${item.seller}</small>
                        <small class="text-info">${item.location}</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('') : '<div class="col-12 text-center"><p>No items match your search.</p></div>';
    
    document.getElementById('browseItemsGrid').innerHTML = itemsHtml;
}

// Show Item Details
function showItemDetails(id) {
    const item = items.find(item => item.id === id);
    if (!item) return;

    Swal.fire({
        title: item.title,
        html: `
            <div class="text-start">
                <div class="row">
                    <div class="col-md-6">
                        <div class="bg-secondary p-4 rounded text-center mb-3" style="height: 250px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-${getIconByCategory(item.category)} display-1"></i>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h3 class="text-success mb-3">${item.price}</h3>
                        <p><strong>Condition:</strong> <span class="badge bg-info">${item.condition}</span></p>
                        <p><strong>Category:</strong> ${item.category}</p>
                        <p><strong>Seller:</strong> ${item.seller}</p>
                        <p><strong>Contact:</strong> ${item.contactMethod}</p>
                        <p><strong>Meetup Location:</strong> ${item.location}</p>
                        <p><strong>Posted:</strong> ${item.createdAt}</p>
                        
                        <div class="mt-3">
                            <h6>Description:</h6>
                            <p class="text-secondary">${item.description}</p>
                        </div>
                        
                        <div class="d-grid gap-2 mt-4">
                            <button class="btn btn-gradient" onclick="startChat('${item.seller}', ${item.id})">
                                <i class="bi bi-chat me-2"></i>Message Seller
                            </button>
                            <button class="btn btn-outline-primary" onclick="showCollectionDeskForItem(${item.id})">
                                <i class="bi bi-box me-2"></i>Use Collection Desk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        width: '800px',
        background: 'var(--dark-surface)',
        color: 'var(--text-primary)',
        showConfirmButton: false,
        showCloseButton: true
    });
}

// Collection Desk
function showCollectionDesk() {
    Swal.fire({
        title: 'Collection Desk Service',
        html: `
            <div class="text-start">
                <div class="alert alert-info mb-4">
                    <h6><i class="bi bi-info-circle me-2"></i>How Collection Desk Works</h6>
                    <ol class="mb-0">
                        <li><strong>Arrange:</strong> Buyer and seller agree to use collection desk</li>
                        <li><strong>Drop Off:</strong> Seller brings item to collection desk</li>
                        <li><strong>Secure Storage:</strong> Item is tagged and stored safely</li>
                        <li><strong>Payment:</strong> Buyer pays seller (cash/digital)</li>
                        <li><strong>Pick Up:</strong> Buyer collects item with pickup code</li>
                    </ol>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="card bg-dark border-secondary mb-3">
                            <div class="card-header">
                                <h6><i class="bi bi-box-arrow-in-down me-2"></i>Collection Desk Hours</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                                <p><strong>Sunday:</strong> Closed</p>
                                <p class="mb-0"><strong>Location:</strong> Student Services Building, Room 101</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card bg-dark border-secondary mb-3">
                            <div class="card-header">
                                <h6><i class="bi bi-shield-check me-2"></i>Safety Features</h6>
                            </div>
                            <div class="card-body">
                                <ul class="mb-0">
                                    <li>Secure storage lockers</li>
                                    <li>24/7 security cameras</li>
                                    <li>Staff verification process</li>
                                    <li>Insurance coverage</li>
                                    <li>Dispute resolution service</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <h6 class="mb-3">Contact Collection Desk</h6>
                    <p>Email: collectiondesk@university.edu | Phone: (555) 123-4567</p>
                    <button class="btn btn-gradient" onclick="openChat('Collection Desk')">
                        <i class="bi bi-chat me-2"></i>Chat with Staff
                    </button>
                </div>
            </div>
        `,
        width: '800px',
        background: 'var(--dark-surface)',
        color: 'var(--text-primary)',
        showConfirmButton: false,
        showCloseButton: true
    });
}

// Collection Desk for specific item
function showCollectionDeskForItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    Swal.fire({
        title: 'Use Collection Desk for this Item',
        html: `
            <div class="text-start">
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-body">
                        <h6>${item.title}</h6>
                        <p class="text-success">${item.price}</p>
                        <p class="text-muted">Seller: ${item.seller}</p>
                    </div>
                </div>
                
                <div class="alert alert-warning">
                    <h6><i class="bi bi-exclamation-triangle me-2"></i>Important Steps</h6>
                    <ol class="mb-0">
                        <li>Contact the seller to arrange collection desk usage</li>
                        <li>Agree on payment method (seller's preference)</li>
                        <li>Seller drops off item at collection desk</li>
                        <li>You receive pickup notification with code</li>
                        <li>Visit collection desk during operating hours</li>
                    </ol>
                </div>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-gradient" onclick="startChat('${item.seller}', ${item.id})">
                        <i class="bi bi-chat me-2"></i>Message Seller About Collection Desk
                    </button>
                    <button class="btn btn-outline-primary" onclick="showCollectionDesk()">
                        <i class="bi bi-info-circle me-2"></i>Learn More About Collection Desk
                    </button>
                </div>
            </div>
        `,
        width: '600px',
        background: 'var(--dark-surface)',
        color: 'var(--text-primary)',
        showConfirmButton: false,
        showCloseButton: true
    });
}

// Chat System
function startChat(sellerName, itemId = null) {
    currentChatUser = sellerName;
    const chatKey = `chat_${sellerName}`;
    
    if (!messages[chatKey]) {
        messages[chatKey] = [];
        // Add welcome message
        messages[chatKey].push({
            sender: sellerName,
            message: itemId ? `Hi! I see you're interested in my item. How can I help you?` : `Hello! How can I help you?`,
            timestamp: new Date().toLocaleTimeString()
        });
    }
    
    openChat(sellerName, itemId);
}

function openChat(userName, itemId = null) {
    const chatKey = `chat_${userName}`;
    const chatMessages = messages[chatKey] || [];
    
    const messagesHtml = chatMessages.map(msg => `
        <div class="message ${msg.sender === 'You' ? 'sent' : 'received'}">
            <div>${msg.message}</div>
            <small class="text-muted">${msg.timestamp}</small>
        </div>
    `).join('');

    Swal.fire({
        title: `Chat with ${userName}`,
        html: `
            <div class="chat-container">
                <div class="chat-header">
                    <h6 class="mb-0"><i class="bi bi-person-circle me-2"></i>${userName}</h6>
                    ${itemId ? `<small class="text-muted">Regarding your item listing</small>` : ''}
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${messagesHtml}
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Type a message..." id="messageInput" onkeypress="handleChatEnter(event, '${userName}')">
                    <button class="btn btn-gradient btn-sm" onclick="sendMessage('${userName}')">
                        <i class="bi bi-send"></i>
                    </button>
                </div>
            </div>
        `,
        width: '500px',
        background: 'var(--dark-surface)',
        color: 'var(--text-primary)',
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            document.getElementById('messageInput').focus();
            scrollChatToBottom();
        }
    });
}

function sendMessage(userName) {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatKey = `chat_${userName}`;
    if (!messages[chatKey]) {
        messages[chatKey] = [];
    }
    
    // Add user message
    messages[chatKey].push({
        sender: 'You',
        message: message,
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Simulate response (in real app, this would be real-time)
    setTimeout(() => {
        const responses = [
            "Thanks for your message! When would be a good time to meet?",
            "The item is still available. Are you interested in seeing it?",
            "I can meet at the library or student center. What works for you?",
            "Sure! I can drop it off at the collection desk if you prefer.",
            "Let me know if you have any other questions!"
        ];
        
        messages[chatKey].push({
            sender: userName,
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toLocaleTimeString()
        });
        
        updateChatDisplay(userName);
    }, 1000 + Math.random() * 2000);
    
    input.value = '';
    updateChatDisplay(userName);
}

function updateChatDisplay(userName) {
    const chatKey = `chat_${userName}`;
    const chatMessages = messages[chatKey] || [];
    
    const messagesHtml = chatMessages.map(msg => `
        <div class="message ${msg.sender === 'You' ? 'sent' : 'received'}">
            <div>${msg.message}</div>
            <small class="text-muted">${msg.timestamp}</small>
        </div>
    `).join('');
    
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = messagesHtml;
        scrollChatToBottom();
    }
}

function handleChatEnter(event, userName) {
    if (event.key === 'Enter') {
        sendMessage(userName);
    }
}

function scrollChatToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Search and filter functions
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        showToast(`Searching for "${query}"...`, 'info');
        // Filter current items
        const filtered = items.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filtered.length > 0) {
            setTimeout(() => {
                showBrowse();
            }, 500);
        } else {
            setTimeout(() => {
                showToast(`No items found for "${query}". Try posting an ad!`, 'warning');
            }, 500);
        }
    }
}

function filterByCategory(category) {
    const filtered = items.filter(item => item.category === category);
    showToast(`Showing ${filtered.length} items in ${category}`, 'info');
    setTimeout(() => {
        showBrowse();
    }, 500);
}

// Utility functions
function showToast(message, type = 'info') {
    const toastId = 'toast-' + Date.now();
    const toastColors = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    };
    
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${toastColors[type]} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Navbar scroll effect
function initializeNavbar() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar-custom');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    });
}

// Search with Enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && document.activeElement.id === 'searchInput') {
        performSearch();
    }
});

// Add some sample items for demonstration (you can remove this)
setTimeout(() => {
    if (items.length === 0) {
        // Add sample items after 30 seconds if none posted
        setTimeout(() => {
            if (items.length === 0) {
                showToast('Added some sample items to get you started!', 'info');
                items.push(
                    {
                        id: 1,
                        title: "Calculus Textbook - Stewart 8th Edition",
                        price: 85,
                        category: "textbooks",
                        condition: "Good",
                        description: "Used for one semester. Minimal highlighting, no missing pages. Great for MATH 1410 students.",
                        seller: "Sarah M.",
                        contactMethod: "Email",
                        location: "Campus Library",
                        createdAt: new Date().toLocaleDateString()
                    },
                    {
                        id: 2,
                        title: "MacBook Air M1 2020",
                        price: 650,
                        category: "electronics",
                        condition: "Excellent",
                        description: "Barely used, still under warranty. Comes with original charger and box. Perfect for programming and design work.",
                        seller: "Mike R.",
                        contactMethod: "Phone",
                        location: "Student Center",
                        createdAt: new Date().toLocaleDateString()
                    }
                );
                updateItemsDisplay();
            }
        }, 30000);
    }
}, 1000);