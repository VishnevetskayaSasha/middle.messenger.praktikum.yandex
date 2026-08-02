import type { Block } from './Block';
import { Route } from './Route';

type BlockClass = new () => Block;

export class Router {
  private routes: Route[] = [];
  private currentRoute: Route | null = null;
  private history: History = window.history;
  private rootQuery: string;

  constructor(rootQuery: string) {
    this.rootQuery = rootQuery;
  }

  public use(pathname: string, BlockClass: BlockClass): Router {
    const route = new Route(
      pathname,
      BlockClass,
      this.rootQuery,
    );

    this.routes.push(route);
    return this;
  }

  public start(): void {
    window.addEventListener('popstate', () => {
      this.onRoute(window.location.pathname);
    });

    document.addEventListener('click', (event) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a');
      if (!link) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href || !href.startsWith('/')) {
        return;
      }

      event.preventDefault();
      this.go(href);
    });

    this.onRoute(window.location.pathname);
  }

  private onRoute(pathname: string): void {
    const route = this.getRoute(pathname);
    if (!route) {
      const notFoundRoute = this.getRoute('/404');
      if (!notFoundRoute) {
        throw new Error('Route "/404" is not registered');
      }

      this.history.replaceState({}, '', '/404');

      if (this.currentRoute) {
        this.currentRoute.leave();
      }

      this.currentRoute = notFoundRoute;
      notFoundRoute.render();
      return;
    }

    if (this.currentRoute) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  public go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this.onRoute(pathname);
  }

  public back(): void {
    this.history.back();
  }

  public forward(): void {
    this.history.forward();
  }

  public getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}
