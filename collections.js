// Collections Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initFilterButtons();
    initSortDropdown();
    initLoadMore();
    initItemActions();
    initImageSlider();
});

// ===== Filter Functionality =====
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const collectionItems = document.querySelectorAll('.collection-item');
    const statsCount = document.querySelector('.collection-stats strong:first-child');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter items
            let visibleCount = 0;
            collectionItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = '';
                    }, 10);
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Update stats
            if (statsCount) {
                statsCount.textContent = visibleCount;
            }
            
            // Scroll to grid if on mobile
            if (window.innerWidth < 768) {
                document.getElementById('collectionGrid').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

// ===== Sort Dropdown =====
function initSortDropdown() {
    const sortSelect = document.getElementById('sortSelect');
    const collectionGrid = document.getElementById('collectionGrid');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            const items = Array.from(document.querySelectorAll('.collection-item:not(.hidden)'));
            
            items.sort((a, b) => {
                const priceA = getPriceValue(a);
                const priceB = getPriceValue(b);
                
                switch(sortValue) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'newest':
                        return hasBadge(b, 'new') - hasBadge(a, 'new');
                    default: // featured
                        return 0;
                }
            });
            
            // Re-append items in new order
            items.forEach(item => {
                collectionGrid.appendChild(item);
            });
        });
    }
}

function getPriceValue(item) {
    const priceText = item.querySelector('.item-price')?.textContent || '';
    return parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
}

function hasBadge(item, badgeClass) {
    return item.querySelector(`.item-badge.${badgeClass}`) ? 1 : 0;
}

// ===== Load More =====
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Show loading state
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading new items
            setTimeout(() => {
                // In a real app, this would fetch more items from the server
                showNotification('More pieces coming soon!');
                
                loadMoreBtn.innerHTML = 'Load More Pieces';
                loadMoreBtn.disabled = false;
            }, 1500);
        });
    }
}

// ===== Item Actions =====
function initItemActions() {
    // Quick view buttons - open image slider
    document.querySelectorAll('.action-btn[aria-label="Quick view"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const collectionItem = btn.closest('.collection-item');
            openImageSlider(collectionItem);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.action-btn[aria-label="Share"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.collection-item');
            const itemName = item.querySelector('.item-name').textContent;
            
            // Share functionality using Web Share API or fallback
            if (navigator.share) {
                navigator.share({
                    title: `${itemName} - Velvets & Threads`,
                    text: `Check out this beautiful ${itemName} from Velvets & Threads!`,
                    url: window.location.href
                }).catch(() => {
                    // User cancelled or share failed
                });
            } else {
                // Fallback - copy to clipboard
                const shareText = `Check out ${itemName} from Velvets & Threads: ${window.location.href}`;
                navigator.clipboard.writeText(shareText).then(() => {
                    showNotification('Link copied to clipboard!');
                });
            }
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.action-btn[aria-label="Add to cart"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const item = btn.closest('.collection-item');
            const itemName = item.querySelector('.item-name').textContent;
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            let count = parseInt(cartCount.textContent);
            cartCount.textContent = count + 1;
            
            // Animate cart icon
            const cartBtn = document.querySelector('.cart-btn');
            cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 200);
            
            showNotification(`${itemName} added to cart!`);
        });
    });
    
    // Item card click - go to detail
    document.querySelectorAll('.collection-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't navigate if clicking action buttons
            if (e.target.closest('.action-btn')) return;
            
            const itemName = item.querySelector('.item-name').textContent;
            showNotification(`${itemName} - Detail page coming soon!`);
        });
    });
}

// ===== Notification System =====
function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<span>${message}</span>`;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--color-bg-dark, #2C2416);
        color: #fff;
        padding: 16px 32px;
        font-size: 14px;
        letter-spacing: 1px;
        z-index: 9999;
        opacity: 0;
        transition: all 0.4s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== Image Slider =====
let currentSlideImages = [];
let currentSlideIndex = 0;

function initImageSlider() {
    // Add click handler to all collection item images
    document.querySelectorAll('.collection-item .item-image').forEach(itemImage => {
        itemImage.style.cursor = 'pointer';
        itemImage.addEventListener('click', (e) => {
            e.stopPropagation();
            const collectionItem = itemImage.closest('.collection-item');
            openImageSlider(collectionItem);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('imageSliderModal');
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeImageSlider();
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
    });
}

function openImageSlider(collectionItem) {
    // Get the main image src
    const mainImage = collectionItem.querySelector('.item-image img');
    const mainSrc = mainImage.src;
    
    // Create a gallery of images for this product
    // For demo: include the main image + 2-3 other images from available images
    const allImages = [
        'Images/474939519_17851519008384756_4205068427304533907_n.jpg',
        'Images/480298680_17855264841384756_8349984582560661037_n.jpg',
        'Images/485270469_17859637713384756_8869758726549976018_n.jpg',
        'Images/485735424_17859637686384756_1545957075173752256_n.jpg',
        'Images/610680162_17894066508384756_578785805163720164_n.jpg',
        'Images/627153248_17898122595384756_1185936028602160042_n.jpg',
        'Images/627545513_17898122586384756_7012242174626757533_n.jpg',
        'Images/641272934_17900907675384756_6158788547099606262_n.jpg',
        'Images/642348372_17900907672384756_347377254340002553_n.jpg',
        'Images/642485940_17900907657384756_9070226320663779881_n.jpg'
    ];
    
    // Filter out the main image and select 3 random others
    const otherImages = allImages.filter(img => !mainSrc.includes(img.replace('Images/', '')));
    const shuffled = otherImages.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine: main image first, then others
    currentSlideImages = [mainSrc, ...shuffled];
    currentSlideIndex = 0;
    
    // Update the modal
    updateSliderDisplay();
    
    // Show the modal
    const modal = document.getElementById('imageSliderModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateSliderDisplay() {
    // Update main image
    const mainImg = document.getElementById('sliderMainImage');
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = currentSlideImages[currentSlideIndex];
        mainImg.style.opacity = '1';
    }, 150);
    
    // Update thumbnails
    const thumbnailsContainer = document.getElementById('sliderThumbnails');
    thumbnailsContainer.innerHTML = currentSlideImages.map((src, index) => `
        <img src="${src}" 
             class="${index === currentSlideIndex ? 'active' : ''}" 
             onclick="goToSlide(${index})"
             alt="Thumbnail ${index + 1}">
    `).join('');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    // Loop around
    if (currentSlideIndex < 0) {
        currentSlideIndex = currentSlideImages.length - 1;
    } else if (currentSlideIndex >= currentSlideImages.length) {
        currentSlideIndex = 0;
    }
    
    updateSliderDisplay();
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateSliderDisplay();
}

function closeImageSlider() {
    const modal = document.getElementById('imageSliderModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
