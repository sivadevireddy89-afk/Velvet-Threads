// Firebase Configuration - REPLACE WITH YOUR OWN CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
let db = null;
let firebaseApp = null;

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return false;
    }
    
    // Check if config is still default
    if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
        console.warn('Firebase config not set - using localStorage fallback');
        return false;
    }
    
    try {
        if (!firebaseApp) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('Firebase initialized successfully');
        }
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Check if Firebase is available
function isFirebaseAvailable() {
    return db !== null && typeof firebase !== 'undefined';
}

// ===== User Data Functions with Firebase =====

// Get user data from Firebase or localStorage
async function getUserData(userId) {
    // Try Firebase first
    if (isFirebaseAvailable() && userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return doc.data();
            }
        } catch (error) {
            console.error('Firebase getUserData error:', error);
        }
    }
    
    // Fallback to localStorage
    const localKey = `velvetsData_${userId}`;
    const savedData = localStorage.getItem(localKey);
    
    if (savedData) {
        return JSON.parse(savedData);
    }
    
    // Return default structure
    const user = getCurrentUser();
    return {
        profile: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            }
        },
        wishlist: [],
        cart: [],
        orders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// Save user data to Firebase and localStorage
async function saveUserData(userId, data) {
    const timestampedData = {
        ...data,
        updatedAt: new Date().toISOString()
    };
    
    // Save to Firebase
    if (isFirebaseAvailable() && userId) {
        try {
            await db.collection('users').doc(userId).set(timestampedData, { merge: true });
            console.log('User data saved to Firebase');
        } catch (error) {
            console.error('Firebase saveUserData error:', error);
        }
    }
    
    // Always save to localStorage as backup
    const localKey = `velvetsData_${userId}`;
    localStorage.setItem(localKey, JSON.stringify(timestampedData));
    
    // Update UI
    updateCartCount();
    updateWishlistCount();
}

// ===== Wishlist Functions (Firebase + Local) =====

async function addToWishlist(productId, productData) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to add to wishlist');
        openAuthModal('login');
        return false;
    }
    
    const userData = await getUserData(user.id);
    
    // Check if already in wishlist
    const exists = userData.wishlist.find(item => item.id === productId);
    if (exists) {
        showNotification('Already in your wishlist!');
        return false;
    }
    
    userData.wishlist.push({
        id: productId,
        ...productData,
        addedAt: new Date().toISOString()
    });
    
    await saveUserData(user.id, userData);
    showNotification('Added to wishlist!');
    return true;
}

async function removeFromWishlist(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = await getUserData(user.id);
    userData.wishlist = userData.wishlist.filter(item => item.id !== productId);
    
    await saveUserData(user.id, userData);
    showNotification('Removed from wishlist');
    return true;
}

async function isInWishlist(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = await getUserData(user.id);
    return userData.wishlist.some(item => item.id === productId);
}

async function getWishlist() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userData = await getUserData(user.id);
    return userData.wishlist;
}

async function updateWishlistCount() {
    const wishlist = await getWishlist();
    const count = wishlist.length;
    
    document.querySelectorAll('.wishlist-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline' : 'none';
    });
}

// ===== Cart Functions (Firebase + Local) =====

async function addToCart(productId, productData, quantity = 1) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to add items to cart');
        openAuthModal('login');
        return false;
    }
    
    const userData = await getUserData(user.id);
    
    // Check if already in cart
    const existingItem = userData.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.updatedAt = new Date().toISOString();
    } else {
        userData.cart.push({
            id: productId,
            ...productData,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    await saveUserData(user.id, userData);
    showNotification(`Added to cart (${quantity} item${quantity > 1 ? 's' : ''})`);
    return true;
}

async function removeFromCart(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = await getUserData(user.id);
    userData.cart = userData.cart.filter(item => item.id !== productId);
    
    await saveUserData(user.id, userData);
    showNotification('Removed from cart');
    return true;
}

async function updateCartQuantity(productId, quantity) {
    const user = getCurrentUser();
    if (!user) return false;
    
    if (quantity <= 0) {
        return removeFromCart(productId);
    }
    
    const userData = await getUserData(user.id);
    const item = userData.cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        item.updatedAt = new Date().toISOString();
        await saveUserData(user.id, userData);
        return true;
    }
    
    return false;
}

async function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userData = await getUserData(user.id);
    return userData.cart;
}

async function getCartTotal() {
    const cart = await getCart();
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price?.replace(/[^0-9]/g, '') || 0);
        return total + (price * item.quantity);
    }, 0);
}

async function clearCart() {
    const user = getCurrentUser();
    if (!user) return;
    
    const userData = await getUserData(user.id);
    userData.cart = [];
    await saveUserData(user.id, userData);
}

async function updateCartCount() {
    const cart = await getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = `(${count})`;
    });
}

// ===== Orders Functions (Firebase + Local) =====

async function createOrder(orderData) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to place an order');
        return null;
    }
    
    const userData = await getUserData(user.id);
    
    const order = {
        id: 'ORD' + Date.now(),
        items: orderData.items || userData.cart,
        total: orderData.total || await getCartTotal(),
        status: 'confirmed',
        shippingAddress: orderData.shippingAddress || userData.profile.address,
        paymentMethod: orderData.paymentMethod || 'COD',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    userData.orders.unshift(order);
    userData.cart = []; // Clear cart after order
    
    await saveUserData(user.id, userData);
    showNotification(`Order ${order.id} placed successfully!`);
    
    // Also save order to separate collection for admin view
    if (isFirebaseAvailable()) {
        try {
            await db.collection('orders').doc(order.id).set({
                ...order,
                userId: user.id,
                userEmail: user.email,
                userName: user.name
            });
        } catch (error) {
            console.error('Error saving order to Firebase:', error);
        }
    }
    
    return order;
}

async function getOrders() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userData = await getUserData(user.id);
    return userData.orders || [];
}

async function getOrder(orderId) {
    const orders = await getOrders();
    return orders.find(order => order.id === orderId);
}

async function cancelOrder(orderId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = await getUserData(user.id);
    const order = userData.orders.find(o => o.id === orderId);
    
    if (order && order.status === 'confirmed') {
        order.status = 'cancelled';
        order.cancelledAt = new Date().toISOString();
        await saveUserData(user.id, userData);
        
        // Update in orders collection too
        if (isFirebaseAvailable()) {
            try {
                await db.collection('orders').doc(orderId).update({
                    status: 'cancelled',
                    cancelledAt: order.cancelledAt
                });
            } catch (error) {
                console.error('Error updating order in Firebase:', error);
            }
        }
        
        showNotification('Order cancelled successfully');
        return true;
    }
    
    showNotification('Order cannot be cancelled');
    return false;
}

// ===== Profile Functions (Firebase + Local) =====

async function updateProfile(profileData) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = await getUserData(user.id);
    userData.profile = { ...userData.profile, ...profileData };
    
    // Update main user object if name/email changed
    if (profileData.name) user.name = profileData.name;
    if (profileData.email) user.email = profileData.email;
    
    // Save both
    localStorage.setItem('velvetsUser', JSON.stringify(user));
    await saveUserData(user.id, userData);
    
    // Update Firebase Auth profile if available
    if (isFirebaseAvailable() && firebase.auth().currentUser) {
        try {
            await firebase.auth().currentUser.updateProfile({
                displayName: profileData.name
            });
        } catch (error) {
            console.error('Error updating Firebase Auth profile:', error);
        }
    }
    
    updateAuthUI(user);
    showNotification('Profile updated successfully');
    return true;
}

async function getProfile() {
    const user = getCurrentUser();
    if (!user) return null;
    
    const userData = await getUserData(user.id);
    return userData.profile;
}

async function updateAddress(address) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = await getUserData(user.id);
    userData.profile.address = { ...userData.profile.address, ...address };
    await saveUserData(user.id, userData);
    
    showNotification('Address updated successfully');
    return true;
}

// ===== Initialize User Features =====

async function initUserFeatures() {
    // Initialize Firebase first
    initFirebase();
    
    // Update counts on page load
    await updateCartCount();
    await updateWishlistCount();
    
    // Initialize wishlist buttons
    initWishlistButtons();
    
    // Initialize cart buttons
    initCartButtons();
}

function initWishlistButtons() {
    document.querySelectorAll('.wishlist-btn, .product-btn[aria-label="Add to wishlist"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            const card = btn.closest('.product-card, .collection-card, .collection-item');
            if (!card) return;
            
            const productId = card.dataset.productId || card.querySelector('img')?.src?.split('/').pop()?.split('.')[0];
            const productName = card.querySelector('.product-name, h3')?.textContent || 'Product';
            const productPrice = card.querySelector('.product-price')?.textContent || '';
            const productImage = card.querySelector('img')?.src;
            
            if (!productId) {
                showNotification('Unable to add to wishlist');
                return;
            }
            
            if (await isInWishlist(productId)) {
                await removeFromWishlist(productId);
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                await addToWishlist(productId, {
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            }
        });
    });
}

function initCartButtons() {
    document.querySelectorAll('.add-to-cart-btn, .product-btn[aria-label="Add to cart"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            const card = btn.closest('.product-card, .collection-card, .collection-item');
            if (!card) return;
            
            const productId = card.dataset.productId || card.querySelector('img')?.src?.split('/').pop()?.split('.')[0];
            const productName = card.querySelector('.product-name, h3')?.textContent || 'Product';
            const productPrice = card.querySelector('.product-price')?.textContent || '';
            const productImage = card.querySelector('img')?.src;
            
            if (!productId) {
                showNotification('Unable to add to cart');
                return;
            }
            
            await addToCart(productId, {
                name: productName,
                price: productPrice,
                image: productImage
            });
        });
    });
}

// ===== Profile Modal =====

async function openProfileModal(section = 'profile') {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login first');
        openAuthModal('login');
        return;
    }
    
    const userData = await getUserData(user.id);
    
    let profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.remove();
    }
    
    profileModal = document.createElement('div');
    profileModal.id = 'profileModal';
    profileModal.className = 'auth-modal active';
    
    const orders = await getOrders();
    const wishlist = await getWishlist();
    const cart = await getCart();
    
    profileModal.innerHTML = `
        <div class="auth-overlay" onclick="closeProfileModal()"></div>
        <div class="auth-container" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <button class="auth-close" onclick="closeProfileModal()" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-layout" style="display: grid; grid-template-columns: 200px 1fr; gap: 30px;">
                <div class="profile-sidebar" style="border-right: 1px solid var(--color-border); padding-right: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="${user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=8B4513&color=fff'}" 
                             alt="${user.name}" 
                             style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
                        <h3 style="font-size: 16px; margin: 0;">${user.name}</h3>
                        <p style="font-size: 12px; color: var(--color-text-light); margin: 5px 0;">${user.email}</p>
                        ${isFirebaseAvailable() ? '<p style="font-size: 10px; color: #27ae60;"><i class="fas fa-cloud"></i> Cloud Sync Active</p>' : '<p style="font-size: 10px; color: #e67e22;"><i class="fas fa-database"></i> Local Storage Only</p>'}
                    </div>
                    
                    <nav style="display: flex; flex-direction: column; gap: 5px;">
                        <button class="profile-nav-btn ${section === 'profile' ? 'active' : ''}" 
                                onclick="showProfileSection('profile')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'profile' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-user" style="margin-right: 10px;"></i> Profile
                        </button>
                        <button class="profile-nav-btn ${section === 'orders' ? 'active' : ''}" 
                                onclick="showProfileSection('orders')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'orders' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-shopping-bag" style="margin-right: 10px;"></i> My Orders (${orders.length})
                        </button>
                        <button class="profile-nav-btn ${section === 'wishlist' ? 'active' : ''}" 
                                onclick="showProfileSection('wishlist')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'wishlist' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-heart" style="margin-right: 10px;"></i> Wishlist (${wishlist.length})
                        </button>
                        <button class="profile-nav-btn ${section === 'cart' ? 'active' : ''}" 
                                onclick="showProfileSection('cart')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'cart' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-shopping-cart" style="margin-right: 10px;"></i> Cart (${cart.length})
                        </button>
                        <button class="profile-nav-btn" 
                                onclick="syncUserData(); showNotification('Data synced!');"
                                style="text-align: left; padding: 12px; border: none; background: transparent; cursor: pointer; border-radius: 4px; color: #27ae60;">
                            <i class="fas fa-sync" style="margin-right: 10px;"></i> Sync Now
                        </button>
                        <button class="profile-nav-btn" 
                                onclick="logoutUser(); closeProfileModal();"
                                style="text-align: left; padding: 12px; border: none; background: transparent; cursor: pointer; border-radius: 4px; color: #c0392b;">
                            <i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i> Logout
                        </button>
                    </nav>
                </div>
                
                <div class="profile-content" id="profileContent">
                    ${await getProfileSectionContent(section)}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(profileModal);
    document.body.style.overflow = 'hidden';
}

async function getProfileSectionContent(section) {
    const user = getCurrentUser();
    const userData = await getUserData(user.id);
    
    switch(section) {
        case 'profile':
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">My Profile</h2>
                <form id="profileForm" style="display: grid; gap: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Full Name</label>
                            <input type="text" name="name" value="${userData.profile.name}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Email</label>
                            <input type="email" name="email" value="${userData.profile.email}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Phone Number</label>
                        <input type="tel" name="phone" value="${userData.profile.phone || ''}" placeholder="+91 98765 43210"
                               style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                    </div>
                    
                    <h3 style="margin-top: 30px; margin-bottom: 20px; font-size: 18px;">Shipping Address</h3>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Street Address</label>
                        <input type="text" name="street" value="${userData.profile.address.street}" 
                               style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">City</label>
                            <input type="text" name="city" value="${userData.profile.address.city}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">State</label>
                            <input type="text" name="state" value="${userData.profile.address.state}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Pincode</label>
                            <input type="text" name="pincode" value="${userData.profile.address.pincode}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Country</label>
                            <input type="text" name="country" value="${userData.profile.address.country}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="margin-top: 20px;">Save Changes</button>
                </form>
            `;
            
        case 'orders':
            const orders = await getOrders();
            if (orders.length === 0) {
                return `
                    <h2 style="margin-bottom: 30px; font-size: 24px;">My Orders</h2>
                    <div style="text-align: center; padding: 60px 20px; color: var(--color-text-light);">
                        <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                        <p>No orders yet</p>
                        <a href="collections.html" class="btn btn-outline-dark" style="margin-top: 20px;">Start Shopping</a>
                    </div>
                `;
            }
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">My Orders</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${orders.map(order => `
                        <div style="border: 1px solid var(--color-border); border-radius: 8px; padding: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                <div>
                                    <strong>${order.id}</strong>
                                    <p style="font-size: 12px; color: var(--color-text-light); margin: 5px 0;">
                                        ${new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;
                                    ${order.status === 'confirmed' ? 'background: #d4edda; color: #155724;' : ''}
                                    ${order.status === 'cancelled' ? 'background: #f8d7da; color: #721c24;' : ''}
                                    ${order.status === 'delivered' ? 'background: #d1ecf1; color: #0c5460;' : ''}">
                                    ${order.status}
                                </span>
                            </div>
                            <p style="margin-bottom: 10px;">${order.items.length} item(s)</p>
                            <p style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">₹${order.total.toLocaleString()}</p>
                            ${order.status === 'confirmed' ? `
                                <button onclick="cancelOrder('${order.id}').then(() => showProfileSection('orders'));" 
                                        style="padding: 8px 16px; border: 1px solid #c0392b; background: transparent; color: #c0392b; border-radius: 4px; cursor: pointer; font-size: 13px;">
                                    Cancel Order
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            
        case 'wishlist':
            const wishlist = await getWishlist();
            if (wishlist.length === 0) {
                return `
                    <h2 style="margin-bottom: 30px; font-size: 24px;">My Wishlist</h2>
                    <div style="text-align: center; padding: 60px 20px; color: var(--color-text-light);">
                        <i class="fas fa-heart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                        <p>Your wishlist is empty</p>
                        <a href="collections.html" class="btn btn-outline-dark" style="margin-top: 20px;">Explore Collection</a>
                    </div>
                `;
            }
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">My Wishlist (${wishlist.length} items)</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    ${wishlist.map(item => `
                        <div style="border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden;">
                            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover;">
                            <div style="padding: 15px;">
                                <h4 style="font-size: 14px; margin-bottom: 8px;">${item.name}</h4>
                                <p style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${item.price}</p>
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="addToCart('${item.id}', {name: '${item.name}', price: '${item.price}', image: '${item.image}'}).then(() => showProfileSection('cart'));" 
                                            style="flex: 1; padding: 10px; background: var(--color-bg-dark); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                                        <i class="fas fa-shopping-cart"></i> Add
                                    </button>
                                    <button onclick="removeFromWishlist('${item.id}').then(() => showProfileSection('wishlist'));" 
                                            style="padding: 10px; background: transparent; border: 1px solid var(--color-border); border-radius: 4px; cursor: pointer; color: #c0392b;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
        case 'cart':
            const cart = await getCart();
            const cartTotal = await getCartTotal();
            if (cart.length === 0) {
                return `
                    <h2 style="margin-bottom: 30px; font-size: 24px;">Shopping Cart</h2>
                    <div style="text-align: center; padding: 60px 20px; color: var(--color-text-light);">
                        <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                        <p>Your cart is empty</p>
                        <a href="collections.html" class="btn btn-outline-dark" style="margin-top: 20px;">Start Shopping</a>
                    </div>
                `;
            }
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">Shopping Cart (${cart.length} items)</h2>
                <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px;">
                    ${cart.map(item => `
                        <div style="display: flex; gap: 20px; border: 1px solid var(--color-border); border-radius: 8px; padding: 15px;">
                            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
                            <div style="flex: 1;">
                                <h4 style="font-size: 16px; margin-bottom: 8px;">${item.name}</h4>
                                <p style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${item.price}</p>
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <div style="display: flex; align-items: center; border: 1px solid var(--color-border); border-radius: 4px;">
                                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1}).then(() => showProfileSection('cart'));" 
                                                style="padding: 8px 12px; background: transparent; border: none; cursor: pointer;">-</button>
                                        <span style="padding: 8px 16px; min-width: 40px; text-align: center;">${item.quantity}</span>
                                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1}).then(() => showProfileSection('cart'));" 
                                                style="padding: 8px 12px; background: transparent; border: none; cursor: pointer;">+</button>
                                    </div>
                                    <button onclick="removeFromCart('${item.id}').then(() => showProfileSection('cart'));" 
                                            style="color: #c0392b; border: none; background: transparent; cursor: pointer; font-size: 13px;">
                                        <i class="fas fa-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="border-top: 1px solid var(--color-border); padding-top: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
                        <span>Total:</span>
                        <span>₹${cartTotal.toLocaleString()}</span>
                    </div>
                    <button onclick="openCheckoutModal()" 
                            style="width: 100%; padding: 15px; background: var(--color-bg-dark); color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
                        Proceed to Checkout
                    </button>
                </div>
            `;
    }
}

async function showProfileSection(section) {
    const contentDiv = document.getElementById('profileContent');
    if (contentDiv) {
        contentDiv.innerHTML = await getProfileSectionContent(section);
        
        document.querySelectorAll('.profile-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
        });
        event?.target?.classList.add('active');
        if (event?.target) event.target.style.background = 'var(--color-bg-cream)';
        
        if (section === 'profile') {
            document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await updateProfile({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                });
                await updateAddress({
                    street: formData.get('street'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    pincode: formData.get('pincode'),
                    country: formData.get('country')
                });
            });
        }
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

async function openCheckoutModal() {
    const cart = await getCart();
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    const order = await createOrder({});
    if (order) {
        closeProfileModal();
        showNotification(`Order ${order.id} placed! Check My Orders for details.`);
    }
}

// ===== Sync Function =====

async function syncUserData() {
    const user = getCurrentUser();
    if (!user) return;
    
    if (!isFirebaseAvailable()) {
        showNotification('Cloud sync not available');
        return;
    }
    
    try {
        // Get local data
        const localKey = `velvetsData_${user.id}`;
        const localData = localStorage.getItem(localKey);
        
        if (localData) {
            const data = JSON.parse(localData);
            data.updatedAt = new Date().toISOString();
            
            // Push to Firebase
            await db.collection('users').doc(user.id).set(data, { merge: true });
            showNotification('Data synced to cloud!');
        }
    } catch (error) {
        console.error('Sync error:', error);
        showNotification('Sync failed. Will retry later.');
    }
}

// ===== Utility Functions =====

function clearAllUserData() {
    localStorage.removeItem('velvetsUser');
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('velvetsData_')) {
            localStorage.removeItem(key);
        }
    });
    showNotification('All user data cleared');
}

async function migrateUserData() {
    const user = getCurrentUser();
    if (!user) return;
    
    const localKey = `velvetsData_${user.id}`;
    const savedData = localStorage.getItem(localKey);
    
    if (savedData && isFirebaseAvailable()) {
        try {
            const data = JSON.parse(savedData);
            await db.collection('users').doc(user.id).set(data, { merge: true });
            console.log('User data migrated to Firebase');
        } catch (error) {
            console.error('Migration error:', error);
        }
    }
}
