
// This node.js script is used to create the PNG sprite with
// all icons from the Google's Material icons submodule, and
// to update the gh-buttons.css file accordingly.

// Requirements:
//   npm install async sprity lwip
//   git submodule init && git submodule update 
//   cd zopfli && make zopflipng && cd ..

var name = 'gh-icons';
var format = 'png';
var compressWithZopfli = true;

// Create the sprite from all black icons
console.log("Building " + name + '.' + format);
require('sprity').create({
	src: 'material-design-icons/*/1x_web/*_black_18dp.png',
	out: process.cwd(),
	name: name,
	format: format,
	cssPath: '',
	dimension: [{ ratio: 1, dpi: 72 }], 
	margin: 0,
	orientation: 'vertical',
	split: false,
	'style-indent-char': '\t',
	'style-indent-size': 1
}, function() {
	
	// Create the white icons (will be used for ":active" pseudo class)
	var imageBlack, image;
	require('async').series([
		function(callback) {
			require('lwip').open(name + '.' + format, function(err, loadedImage) {
				imageBlack = loadedImage;
				callback(err);
			});
		},
		function(callback) {
			require('lwip').create(
				imageBlack.width() * 2, 
				imageBlack.height(),
				{r: 0, g: 0, b: 0, a: 0},
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
			require('async').timesSeries(imageBlack.width(), function(x, x_next) {
				require('async').timesSeries(imageBlack.height(), function(y, y_next) {
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
			
			// Compress using zopflipng
			if (compressWithZopfli) { 
				require('child_process').execFileSync('zopfli/zopflipng', 
					['-m', name + '.' + format, name + '-zopfli.' + format],
					{ stdio: 'inherit' }
				);
				require('fs').unlinkSync(name + '.' + format);
				require('fs').renameSync(name + '-zopfli.' + format, name + '.' + format);
			}
			
			callback();
		}
	]);
	
});
