        // Global variables
        let items = [];
        
        let uploadedImages = [];
let messages = {};
        let currentChatUser = null;

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            initializeBackToTop();
            updateItemsDisplay();
            showToast('Welcome to UniSwap Campus Marketplace!', 'success');
            
            // Add sample items after 5 seconds if none posted
            setTimeout(() => {
                if (items.length === 0) {
                    addSampleItems();
                }
            }, 5000);
        });

        // Add sample items
        function addSampleItems() {
            showToast('Adding sample items to get you started!', 'info');
            
            items = [
                {
                    id: 1,
                    title: "Calculus Textbook - Stewart 8th Edition",
                    price: "RM 85",
                    category: "textbooks",
                    condition: "Good",
                    description: "Used for one semester. Minimal highlighting, no missing pages. Great for MATH 1410 students. Includes solution manual.",
                    seller: "Sarah M.",
                    contactMethod: "Email",
                    location: "Campus Library",
                    images: uploadedImages,
                    createdAt: new Date().toLocaleDateString()
                },
                {
                    id: 2,
                    title: "MacBook Air M1 2020",
                    price: "RM 650",
                    category: "electronics",
                    condition: "Excellent",
                    description: "Barely used, still under warranty. Comes with original charger and box. Perfect for programming and design work. 8GB RAM, 256GB SSD.",
                    seller: "Mike R.",
                    contactMethod: "Phone",
                    location: "Student Center",
                    images: [],
                    createdAt: new Date().toLocaleDateString()
                },
                {
                    id: 3,
                    title: "Study Desk with Drawers",
                    price: "RM 120",
                    category: "furniture",
                    condition: "Good",
                    description: "Wooden study desk with 3 drawers. Perfect for dorm room or small apartment. Minor scratches but very sturdy.",
                    seller: "Emma L.",
                    contactMethod: "Campus Chat",
                    location: "Collection Desk",
                    images: [],
                    createdAt: new Date().toLocaleDateString()
                },
                {
                    id: 4,
                    title: "Winter Jacket - Uniqlo Size M",
                    price: "RM 45",
                    category: "fashion",
                    condition: "Like New",
                    description: "Bought last winter, worn only a few times. Very warm and comfortable. Perfect for Malaysian air conditioning!",
                    seller: "David W.",
                    contactMethod: "Email",
                    location: "Campus Library",
                    images: [],
                    createdAt: new Date().toLocaleDateString()
                }
            ];
            
            updateItemsDisplay();
        }

        // Update items display
        function updateItemsDisplay(data = null) {
    const grid = document.getElementById('itemsGrid');
    const list = data || items; // 如果传入了 data 就用 data，否则用全局 items

    if (list.length === 0) {
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
        grid.innerHTML = list.map(item => `
            <div class="col-lg-4 col-md-6">
                <div class="item-card" onclick="showItemDetails(${item.id})">
                    <div class="item-image">
                        ${item.images && item.images.length > 0 ? 
                            `<img src="${item.images[0].data}" alt="${item.title}">` :
                            `<i class="bi bi-${getIconByCategory(item.category)}"></i>`
                        }
                    </div>
                    <div class="item-info">
                        <div class="item-price">${item.price}</div>
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

function filterByCategory(category) {
    const filtered = items.filter(item => item.category === category);
    updateItemsDisplay(filtered);
}


        // Get icon by category
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

        // Show post ad modal
        function showPostAd() {
            Swal.fire({
                title: 'Post New Ad',
                html: `
                    <form id="postAdForm" class="text-start">
                        <div class="mb-3">
                            <label class="form-label">Item Title</label>
                            <input type="text" class="form-control" id="itemTitle" required>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Price ($)</label>
                                <input type="number" class="form-control" id="itemPrice" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Category</label>
                                <select class="form-select" id="itemCategory" required>
                                    <option value="">Select Category</option>
                                    <option value="textbooks">Textbooks</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="furniture">Furniture</option>
                                    <option value="fashion">Fashion</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Condition</label>
                            <select class="form-select" id="itemCondition" required>
                                <option value="">Select Condition</option>
                                <option value="Like New">Like New</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" id="itemDescription" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Your Name</label>
                            <input type="text" class="form-control" id="sellerName" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Contact Method</label>
                            <select class="form-select" id="contactMethod" required>
                                <option value="">Select Method</option>
                                <option value="Email">Email</option>
                                <option value="Phone">Phone</option>
                                <option value="Campus Chat">Campus Chat</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Meetup Location</label>
                            <select class="form-select" id="meetupLocation">
                                <option value="Campus Library">Campus Library</option>
                                <option value="Student Center">Student Center</option>
                                <option value="Collection Desk">Collection Desk</option>
                            </select>
                        </div>
                    
                        <div class="mb-3">
                            <label class="form-label">Photos (up to 5)</label>
                            <input type="file" class="form-control" id="itemImages" accept="image/*" multiple>
                            <div id="imagePreview" class="d-flex flex-wrap gap-2 mt-2"></div>
                        </div>
                        <div class="text-end">
                            <button type="submit" class="btn btn-gradient">Post Ad</button>
                        </div>
</form>
                `,
                width: '600px',
                background: 'var(--dark-surface)',
                color: 'var(--text-primary)',
                showConfirmButton: false,
                showCancelButton: true,
                confirmButtonText: 'Post Ad',
                cancelButtonText: 'Cancel',
                showCloseButton: true,
                didOpen: () => {
                    // hook submit
                    document.getElementById('postAdForm').addEventListener('submit', function(e) {
                        e.preventDefault();
                        submitPostAd();
                    });
                    // image preview
                    uploadedImages = [];
                    const fileInput = document.getElementById('itemImages');
                    const preview = document.getElementById('imagePreview');
                    if (fileInput) {
                        fileInput.addEventListener('change', (e) => {
                            const files = Array.from(e.target.files).slice(0,5);
                            uploadedImages = [];
                            if (preview) preview.innerHTML='';
                            files.forEach(file => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const dataUrl = reader.result;
                                    uploadedImages.push({name:file.name, data:dataUrl, size:file.size, type:file.type});
                                    if (preview) {
                                        const img = document.createElement('img');
                                        img.src = dataUrl;
                                        img.style.width = '64px';
                                        img.style.height = '64px';
                                        img.style.objectFit = 'cover';
                                        img.className = 'rounded';
                                        preview.appendChild(img);
                                    }
                                };
                                reader.readAsDataURL(file);
                            });
                        });
                    }
                }
            });
        }

        // Submit post ad
        function submitPostAd() {
            const newItem = {
                id: Date.now(),
                title: document.getElementById('itemTitle').value,
                price: 'RM ' + document.getElementById('itemPrice').value,
                category: document.getElementById('itemCategory').value,
                condition: document.getElementById('itemCondition').value,
                description: document.getElementById('itemDescription').value,
                seller: document.getElementById('sellerName').value,
                contactMethod: document.getElementById('contactMethod').value,
                location: document.getElementById('meetupLocation').value,
                images: uploadedImages,
                createdAt: new Date().toLocaleDateString()
            };
            
            items.unshift(newItem);
            updateItemsDisplay();
            Swal.close();
            showToast('Item posted successfully!', 'success');
        }

        // Show browse modal
        function showBrowse(list = null) {
            const data = list || items;
            const itemsHtml = data.length > 0 ? data.map(item => `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card bg-dark border-secondary h-100" style="cursor: pointer;" onclick="showItemDetails(${item.id})">
                        <div class="card-body">
                            <h6 class="card-title">${item.title}</h6>
                            <p class="text-success fs-5">${item.price}</p>
                            <p class="text-muted">${item.condition} • ${item.seller}</p>
                        </div>
                    </div>
                </div>
            `).join('') : '<div class="col-12 text-center"><p>No items found</p></div>';

            Swal.fire({
                title: 'Browse Items',
                html: `<div class="row g-3">${itemsHtml}</div>`,
                width: '90%',
                background: 'var(--dark-surface)',
                color: 'var(--text-primary)',
                showConfirmButton: false,
                showCloseButton: true
            });
        }

        // Show item details
        function showItemDetails(id) {
            const item = items.find(i => i.id === id);
            if (!item) return;
            const main = (item.images && item.images[0]) 
              ? `<img src="${item.images[0].data}" class="w-100" style="height:240px;object-fit:cover;border-radius:12px;">`
              : `<div class="d-flex align-items-center justify-content-center" style="height:240px;background:#49505755;border-radius:12px;">
                   <i class="bi bi-${getIconByCategory(item.category)}" style="font-size:3rem;color:#cbd5e1"></i>
                 </div>`;
            const thumbs = (item.images||[]).slice(1).map(im => `<img src="${im.data}" class="me-2 mt-2" style="width:70px;height:70px;border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,.08)">`).join('');
            Swal.fire({
                title: item.title,
                html: `
                    <div class="container-fluid text-start">
                      <div class="row g-3">
                        <div class="col-md-5">
                          ${main}
                          ${thumbs ? `<div class="d-flex flex-wrap">${thumbs}</div>` : ''}
                        </div>
                        <div class="col-md-7">
                          <div class="price text-success fs-3 fw-bold mb-2">${item.price}</div>
                          <div class="mb-2">
                            <span class="badge-cond badge-${item.condition.toLowerCase().includes('excellent') ? 'excellent' : item.condition.toLowerCase().includes('good') ? 'good' : 'fair'}">${item.condition}</span>
                            <span class="ms-2 text-muted text-capitalize">Category: ${item.category}</span>
                          </div>
                          <p class="mb-1"><strong>Seller:</strong> ${item.seller}</p>
                          <p class="mb-1"><strong>Contact:</strong> ${item.contactMethod}</p>
                          <p class="mb-1"><strong>Meetup Location:</strong> ${item.location}</p>
                          <p class="mb-1"><strong>Posted:</strong> ${item.createdAt}</p>
                          <div class="mt-2"><strong>Description:</strong><br><span class="text-secondary">${item.description}</span></div>
                          <div class="d-grid gap-2 mt-3">
                            <button class="btn btn-gradient" onclick="messageSeller('${encodeURIComponent(item.seller)}','${encodeURIComponent(item.contactMethod)}')">
                              <i class="bi bi-chat-dots me-1"></i> Message Seller
                            </button>
                            <button class="btn btn-outline-light" onclick="showCollectionDesk()">
                              <i class="bi bi-box-seam me-1"></i> Use Collection Desk
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>`,
                width: '820px',
                background: 'var(--dark-surface)',
                color: 'var(--text-primary)',
                showConfirmButton: false,
                showCloseButton: true
            });
        }

        // Show collection desk
        
        // Message seller dialog (global for inline onclick)
        
        // Open chat with seller
        function messageSeller(nameEnc, methodEnc) {
            const seller = decodeURIComponent(nameEnc || 'Seller');
            const method = decodeURIComponent(methodEnc || '');
            currentChatUser = seller;
            if (!messages[seller]) {
                messages[seller] = [
                    {from: 'them', text: "Hi! I see you're interested in my item. How can I help you?", time: new Date()}
                ];
            }
            openChatWindow(seller, method);
        }

        function openChatWindow(seller, method){
            Swal.fire({
                title: `Chat with ${seller}`,
                html: `
                    <div class="chat-window">
                      <div class="chat-header">
                        <div class="chat-title"><i class="bi bi-person-circle me-1"></i> ${seller}</div>
                        <div class="chat-sub">Regarding your item listing${method ? ' • ' + method : ''}</div>
                      </div>
                      <div id="chatBody" class="chat-body"></div>
                      <div class="chat-input">
                        <input id="chatInput" type="text" placeholder="Type a message...">
                        <button id="chatSend" class="btn btn-gradient chat-send"><i class="bi bi-send"></i></button>
                      </div>
                    </div>`,
                width: 520,
                background: 'var(--dark-surface)',
                color: 'var(--text-primary)',
                showConfirmButton: false,
                showCloseButton: true,
                didOpen: () => {
                    renderChat(seller);
                    const input = document.getElementById('chatInput');
                    const sendBtn = document.getElementById('chatSend');
                    input.focus();
                    input.addEventListener('keydown', (e)=>{
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(seller); }
                    });
                    sendBtn.addEventListener('click', ()=> sendChatMessage(seller));
                }
            });
        }

        function renderChat(seller){
            const body = document.getElementById('chatBody');
            if (!body) return;
            const msgs = messages[seller] || [];
            body.innerHTML = msgs.map(m => `
                <div class="d-flex ${m.from === 'me' ? 'justify-content-end' : 'justify-content-start'}">
                  <div class="bubble ${m.from === 'me' ? 'me' : 'them'}">
                    <div>${m.text.replace(/</g,'&lt;')}</div>
                    <div class="time">${new Date(m.time).toLocaleTimeString()}</div>
                  </div>
                </div>`
            ).join('');
            body.scrollTop = body.scrollHeight;
        }

        function sendChatMessage(seller){
            const input = document.getElementById('chatInput');
            const text = (input.value || '').trim();
            if (!text) return;
            messages[seller] = messages[seller] || [];
            messages[seller].push({from:'me', text, time: new Date()});
            input.value='';
            renderChat(seller);
            // optional auto-reply for demo
            setTimeout(()=>{
                messages[seller].push({from:'them', text: "Got it 👍", time: new Date()});
                renderChat(seller);
            }, 800);
        }
    // Show toast notification
        function showToast(message, type = 'info') {
            const toastId = 'toast-' + Date.now();
            const toastHtml = `
                <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert">
                    <div class="d-flex">
                        <div class="toast-body">${message}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            `;
            
            document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHtml);
            const toastElement = document.getElementById(toastId);
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
            
            setTimeout(() => {
                toastElement.remove();
            }, 5000);
        }

        // Back to top functionality
        function initializeBackToTop() {
            window.addEventListener('scroll', function() {
                const backToTopBtn = document.getElementById('backToTop');
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
        }

        // Scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
