/* SehatPharm Pharmacy — catalogue, cart, forms, animations. No backend: orders via WhatsApp. */
var WA_NUMBER = "923001234567";
var MEDICINES = [
  {id:1,name:"Paracetamol 500mg (20 tablets)",cat:"Pain Relief",price:180,rx:false},
  {id:2,name:"Ibuprofen 400mg (20 tablets)",cat:"Pain Relief",price:260,rx:false},
  {id:3,name:"Diclofenac Gel 30g",cat:"Pain Relief",price:320,rx:false},
  {id:4,name:"Amoxicillin 500mg (12 capsules)",cat:"Antibiotics",price:480,rx:true},
  {id:5,name:"Ciprofloxacin 500mg (10 tablets)",cat:"Antibiotics",price:520,rx:true},
  {id:6,name:"Azithromycin 250mg (6 tablets)",cat:"Antibiotics",price:650,rx:true},
  {id:7,name:"ORS Sachets (Pack of 10)",cat:"Cold & Flu",price:220,rx:false},
  {id:8,name:"Cough Syrup 120ml",cat:"Cold & Flu",price:380,rx:false},
  {id:9,name:"Flu Relief Tablets (20)",cat:"Cold & Flu",price:300,rx:false},
  {id:10,name:"Vitamin D3 5000 IU (30 softgels)",cat:"Vitamins",price:950,rx:false},
  {id:11,name:"Vitamin C 1000mg Effervescent (20)",cat:"Vitamins",price:720,rx:false},
  {id:12,name:"Multivitamin Tablets (30)",cat:"Vitamins",price:1100,rx:false},
  {id:13,name:"Calcium + Vitamin D Tablets (30)",cat:"Vitamins",price:890,rx:false},
  {id:14,name:"Baby Formula Stage 1 (400g)",cat:"Baby Care",price:1850,rx:false},
  {id:15,name:"Baby Diapers Medium (40 pack)",cat:"Baby Care",price:1450,rx:false},
  {id:16,name:"Baby Lotion 200ml",cat:"Baby Care",price:640,rx:false},
  {id:17,name:"Moisturising Cream 100ml",cat:"Skin Care",price:780,rx:false},
  {id:18,name:"Sunscreen SPF 50 (100ml)",cat:"Skin Care",price:1250,rx:false},
  {id:19,name:"Antifungal Cream 30g",cat:"Skin Care",price:420,rx:false},
  {id:20,name:"First Aid Kit (Complete)",cat:"First Aid",price:1350,rx:false},
  {id:21,name:"Antiseptic Liquid 250ml",cat:"First Aid",price:360,rx:false},
  {id:22,name:"Adhesive Bandages (Pack of 50)",cat:"First Aid",price:240,rx:false},
  {id:23,name:"Blood Sugar Test Strips (50)",cat:"Diabetes Care",price:1650,rx:false},
  {id:24,name:"Glucometer (with 10 strips)",cat:"Diabetes Care",price:2950,rx:false}
];
var CATS = ["All","Pain Relief","Antibiotics","Cold & Flu","Vitamins","Baby Care","Skin Care","First Aid","Diabetes Care"];

function money(n){ return "Rs. " + n.toLocaleString("en-PK"); }
function getCart(){
  try { return JSON.parse(localStorage.getItem("sehatpharm_cart") || "{}"); } catch(e){ return {}; }
}
function saveCart(c){ localStorage.setItem("sehatpharm_cart", JSON.stringify(c)); renderCart(); }
function cartCount(){
  var c = getCart(), n = 0;
  Object.keys(c).forEach(function(k){ n += c[k]; });
  return n;
}
function cartTotal(){
  var c = getCart(), t = 0;
  Object.keys(c).forEach(function(k){
    var m = MEDICINES.filter(function(x){ return x.id == k; })[0];
    if (m) t += m.price * c[k];
  });
  return t;
}
function addToCart(id, qty){
  var c = getCart(); c[id] = (c[id] || 0) + (qty || 1); saveCart(c); openCart();
}
function renderCart(){
  var countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cartCount();
  var box = document.getElementById("cartItems");
  if (!box) return;
  var c = getCart(), keys = Object.keys(c);
  if (!keys.length){ box.innerHTML = "<p class='muted'>Your cart is empty. Add medicines from the catalogue.</p>"; }
  else {
    box.innerHTML = keys.map(function(k){
      var m = MEDICINES.filter(function(x){ return x.id == k; })[0];
      if (!m) return "";
      return "<div class='cart-item'><div><b>" + m.name + "</b><br><span class='muted small'>" + money(m.price) + " x " + c[k] + "</span></div><div><b>" + money(m.price * c[k]) + "</b><br><button data-remove='" + k + "'>Remove</button></div></div>";
    }).join("");
    box.querySelectorAll("[data-remove]").forEach(function(b){
      b.addEventListener("click", function(){
        var cc = getCart(); delete cc[b.getAttribute("data-remove")]; saveCart(cc);
      });
    });
  }
  var tot = document.getElementById("cartTotal");
  if (tot) tot.textContent = money(cartTotal());
}
function openCart(){
  var d = document.getElementById("cartDrawer"), s = document.getElementById("cartScrim");
  if (d){ d.classList.add("open"); d.setAttribute("aria-hidden","false"); }
  if (s) s.classList.add("show");
}
function closeCart(){
  var d = document.getElementById("cartDrawer"), s = document.getElementById("cartScrim");
  if (d){ d.classList.remove("open"); d.setAttribute("aria-hidden","true"); }
  if (s) s.classList.remove("show");
}
function medCard(m){
  return "<article class='card'><div class='card-body'><span class='pill'>" + m.cat.toUpperCase() + "</span>" +
    (m.rx ? "<span class='rx-tag'>&#8478; Prescription</span>" : "") +
    "<h3>" + m.name + "</h3><p class='muted small'>" +
    (m.rx ? "Dispensed only with a valid prescription." : "Available over the counter.") + "</p>" +
    "<span class='price'>" + money(m.price) + "</span>" +
    "<div class='add-row'><div class='qty'><button data-dec='" + m.id + "' aria-label='Decrease'>&minus;</button><span id='qty-" + m.id + "'>1</span><button data-inc='" + m.id + "' aria-label='Increase'>+</button></div>" +
    "<button class='btn btn-sm' data-add='" + m.id + "'>Add to Cart</button></div></div></article>";
}
function bindCards(scope){
  scope.querySelectorAll("[data-add]").forEach(function(b){
    b.addEventListener("click", function(){
      var q = parseInt(document.getElementById("qty-" + b.getAttribute("data-add")).textContent, 10) || 1;
      addToCart(parseInt(b.getAttribute("data-add"), 10), q);
    });
  });
  scope.querySelectorAll("[data-inc]").forEach(function(b){
    b.addEventListener("click", function(){
      var el = document.getElementById("qty-" + b.getAttribute("data-inc"));
      el.textContent = Math.min(20, parseInt(el.textContent, 10) + 1);
    });
  });
  scope.querySelectorAll("[data-dec]").forEach(function(b){
    b.addEventListener("click", function(){
      var el = document.getElementById("qty-" + b.getAttribute("data-dec"));
      el.textContent = Math.max(1, parseInt(el.textContent, 10) - 1);
    });
  });
}
function renderCatalogue(filterCat, query){
  var grid = document.getElementById("medGrid");
  if (!grid) return;
  var q = (query || "").toLowerCase();
  var list = MEDICINES.filter(function(m){
    var okCat = !filterCat || filterCat === "All" || m.cat === filterCat;
    var okQ = !q || m.name.toLowerCase().indexOf(q) !== -1 || m.cat.toLowerCase().indexOf(q) !== -1;
    return okCat && okQ;
  });
  grid.innerHTML = list.length ? list.map(medCard).join("") : "<p class='muted'>No medicines match your search. Try another name, or upload a prescription and we will source it for you.</p>";
  bindCards(grid);
  var cnt = document.getElementById("medCount");
  if (cnt) cnt.textContent = list.length + " of " + MEDICINES.length + " medicines shown";
}
function ref(prefix){
  return prefix + "-" + Math.floor(100000 + Math.random() * 900000);
}
document.addEventListener("DOMContentLoaded", function(){
  var ham = document.getElementById("hamburger"), nav = document.getElementById("nav");
  if (ham) ham.addEventListener("click", function(){ nav.classList.toggle("open"); });
  var cb = document.getElementById("cartBtn"), cc = document.getElementById("cartClose"), sc = document.getElementById("cartScrim");
  if (cb) cb.addEventListener("click", openCart);
  if (cc) cc.addEventListener("click", closeCart);
  if (sc) sc.addEventListener("click", closeCart);
  var clear = document.getElementById("cartClear");
  if (clear) clear.addEventListener("click", function(){ saveCart({}); });
  var wa = document.getElementById("waCheckout");
  if (wa) wa.addEventListener("click", function(){
    var c = getCart(), keys = Object.keys(c);
    if (!keys.length){ alert("Your cart is empty. Add a medicine first."); return; }
    var lines = ["Hello SehatPharm! I would like to order:"];
    keys.forEach(function(k){
      var m = MEDICINES.filter(function(x){ return x.id == k; })[0];
      if (m) lines.push("- " + m.name + " x " + c[k] + " = " + money(m.price * c[k]));
    });
    lines.push("Total: " + money(cartTotal()));
    lines.push("Please confirm availability and delivery.");
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
  });
  renderCart();

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, {threshold: 0.12});
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  var home = document.getElementById("homePopular");
  if (home){ home.innerHTML = MEDICINES.filter(function(m){ return [1,10,7,17].indexOf(m.id) !== -1; }).map(medCard).join(""); bindCards(home); }

  var params = new URLSearchParams(window.location.search);
  var activeCat = params.get("cat") || "All";
  var filters = document.getElementById("catFilters");
  if (filters){
    filters.innerHTML = CATS.map(function(c){
      return "<button data-cat='" + c + "' class='" + (c === activeCat ? "active" : "") + "'>" + c + "</button>";
    }).join("");
    filters.querySelectorAll("button").forEach(function(b){
      b.addEventListener("click", function(){
        filters.querySelectorAll("button").forEach(function(x){ x.classList.remove("active"); });
        b.classList.add("active");
        renderCatalogue(b.getAttribute("data-cat"), document.getElementById("medSearch").value);
      });
    });
  }
  var search = document.getElementById("medSearch");
  if (search){
    renderCatalogue(activeCat, search.value);
    search.addEventListener("input", function(){
      var act = filters ? filters.querySelector("button.active") : null;
      renderCatalogue(act ? act.getAttribute("data-cat") : "All", search.value);
    });
  }
  var hs = document.getElementById("heroSearchBtn");
  if (hs) hs.addEventListener("click", function(){
    var v = document.getElementById("heroSearch").value.trim();
    window.location.href = "medicines.html" + (v ? "?q=" + encodeURIComponent(v) : "");
  });
  var hsi = document.getElementById("heroSearch");
  if (hsi) hsi.addEventListener("keydown", function(e){ if (e.key === "Enter"){ e.preventDefault(); hs.click(); } });
  if (search && params.get("q")){ search.value = params.get("q"); renderCatalogue("All", params.get("q")); }

  var rx = document.getElementById("rxForm");
  if (rx){
    var file = document.getElementById("rxFile"), hint = document.getElementById("rxFileHint");
    file.addEventListener("change", function(){ hint.textContent = file.files.length ? file.files[0].name : "No file chosen yet"; });
    rx.addEventListener("submit", function(e){
      e.preventDefault();
      var r = ref("SP");
      var ok = document.getElementById("rxSuccess");
      ok.hidden = false;
      ok.innerHTML = "<b>Prescription received!</b> Reference <b>" + r + "</b>. Our pharmacist will confirm availability and the total on WhatsApp shortly. (Demo form — no file was uploaded to a server.)";
      rx.reset(); hint.textContent = "No file chosen yet";
    });
  }
  var cf = document.getElementById("contactForm");
  if (cf){
    cf.addEventListener("submit", function(e){
      e.preventDefault();
      var ok = document.getElementById("cSuccess");
      ok.hidden = false;
      ok.innerHTML = "<b>Message sent!</b> Thank you — we will reply on WhatsApp during store hours (9:00 AM &ndash; 11:00 PM).";
      cf.reset();
    });
  }
  var tb = document.getElementById("trackBtn");
  if (tb) tb.addEventListener("click", function(){
    var v = document.getElementById("trackRef").value.trim().toUpperCase();
    var err = document.getElementById("trackErr"), res = document.getElementById("trackResult");
    if (!/^SP-\d{6}$/.test(v)){ err.textContent = "Please enter a reference like SP-482913."; res.innerHTML = ""; return; }
    err.textContent = "";
    res.innerHTML = "<p><b>Order " + v + ":</b> Confirmed and being packed. Your rider's live updates arrive on WhatsApp. (Demo tracker.)</p>";
  });
});
