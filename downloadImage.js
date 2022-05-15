
export default function (dataURL, info) {

	function saveBase64AsFile(base64, fileName) {
		let link = document.createElement('a');

		link.setAttribute('href', base64);
		link.setAttribute('download', fileName);
		link.click();
	}

	let image = new Image();
	image.src = dataURL;

	image.onload = () => {
		// Clip off the watermark (bottom 20px)
		let imageWidth = image.naturalWidth;
		let imageHeight = image.naturalHeight;
		let clipHeight = imageHeight - 20;

		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		canvas.width = imageWidth;
		canvas.height = clipHeight;
		context.drawImage(image, 0, 0, imageWidth, clipHeight, 0, 0, imageWidth, clipHeight);

		let clippedImage = new Image();

		// There are 3 pages that the image can be saved from:
		// the browse page (linkUrl), the image page (pageUrl),
		// and the image source link (pageUrl as hash instead of name)
		let imagePageUrl = info.linkUrl || info.pageUrl;

		// Get the name of the image (strip domain info)
		let finalName = imagePageUrl.replace(/^.*[\\\/]/, '');

		// Remove the extension if there is one and force png
		finalName = finalName.replace(/\.[^/.]+$/, '');
		clippedImage.src = canvas.toDataURL('image/png');

		saveBase64AsFile(clippedImage.src, finalName);
	}
}
