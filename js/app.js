/* ==========================================================================
   CELEBRATI — MAIN APPLICATION ENTRY POINT & VIEW ROUTER
   ========================================================================== */

import { db } from './storage.js?v=2.0';
import { renderAdminView }    from './components/admin.js?v=2.0';
import { renderDashboardView } from './components/dashboard.js?v=2.0';
import { renderInviteView }   from './components/invite.js?v=2.0';
import { renderTrackerView }  from './components/tracker.js?v=2.0';
import { showLoginGate }      from './components/auth.js?v=2.0';

class CelebratiApp {
  constructor() {
    this.currentView = 'invite';
    this.appContainer = document.querySelector('#app-container');
    this.eventQuickSelect = document.querySelector('#event-quick-select');
    this.init();
  }

  async init() {
    await db.waitForInit();
    // Pull events if logged in
    if (db.isAdminLoggedIn() && typeof db.pullEventsFromFirebase === 'function') {
      await db.pullEventsFromFirebase();
    }
    
    // Check hash first to decide if auth is needed
    const hash = window.location.hash;
    const isPublicView = hash.startsWith('#invite-') || hash.startsWith('#tracker-');

    if (isPublicView) {
      // Public links — no login required
      this.setupPublicView();
      this.handleHashChange();
    } else {
      // Admin area — require login
      if (!db.isAdminLoggedIn()) {
        this.showSwitcherBar(false);
        showLoginGate(async () => {
          if (typeof db.pullEventsFromFirebase === 'function') await db.pullEventsFromFirebase();
          this.bootApp();
          if (window.location.hash === '#admin') this.switchView('admin');
          else if (window.location.hash === '#dashboard') this.switchView('dashboard');
        });
      } else {
        this.bootApp();
        if (window.location.hash === '#admin') this.switchView('admin');
        else if (window.location.hash === '#dashboard') this.switchView('dashboard');
      }
    }

    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  bootApp() {
    this.showSwitcherBar(true);
    this.populateEventQuickSelect();
    this.setupViewSwitcherBar();
    this.renderCurrentView();
  }

  setupPublicView() {
    // Hide admin switcher bar for public/guest views
    this.showSwitcherBar(false);
  }

  showSwitcherBar(visible) {
    const bar = document.getElementById('view-switcher-bar');
    if (bar) bar.style.display = visible ? '' : 'none';
    if (this.appContainer) {
      this.appContainer.style.marginTop = visible ? '60px' : '0';
    }
  }

  populateEventQuickSelect() {
    if (!this.eventQuickSelect) return;
    const events  = db.getEvents();
    const activeId = db.getActiveEventId();

    this.eventQuickSelect.innerHTML = events.map(e => `
      <option value="${e.id}" ${e.id === activeId ? 'selected' : ''}>
        ${e.title} (${e.eventType})
      </option>
    `).join('');

    this.eventQuickSelect.addEventListener('change', (e) => {
      db.setActiveEventId(e.target.value);
      this.renderCurrentView();
    });
  }

  setupViewSwitcherBar() {
    const pills = document.querySelectorAll('.view-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => this.switchView(pill.dataset.view));
    });

    // Theme toggle
    const themeToggle = document.querySelector('#theme-toggle-btn');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙 Dark' : '☀️ Light';
      });
    }

    // Logout button
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        db.logoutAdmin().then(() => {
          window.location.reload();
        });
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.view === viewName);
    });
    this.renderCurrentView();
  }

  handleHashChange() {
    const hash = window.location.hash;

    if (hash.startsWith('#tracker-')) {
      const eventId = hash.replace('#tracker-', '');
      this.setupPublicView();
      if (this.appContainer) this.appContainer.innerHTML = '';
      renderTrackerView(this.appContainer, eventId);

    } else if (hash.startsWith('#invite-')) {
      const eventId = hash.replace('#invite-', '');
      db.setActiveEventId(eventId);
      this.setupPublicView();
      if (this.appContainer) this.appContainer.innerHTML = '';
      renderInviteView(this.appContainer);

    } else if (hash === '#admin') {
      if (!db.isAdminLoggedIn()) { 
        showLoginGate(async () => {
          if (typeof db.pullEventsFromFirebase === 'function') await db.pullEventsFromFirebase();
          this.bootApp();
          this.switchView('admin');
        }); 
        return; 
      }
      this.bootApp();
      this.switchView('admin');

    } else if (hash === '#dashboard') {
      if (!db.isAdminLoggedIn()) { 
        showLoginGate(async () => {
          if (typeof db.pullEventsFromFirebase === 'function') await db.pullEventsFromFirebase();
          this.bootApp();
          this.switchView('dashboard');
        }); 
        return; 
      }
      this.bootApp();
      this.switchView('dashboard');
    }
  }

  renderCurrentView() {
    if (!this.appContainer) return;
    this.appContainer.innerHTML = '';

    if (this.eventQuickSelect) {
      this.eventQuickSelect.value = db.getActiveEventId();
    }

    if (this.currentView === 'admin') {
      renderAdminView(
        this.appContainer,
        () => this.switchView('dashboard'),
        () => this.switchView('invite')
      );
    } else if (this.currentView === 'dashboard') {
      renderDashboardView(
        this.appContainer,
        () => this.switchView('admin'),
        () => this.switchView('invite')
      );
    } else {
      renderInviteView(this.appContainer);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new CelebratiApp();
});
