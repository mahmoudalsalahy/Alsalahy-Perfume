/**
 * i18n.js - Internationalization / Translation System
 * Supports Arabic (RTL) and English (LTR)
 */

const translations = {
  ar: {
    // Navigation
    nav_home: "الرئيسية",
    nav_products: "العطور",
    nav_about: "من نحن",
    nav_contact: "تواصل معنا",
    nav_cart: "السلة",
    nav_login: "تسجيل الدخول",
    nav_register: "إنشاء حساب",
    nav_logout: "تسجيل الخروج",
    nav_welcome: "مرحباً",

    // Hero
    hero_title: "الصلاحي للعطور",
    hero_subtitle: "عطور فاخرة تحكي قصتك",
    hero_tagline: "اكتشف عالم الأناقة والفخامة",
    hero_cta: "تسوق الآن",

    // Products
    products_title: "مجموعتنا المميزة",
    products_subtitle: "عطور فاخرة مصنوعة بعناية من أجود المكونات",
    product_add_cart: "أضف للسلة",
    product_details: "التفاصيل",
    product_size: "الحجم",
    product_quantity: "الكمية",
    product_price: "السعر",
    product_currency: "ج.م",
    product_close: "إغلاق",
    product_notes_label: "المكونات",

    // Product names & descriptions
    product_1_name: "عود ملكي",
    product_1_desc: "عطر فاخر بنفحات العود الطبيعي الممزوج بالعنبر والمسك الأبيض، يمنحك حضوراً ملكياً لا يُنسى. تركيبة شرقية أصيلة تدوم طويلاً.",
    product_1_notes: "العود • العنبر • المسك الأبيض • خشب الصندل",

    product_2_name: "مسك فضي",
    product_2_desc: "مزيج أنيق من المسك الفاخر والزهور البيضاء مع لمسات من الفانيليا، عطر يعكس الأناقة والنقاء. مثالي للمناسبات الخاصة.",
    product_2_notes: "المسك • الزهور البيضاء • الفانيليا • الأرز",

    product_3_name: "وردة مخملية",
    product_3_desc: "عطر ساحر يجمع بين الورد الدمشقي والعود الفاخر مع لمسة من التوت البري، تجربة عطرية فريدة تأسر الحواس.",
    product_3_notes: "الورد الدمشقي • العود • التوت البري • الباتشولي",

    // Cart
    cart_title: "سلة التسوق",
    cart_empty: "سلتك فارغة",
    cart_empty_msg: "لم تقم بإضافة أي منتجات بعد",
    cart_total: "الإجمالي",
    cart_checkout: "إتمام الطلب",
    cart_clear: "مسح السلة",
    cart_remove: "إزالة",
    cart_continue: "متابعة التسوق",

    // Order
    order_title: "إتمام الطلب",
    order_name: "الاسم الكامل",
    order_phone: "رقم الهاتف",
    order_address: "العنوان",
    order_city: "المدينة",
    order_notes: "ملاحظات إضافية",
    order_summary: "ملخص الطلب",
    order_submit: "تأكيد الطلب",
    order_cancel: "إلغاء",
    payment_title: "طريقة الدفع",
    payment_instapay: "InstaPay",
    payment_vodafone: "محفظة",
    payment_instapay_open: "افتح رابط InstaPay",
    payment_vodafone_number: "رقم المحفظة",
    payment_proof: "صورة إثبات الدفع",
    payment_proof_hint: "ارفع Screenshot أو صورة إيصال الدفع.",
    order_success_title: "تم استلام طلبك!",
    order_success_msg: "سنراجع صورة الدفع أولا، ثم نؤكد الطلب ونتواصل معك.",
    order_back_home: "العودة للرئيسية",

    // Auth
    auth_login_title: "تسجيل الدخول",
    auth_register_title: "إنشاء حساب جديد",
    auth_email: "البريد الإلكتروني",
    auth_password: "كلمة المرور",
    auth_confirm_password: "تأكيد كلمة المرور",
    auth_phone: "رقم الهاتف",
    auth_name: "الاسم الكامل",
    auth_login_btn: "تسجيل الدخول",
    auth_register_btn: "إنشاء حساب",
    auth_google: "المتابعة مع جوجل",
    auth_or: "أو",
    auth_have_account: "لديك حساب بالفعل؟",
    auth_no_account: "ليس لديك حساب؟",
    auth_forgot: "نسيت كلمة المرور؟",

    // About
    about_title: "من نحن",
    about_text_1: "علامة الصلاحي للعطور متخصصة في صناعة العطور الراقية. نؤمن بأن العطر هو الانطباع الأول الذي يدوم.",
    about_text_2: "",
    about_quality: "جودة فريدة",
    about_quality_desc: "افضل سعر بجودة استثنائية",
    about_crafted: "صناعة يدوية",
    about_crafted_desc: "كل عطر يُصنع بعناية فائقة",
    about_lasting: "ثبات يدوم",
    about_lasting_desc: "تركيبات مركزة تدوم طوال اليوم",

    // Contact
    contact_title: "تواصل معنا",
    contact_subtitle: "نسعد بتواصلكم",
    contact_name: "الاسم",
    contact_email: "البريد الإلكتروني",
    contact_message: "الرسالة",
    contact_send: "إرسال",
    contact_phone_label: "الهاتف",
    contact_email_label: "البريد",
    contact_address_label: "العنوان",
    contact_phone_val: "+20 155 811 8597",
    contact_email_val: "alsalahykhaled009@gmail.com",
    contact_address_val: "بورسعيد ،مصر",

    // Footer
    footer_desc: "عطور فاخرة مصنوعة بعناية من أجود المكونات الطبيعية",
    footer_links: "روابط سريعة",
    footer_contact: "تواصل معنا",
    footer_social: "تابعنا",
    footer_rights: "جميع الحقوق محفوظة",

    // Notifications
    notif_added: "تمت الإضافة للسلة بنجاح!",
    notif_removed: "تم حذف المنتج من السلة",
    notif_cleared: "تم مسح السلة بالكامل",
    notif_order_placed: "تم إرسال طلبك بنجاح، وسيتم تأكيده بعد مراجعة الدفع.",
    notif_order_error: "حدث خطأ أثناء إرسال الطلب. تأكد من تشغيل كود الدفع في Supabase ثم حاول مرة أخرى.",
    notif_login_success: "تم تسجيل الدخول بنجاح!",
    notif_register_success: "تم إنشاء الحساب بنجاح!",
    notif_register_check_email: "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتسجيل الدخول.",
    notif_register_confirmation_enabled: "تم إنشاء الحساب، لكن تأكيد البريد ما زال مفعلا في Supabase. أغلق Confirm Email ثم جرب بحساب جديد.",
    notif_logout_success: "تم تسجيل الخروج",
    notif_login_error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    notif_email_rate_limited: "Supabase أوقف إرسال الرسائل مؤقتا لهذا البريد. انتظر قليلا، وأغلق Confirm Email من إعدادات Supabase لتسجيل مباشر بدون رسائل.",
    notif_login_email_not_confirmed: "الحساب موجود لكن البريد غير مؤكد. افتح رابط التأكيد في بريدك الإلكتروني.",
    notif_login_auth_user_missing: "هذا البريد محفوظ في جدول العملاء فقط، وليس في نظام تسجيل الدخول. احذف الحساب من جدول users وسجل من جديد.",
    notif_register_error: "يرجى ملء جميع الحقول بشكل صحيح",
    notif_password_mismatch: "كلمة المرور غير متطابقة",
    notif_contact_sent: "تم إرسال رسالتك بنجاح!",
    notif_cart_empty_order: "السلة فارغة! أضف منتجات أولاً",
    notif_fill_fields: "يرجى ملء جميع الحقول المطلوبة",
    notif_payment_method_required: "اختر طريقة الدفع أولا",
    notif_payment_proof_required: "ارفع صورة إثبات الدفع قبل تأكيد الطلب",
    notif_payment_proof_image: "ملف إثبات الدفع يجب أن يكون صورة",

    // Misc
    lang_toggle: "EN",
    scroll_top: "العودة للأعلى",
    coming_soon: "قريبا...",
  },

  en: {
    // Navigation
    nav_home: "Home",
    nav_products: "Perfumes",
    nav_about: "About",
    nav_contact: "Contact",
    nav_cart: "Cart",
    nav_login: "Login",
    nav_register: "Register",
    nav_logout: "Logout",
    nav_welcome: "Welcome",

    // Hero
    hero_title: "ALSALAHY PERFUME",
    hero_subtitle: "Luxury fragrances that tell your story",
    hero_tagline: "Discover elegance and luxury",
    hero_cta: "Shop Now",

    // Products
    products_title: "Our Collection",
    products_subtitle: "Premium fragrances crafted with the finest ingredients",
    product_add_cart: "Add to Cart",
    product_details: "Details",
    product_size: "Size",
    product_quantity: "Quantity",
    product_price: "Price",
    product_currency: "EGP",
    product_close: "Close",
    product_notes_label: "Ingredients",

    // Product names & descriptions
    product_1_name: "Oud Royal",
    product_1_desc: "A luxurious fragrance with natural oud notes blended with amber and white musk, giving you an unforgettable royal presence. An authentic oriental composition that lasts long.",
    product_1_notes: "Oud • Amber • White Musk • Sandalwood",

    product_2_name: "Silver Musk",
    product_2_desc: "An elegant blend of premium musk and white flowers with touches of vanilla, a fragrance that reflects elegance and purity. Perfect for special occasions.",
    product_2_notes: "Musk • White Flowers • Vanilla • Cedar",

    product_3_name: "Velvet Rose",
    product_3_desc: "A captivating fragrance that combines Damascene rose with premium oud and a touch of berry, a unique olfactory experience that captivates the senses.",
    product_3_notes: "Damascene Rose • Oud • Berry • Patchouli",

    // Cart
    cart_title: "Shopping Cart",
    cart_empty: "Your cart is empty",
    cart_empty_msg: "You haven't added any products yet",
    cart_total: "Total",
    cart_checkout: "Checkout",
    cart_clear: "Clear Cart",
    cart_remove: "Remove",
    cart_continue: "Continue Shopping",

    // Order
    order_title: "Complete Order",
    order_name: "Full Name",
    order_phone: "Phone Number",
    order_address: "Address",
    order_city: "City",
    order_notes: "Additional Notes",
    order_summary: "Order Summary",
    order_submit: "Confirm Order",
    order_cancel: "Cancel",
    payment_title: "Payment Method",
    payment_instapay: "InstaPay",
    payment_vodafone: "Wallet",
    payment_instapay_open: "Open InstaPay link",
    payment_vodafone_number: "Wallet number",
    payment_proof: "Payment proof image",
    payment_proof_hint: "Upload a screenshot or payment receipt image.",
    order_success_title: "Order Received!",
    order_success_msg: "We will review the payment proof first, then confirm the order and contact you.",
    order_back_home: "Back to Home",

    // Auth
    auth_login_title: "Login",
    auth_register_title: "Create Account",
    auth_email: "Email Address",
    auth_password: "Password",
    auth_confirm_password: "Confirm Password",
    auth_phone: "Phone Number",
    auth_name: "Full Name",
    auth_login_btn: "Login",
    auth_register_btn: "Register",
    auth_google: "Continue with Google",
    auth_or: "OR",
    auth_have_account: "Already have an account?",
    auth_no_account: "Don't have an account?",
    auth_forgot: "Forgot password?",

    // About
    about_title: "About Us",
    about_text_1: "ALSALAHY PERFUME is a brand specializing in luxury fragrance creation. We believe that perfume is the first impression that lasts.",
    about_text_2: "",
    about_quality: "Unique Quality",
    about_quality_desc: "Best price with exceptional quality",
    about_crafted: "Handcrafted",
    about_crafted_desc: "Each fragrance is meticulously crafted",
    about_lasting: "Long Lasting",
    about_lasting_desc: "Concentrated formulas that last all day",

    // Contact
    contact_title: "Contact Us",
    contact_subtitle: "We'd love to hear from you",
    contact_name: "Name",
    contact_email: "Email",
    contact_message: "Message",
    contact_send: "Send",
    contact_phone_label: "Phone",
    contact_email_label: "Email",
    contact_address_label: "Address",
    contact_phone_val: "+20 155 811 8597",
    contact_email_val: "alsalahykhaled009@gmail.com",
    contact_address_val: "Port Said, Egypt",

    // Footer
    footer_desc: "Premium fragrances crafted with the finest natural ingredients",
    footer_links: "Quick Links",
    footer_contact: "Contact Us",
    footer_social: "Follow Us",
    footer_rights: "All Rights Reserved",

    // Notifications
    notif_added: "Added to cart successfully!",
    notif_removed: "Product removed from cart",
    notif_cleared: "Cart cleared completely",
    notif_order_placed: "Your order was sent successfully and will be confirmed after payment review.",
    notif_order_error: "Something went wrong while sending the order. Make sure the payment setup SQL ran in Supabase, then try again.",
    notif_login_success: "Logged in successfully!",
    notif_register_success: "Account created successfully!",
    notif_register_check_email: "Account created. Check your email before logging in.",
    notif_register_confirmation_enabled: "Account created, but email confirmation is still enabled in Supabase. Turn off Confirm Email, then try a new account.",
    notif_logout_success: "Logged out successfully",
    notif_login_error: "Invalid email or password",
    notif_email_rate_limited: "Supabase temporarily blocked emails to this address. Wait a while, and turn off Confirm Email in Supabase for signup without emails.",
    notif_login_email_not_confirmed: "This account exists but the email is not confirmed. Open the confirmation link in your email.",
    notif_login_auth_user_missing: "This email exists only in the users table, not in Supabase Auth. Delete it from users and register again.",
    notif_register_error: "Please fill all fields correctly",
    notif_password_mismatch: "Passwords do not match",
    notif_contact_sent: "Your message has been sent successfully!",
    notif_cart_empty_order: "Cart is empty! Add products first",
    notif_fill_fields: "Please fill all required fields",
    notif_payment_method_required: "Choose a payment method first",
    notif_payment_proof_required: "Upload the payment proof before confirming the order",
    notif_payment_proof_image: "Payment proof must be an image file",

    // Misc
    lang_toggle: "عربي",
    scroll_top: "Back to Top",
    coming_soon: "Coming Soon...",
  },
};

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem("alsalahy_lang") || "ar";
    this.listeners = [];
  }

  init() {
    this.applyLanguage();
  }

  t(key) {
    return translations[this.currentLang][key] || key;
  }

  getCurrentLang() {
    return this.currentLang;
  }

  isRTL() {
    return this.currentLang === "ar";
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("alsalahy_lang", this.currentLang);
    this.applyLanguage();
    this.notifyListeners();
  }

  applyLanguage() {
    const html = document.documentElement;
    html.setAttribute("lang", this.currentLang);
    html.setAttribute("dir", this.isRTL() ? "rtl" : "ltr");

    // Update all translatable elements
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", translation);
      } else {
        el.textContent = translation;
      }
    });

    // Update lang toggle button
    const toggleBtn = document.getElementById("lang-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = this.t("lang_toggle");
    }
  }

  onLanguageChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb(this.currentLang));
  }
}

// Export singleton
window.i18n = new I18n();
