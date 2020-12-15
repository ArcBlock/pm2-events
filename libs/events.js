'use strict';
const axon = require('pm2-axon');
const sub = axon.socket('sub-emitter');
const expandTilde = require('expand-tilde');

let events = {};

/**
 * Get ~/.pm2/pub.sock path
 *
 * @param {Function} callback
 * @return {Function} callback
 */

events.getSockPath = (callback) => {
  const pm2Home = process.env.PM2_HOME;
  let sockPath =
    pm2Home === undefined ? '~/.pm2/pub.sock' : `${pm2Home}/pub.sock`;

  setTimeout(() => callback(null, expandTilde(sockPath), 0));
};

/**
 * Connect with sock and catch events
 *
 * @param {String} sockPath
 * @param {Function} event
 * @param {Function} error
 */

events.main = (sockPath, event, error) => {
  sub.connect(sockPath);

  sub.on('process:*', (e, p) => {
    event && event(p.event, p);
  });

  sub.on('error', (e) => {
    error && error(e);
  });
};

/**
 * Expose events
 */

module.exports = events;
