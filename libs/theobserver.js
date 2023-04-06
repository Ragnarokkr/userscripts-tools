/**
 * Installs a MutationObserver for an user-specified DOM node and executes tasks
 * according to the events.
 *
 * @class TheObserver
 */
class TheObserver {
  static ATTRIBUTES = "attributes";
  static CHILD_LIST = "childList";
  static CHARACTER_DATA = "characterData";

  #supportedEvents = [
    TheObserver.ATTRIBUTES,
    TheObserver.CHILD_LIST,
    TheObserver.CHARACTER_DATA,
  ];

  #target;
  #config;
  #observer;
  #listeners = {};

  /**
   * Creates an instance of TheObserver.
   * @param {Node} targetNode target DOM node to watch for changes
   * @param {object} [config={ attributes: false, childList: false, characterData: false }] `MutationObserver` config
   * @memberof TheObserver
   */
  constructor(
    targetNode,
    config = { attributes: false, childList: false, characterData: false }
  ) {
    this.#target = targetNode;
    this.#config = config;
  }

  // Callback function for routing the events to all the registered listeners
  #mutationsRouter(mutationList, observer) {
    for (const event of this.#supportedEvents) {
      if (this.#config[event] && this.#listeners[event]) {
        const filteredRecords = mutationList.filter(
          (record) => record.type === event
        );
        for (const listener of this.#listeners[event]) {
          listener[0](filteredRecords, observer);
        }
        this.#listeners[event] = this.#listeners[event].filter(
          (listener) => listener[1]
        );
      }
    }
  }

  // Adds a new listener
  #addListener(event, listener, permanent = true) {
    if (typeof listener !== "function")
      throw new Error("TheObserver instance expects a function as listener.");

    if (this.#supportedEvents.includes(event)) {
      if (!(event in this.#listeners)) this.#listeners[event] = [];
      this.#listeners[event].push([listener, permanent]);
    } else {
      throw new Error(`TheObserver instance expects an event in ${JSON.stringify(this.#supportedEvents)} but was passed ${event}`);
    }
  }

  /**
   * Adds a listener for a specific type of event.
   * @param {string} event the event the listener has to be execute for
   * @param {function} listener callback function. It expects two arguments (`mutationsList` and `observer`).
   * @memberof TheObserver
   */
  on(event, listener = () => {}) {
    this.#addListener(event, listener);
  }

  /**
   * Adds a listener for a specific type of event which will be executed only once.
   * @param {string} event the event the listener has to be execute for
   * @param {function} listener callback function. It expects two arguments (`mutationsList` and `observer`).
   */
  once(event, listener = () => {}) {
    this.#addListener(event, listener, false);
  }

  /**
   * Starts watching the specified DOM node for events.
   * @memberof TheObserver
   */
  start() {
    this.#observer = new MutationObserver(this.#mutationsRouter.bind(this));
    this.#observer.observe(this.#target, this.#config);
  }

  /**
   * Stops the observer from watching for new events.
   * @memberof TheObserver
   */
  stop() {
    this.#observer.disconnect();
  }

  /**
   * Sets new attribute filters and restarts the observer.
   * @param {string[]} filters list of attribute filters. By default is an empty list.
   */
  setAttributeFilter(filters = []) {
    this.#config = { ...this.#config, attributeFilter: filters };
    this.stop();
    this.start();
  }

  /**
   * Sets a new target node element and restarts the observer.
   * @param {Node} targetNode target node to observe
   */
  setTargetNode(targetNode) {
    this.#target = targetNode;
    this.stop();
    this.start();
  }

  /**
   * Sets new config and restarts the observer.
   * @param {object} [config={ attributes: false, childList: false, characterData: false }] `MutationObserver` config
   */
  setConfig(config = { attributes: false, childList: false, characterData: false }) {
    this.#config = config;
    this.stop();
    this.start();
  }

  /**
   * Current observed node.
   * @readonly
   * @memberof TheObserver
   */
  get targetNode() {
    return this.#target;
  }

  /**
   * Current set attribute filters.
   * @readonly
   * @memberof TheObserver
   */
  get attributeFilter() {
    return this.#config.attributeFilter;
  }
}
