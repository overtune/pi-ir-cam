/*
 * Module dependencies
 */
const fs = require('fs');
const child_process = require('child_process');
const raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({io: new raspi()});


/*
 * Settings
 */
require('events').EventEmitter.prototype._maxListeners = 20;


/*
 * irCam
 */
module.exports = (function () {
	'use strict';

	var irCam = {
		_constructor: function () {
			this._initBoard();
			return this;
		},

		_initBoard: function () {
			board.on('ready', () => {
				console.log('Board is ready');

				// Create a new `motion` hardware instance.
				const motion = new five.Motion('P1-7'); //a PIR is wired on pin 7 (GPIO 4)

				// 'calibrated' occurs once at the beginning of a session
				motion.on('calibrated', () => {
					console.log('calibrated');
				});

				// Motion detected
				motion.on('motionstart', () => {
					console.log('motionstart');
				});

				// 'motionend' events
				motion.on('motionend', () => {
					console.log('motionend');
				});
			});
		}
	};

	return irCam._constructor();
}());
