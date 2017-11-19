/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
"use strict";

$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

         it('feed urls are defined', function() {
           for (let feed of allFeeds) {
             expect(feed.url).toBeDefined();
           }
         });

         it('feed names are defined', function() {
           for (let feed of allFeeds) {
             expect(feed.name).toBeDefined();
           }
         });

    });

    describe('The menu', function() {
        var menuIcon = $('.menu-icon-link');

        it('menu hidden by default', function() {
          let bodyHidden = $("body.menu-hidden");
          expect(bodyHidden.length).not.toBeLessThan(1);
        });

        it('menu (un)hidden by click', function() {
          menuIcon.click();
          let bodyHidden = $("body.menu-hidden");
          expect(bodyHidden.length).toBeLessThan(1);

          menuIcon.click();
          bodyHidden = $("body.menu-hidden");
          expect(bodyHidden.length).not.toBeLessThan(1);
        });
    });

    describe('Initial entries', function() {
       beforeEach(done => loadFeed(0, () => done()));

       it('entry element after loadFeed', function(done) {
         let entriesInFeedContainer = $(".feed .entry");
         expect(entriesInFeedContainer.length).not.toBeLessThan(1);
         done();
       });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New feed selection', function() {
      /* TODO: Write a test that ensures when a new feed is loaded
       * by the loadFeed function that the content actually changes.
       * Remember, loadFeed() is asynchronous.
       */
       let previousContentFirstLink, afterContentFirstLink;

       beforeEach(function(done) {
         loadFeed(0, function() {
           previousContentFirstLink = $(".feed .entry-link:first-child").attr('href');
           loadFeed(2, function() {
             afterContentFirstLink = $(".feed .entry-link:first-child").attr('href');
             done();
           });
         });
       });

       it ('feed changes upon loading', function(done) {
          console.log("Before: " + previousContentFirstLink + ", after: " + afterContentFirstLink);
          expect(previousContentFirstLink !== afterContentFirstLink).toBeTruthy();
          done();
       });
    });
}());
