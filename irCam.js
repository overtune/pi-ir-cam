'use strict';

/*
 * Module dependencies
 */
const fs = require('fs');
const child_process = require('child_process');
const raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({io: new raspi()});
const path = require('path');


/*
 * Variables
 */
const photoFolder = path.resolve('./output/photos');
const movieFolder = path.resolve('./output/movies');
const photoIntervalTime = 2000;
let photoInterval = null;


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
			let that = this;

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
					that._startPhotoCapture();
				});

				// 'motionend' events
				motion.on('motionend', () => {
					console.log('motionend');
					that._endPhotoCapture();
				});
			});
		},


		_startPhotoCapture: function () {
			let that = this;

			photoInterval = setInterval(function () {
				let filename = photoFolder + '/image_' + that._getDate() + '.jpg';
				let args = ['-o', filename, '-t', '1'];
				let spawn = child_process.spawn('raspistill', args);	
			}, photoIntervalTime);
		},


		_endPhotoCapture: function () {
			clearInterval(photoInterval);
		},


		_getDate: function () {
			return (new Date()).toISOString().substring(0, 19);
		}
	};

	return irCam._constructor();
}());
