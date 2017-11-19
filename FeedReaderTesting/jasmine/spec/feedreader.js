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
    const EMPTY = '';

    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });

    it('feed urls are defined', function() {
      for (let feed of allFeeds) {
        expect(feed.url).toBeDefined();
        expect(feed.url === EMPTY).not.toBeTruthy();
      }
    });

    it('feed names are defined', function() {
      for (let feed of allFeeds) {
        expect(feed.name).toBeDefined();
        expect(feed.name === EMPTY).not.toBeTruthy();
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

  describe('New feed selection', function() {
    let previousContentFirstLink, afterContentFirstLink;

    /*
     * Load "Udacity blog", take note of the first link of all the loaded entry-links
     * Load "HTML5 Rocks", do the same.
     *
     * Now compare those URLs.
     * This test assumes that no single URL shows up for more than one "feed name".
     *
     * Of course, instead of using these two feed names (Udacity Blog, HTML5 rocks)
     * one could choose any two of the four available feed names.
     */
    beforeEach(function(done) {
      loadFeed(0, function() {
        previousContentFirstLink = $(".feed .entry-link:first-child").attr('href');
        loadFeed(2, function() {
          afterContentFirstLink = $(".feed .entry-link:first-child").attr('href');
          done();
        });
      });
    });

    it('feed changes upon loading', function(done) {
      expect(previousContentFirstLink !== afterContentFirstLink).toBeTruthy();
      done();
    });
  });
}());
