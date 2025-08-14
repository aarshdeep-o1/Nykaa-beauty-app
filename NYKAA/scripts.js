// Global Variables
let slideIndex = 1
let cart = []
const cartTotal = 0

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeCarousel()
  initializeBackToTop()
  initializeNewsletter()
  updateCartDisplay()
  loadCartFromStorage()

  // Initialize shopping page if it exists
  if (document.getElementById("product-grid")) {
    initializeShoppingPage()
  }
})

// Testimonials Carousel Functions
function initializeCarousel() {
  const slides = document.getElementsByClassName("testimonial-slide")
  if (slides.length > 0) {
    showSlides(slideIndex)

    // Auto play the carousel every 5 seconds
    setInterval(() => {
      plusSlides(1)
    }, 5000)
  }
}

function plusSlides(n) {
  showSlides((slideIndex += n))
}

function currentSlide(n) {
  showSlides((slideIndex = n))
}

function showSlides(n) {
  const slides = document.getElementsByClassName("testimonial-slide")
  const dots = document.getElementsByClassName("dot")

  if (slides.length === 0) return

  if (n > slides.length) {
    slideIndex = 1
  }
  if (n < 1) {
    slideIndex = slides.length
  }

  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"
    slides[i].classList.remove("active")
  }

  // Remove active class from all dots
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active")
  }

  // Show current slide and activate corresponding dot
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block"
    slides[slideIndex - 1].classList.add("active")
  }

  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add("active")
  }
}

// Back to Top Button Functions
function initializeBackToTop() {
  const backToTopBtn = document.getElementById("backToTopBtn")

  if (backToTopBtn) {
    window.onscroll = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "flex"
      } else {
        backToTopBtn.style.display = "none"
      }
    }
  }
}

function topFunction() {
  document.body.scrollTop = 0 // For Safari
  document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}

// Newsletter Functions
function initializeNewsletter() {
  const newsletterForm = document.getElementById("newsletterForm")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      handleNewsletterSubmission()
    })
  }
}

function handleNewsletterSubmission() {
  const emailInput = document.getElementById("emailInput")
  const messageDiv = document.getElementById("newsletter-message")
  const email = emailInput.value.trim()

  if (!email) {
    showNewsletterMessage("Please enter a valid email address.", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNewsletterMessage("Please enter a valid email address.", "error")
    return
  }

  // Simulate API call
  showNewsletterMessage("Subscribing...", "info")

  setTimeout(() => {
    showNewsletterMessage("Thank you for subscribing! You will receive our latest updates and offers.", "success")
    emailInput.value = ""
  }, 1500)
}

function showNewsletterMessage(message, type) {
  const messageDiv = document.getElementById("newsletter-message")
  if (messageDiv) {
    messageDiv.textContent = message
    messageDiv.className = `newsletter-message ${type}`
    messageDiv.style.display = "block"

    if (type === "success") {
      setTimeout(() => {
        messageDiv.style.display = "none"
      }, 5000)
    }
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Shopping Cart Functions
function addToCart(productName, price) {
  const existingItem = cart.find((item) => item.name === productName)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: 1,
    })
  }

  updateCartDisplay()
  showAddToCartAnimation()
  showNotification(`${productName} added to cart!`, "success")
}

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName)
  updateCartDisplay()
  displayCartItems()
}

function updateCartQuantity(productName, newQuantity) {
  const item = cart.find((item) => item.name === productName)
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productName)
    } else {
      item.quantity = newQuantity
      updateCartDisplay()
      displayCartItems()
    }
  }
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cart-count")
  const cartTotalElement = document.getElementById("cart-total")

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartCount) {
    cartCount.textContent = `Cart (${totalItems})`
  }

  if (cartTotalElement) {
    cartTotalElement.textContent = `Total: ₹${totalPrice.toLocaleString()}`
  }

  // Update cart section if it exists
  displayCartItems()
}

function displayCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")

  if (!cartItemsContainer) return

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>'
    return
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <br>
                <small>₹${item.price.toLocaleString()} each</small>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="updateCartQuantity('${item.name}', ${item.quantity - 1})" 
                        style="background: #ff4081; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">-</button>
                <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.name}', ${item.quantity + 1})" 
                        style="background: #ff4081; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">+</button>
                <button onclick="removeFromCart('${item.name}')" 
                        style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Remove</button>
            </div>
            <div style="font-weight: bold; color: #e91e63;">
                ₹${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `,
    )
    .join("")
}

function clearCart() {
  if (cart.length === 0) {
    showNotification("Cart is already empty!", "info")
    return
  }

  if (confirm("Are you sure you want to clear your cart?")) {
    cart = []
    updateCartDisplay()
    showNotification("Cart cleared successfully!", "success")
  }
}

function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (confirm(`Proceed to checkout?\n\nTotal Items: ${totalItems}\nTotal Amount: ₹${totalPrice.toLocaleString()}`)) {
    // Simulate checkout process
    showNotification("Processing your order...", "info")

    setTimeout(() => {
      cart = []
      updateCartDisplay()
      showNotification("Order placed successfully! Thank you for shopping with Nykaa!", "success")
    }, 2000)
  }
}

// Shopping Page Functions
function initializeShoppingPage() {
  // Initialize filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn")
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      this.classList.add("active")
    })
  })
}

function filterProducts(category) {
  const products = document.querySelectorAll(".product-card")

  products.forEach((product) => {
    if (category === "all" || product.dataset.category === category) {
      product.style.display = "block"
      product.classList.add("fade-in")
    } else {
      product.style.display = "none"
      product.classList.remove("fade-in")
    }
  })
}

// Utility Functions
function showAddToCartAnimation() {
  // Add a simple animation effect when item is added to cart
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    cartCount.style.transform = "scale(1.2)"
    cartCount.style.color = "#4caf50"

    setTimeout(() => {
      cartCount.style.transform = "scale(1)"
      cartCount.style.color = "#e91e63"
    }, 300)
  }
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.backgroundColor = "#4caf50"
      break
    case "error":
      notification.style.backgroundColor = "#f44336"
      break
    case "info":
      notification.style.backgroundColor = "#2196f3"
      break
    default:
      notification.style.backgroundColor = "#ff4081"
  }

  // Add to page
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Search functionality (if needed)
function searchProducts(query) {
  const products = document.querySelectorAll(".product-card")
  const searchQuery = query.toLowerCase()

  products.forEach((product) => {
    const productName = product.querySelector("h3").textContent.toLowerCase()
    const productDescription = product.querySelector(".description")?.textContent.toLowerCase() || ""

    if (productName.includes(searchQuery) || productDescription.includes(searchQuery)) {
      product.style.display = "block"
    } else {
      product.style.display = "none"
    }
  })
}

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})

// Handle form submissions
function handleFormSubmission(formId, callback) {
  const form = document.getElementById(formId)
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault()
      callback(this)
    })
  }
}

// Local Storage functions for cart persistence
function saveCartToStorage() {
  localStorage.setItem("nykaa_cart", JSON.stringify(cart))
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("nykaa_cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartDisplay()
  }
}