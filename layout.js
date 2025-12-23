// layout.js

function initLayout() {
    const sidebarContainer = document.getElementById('sidebar-area');
    const headerContainer = document.getElementById('header-area');
    const footerContainer = document.getElementById('footer-area');

    // --- 1. SIDEBAR HTML (Sesuai Screenshot) ---
    const sidebarHTML = `
    <div class="navbar-logo">
      <a href="index.html">
        <img src="assets/images/logo/My Duit.png" alt="logo" />
      </a>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li class="nav-item" id="menu-dashboard">
          <a href="index.html" class="nav-link">
            <span class="icon"><i class="lni lni-grid-alt"></i></span>
            <span class="text">Dashboard</span>
          </a>
        </li>

        <li class="nav-item" id="menu-transaksi">
          <a href="transaksi.html">
            <span class="icon"><i class="lni lni-list"></i></span>
            <span class="text">Transaksi</span>
          </a>
        </li>

        <span class="divider"><hr /></span>

        <li class="nav-item" id="menu-settings">
          <a href="settings.html"> <span class="icon"><i class="lni lni-cog"></i></span>
            <span class="text">Pengaturan</span>
          </a>
        </li>
      </ul>
    </nav>
    `;

    // --- 2. HEADER HTML (Navbar + Dropdown Lengkap) ---
    const headerHTML = `
    <div class="container-fluid">
        <div class="row">
          <div class="col-lg-5 col-md-5 col-6">
            <div class="header-left d-flex align-items-center">
              <div class="menu-toggle-btn mr-15">
                <button id="menu-toggle" class="main-btn primary-btn btn-hover">
                  <i class="lni lni-chevron-left me-2"></i> Menu
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-7 col-md-7 col-6">
            <div class="header-right">
              <div class="profile-box ml-15">
                <button class="dropdown-toggle bg-transparent border-0" type="button" id="profile"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <div class="profile-info">
                    <div class="info">
                      <div class="image">
                        <img src="assets/images/profile/profile-image.png" alt="" />
                      </div>
                      <div>
                        <h6 class="fw-500" id="navUsername">Loading...</h6>
                        <p id="navRole" class="text-sm">User</p>
                      </div>
                    </div>
                  </div>
                </button>
                
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profile">
                  <li>
                    <div class="author-info flex items-center !p-1">
                      <div class="image">
                        <img src="assets/images/profile/profile-image.png" alt="image">
                      </div>
                      <div class="content">
                        <h4 class="text-sm" id="dropdownName">User</h4>
                        <a class="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white text-xs" href="#" id="dropdownEmail">email@example.com</a>
                      </div>
                    </div>
                  </li>
                  <li class="divider"></li>
                  <li>
                    <a href="settings.html"> <i class="lni lni-cog"></i> Settings </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                    <a href="#" onclick="logout()"> <i class="lni lni-exit"></i> Sign Out </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // --- 3. FOOTER HTML ---
    const footerHTML = `
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 order-last order-md-first">
            <div class="copyright text-center text-md-start">
              <p class="text-sm">
                Designed by Love❤️
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="terms d-flex justify-content-center justify-content-md-end">
              <a href="#0" class="text-sm">Term & Conditions</a>
              <a href="#0" class="text-sm ml-15">Privacy & Policy</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // 3. Inject ke HTML
    if (sidebarContainer) sidebarContainer.innerHTML = sidebarHTML;
    if (headerContainer) headerContainer.innerHTML = headerHTML;
    if (footerContainer) footerContainer.innerHTML = footerHTML;

    // 4. Jalankan Fungsi Logika
    setActiveMenu();
    updateNavbarProfile();
    initSidebarToggle();
}

// --- LOGIKA PENDUKUNG ---

function setActiveMenu() {
    const path = window.location.pathname;
    const page = path.split("/").pop(); 

    // Reset active class
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    if (page === 'index.html' || page === '') {
        const el = document.getElementById('menu-dashboard');
        if(el) el.classList.add('active');
    } else if (page === 'transaksi.html') {
        const el = document.getElementById('menu-transaksi');
        if(el) el.classList.add('active');
    } else if (page === 'settings.html') {
        const el = document.getElementById('menu-settings');
        if(el) el.classList.add('active');
    }
}

function updateNavbarProfile() {
    const userStr = localStorage.getItem('user_profile');
    if (userStr) {
        const user = JSON.parse(userStr);
        
        // Update di Navbar Atas
        const navName = document.getElementById('navUsername');
        const navRole = document.getElementById('navRole');
        
        // Update di dalam Dropdown
        const dropName = document.getElementById('dropdownName');
        const dropEmail = document.getElementById('dropdownEmail');
        
        const displayName = user.username || "User";
        const displayFullName = user.fullName || "User";
        const displayEmail = user.email || "email@example.com";

        if (navName) navName.innerText = displayName;
        if (dropName) dropName.innerText = displayFullName;
        if (dropEmail) dropEmail.innerText = displayEmail;
        
        // Role bisa hardcode Admin atau ambil dari API jika ada
        if (navRole) navRole.innerText = "User"; 
    }
}

function logout() {
    if(confirm("Yakin ingin keluar aplikasi?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_profile');
        window.location.href = 'signin.html';
    }
}

function initSidebarToggle() {
    const menuToggleBtn = document.querySelector("#menu-toggle");
    const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
    const mainWrapper = document.querySelector(".main-wrapper");
    const overlay = document.querySelector(".overlay");

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener("click", () => {
            sidebarNavWrapper.classList.toggle("active");
            overlay.classList.toggle("active");
            mainWrapper.classList.toggle("active");

            const icon = menuToggleBtn.querySelector("i");

            // Cek: Apakah sekarang iconnya Chevron Left?
            if (icon.classList.contains("lni-chevron-left")) {
                // Ganti jadi Menu (Garis Tiga)
                icon.classList.remove("lni-chevron-left");
                icon.classList.add("lni-menu");
            } else {
                // Balikin jadi Chevron Left
                icon.classList.remove("lni-menu");
                icon.classList.add("lni-chevron-left");
            }
        });
    }
    if (overlay) {
        overlay.addEventListener("click", () => {
            // Tutup Sidebar
            sidebarNavWrapper.classList.remove("active");
            overlay.classList.remove("active");
            mainWrapper.classList.remove("active");
            
            // Paksa Icon balik ke Menu (karena sidebar tertutup)
            const icon = menuToggleBtn.querySelector("i");
            if(icon) {
                icon.classList.remove("lni-chevron-left");
                icon.classList.add("lni-menu");
            }
        });
    }
}

// Jalankan saat file diload
document.addEventListener("DOMContentLoaded", initLayout);