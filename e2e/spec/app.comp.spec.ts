import { by, browser, element, By } from 'protractor';
const PixDiff = require('pix-diff');

describe('AppComp', () => {

  it('Navigate to home', () => {
    browser.get('#/home');
    expect(browser.getTitle()).toBeDefined();
  });
  it('Compare the home page', () => {
    browser.get('#/home');
    browser.compareScreen(element(By.tagName('p')), 'homePage'); 
  });
  it('Navigate to grid', () => {
    browser.get('#/grid');
    expect(browser.getTitle()).toBeDefined();
  });
  it('Compare the grid page', () => {
    browser.get('#/grid');
    browser.compareScreen(element(By.tagName('ej-grid')), 'gridPage'); 
  });
 
});


