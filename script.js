
console.log("AWS Static Website Loaded Successfully!");

const API_BASE =
    "https://527dht44ph.execute-api.ap-south-1.amazonaws.com";

function showMessage() {
    alert("AWS Static Website is working successfully!");
}

async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const uploadStatus = document.getElementById("uploadStatus");

    if (!fileInput || !uploadStatus) return;

    if (!fileInput.files || fileInput.files.length === 0) {
        uploadStatus.textContent = "Please select a file first.";
        return;
    }

    const file = fileInput.files[0];
    uploadStatus.textContent = "Uploading file...";

    const apiUrl =
        API_BASE + "/upload?filename=" +
        encodeURIComponent(file.name);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream"
            },
            body: await file.arrayBuffer()
        });

        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            result = { message: responseText };
        }

        if (response.ok) {
            uploadStatus.textContent =
                "File uploaded successfully: " +
                (result.file || file.name);
            fileInput.value = "";
        } else {
            uploadStatus.textContent =
                "Upload failed: " +
                (result.error || result.message || response.status);
        }
    } catch (error) {
        console.error("Upload error:", error);
        uploadStatus.textContent =
            "Upload failed: " + error.message;
    }
}

async function deleteFile() {
    const fileNameInput = document.getElementById("deleteFileName");
    const deleteStatus = document.getElementById("deleteStatus");

    if (!fileNameInput || !deleteStatus) return;

    const fileName = fileNameInput.value.trim();

    if (!fileName) {
        deleteStatus.textContent = "Please enter a file name.";
        return;
    }

    const protectedFiles = [
        "index.html",
        "style.css",
        "script.js"
    ];

    if (protectedFiles.includes(fileName)) {
        deleteStatus.textContent =
            "Website files cannot be deleted.";
        return;
    }

    const confirmed = confirm(
        'Are you sure you want to delete "' +
        fileName + '" from S3?'
    );

    if (!confirmed) {
        deleteStatus.textContent = "Delete cancelled.";
        return;
    }

    deleteStatus.textContent = "Deleting file...";

    const apiUrl =
        API_BASE + "/delete?filename=" +
        encodeURIComponent(fileName);

    try {
        const response = await fetch(apiUrl, {
            method: "DELETE"
        });

        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            result = { message: responseText };
        }

        if (response.ok) {
            deleteStatus.textContent =
                "Delete request successful: " +
                (result.file || fileName);
            fileNameInput.value = "";
        } else {
            deleteStatus.textContent =
                "Delete failed: " +
                (result.error || result.message || response.status);
        }
    } catch (error) {
        console.error("Delete error:", error);
        deleteStatus.textContent =
            "Delete failed: " + error.message;
    }
}

window.uploadFile = uploadFile;
window.deleteFile = deleteFile;
window.showMessage = showMessage;

console.log("Upload and Delete functions loaded.");