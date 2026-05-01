const PRODUCT_IMAGES_BUCKET = "product-images";

const adminState = {
  session: null,
  currentView: "orders",
  products: [],
  orders: [],
  announcement: null
};

document.addEventListener("DOMContentLoaded", async () => {
  notificationSystem.init();
  bindAdminEvents();
  await initAdminSession();
});

function bindAdminEvents() {
  document.getElementById("admin-login-form")?.addEventListener("submit", handleAdminLogin);
  document.getElementById("admin-logout-btn")?.addEventListener("click", handleAdminLogout);
  document.getElementById("admin-refresh-btn")?.addEventListener("click", refreshCurrentView);
  document.getElementById("orders-status-filter")?.addEventListener("change", renderOrders);
  document.getElementById("product-form")?.addEventListener("submit", handleProductSubmit);
  document.getElementById("product-new-btn")?.addEventListener("click", resetProductForm);
  document.getElementById("product-image-file")?.addEventListener("change", previewSelectedProductImage);
  document.getElementById("product-image-url")?.addEventListener("input", updateProductPreview);
  document.getElementById("announcement-form")?.addEventListener("submit", handleAnnouncementSubmit);
  document.getElementById("announcement-remove-btn")?.addEventListener("click", removeAnnouncement);

  document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchAdminView(btn.dataset.adminView));
  });
}

async function initAdminSession() {
  const { data } = await window.supabaseClient.auth.getSession();
  adminState.session = data.session;

  if (!adminState.session) {
    showAdminLogin();
    return;
  }

  const allowed = await verifyAdmin();
  if (!allowed) {
    await window.supabaseClient.auth.signOut();
    showAdminLogin();
    notificationSystem.error("هذا الحساب غير مصرح له بدخول الإدارة", 3500);
    return;
  }

  showAdminDashboard();
  await refreshCurrentView();
}

async function verifyAdmin() {
  const email = adminState.session?.user?.email;
  if (!email) return false;

  const { data, error } = await window.supabaseClient
    .from("admin_users")
    .select("id")
    .eq("active", true)
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    console.error("Admin verification error:", error);
    return false;
  }

  return Boolean(data);
}

function showAdminLogin() {
  document.getElementById("admin-login-panel").hidden = false;
  document.getElementById("admin-content").hidden = true;
  document.querySelector(".admin-sidebar-footer").style.display = "none";
}

function showAdminDashboard() {
  document.getElementById("admin-login-panel").hidden = true;
  document.getElementById("admin-content").hidden = false;
  document.querySelector(".admin-sidebar-footer").style.display = "flex";
  document.getElementById("admin-email").textContent = adminState.session.user.email;
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById("admin-login-email").value.trim().toLowerCase();
  const password = document.getElementById("admin-login-password").value;

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    notificationSystem.error(error.message || "تعذر تسجيل الدخول");
    return;
  }

  adminState.session = data.session;
  await initAdminSession();
}

async function handleAdminLogout() {
  await window.supabaseClient.auth.signOut();
  adminState.session = null;
  showAdminLogin();
}

function switchAdminView(view) {
  adminState.currentView = view;
  const titles = {
    orders: "إدارة الطلبات",
    products: "إدارة المنتجات",
    announcement: "رسالة الموسم"
  };

  document.getElementById("admin-page-title").textContent = titles[view] || titles.orders;
  document.querySelectorAll(".admin-nav-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.adminView === view));
  document.querySelectorAll(".admin-view").forEach((panel) => panel.classList.toggle("active", panel.id === `admin-view-${view}`));
  refreshCurrentView();
}

async function refreshCurrentView() {
  if (!adminState.session) return;
  if (adminState.currentView === "orders") await loadOrders();
  if (adminState.currentView === "products") await loadProducts();
  if (adminState.currentView === "announcement") await loadAnnouncement();
}

async function loadOrders() {
  const { data, error } = await window.supabaseClient
    .from("orders")
    .select("*, order_items(*, products(name_ar, name_en))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load orders error:", error);
    notificationSystem.error("تعذر تحميل الطلبات");
    return;
  }

  adminState.orders = data || [];
  renderOrders();
}

function renderOrders() {
  const list = document.getElementById("admin-orders-list");
  const filter = document.getElementById("orders-status-filter").value;
  const orders = adminState.orders.filter((order) => filter === "all" || order.payment_status === filter);

  if (!orders.length) {
    list.innerHTML = '<div class="admin-empty">لا توجد طلبات بهذا الفلتر</div>';
    return;
  }

  list.innerHTML = orders.map((order) => {
    const items = (order.order_items || []).map((item) => {
      const productName = item.products?.name_ar || item.products?.name_en || "منتج";
      return `${productName} (${item.size}) x ${item.quantity}`;
    }).join("، ");

    const proofLink = order.payment_proof_url
      ? `<a class="payment-link" href="${order.payment_proof_url}" target="_blank" rel="noopener">فتح صورة الدفع</a>`
      : '<span class="admin-pill">لا يوجد رابط صورة</span>';

    return `
      <article class="admin-list-item">
        <div class="admin-item-header">
          <div>
            <div class="admin-item-title">طلب #${String(order.id).slice(-6).toUpperCase()}</div>
            <div class="admin-meta">
              <span>${new Date(order.created_at).toLocaleString("ar-EG")}</span>
              <span>${order.customer_name || "بدون اسم"}</span>
              <span dir="ltr">${order.phone || ""}</span>
            </div>
          </div>
          <span class="admin-pill">${getPaymentStatusLabel(order.payment_status)}</span>
        </div>
        <div class="admin-item-grid">
          <div class="admin-field"><strong>الإجمالي</strong>${order.total || 0} ج.م</div>
          <div class="admin-field"><strong>طريقة الدفع</strong>${getPaymentMethodLabel(order.payment_method)}</div>
          <div class="admin-field"><strong>العنوان</strong>${order.address || ""} - ${order.city || ""}</div>
          <div class="admin-field"><strong>المنتجات</strong>${items || "لا توجد منتجات"}</div>
          <div class="admin-field"><strong>إثبات الدفع</strong>${proofLink}</div>
          <div class="admin-field"><strong>سبب الرفض</strong>${order.rejection_reason || "لا يوجد"}</div>
        </div>
        <div class="admin-actions">
          <input class="admin-input admin-reason" id="reason-${order.id}" placeholder="سبب الرفض أو ملاحظة الإدارة">
          <button class="admin-primary-btn" onclick="reviewOrder('${order.id}', 'approved')">موافقة</button>
          <button class="admin-ghost-btn" onclick="reviewOrder('${order.id}', 'rejected')">رفض</button>
        </div>
      </article>
    `;
  }).join("");
}

function getPaymentStatusLabel(status) {
  const labels = {
    pending_review: "بانتظار المراجعة",
    approved: "تمت الموافقة",
    rejected: "مرفوض"
  };
  return labels[status] || status || "غير محدد";
}

function getPaymentMethodLabel(method) {
  const labels = {
    instapay: "InstaPay",
    vodafone_cash: "محفظة"
  };
  return labels[method] || method || "غير محدد";
}

async function reviewOrder(orderId, decision) {
  const reason = document.getElementById(`reason-${orderId}`)?.value.trim() || "";

  if (decision === "rejected" && !reason) {
    notificationSystem.warning("اكتب سبب الرفض أولا");
    return;
  }

  const payload = {
    payment_status: decision,
    status: decision === "approved" ? "completed" : "cancelled",
    rejection_reason: decision === "rejected" ? reason : null,
    admin_note: reason || null,
    payment_reviewed_at: new Date().toISOString()
  };

  const { error } = await window.supabaseClient
    .from("orders")
    .update(payload)
    .eq("id", orderId);

  if (error) {
    console.error("Review order error:", error);
    notificationSystem.error("تعذر تحديث الطلب");
    return;
  }

  notificationSystem.success(decision === "approved" ? "تمت الموافقة على الطلب" : "تم رفض الطلب");
  await loadOrders();
}

async function loadProducts() {
  const { data, error } = await window.supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Load products error:", error);
    notificationSystem.error("تعذر تحميل المنتجات");
    return;
  }

  adminState.products = data || [];
  renderProductsAdmin();
}

function renderProductsAdmin() {
  const list = document.getElementById("admin-products-list");
  if (!adminState.products.length) {
    list.innerHTML = '<div class="admin-empty">لا توجد منتجات بعد</div>';
    return;
  }

  list.innerHTML = adminState.products.map((product) => `
    <article class="admin-list-item">
      <div class="admin-item-header">
        <div>
          <div class="admin-item-title">${product.name_ar || product.name_en || "منتج بدون اسم"}</div>
          <div class="admin-meta">
            <span>${product.name_en || ""}</span>
            <span>${product.price || product.price_50ml || 0} ج.م</span>
          </div>
        </div>
        <img class="admin-product-thumb" src="${product.image || "images/logo.png"}" alt="">
      </div>
      <div class="admin-actions">
        <button class="admin-primary-btn" onclick="editProduct(${product.id})">تعديل</button>
        <button class="admin-ghost-btn" onclick="deleteProduct(${product.id})">حذف</button>
      </div>
    </article>
  `).join("");
}

function editProduct(productId) {
  const product = adminState.products.find((item) => item.id === productId);
  if (!product) return;

  document.getElementById("product-form-title").textContent = "تعديل منتج";
  document.getElementById("product-id").value = product.id;
  document.getElementById("product-name-ar").value = product.name_ar || "";
  document.getElementById("product-name-en").value = product.name_en || "";
  document.getElementById("product-price").value = product.price || product.price_50ml || "";
  document.getElementById("product-original-price").value = product.original_price_50ml || product.original_price || "";
  document.getElementById("product-desc-ar").value = product.desc_ar || "";
  document.getElementById("product-desc-en").value = product.desc_en || "";
  document.getElementById("product-notes-ar").value = product.notes_ar || "";
  document.getElementById("product-notes-en").value = product.notes_en || "";
  document.getElementById("product-image-url").value = product.image || "";
  updateProductPreview();
  document.getElementById("product-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetProductForm() {
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-form-title").textContent = "إضافة منتج";
  const preview = document.getElementById("product-image-preview");
  preview.src = "";
  preview.style.display = "none";
}

function updateProductPreview() {
  const url = document.getElementById("product-image-url").value.trim();
  const preview = document.getElementById("product-image-preview");
  preview.src = url;
  preview.style.display = url ? "block" : "none";
}

function previewSelectedProductImage() {
  const file = document.getElementById("product-image-file").files?.[0];
  if (!file) {
    updateProductPreview();
    return;
  }
  const preview = document.getElementById("product-image-preview");
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
}

async function uploadProductImage(file) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
  const randomId = window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2);
  const filePath = `products/${Date.now()}-${randomId}.${safeExtension}`;

  const { error } = await window.supabaseClient.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg"
    });

  if (error) throw error;

  const { data } = window.supabaseClient.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

async function handleProductSubmit(event) {
  event.preventDefault();
  const productId = document.getElementById("product-id").value;
  const imageFile = document.getElementById("product-image-file").files?.[0];
  let image = document.getElementById("product-image-url").value.trim();

  try {
    if (imageFile) image = await uploadProductImage(imageFile);

    const price = Number(document.getElementById("product-price").value);
    const originalPrice = Number(document.getElementById("product-original-price").value) || null;
    const payload = {
      name_ar: document.getElementById("product-name-ar").value.trim(),
      name_en: document.getElementById("product-name-en").value.trim(),
      desc_ar: document.getElementById("product-desc-ar").value.trim(),
      desc_en: document.getElementById("product-desc-en").value.trim(),
      notes_ar: document.getElementById("product-notes-ar").value.trim(),
      notes_en: document.getElementById("product-notes-en").value.trim(),
      image,
      price,
      price_50ml: price,
      original_price: originalPrice,
      original_price_50ml: originalPrice,
      sizes: ["50 ml"],
      prices: { "50 ml": price },
      updated_at: new Date().toISOString()
    };

    const request = productId
      ? window.supabaseClient.from("products").update(payload).eq("id", productId)
      : window.supabaseClient.from("products").insert([payload]);

    const { error } = await request;
    if (error) throw error;

    notificationSystem.success(productId ? "تم تحديث المنتج" : "تم إضافة المنتج");
    resetProductForm();
    await loadProducts();
  } catch (err) {
    console.error("Save product error:", err);
    notificationSystem.error(err.message || "تعذر حفظ المنتج");
  }
}

async function deleteProduct(productId) {
  if (!confirm("هل تريد حذف هذا المنتج؟")) return;

  const { error } = await window.supabaseClient
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    notificationSystem.error("تعذر حذف المنتج");
    return;
  }

  notificationSystem.success("تم حذف المنتج");
  await loadProducts();
}

async function loadAnnouncement() {
  const { data, error } = await window.supabaseClient
    .from("site_announcements")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Load announcement error:", error);
    notificationSystem.error("تعذر تحميل رسالة الموسم");
    return;
  }

  adminState.announcement = data;
  document.getElementById("announcement-message-ar").value = data?.message_ar || "";
  document.getElementById("announcement-message-en").value = data?.message_en || "";
  document.getElementById("announcement-active").checked = Boolean(data?.active);
}

async function handleAnnouncementSubmit(event) {
  event.preventDefault();
  const payload = {
    message_ar: document.getElementById("announcement-message-ar").value.trim(),
    message_en: document.getElementById("announcement-message-en").value.trim(),
    active: document.getElementById("announcement-active").checked,
    starts_at: null,
    ends_at: null,
    updated_at: new Date().toISOString()
  };

  const request = adminState.announcement?.id
    ? window.supabaseClient.from("site_announcements").update(payload).eq("id", adminState.announcement.id)
    : window.supabaseClient.from("site_announcements").insert([payload]);

  const { error } = await request;
  if (error) {
    console.error("Save announcement error:", error);
    notificationSystem.error("تعذر حفظ رسالة الموسم");
    return;
  }

  notificationSystem.success("تم حفظ رسالة الموسم");
  await loadAnnouncement();
}

async function removeAnnouncement() {
  if (!adminState.announcement?.id) {
    document.getElementById("announcement-active").checked = false;
    notificationSystem.success("تمت إزالة الرسالة من الصفحة");
    return;
  }

  const { error } = await window.supabaseClient
    .from("site_announcements")
    .update({
      active: false,
      starts_at: null,
      ends_at: null,
      updated_at: new Date().toISOString()
    })
    .eq("id", adminState.announcement.id);

  if (error) {
    console.error("Remove announcement error:", error);
    notificationSystem.error("تعذر إزالة الرسالة");
    return;
  }

  notificationSystem.success("تمت إزالة الرسالة من الصفحة");
  await loadAnnouncement();
}

window.reviewOrder = reviewOrder;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
