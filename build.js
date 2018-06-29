
// Config
var name = 'gh-icons';
var format = 'png';
var compressWithZopfli = true; // FALSE to skip zopflipng compression

// Dependencies
var sprity = require('sprity');
var async = require('async');
var jimp = require('jimp');
var child_process = require('child_process');
var fs = require('fs');

// Create the sprite from all black icons
console.log("Building " + name + '.' + format);
sprity.create({
	engine: 'sprity-jimp',
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
			jimp.read(name + '.' + format, function(err, loadedImage) {
				imageBlack = loadedImage;
				callback(err);
			});
		},
		function(callback) {
			new jimp(imageBlack.bitmap.width * 2, imageBlack.bitmap.height, 0x00000000, function(err, createdImage) {
				image = createdImage;
				callback(err);
			});
		},
		function(callback) {
			image.composite(imageBlack, 0, 0);
			imageBlack.invert();
			image.composite(imageBlack, imageBlack.bitmap.width, 0);
			image.write(name + '.' + format, callback);
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
