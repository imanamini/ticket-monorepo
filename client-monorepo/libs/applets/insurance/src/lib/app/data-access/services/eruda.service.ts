import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

declare global {
  interface Window {
    eruda?: any;
    'eruda-monitor'?: any;
    'eruda-features'?: any;
    'eruda-timing'?: any;
    'eruda-code'?: any;
    'eruda-geolocation'?: any;
    'eruda-orientation'?: any;
    'eruda-touches'?: any;
    'eruda-benchmark'?: any;

    [key: string]: any; // Allow indexed access for dynamically loaded plugins
  }
}

@Injectable({
  providedIn: 'root',
})
export class ErudaService {
  private erudaLoaded = false;
  private renderer: Renderer2;
  private readonly window: Window | null = null;
  private readonly isBrowser: boolean;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.window = this.document.defaultView as Window;
    }
  }

  public initializeEruda(): void {
    if (!this.isBrowser) {
      return;
    }

    this.loadErudaScript();
  }

  public initializeErudaForced(): void {
    if (!this.isBrowser) {
      return;
    }

    this.loadErudaScript();
  }

  private loadErudaScript(): void {
    if (!this.isBrowser || !this.window || !this.document.head) {
      return;
    }

    if (this.erudaLoaded) {
      if (this.window.eruda && !this.document.querySelector('.eruda-container')) {
        this.window.eruda.init();
        console.log('Eruda mobile dev console re-initialized');
      }
      return;
    }

    try {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'src', 'node_modules/eruda/eruda.js');
      this.renderer.setAttribute(script, 'async', 'true');

      this.renderer.listen(script, 'load', () => {
        if (this.window && this.window.eruda) {
          this.window.eruda.init();

          this.loadErudaPlugins([
            'eruda-monitor',
            'eruda-features',
            'eruda-timing',
            'eruda-code',
            'eruda-geolocation',
            'eruda-orientation',
            'eruda-touches',
            'eruda-benchmark',
          ]);

          this.configureBenchmarkTests();
          this.erudaLoaded = true;
          console.log('Eruda mobile dev console initialized');
        }
      });

      this.renderer.listen(script, 'error', (error) => {
        console.error('Failed to load Eruda script:', error);

        if (this.isBrowser && this.window && this.document.head) {
          const fallbackScript = this.renderer.createElement('script');
          this.renderer.setAttribute(fallbackScript, 'src', 'https://cdn.jsdelivr.net/npm/eruda');
          this.renderer.setAttribute(fallbackScript, 'async', 'true');

          this.renderer.listen(fallbackScript, 'load', () => {
            if (this.window && this.window.eruda) {
              this.window.eruda.init();
              this.erudaLoaded = true;
              console.log('Eruda mobile dev console initialized from CDN');
              this.loadErudaPluginsFromCDN([
                'eruda-monitor',
                'eruda-features',
                'eruda-timing',
                'eruda-code',
                'eruda-geolocation',
                'eruda-orientation',
                'eruda-touches',
                'eruda-benchmark',
              ]);
            }
          });

          this.renderer.appendChild(this.document.head, fallbackScript);
        }
      });

      this.renderer.appendChild(this.document.head, script);
    } catch (error) {
      console.error('Error initializing Eruda:', error);
    }
  }

  private shouldInitializeEruda(): boolean {
    if (!this.isBrowser || !this.window) {
      return false;
    }

    try {
      return this.window.location?.search?.includes('eruda=true') || false;
    } catch {
      return false;
    }
  }

  onDestroy(): void {
    this.window?.eruda?.destroy();
  }

  private loadErudaPlugins(plugins: string[]): void {
    if (!this.window || !this.document.head) {
      return;
    }

    let loadedPlugins = 0;
    const totalPlugins = plugins.length;

    plugins.forEach((plugin) => {
      try {
        const pluginScript = this.renderer.createElement('script');
        this.renderer.setAttribute(pluginScript, 'src', `node_modules/${plugin}/${plugin}.js`);
        this.renderer.setAttribute(pluginScript, 'async', 'true');

        this.renderer.listen(pluginScript, 'load', () => {
          loadedPlugins++;

          try {
            const pluginName = plugin.replace('eruda-', '');
            if (this.window && this.window[plugin]) {
              this.window.eruda.add(this.window[plugin]);
              console.log(`Added Eruda plugin: ${pluginName}`);
            }
          } catch (err) {
            console.warn(`Failed to add Eruda plugin ${plugin}:`, err);
          }

          if (loadedPlugins === totalPlugins) {
            this.configureBenchmarkTests();
          }
        });

        this.renderer.listen(pluginScript, 'error', () => {
          loadedPlugins++;
          console.warn(`Failed to load Eruda plugin: ${plugin}`);
          if (loadedPlugins === totalPlugins) {
            this.configureBenchmarkTests();
          }
        });

        this.renderer.appendChild(this.document.head, pluginScript);
      } catch (error) {
        console.error(`Error loading Eruda plugin ${plugin}:`, error);
        loadedPlugins++;
      }
    });
  }

  private loadErudaPluginsFromCDN(plugins: string[]): void {
    if (!this.window || !this.document.head) {
      return;
    }

    let loadedPlugins = 0;
    const totalPlugins = plugins.length;

    plugins.forEach((plugin) => {
      try {
        const pluginScript = this.renderer.createElement('script');
        this.renderer.setAttribute(pluginScript, 'src', `https://cdn.jsdelivr.net/npm/${plugin}`);
        this.renderer.setAttribute(pluginScript, 'async', 'true');
        this.renderer.listen(pluginScript, 'load', () => {
          loadedPlugins++;

          try {
            const pluginName = plugin.replace('eruda-', '');

            if (this.window && this.window.eruda) {
              if (!this.window.eruda.get(pluginName)) {
                if (this.window[plugin]) {
                  this.window.eruda.add(this.window[plugin]);
                }
              }
              console.log(`Added Eruda plugin from CDN: ${pluginName}`);
            }
          } catch (err) {
            console.warn(`Failed to add Eruda plugin from CDN ${plugin}:`, err);
          }

          if (loadedPlugins === totalPlugins) {
            this.configureBenchmarkTests();
          }
        });

        this.renderer.listen(pluginScript, 'error', () => {
          loadedPlugins++;
          console.warn(`Failed to load Eruda plugin from CDN: ${plugin}`);
          if (loadedPlugins === totalPlugins) {
            this.configureBenchmarkTests();
          }
        });

        this.renderer.appendChild(this.document.head, pluginScript);
      } catch (error) {
        console.error(`Error loading Eruda plugin from CDN ${plugin}:`, error);
        loadedPlugins++;
      }
    });
  }

  private configureBenchmarkTests(): void {
    if (!this.window || !this.window.eruda) {
      return;
    }

    try {
      const benchmark = this.window.eruda.get('benchmark');
      if (benchmark) {
        benchmark.add('Test', function () {
          const arr = new Array(10000);
          for (var i = 0; i < 10000; i++) arr[i] = i * 2;
        });

        benchmark.add('Test Suite', [
          {
            name: 'RegExp#test',
            fn: function () {
              /o/.test('Hello World!');
            },
          },
          {
            name: 'String#indexOf',
            fn: function () {
              'Hello World!'.indexOf('o') > -1;
            },
          },
          {
            name: 'String#match',
            fn: function () {
              !!'Hello World!'.match(/o/);
            },
          },
        ]);
        console.log('Benchmark tests configured');
      }
    } catch (error) {
      console.warn('Failed to configure benchmark tests:', error);
    }
  }
}
