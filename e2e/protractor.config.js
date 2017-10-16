const { SpecReporter } = require('jasmine-spec-reporter');
var seleniumAddress = 'http://150.107.121.2:4444/wd/hub';
var shell = require('shelljs');
var camelCase = require('pix-diff/lib/camelCase.js');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './spec/*.spec.js'
  ],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['no-sandbox']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:3000/',
  useAllAngular2AppRoots: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function () { }
  },
  
  onPrepare: () => {
    const PixDiff = require('pix-diff');
    const fs = require('fs');
    const path = require('path');
    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled = false;
    browser.isDesktop = true;
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      savePath: './e2e/',
      filePrefix: 'xmlresults'
    }));
    
    browser.driver.manage().window().setSize(1920, 1020);
    browser.getCapabilities().then(function (cap) {
      browser.browserName = cap.get('browserName');

      browser.pixResult = PixDiff;

      browser.pixDiff = new PixDiff({
        basePath: './e2e',
        diffPath: './e2e',
        formatImageName: '{tag}'
      });
      //override difference path
      browser.pixDiff.diffPath = path.normalize(camelCase('./e2e/Diff/' + browser.browserName));
      //create folder if not present
      createF(browser.pixDiff.diffPath);
      browser.compareScreen = function (element, fileName, opt) {
        createF(camelCase('e2e/expected/' + browser.pixDiff.browserName));
        createF(camelCase('e2e/actual/' + browser.pixDiff.browserName));

        // thresholdType: 'percent',
        // threshold: 0.009,
        var option = {
          imageAPath: '/expected/' + browser.pixDiff.browserName + '/' + fileName, // Use file-path 
          imageBPath: '/actual/' + browser.pixDiff.browserName + '/' + fileName,
          filter: ['grayScale'],
          debug: true,
          hideShift: true,
        };
        var doneFn = arguments[arguments.length - 1];
        if (typeof opt === 'object' && Object.keys(opt).length) {
          Object.assign(option, opt);
        }
        if (!fs.existsSync(path.resolve(__dirname, '../../../../' + camelCase('e2e/Expected/' + browser.pixDiff.browserName + '/' + fileName) + '.png'))) {
          browser.pixDiff.saveRegion(element, '/Expected/' + browser.pixDiff.browserName + '/' + fileName, option).then(
            function () {
              console.log('Expect Image Created');
              browser.saveCheckImage(element, fileName, option, doneFn);
            }
          );
        } else {
          browser.saveCheckImage(element, fileName, option, doneFn);
        }

      }
      browser.saveCheckImage = function (element, fileName, option, doneFn) {
        browser.pixDiff.saveRegion(element, '/Actual/' + browser.pixDiff.browserName + '/' + fileName, option).then(() => {
          browser.pixDiff.checkRegion(element, '/Expected/' + browser.pixDiff.browserName + '/' + fileName, option).then((result) => {
            //
            // *  - `RESULT_UNKNOWN`: 0
            // *  - `RESULT_DIFFERENT`: 1
            // *  - `RESULT_SIMILAR`: 7
            // *  - `RESULT_IDENTICAL`: 5
            expect(result.code).toEqual(browser.pixResult.RESULT_IDENTICAL);
            if (typeof doneFn === 'function') {
              doneFn();
            }
          });
        });
      }
      browser.waitForEvent = function(id, moduleName, eventName) {
        return browser.executeAsyncScript(function(id, moduleName, eventName, callback) {
            var instances = document.getElementById(id).ej2_instances;
            var instanceObj;
            for (var i = 0; instances && i < instances.length; i++) {
                if (instances[i].getModuleName() == moduleName) {
                    instanceObj = instances[i]
                }
            }
            if (instanceObj) {
                var handler;
                handler = function(e) {
                    instanceObj.removeEventListener(eventName, handler);
                    callback();
                };
                instanceObj.addEventListener(eventName, handler);
            } else {
                callback();
            }
        }, id, moduleName, eventName);
    }

    browser.injectScript = function(path) {
        return browser.executeAsyncScript(function(path) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = function() {
                callback();
            }
            script.src = path;
            head.appendChild(script);
        }, browser.basePath + path);

    }

    browser.injectCss = function(content) {
        return browser.wait(browser.executeScript(`
                var style = document.createElement('style');
                style.id = 'browsercss';
                if (style.styleSheet) {style.styleSheet.cssText = '` + content + `';}
                else{style.appendChild(document.createTextNode('` + content + `'));}
                document.head.appendChild(style);
                `));
    }

      browser.load = function(path) {
        browser.get(browser.basePath + path);
        if (browser.css) {
            browser.injectCss(browser.css);
        }
    }

    });
  },
  onComplete: function() {
    var browserName, browserVersion;
    var capsPromise = browser.getCapabilities();

    capsPromise.then(function (caps) {
       browserName = caps.get('browserName');
       browserVersion = caps.get('version');

       var HTMLReport = require('protractor-html-reporter');

       testConfig = {
           reportTitle: 'Test Execution Report',
           outputPath: './e2e/',
           screenshotPath: './screenshots',
           testBrowser: browserName,
           browserVersion: browserVersion,
           modifiedSuiteName: false,
           screenshotsOnlyOnFailure: true
       };
       new HTMLReport().from('e2e/xmlresults.xml', testConfig);
   });
}
};
function createF(path) {
  shell.mkdir('-p', path);
}
