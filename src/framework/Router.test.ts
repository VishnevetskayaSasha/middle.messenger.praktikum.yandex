import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Router } from './Router';
import { Block } from './Block';

class TestBlock extends Block {
  protected template = '<div>Test</div>';
}

describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    router = new Router('#app');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен регистрировать маршрут', () => {
    router.use('/test', TestBlock);

    const route = router.getRoute('/test');

    expect(route).toBeDefined();
  });

  it('должен переходить на указанный маршрут', () => {
    router.use('/test', TestBlock);
    router.go('/test');

    expect(window.location.pathname).toBe('/test');
  });

  it('должен переходить назад по истории', () => {
    const backMock = vi.spyOn(window.history, 'back');

    router.back();

    expect(backMock).toHaveBeenCalled();
  });

  it('должен переходить вперёд по истории', () => {
    const forwardMock = vi.spyOn(window.history, 'forward');

    router.forward();

    expect(forwardMock).toHaveBeenCalled();
  });

  it('должен переходить на страницу 404 для неизвестного маршрута', () => {
    router.use('/404', TestBlock);
    router.go('/unknown');

    expect(window.location.pathname).toBe('/404');
  });

  it('должен перенаправлять неавторизованного пользователя на главную страницу', () => {
    router
      .use('/', TestBlock)
      .use('/messenger', TestBlock);

    router.setAuthorized(false);
    router.go('/messenger');

    expect(window.location.pathname).toBe('/');
  });

  it('должен перенаправлять авторизованного пользователя в мессенджер', () => {
    router
      .use('/', TestBlock)
      .use('/messenger', TestBlock);

    router.setAuthorized(true);
    router.go('/');

    expect(window.location.pathname).toBe('/messenger');
  });
});
