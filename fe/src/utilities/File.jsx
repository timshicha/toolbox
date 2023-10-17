
// Source: https://stackoverflow.com/a/34156339
function downloadFile(content, filename, contentType) {
    let a = document.createElement('a');
    let file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
}

export { downloadFile };