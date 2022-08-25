const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("file-input");

uploadForm.addEventListener("click", () => {
	fileInput.click();
})

const uploadModalEl = document.getElementById("uploadModal");
const modalOptions = {
    placement: 'center-center',
  };
const uploadModal = new Modal(uploadModalEl,modalOptions);


function showUpload(){
    uploadModal.show();
}

function hideUpload(){
    uploadModal.hide();
}

document.querySelector('#upload-button').addEventListener('click', function () {
	// user has not chosen any file
	if (document.querySelector('#file-input').files.length == 0) {
		alert('Error : No file selected');
		return;
	}

	// first file that was chosen
	let file = document.querySelector('#file-input').files[0];



	// validation is successful
	// alert('You have chosen the file ' + file.name);

	// upload file now
	let data = new FormData();
	var url = document.location.href.split("/");
	if (url.includes("folder")) {
		data.append('folder', url[url.length - 1]);
	}
	// file selected by the user
	// in case of multiple files append each of them
	data.append('file', document.querySelector('#file-input').files[0]);
	

	let request = new XMLHttpRequest();
	request.open('POST', '/upload');

	// upload progress event
	request.upload.addEventListener('progress', function (e) {
		let percent_complete = Math.floor((e.loaded / e.total) * 100);

		// <span class="name">${files[0].name} • Uploading</span>
		let progressHTML = `<div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
		<div class="h-6 justify-center bg-blue-600 text-xs font-large text-blue-100 text-center p-0.5 leading-none rounded-full" style="width: ${percent_complete}%"> ${percent_complete}%</div>
	  </div>`;
		uploadedArea.classList.add("onprogress");
		progressArea.innerHTML = progressHTML;

		// percentage of upload completed
		console.log(percent_complete);
	});

	// Request finished event
	// request.addEventListener('load', function (e) {
	// 	console.log(request.status);
	// 	console.log(request.response);
	// });

	// send POST request to server side script
	request.send(data);
});

