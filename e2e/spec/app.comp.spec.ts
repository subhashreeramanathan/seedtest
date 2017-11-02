import { by, browser, element, By } from 'protractor';
const PixDiff = require('pix-diff');

describe('AppComp', () => {

  it('Navigate to home', () => {
    browser.get('#/home');
    browser.sleep(2000);
    expect(browser.getTitle()).toBeDefined();
  });
  it('Compare the home page', () => {
    browser.sleep(1000);
    browser.compareScreen(element(by.tagName('p')), 'homePage'); 
  });
  it('Navigate to grid', () => {
    browser.get('#/grid');
    browser.sleep(1000);
    expect(browser.getTitle()).toBeDefined();
  });
  it('Compare the grid page', () => {
    browser.sleep(1000);
    browser.compareScreen(element(by.tagName('ej-grid')), 'gridPage'); 
  });
 
});


