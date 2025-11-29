// ========= HELPER =========
function formatPrice(value) {
  return value.toLocaleString("vi-VN") + " đ";
}

// ========= WISHLIST LOGIC =========
const wishlist = new Map(); // key: productId, value: {name, price}
const wishlistCountEl = document.getElementById("wishlist-count");
const wishlistListEl = document.getElementById("wishlist-list");

function updateWishlistUI() {
  wishlistCountEl.textContent = wishlist.size;

  wishlistListEl.innerHTML = "";
  if (wishlist.size === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item text-center text-secondary";
    li.textContent = "Chưa có sản phẩm nào trong Wishlist.";
    wishlistListEl.appendChild(li);
    return;
  }

  wishlist.forEach((item, id) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <div class="fw-semibold">${item.name}</div>
        <div class="small text-muted">${formatPrice(item.price)}</div>
      </div>
      <button class="btn btn-link text-danger p-0 small remove-wishlist" data-id="${id}">
        <i class="bi bi-x-circle"></i>
      </button>
    `;
    wishlistListEl.appendChild(li);
  });
}

// Lắng nghe click chung cho wishlist (nút tim + remove)
document.addEventListener("click", function (e) {
  // Toggle wishlist từ card sản phẩm
  if (e.target.closest(".wishlist-btn")) {
    const btn = e.target.closest(".wishlist-btn");
    const cardCol = btn.closest(".product-col");
    const productId = btn.getAttribute("data-product-id");
    const name = cardCol.getAttribute("data-name");
    const price = Number(cardCol.getAttribute("data-price"));

    if (wishlist.has(productId)) {
      wishlist.delete(productId);
      btn.classList.remove("active");
    } else {
      wishlist.set(productId, { name, price });
      btn.classList.add("active");
    }

    updateWishlistUI();
  }

  // Xoá 1 item trong wishlist (trong offcanvas)
  if (e.target.closest(".remove-wishlist")) {
    const id = e.target.closest(".remove-wishlist").getAttribute("data-id");
    wishlist.delete(id);

    // Bỏ trạng thái active trên nút tim tương ứng
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      if (btn.getAttribute("data-product-id") === id) {
        btn.classList.remove("active");
      }
    });

    updateWishlistUI();
  }
});

// Xoá toàn bộ wishlist
const wishlistClearBtn = document.getElementById("wishlist-clear");
if (wishlistClearBtn) {
  wishlistClearBtn.addEventListener("click", function () {
    wishlist.clear();
    document
      .querySelectorAll(".wishlist-btn")
      .forEach((btn) => btn.classList.remove("active"));
    updateWishlistUI();
  });
}

// ========= PRODUCT MODAL + SIZE + RECOMMENDATIONS =========
const productModalName = document.getElementById("productModalName");
const productModalPrice = document.getElementById("productModalPrice");
const productModalImage = document.getElementById("productModalImage");
const productModalTags = document.getElementById("productModalTags");
const recommendationRow = document.getElementById("recommendation-row");
const sizeButtons = Array.from(document.querySelectorAll("#productModal .size-btn"));
const colorButtons = Array.from(document.querySelectorAll("#productModal .color-btn"));
let selectedColor = null;

colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    colorButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedColor = btn.dataset.color || btn.textContent.trim();
    console.log("Màu đã chọn:", selectedColor);
  });
});
const btnModalAddCart = document.getElementById("btn-modal-add-cart");

let selectedSize = null;
let selectedColor = null;
let currentProductId = null; // nếu sau này bạn muốn gắn id sản phẩm


// các nút chọn size trong modal
const sizeButtons = Array.from(
  document.querySelectorAll("#productModal .size-btn")
);
let selectedSize = null;

// lưu thông tin sản phẩm đang mở modal (để thêm giỏ)
let currentModalProductId = null;
let currentModalProductName = "";
let currentModalProductPrice = 0;

// Khi bấm nút xem chi tiết
document.querySelectorAll(".btn-details").forEach((btn) => {
  btn.addEventListener("click", function () {
    const col = btn.closest(".product-col");
    const title = col.getAttribute("data-name");
    const price = Number(col.getAttribute("data-price"));
    const gender = col.getAttribute("data-gender");
    const type = col.getAttribute("data-type");
    const imgSrc = col.querySelector("img").src;
    const productId = col.getAttribute("data-product-id") || null;

    // Reset size + màu mỗi lần mở modal
    selectedSize = null;
    selectedColor = null;
    currentProductId = productId;

    sizeButtons.forEach((b) => b.classList.remove("active"));
    colorButtons.forEach((b) => b.classList.remove("active"));

    // Đổ dữ liệu vào modal
    productModalName.textContent = title;
    productModalPrice.textContent = formatPrice(price);
    productModalImage.src = imgSrc;
    productModalImage.alt = title;
    productModalTags.textContent = gender.toUpperCase() + " · " + type;

    // (phần gợi ý sản phẩm bạn giữ nguyên như cũ)
    const allCols = Array.from(document.querySelectorAll(".product-col"));
    const currentIndex = allCols.indexOf(col);

    const candidates = allCols.filter((c, idx) => {
      if (idx === currentIndex) return false;
      const g = c.getAttribute("data-gender");
      const t = c.getAttribute("data-type");
      return g === gender || t === type;
    });

    recommendationRow.innerHTML = "";
    if (candidates.length === 0) {
      const colEmpty = document.createElement("div");
      colEmpty.className = "col-12";
      colEmpty.innerHTML = `
        <div class="text-center text-secondary small">
          Chưa có gợi ý tương tự. Bạn có thể bổ sung thêm sản phẩm trong HTML.
        </div>`;
      recommendationRow.appendChild(colEmpty);
      return;
    }

    candidates.slice(0, 3).forEach((c) => {
      const recName = c.getAttribute("data-name");
      const recPrice = Number(c.getAttribute("data-price"));
      const recImg = c.querySelector("img").src;

      const recCol = document.createElement("div");
      recCol.className = "col-12 col-md-4";
      recCol.innerHTML = `
        <div class="card h-100 border-0 shadow-sm">
          <img src="${recImg}" class="card-img-top" alt="${recName}">
          <div class="card-body py-2 px-3">
            <h6 class="card-title mb-1 small">${recName}</h6>
            <div class="small text-danger fw-semibold">${formatPrice(recPrice)}</div>
          </div>
        </div>
      `;
      recommendationRow.appendChild(recCol);
    });
  });
});

// Chọn size
sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sizeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedSize = btn.dataset.size || btn.textContent.trim();
    console.log("Size đã chọn:", selectedSize);
  });
});

// Chọn size
sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sizeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedSize = btn.dataset.size || btn.textContent.trim();
    console.log("Size đã chọn:", selectedSize);
  });
});

// Chọn màu
colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    colorButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedColor = btn.dataset.color || btn.textContent.trim();
    console.log("Màu đã chọn:", selectedColor);
  });
});

// Thêm vào giỏ – cần size + màu
btnModalAddCart.addEventListener("click", () => {
  if (!requireVariantSelected()) return;

  const productName = productModalName.textContent;

  // Ở đây bạn có thể push vào 1 mảng cart[] để xử lý sau.
  console.log("Add to cart:", {
    id: currentProductId,
    name: productName,
    size: selectedSize,
    color: selectedColor,
  });

  alert(
    `Đã thêm vào giỏ:\n${productName}\nSize: ${selectedSize}\nMàu: ${selectedColor}`
  );
});

// Mua ngay – mở modal thanh toán nếu đã chọn size + màu
btnModalBuyNow.addEventListener("click", () => {
  if (!requireVariantSelected()) return;

  const checkoutModalEl = document.getElementById("checkoutModal");
  const checkoutModal = new bootstrap.Modal(checkoutModalEl);
  checkoutModal.show();

  // Sau này bạn có thể fill sẵn thông tin đơn hàng vào checkout
  console.log("Mua ngay:", {
    id: currentProductId,
    name: productModalName.textContent,
    size: selectedSize,
    color: selectedColor,
  });
});

// Chọn màu
colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    colorButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedColor = btn.dataset.color || btn.textContent.trim();
    console.log("Màu đã chọn:", selectedColor);
  });
});

    currentModalProductId = id;
    currentModalProductName = title;
    currentModalProductPrice = price;

    // reset size khi mở modal mới
    selectedSize = null;
    sizeButtons.forEach((b) => b.classList.remove("active"));

    // Đổ dữ liệu vào modal
    productModalName.textContent = title;
    productModalPrice.textContent = formatPrice(price);
    productModalImage.src = imgSrc;
    productModalImage.alt = title;
    productModalTags.textContent = gender.toUpperCase() + " · " + type;

    // Gợi ý sản phẩm cùng giới tính hoặc cùng loại
    const allCols = Array.from(document.querySelectorAll(".product-col"));
    const currentIndex = allCols.indexOf(col);

    const candidates = allCols.filter((c, idx) => {
      if (idx === currentIndex) return false;
      const g = c.getAttribute("data-gender");
      const t = c.getAttribute("data-type");
      return g === gender || t === type;
    });

    recommendationRow.innerHTML = "";
    if (candidates.length === 0) {
      const colEmpty = document.createElement("div");
      colEmpty.className = "col-12";
      colEmpty.innerHTML = `
        <div class="text-center text-secondary small">
          Chưa có gợi ý tương tự. Bạn có thể bổ sung thêm sản phẩm trong HTML.
        </div>`;
      recommendationRow.appendChild(colEmpty);
      return;
    }

    candidates.slice(0, 3).forEach((c) => {
      const recName = c.getAttribute("data-name");
      const recPrice = Number(c.getAttribute("data-price"));
      const recImg = c.querySelector("img").src;

      const recCol = document.createElement("div");
      recCol.className = "col-12 col-md-4";
      recCol.innerHTML = `
        <div class="card h-100 border-0 shadow-sm">
          <img src="${recImg}" class="card-img-top" alt="${recName}">
          <div class="card-body py-2 px-3">
            <h6 class="card-title mb-1 small">${recName}</h6>
            <div class="small text-danger fw-semibold">${formatPrice(recPrice)}</div>
          </div>
        </div>
      `;
      recommendationRow.appendChild(recCol);
    });
  });
});

// Chọn size trong modal
sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // bỏ active tất cả trước
    sizeButtons.forEach((b) => b.classList.remove("active"));
    // set active cho nút vừa click
    btn.classList.add("active");
    // lưu lại size đã chọn (để sau này dùng cho giỏ hàng)
    selectedSize = btn.textContent.trim();
    console.log("Đã chọn size:", selectedSize);
  });
});

// ========= CART + ORDER SUMMARY =========
let cart = []; // {key, id, name, price, size, qty}

const orderSummaryEl = document.getElementById("order-summary");
const orderTotalEl = document.getElementById("order-total");
const sizeErrorEl = document.getElementById("size-error");

function addToCart(id, name, price, size = null) {
  const key = id + "|" + (size || "no-size");
  const existing = cart.find((item) => item.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ key, id, name, price, size, qty: 1 });
  }

  updateOrderSummary();
}

function updateOrderSummary() {
  if (!orderSummaryEl || !orderTotalEl) return;

  orderSummaryEl.innerHTML = "";
  if (cart.length === 0) {
    orderSummaryEl.innerHTML =
      '<li class="list-group-item small text-secondary">Chưa có sản phẩm nào trong giỏ hàng.</li>';
    orderTotalEl.textContent = "0 đ";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    const sizeText = item.size ? ` · Size ${item.size}` : "";
    li.innerHTML = `
      <div>
        <div class="fw-semibold">${item.name}${sizeText}</div>
        <div class="small text-muted">SL: ${item.qty}</div>
      </div>
      <strong class="small">${formatPrice(item.price * item.qty)}</strong>
    `;
    orderSummaryEl.appendChild(li);
    total += item.price * item.qty;
  });

  orderTotalEl.textContent = formatPrice(total);
}

// Thêm giỏ từ card sản phẩm
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const col = btn.closest(".product-col");
    const id = col.getAttribute("data-product-id");
    const name = col.getAttribute("data-name");
    const price = Number(col.getAttribute("data-price"));

    addToCart(id, name, price); // chưa chọn size -> để null
    alert("Đã thêm sản phẩm vào giỏ hàng.");
  });
});

// Thêm giỏ từ modal (bắt buộc chọn size)
const modalAddToCartBtn = document.getElementById("modal-add-to-cart");
if (modalAddToCartBtn) {
  modalAddToCartBtn.addEventListener("click", () => {
    if (!selectedSize) {
      sizeErrorEl.classList.remove("d-none");
      sizeErrorEl.textContent = "Vui lòng chọn size trước khi thêm vào giỏ.";
      return;
    }
    sizeErrorEl.classList.add("d-none");

    addToCart(
      currentModalProductId,
      currentModalProductName,
      currentModalProductPrice,
      selectedSize
    );
    alert("Đã thêm sản phẩm vào giỏ hàng.");
  });
}

// 'Đặt hàng ngay' từ Wishlist -> lấy sản phẩm trong wishlist đổ vào giỏ
const wishlistCheckoutBtn = document.getElementById("wishlist-checkout");
if (wishlistCheckoutBtn) {
  wishlistCheckoutBtn.addEventListener("click", () => {
    if (wishlist.size === 0) {
      // không có gì trong wishlist thì giữ nguyên cart
      return;
    }

    cart = [];
    wishlist.forEach((item, id) => {
      const key = id + "|no-size";
      cart.push({
        key,
        id,
        name: item.name,
        price: item.price,
        size: null,
        qty: 1,
      });
    });
    updateOrderSummary();
  });
}

// ========= FILTERS (giới tính, type, search, sort) =========
const filterGenderEl = document.getElementById("filter-gender");
const filterTypeEl = document.getElementById("filter-type");
const filterSortEl = document.getElementById("filter-sort");
const filterSearchEl = document.getElementById("search-input"); // dùng luôn ô search hiện tại
const productCols = Array.from(document.querySelectorAll(".product-col"));
const productCountLabel = document.getElementById("product-count-label");
const productGrid = document.getElementById("product-grid");

function applyFilters() {
  const gender = filterGenderEl.value;
  const type = filterTypeEl.value;
  const sort = filterSortEl.value;
  const searchTerm = filterSearchEl.value.trim().toLowerCase();

  // Lọc
  let visibleProducts = productCols.filter((col) => {
    const g = col.getAttribute("data-gender");
    const t = col.getAttribute("data-type");
    const name = col.getAttribute("data-name").toLowerCase();

    const matchGender = gender === "all" || g === gender;
    const matchType = type === "all" || t === type;
    const matchSearch = name.includes(searchTerm);

    return matchGender && matchType && matchSearch;
  });

  // Sắp xếp theo giá
  if (sort === "price-asc" || sort === "price-desc") {
    visibleProducts.sort((a, b) => {
      const pa = Number(a.getAttribute("data-price"));
      const pb = Number(b.getAttribute("data-price"));
      return sort === "price-asc" ? pa - pb : pb - pa;
    });
  }

  // Ẩn / hiện + sắp xếp lại DOM
  productCols.forEach((col) => col.classList.add("d-none"));
  visibleProducts.forEach((col) => {
    col.classList.remove("d-none");
    if (productGrid) productGrid.appendChild(col);
  });

  productCountLabel.textContent = visibleProducts.length + " sản phẩm";
}

// Gán sự kiện cho filter
[filterGenderEl, filterTypeEl, filterSortEl].forEach((el) => {
  el.addEventListener("change", applyFilters);
});

filterSearchEl.addEventListener("input", applyFilters);

// ========= CHECKOUT SUBMIT =========
const checkoutSubmitBtn = document.getElementById("checkout-submit");
const checkoutErrorEl = document.getElementById("checkout-error");

if (checkoutSubmitBtn) {
  checkoutSubmitBtn.addEventListener("click", () => {
    const nameInput = document.querySelector(
      "#checkoutModal input[type='text']"
    );
    const phoneInput = document.querySelector(
      "#checkoutModal input[type='tel']"
    );
    const addressInput = document.querySelector("#checkoutModal textarea");

    if (cart.length === 0) {
      checkoutErrorEl.textContent =
        "Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi đặt.";
      checkoutErrorEl.classList.remove("d-none");
      return;
    }

    if (
      !nameInput.value.trim() ||
      !phoneInput.value.trim() ||
      !addressInput.value.trim()
    ) {
      checkoutErrorEl.textContent =
        "Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ.";
      checkoutErrorEl.classList.remove("d-none");
      return;
    }

    checkoutErrorEl.classList.add("d-none");

    alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại ShoeStore 💙");

    // reset giỏ + wishlist
    cart = [];
    updateOrderSummary();

    wishlist.clear();
    updateWishlistUI();
    document
      .querySelectorAll(".wishlist-btn")
      .forEach((btn) => btn.classList.remove("active"));

    // đóng modal
    const modalEl = document.getElementById("checkoutModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
  });
}

// ========= INIT =========
updateWishlistUI();
updateOrderSummary();
applyFilters();