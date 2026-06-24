/**
 * Device Controls Library
 * Handles scroll wheel and side button interactions for the R1 device
 */

class DeviceControls {
  constructor() {
    this.sideButtonEnabled = true;
    this.scrollWheelEnabled = true;
    this.eventListeners = new Map();
  }

  /**
   * Initialize device controls
   * @param {Object} options - Configuration options
   */
  init(options = {}) {
    this.sideButtonEnabled = options.sideButtonEnabled ?? true;
    this.scrollWheelEnabled = options.scrollWheelEnabled ?? true;
    
    if (this.sideButtonEnabled) {
      this.setupSideButtonListener();
    }
    
    if (this.scrollWheelEnabled) {
      this.setupScrollWheelListener();
    }
    
    // Setup keyboard fallback for development
    if (options.keyboardFallback !== false) {
      this.setupKeyboardFallback();
    }
  }

  /**
   * Setup side button event listener
   */
  setupSideButtonListener() {
    window.addEventListener('sideClick', (event) => {
      if (!this.sideButtonEnabled) return;
      
      this.handleSideButtonClick(event);
    });
  }

  /**
   * Setup scroll wheel event listener
   */
  setupScrollWheelListener() {
    // Flutter sends scrollUp and scrollDown events instead of wheel events
    window.addEventListener('scrollUp', (event) => {
      if (!this.scrollWheelEnabled) return;
      this.handleScrollWheel({ direction: 'up', event });
    });
    
    window.addEventListener('scrollDown', (event) => {
      if (!this.scrollWheelEnabled) return;
      this.handleScrollWheel({ direction: 'down', event });
    });
  }

  /**
   * Setup keyboard fallback (space bar = side button)
   */
  setupKeyboardFallback() {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        const sideClickEvent = new CustomEvent('sideClick', {
          detail: { source: 'keyboard' }
        });
        window.dispatchEvent(sideClickEvent);
      }
    });
  }

  /**
   * Handle side button click
   * @param {Event} event - The side click event
   */
  handleSideButtonClick(event) {
    const handlers = this.eventListeners.get('sideButton') || [];
    handlers.forEach(handler => handler(event));
  }

  /**
   * Handle scroll wheel events
   * @param {Object} data - The scroll data
   */
  handleScrollWheel(data) {
    const handlers = this.eventListeners.get('scrollWheel') || [];
    
    handlers.forEach(handler => handler({
      direction: data.direction,
      event: data.event
    }));
  }

  /**
   * Register event handler
   * @param {string} eventType - 'sideButton' or 'scrollWheel'
   * @param {Function} handler - Event handler function
   */
  on(eventType, handler) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(handler);
  }

  /**
   * Remove event handler
   * @param {string} eventType - 'sideButton' or 'scrollWheel'
   * @param {Function} handler - Event handler function to remove
   */
  off(eventType, handler) {
    const handlers = this.eventListeners.get(eventType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Enable or disable side button
   * @param {boolean} enabled - Enable state
   */
  setSideButtonEnabled(enabled) {
    this.sideButtonEnabled = enabled;
  }

  /**
   * Enable or disable scroll wheel
   * @param {boolean} enabled - Enable state
   */
  setScrollWheelEnabled(enabled) {
    this.scrollWheelEnabled = enabled;
  }

  /**
   * Simulate side button click (for testing)
   */
  triggerSideButton() {
    const event = new CustomEvent('sideClick', {
      detail: { source: 'programmatic' }
    });
    window.dispatchEvent(event);
  }
}

// Export singleton instance
const deviceControls = new DeviceControls();

// Example usage:
// deviceControls.init();
// deviceControls.on('sideButton', (event) => console.log('Side button clicked'));
// deviceControls.on('scrollWheel', (data) => console.log('Scrolled', data.direction));

export default deviceControls;