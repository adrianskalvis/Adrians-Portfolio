/* jsdom has no IntersectionObserver. This stand-in records what each observer watches,
   so a test can say "this element is now 40% on screen" with triggerIntersection(). */
type Watcher = { callback: IntersectionObserverCallback; elements: Set<Element>; observer: IntersectionObserver };

const watchers = new Set<Watcher>();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds: ReadonlyArray<number>;
  private readonly watcher: Watcher;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    const threshold = options?.threshold ?? 0;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
    this.watcher = { callback, elements: new Set(), observer: this };
    watchers.add(this.watcher);
  }

  observe(element: Element) {
    this.watcher.elements.add(element);
  }

  unobserve(element: Element) {
    this.watcher.elements.delete(element);
  }

  disconnect() {
    this.watcher.elements.clear();
    watchers.delete(this.watcher);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

export const installIntersectionObserver = () => {
  Object.defineProperty(window, "IntersectionObserver", { writable: true, value: MockIntersectionObserver });
};

/* Pass several states to deliver them as one batch, oldest first, like a fast scroll does. */
export const triggerIntersection = (element: Element, isIntersecting: boolean | boolean[]) => {
  const rect = element.getBoundingClientRect();
  const states = Array.isArray(isIntersecting) ? isIntersecting : [isIntersecting];
  watchers.forEach(({ callback, elements, observer }) => {
    if (!elements.has(element)) return;
    const entries = states.map(
      (state, i) =>
        ({
          target: element,
          isIntersecting: state,
          intersectionRatio: state ? 1 : 0,
          boundingClientRect: rect,
          intersectionRect: rect,
          rootBounds: null,
          time: Date.now() + i,
        }) as IntersectionObserverEntry,
    );
    callback(entries, observer);
  });
};
