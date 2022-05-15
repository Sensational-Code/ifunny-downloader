
import downloadImage from './downloadImage.js';

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'saveImage',
		title: 'Save iFunny Image',
		contexts: ['image']
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	chrome.tabs.query({ active: true }, async (tabs) => {
		let currentTab = tabs[0].id;

		// Since the actual images are hosted on a subdomain (img.ifunny.co)
		// with CORS enabled, we need to make the request here to bypass CORS,
		// then send the image data back to the page to prompt the save action

		let response = await fetch(info.srcUrl);
		let blob = await response.blob();
		let dataURL = await blobToDataURL(blob);

		chrome.scripting.executeScript({
			target: { tabId: currentTab },
			func: downloadImage,
			args: [dataURL, info]
		});
	})
});

function blobToDataURL(blob) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
			let dataURL = reader.result;
			resolve(dataURL);
		};

		reader.readAsDataURL(blob);
	});
};

