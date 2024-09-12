export default class ScriptCache {
  constructor(scripts) {
    this.loaded = {};
    this.failed = {};
    this.loading = {};
    this.load(scripts);
  }

  load(scripts) {
    scripts.forEach(script => {
      const name = script.name;
      if (this.loaded[name] || this.loading[name]) {
        return;
      }

      this.loading[name] = true;

      const tag = document.createElement('script');
      tag.async = true;
      tag.src = name;
      tag.onload = () => {
        this.loaded[name] = true;
        this.loading[name] = false;
        if (script.callback) {
          script.callback();
        }
      };
      tag.onerror = () => {
        this.failed[name] = true;
        this.loading[name] = false;
      };

      document.head.appendChild(tag);
    });
  }
}
