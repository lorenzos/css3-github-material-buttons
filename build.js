
// Config
var name = 'gh-icons';
var format = 'png';
var compressWithZopfli = true; // FALSE to skip zopflipng compression

// Dependencies
var sprity = require('sprity');
var async = require('async');
var lwip = require('lwip');
var child_process = require('child_process');
var fs = require('fs');

// Create the sprite from all black icons
console.log("Building " + name + '.' + format);
sprity.create({
	src: 'material-design-icons/*/1x_web/*_black_18dp.png',
	out: process.cwd(),
	name: name,
	format: format,
	style: 'gh-buttons-sprite.css',
	template: 'gh-buttons-sprite.hbs',
	dimension: [{ ratio: 1, dpi: 72 }], 
	margin: 0,
	orientation: 'vertical',
	split: false,
	'style-indent-char': '\t',
	'style-indent-size': 1
}, function() {
	
	// Create the white icons (will be used for ":active" pseudo class)
	var imageBlack, image;
	async.series([
		function(callback) {
			lwip.open(name + '.' + format, function(err, loadedImage) {
				imageBlack = loadedImage;
				callback(err);
			});
		},
		function(callback) {
			lwip.create(
				imageBlack.width() * 2, 
				imageBlack.height(),
				{ r: 0, g: 0, b: 0, a: 0 },
				function(err, createdImage) {
					image = createdImage;
					callback(err);
				}
			);
		},
		function(callback) {
			image.paste(0, 0, imageBlack, callback);
		},
		function(callback) {
			async.timesSeries(imageBlack.width(), function(x, x_next) {
				async.timesSeries(imageBlack.height(), function(y, y_next) {
					var pixel = imageBlack.getPixel(x, y);
					pixel.r = 255 - pixel.r;
					pixel.g = 255 - pixel.g;
					pixel.b = 255 - pixel.b;
					imageBlack.setPixel(x, y, pixel, y_next);
				}, x_next);
			}, callback);
		},
		function(callback) {
			image.paste(imageBlack.width(), 0, imageBlack, callback);
		},
		function(callback) {
			image.writeFile(name + '.' + format, format, {
				compression: "high",
				interlaced: false,
				transparency: 'auto'
			}, callback);
		}, function(callback) {
			
			console.log("Building gh-buttons.css");
			
			// Fix CSS class names in generated CSS file, removing Material icons filename prefix and suffix
			var cssSprite = fs.readFileSync('gh-buttons-sprite.css', 'utf8');
			cssSprite = cssSprite.replace(/\.button\.[^{:.]+1x_web-ic_([^{:.]+)_black_18dp\./g, '.button.ic_$1.');
			
			// Replace CSS rules in main CSS file
			var css = fs.readFileSync('gh-buttons.css', 'utf8');
			cssSprite = '/* {{SPRITE}} */\n\n' + cssSprite + '/* {{/SPRITE}} */';
			css = css.replace(/\/\* \{\{SPRITE\}\} \*\/[\s\S]*\/\* \{\{\/SPRITE\}\} \*\//, cssSprite);
			fs.writeFile('gh-buttons.css', css);
			
			// Delete generated CSS file
			fs.unlinkSync('gh-buttons-sprite.css');
			
			callback();
		}, function(callback) {
			
			// Compress using zopflipng
			if (compressWithZopfli) { 
				child_process.execFileSync('zopfli/zopflipng', 
					[ '-m', name + '.' + format, name + '-zopfli.' + format ],
					{ stdio: 'inherit' }
				);
				fs.unlinkSync(name + '.' + format);
				fs.renameSync(name + '-zopfli.' + format, name + '.' + format);
			}
			
			callback();
		}
	]);
	
});
