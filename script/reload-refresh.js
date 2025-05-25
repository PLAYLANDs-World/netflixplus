class StateManager {
  constructor() {
    this.stateKey = 'websiteState';
    this.observedAttributes = ['value', 'checked', 'style', 'class', 'open'];
    this.observer = null;
    this.debounceTimer = null;
    this.init();
  }

  init() {
    // Restore state on page load
    this.restoreState();

    // Watch for changes in the DOM/UI
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(() => this.debouncedSave());
    });

    // Observe the entire body and subtree
    this.observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: this.observedAttributes
    });

    // Save state before page unload
    window.addEventListener('beforeunload', () => this.saveState());
  }

  debouncedSave() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.saveState(), 1000);
  }

  saveState() {
    const state = {};
    // Capture all elements with [data-persist] attribute
    document.querySelectorAll('[data-persist]').forEach(element => {
      const id = element.id || Math.random().toString(36).substr(2, 9);
      state[id] = {
        tag: element.tagName,
        attributes: {},
        properties: {}
      };

      // Capture attributes (e.g., style, class)
      this.observedAttributes.forEach(attr => {
        if (element.hasAttribute(attr)) {
          state[id].attributes[attr] = element.getAttribute(attr);
        }
      });

      // Capture properties (e.g., value, checked)
      if (element.tagName === 'INPUT') {
        state[id].properties.value = element.value;
        state[id].properties.checked = element.checked;
      }

      // Capture custom visibility (e.g., popups)
      if (element.style.display === 'block' || element.open) {
        state[id].properties.visible = true;
      }
    });

    // Save scroll position
    state.scrollPosition = window.scrollY;
    localStorage.setItem(this.stateKey, JSON.stringify(state));
  }

  restoreState() {
    const savedState = localStorage.getItem(this.stateKey);
    if (!savedState) return;

    const state = JSON.parse(savedState);
    // Restore elements
    Object.keys(state).forEach(id => {
      if (id === 'scrollPosition') return;

      const elementState = state[id];
      let element = document.getElementById(id);

      // Fallback if element has no ID
      if (!element) {
        element = document.querySelector(`[data-persist]:nth-child(${id})`);
      }

      if (element) {
        // Restore attributes
        Object.entries(elementState.attributes).forEach(([attr, value]) => {
          element.setAttribute(attr, value);
        });

        // Restore properties
        if (element.tagName === 'INPUT') {
          element.value = elementState.properties.value || '';
          element.checked = elementState.properties.checked || false;
        }

        // Restore visibility
        if (elementState.properties.visible) {
          if (element.tagName === 'DIALOG') {
            element.showModal();
          } else {
            element.style.display = 'block';
          }
        }
      }
    });

    // Restore scroll position
    window.scrollTo(0, state.scrollPosition || 0);
  }
}

// Initialize the State Manager
const stateManager = new StateManager();