'use strict';

describe('Menus E2E Tests:', function () {
  describe('Test Menus page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/menus');
      expect(element.all(by.repeater('menu in menus')).count()).toEqual(0);
    });
  });
});
