/**
 * Flutter Channel Communication Library
 * Handles bidirectional communication between WebView and Flutter app
 * Based on the R1 Creations SDK
 * 
 * DEPRECATED - This library is kept for backward compatibility only.
 * New projects should use the native APIs directly:
 * - PluginMessageHandler.postMessage() for sending messages
 * - window.onPluginMessage for receiving messages
 * - window.creationStorage for persistent storage
 * - window.creationSensors for accelerometer
 */

class FlutterChannel {
  constructor() {
    this.isFlutterAvailable = this.checkFlutterAvailability();
    this.setupPluginMessageHandler();
  }

  /**
   * Check if Flutter channel is available
   */
  checkFlutterAvailability() {
    return typeof window !== 'undefined' && 
           (window.FlutterButtonHandler !== undefined || 
            window.closeWebView !== undefined ||
            window.PluginMessageHandler !== undefined ||
            window.TouchEventHandler !== undefined);
  }

  /**
   * Setup handler for incoming plugin messages from Flutter
   */
  setupPluginMessageHandler() {
    // Check if handler already exists to allow user override
    if (typeof window !== 'undefined' && !window.onPluginMessage) {
      window.onPluginMessage = function(data) {
        // Dispatch as custom event for better handling
        window.dispatchEvent(new CustomEvent('pluginMessage', { 
          detail: data 
        }));
      };
    }
  }

  /**
   * DEPRECATED - Use PluginMessageHandler.postMessage() instead
   * @deprecated
   * @param {string} message - The message to send
   */
  sendMessage(message) {
    console.warn('flutterChannel.sendMessage() is deprecated. Use PluginMessageHandler.postMessage() instead');
    
    // Try to use PluginMessageHandler for compatibility
    if (window.PluginMessageHandler) {
      try {
        const payload = {
          message: typeof message === 'string' ? message : JSON.stringify(message)
        };
        window.PluginMessageHandler.postMessage(JSON.stringify(payload));
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    }
    
    // Fallback to FlutterButtonHandler if available
    if (window.FlutterButtonHandler) {
      try {
        const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
        window.FlutterButtonHandler.postMessage(messageStr);
        return true;
      } catch (error) {
        console.error('Failed to send message to Flutter:', error);
        return false;
      }
    }
    
    console.warn('No message handler available');
    return false;
  }


  /**
   * Send a plugin message to Flutter
   * This is a wrapper around PluginMessageHandler.postMessage()
   * @param {Object} messageObj - The plugin message object
   * @param {string} messageObj.message - Required message field
   * @param {boolean} [messageObj.useLLM] - Use LLM processing
   * @param {boolean} [messageObj.useSerpAPI] - Use SERP API
   * @param {boolean} [messageObj.wantsR1Response] - Enable R1 voice output
   * @param {boolean} [messageObj.wantsJournalEntry] - Save to journal
   * @param {string} [messageObj.pluginId] - Optional plugin identifier
   * @param {string} [messageObj.imageBase64] - Optional base64-encoded image
   */
  sendPluginMessage(messageObj) {
    if (!window.PluginMessageHandler) {
      console.warn('PluginMessageHandler not available');
      return false;
    }

    // Validate message object
    if (typeof messageObj !== 'object' || !messageObj.message) {
      console.error('PluginMessage must be an object with a "message" field');
      return false;
    }

    try {
      // Always stringify the object for PluginMessageHandler
      window.PluginMessageHandler.postMessage(JSON.stringify(messageObj));
      return true;
    } catch (error) {
      console.error('Failed to send plugin message to Flutter:', error);
      return false;
    }
  }

  /**
   * Send touch event data to Flutter
   * @param {Object} touchData - Touch event data
   * @param {number} touchData.x - X coordinate of the touch
   * @param {number} touchData.y - Y coordinate of the touch
   * @param {string} touchData.type - Type of touch event ('tap', 'down', 'up', 'move')
   */
  sendTouchEvent(touchData) {
    if (!window.TouchEventHandler) {
      console.warn('TouchEventHandler not available');
      return false;
    }

    // Validate touch data
    if (!touchData || typeof touchData.x !== 'number' || typeof touchData.y !== 'number' || !touchData.type) {
      console.error('Touch event must have x, y coordinates and type');
      return false;
    }

    try {
      window.TouchEventHandler.postMessage(JSON.stringify(touchData));
      return true;
    } catch (error) {
      console.error('Failed to send touch event to Flutter:', error);
      return false;
    }
  }

  /**
   * Close the WebView and return to home screen
   */
  closeWebView() {
    if (window.closeWebView) {
      // Message content is ignored by Flutter
      window.closeWebView.postMessage('');
      return true;
    }
    console.warn('closeWebView not available');
    return false;
  }

  /**
   * Register a handler for plugin messages from Flutter
   * @param {Function} callback - The callback function to handle messages
   */
  onPluginMessage(callback) {
    if (typeof window === 'undefined') return;

    // Listen for the custom event dispatched by window.onPluginMessage
    window.addEventListener('pluginMessage', (event) => {
      callback(event.detail);
    });
  }

  /**
   * Listen for side button clicks (when lockPtt is enabled)
   * @param {Function} callback - The callback function
   */
  onSideClick(callback) {
    if (typeof window === 'undefined') return;

    window.addEventListener('sideClick', callback);
  }

}

// Export singleton instance
const flutterChannel = new FlutterChannel();

// Example usage:
// DEPRECATED - Use native APIs instead:

// Sending messages (use PluginMessageHandler directly):
// PluginMessageHandler.postMessage(JSON.stringify({
//   message: 'Your message here',
//   useLLM: true,
//   useSerpAPI: false,
//   wantsR1Response: false,
//   wantsJournalEntry: false
// }));

// Receiving messages (use window.onPluginMessage):
// window.onPluginMessage = function(data) {
//   console.log('Received:', data);
// };

// Hardware events (use native event listeners):
// window.addEventListener('scrollUp', () => console.log('Scrolled up'));
// window.addEventListener('scrollDown', () => console.log('Scrolled down'));
// window.addEventListener('sideClick', () => console.log('Side button clicked'));
// window.addEventListener('longPressStart', () => console.log('Long press started'));
// window.addEventListener('longPressEnd', () => console.log('Long press ended'));

// Storage (use window.creationStorage):
// await window.creationStorage.plain.setItem('key', btoa(JSON.stringify(data)));
// const stored = await window.creationStorage.plain.getItem('key');
// const data = JSON.parse(atob(stored));

// Accelerometer (use window.creationSensors):
// window.creationSensors.accelerometer.start((data) => {
//   console.log('Accel:', data); // {x, y, z}
// }, { frequency: 60 });

export default flutterChannel;