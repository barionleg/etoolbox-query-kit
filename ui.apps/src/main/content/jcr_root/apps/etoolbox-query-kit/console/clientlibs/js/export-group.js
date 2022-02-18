(function (document, $) {
    'use strict';

    $(document).on('click', '#buttonExportPdf', function () {
        doPostForExport('pdf', 'PDF');
    });

    $(document).on('click', '#buttonExportXslx', function () {
        doPostForExport('vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'XSLX');
    });

    $(document).on('click', '#buttonExportJson', function () {
        doPostForExport('json', 'JSON');
    });

    $(document).on('query-kit:success-response', function (event, result) {
        $("[name='export-buttons-group']").prop('disabled', !(result.data && result.data.length > 0));
    });

    function doPostForExport(type, format) {
        const editor = document.querySelector('.CodeMirror').CodeMirror;
        const value = editor.getValue();

        const xhrRequest = new XMLHttpRequest();
        xhrRequest.open('POST', '/services/etoolbox-query-kit/export', true);
        xhrRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrRequest.responseType = 'arraybuffer';
        xhrRequest.onload = function (e) {
            const blob = new Blob([this.response], { type: `application/${type}` });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `table.${format.toLowerCase()}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        xhrRequest.send(`query=${value}&format=${format}`);
    }
})(document, Granite.$);
