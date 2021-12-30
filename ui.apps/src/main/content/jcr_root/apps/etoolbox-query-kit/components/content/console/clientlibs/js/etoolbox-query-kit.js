"use strict"

$(function () {

    const TYPED_QUERIES_KEY = 'typed_queries';

    var $executeButton = $('#executeButton'),
        $queryForm = $('#queryForm'),
        $languageSelect = $('#languageSelect')[0],
        $domain = 'crx/de/index.jsp#',
        timerId = null,
        editor = null,
        editorLines = null;

    $executeButton.click((function () {
        $queryForm.submit(function (e) {
            e.preventDefault();
            var form = $(this);
            var url = form.attr('action');
            $.ajax({
                url: url,
                type: "POST",
                data: form.serialize(),
                success: executeSuccess,
                error(error) {
                    if (error.status === 400){
                        editorLines.style.textDecoration="underline red";
                        editorLines.style.textDecorationStyle="dashed";
                    }
                    console.error(error.statusText);
                  }
            })
        });
    }));

    $queryForm.on('keyup', (function (e) {
        editorLines.style.textDecoration="none";
        clearTimeout(timerId);
        timerId = setTimeout(function(){
            localStorage.setItem(TYPED_QUERIES_KEY, editor.getValue());
        }, 1000);
    }));

    function executeSuccess(data) {
        $('.resultTable').remove();
        $('.query-kit-pagination').remove();
        $(document).trigger('query-kit:success-response', [data]);
        updateUrlParams();
        buildResultTable(data["data"]);
        addPagination(data);
    }

    function updateUrlParams(){
         var query = editor.getValue();
         var language = $languageSelect.selectedItem.value;
         if (query && history.pushState) {
            var newUrl = window.location.origin + window.location.pathname +
               '?language=' + language +
               '&query=' + encodeURIComponent(query);
            window.history.pushState({path:newUrl},'',newUrl);
         }
    }

    function buildResultTable(data) {
        //todo add check data
        var columns = Object.keys(data[0]);
        var table = new Coral.Table();
        table.classList.add('resultTable');
        table.setAttribute("id", "resultTable");
        columns.forEach(() => {
            table.appendChild(new Coral.Table.Column());
        });
        var head = new Coral.Table.Head();
        columns.forEach(item => {
            var headCell = new Coral.Table.HeaderCell();
            headCell.innerHTML = item;
            head.appendChild(headCell)
        });
        table.appendChild(head);
        data.forEach(item => {
            var row = table.items.add({});
            Object.entries(item).forEach(item => {
                var cell = new Coral.Table.Cell();
                cell.innerHTML = item[0] === 'path' ? '<a href="' + $domain + item[1] + '">' + item[1] + '</a>' : item[1];
                row.appendChild(cell);
            })
        });
        $queryForm.after(table);
    }

    function addPagination(data) {
        var pagesCount = Math.ceil(data["resultCount"] / data["limit"]);
        var currentPage = Math.floor(data["offset"] / data["limit"]) + 1;
        var language = data["language"];
        var query = data["query"];
        var offset_next = data["offset"] + data["data"].length;
        var offset_previous = data["offset"] - data["data"].length;
        var limit = data["limit"];
        var limitInput = $('#limitInput');

        var buttonNextPage = new Coral.Button().set({
            label: {
                innerHTML: 'Next'
            },
            variant: "cta",
            iconSize: "M",
            disabled: currentPage === pagesCount
        });
        buttonNextPage.classList.add('query-kit-pagination');
        buttonNextPage.setAttribute("id", "nextPageButton");
        buttonNextPage.on("click" ,(function () {
            doPostForPagination(language, query, offset_next, limitInput[0].get('value'));
        }));

        var buttonPreviousPage = new Coral.Button().set({
            label: {
                innerHTML: 'Previous'
            },
            variant: "cta",
            iconSize: "M",
            disabled: currentPage === 1
        });
        buttonPreviousPage.classList.add('query-kit-pagination');
        buttonPreviousPage.setAttribute("id", "buttonPreviousPage");
        buttonPreviousPage.on("click" ,(function () {
            doPostForPagination(language, query, offset_previous, limitInput[0].get('value'));
        }));

        var pageSelect = new Coral.Select().set({
            name: "Select",
            placeholder: "Choose a page",
            disabled: data['resultCount'] === -1
        });
        pageSelect.classList.add('query-kit-pagination');
        for (let i = 1; i <= pagesCount; i++) {
            pageSelect.items.add({
                content: {
                    innerHTML: `${i} page`
                },
                value: i,
                disabled: false,
                selected: i === currentPage
            });
        }
        pageSelect.on("change",  function () {
            var newOffset = (pageSelect.selectedItem.get('value') - 1) * limit;
            doPostForPagination(language, query, newOffset, limit);
        })

        $('#resultInfo').remove();
        var resultInfo = document.createElement("div");
        resultInfo.setAttribute('id', 'resultInfo');
        resultInfo.innerText = `${data['offset'] + 1} - ${data['offset'] + data["data"].length} rows of ${data['resultCount'] !== -1 ? data['resultCount'] : 'unknown'}`;
        var resultTable = $("#resultTable");
        resultTable.before(resultInfo);
        resultTable.after(pageSelect).after(buttonNextPage).after(buttonPreviousPage);
    }

    function doPostForPagination(language, query, offset, limit){
       $.ajax({
           url: $queryForm.attr('action'),
           type: "POST",
           data: {"language": language, "query": query, "offset": offset, "limit": limit},
           success: executeSuccess
       })
    }

    setTimeout(function init(){
        editor = document.querySelector('.CodeMirror').CodeMirror;
        editorLines = document.querySelector('.CodeMirror-lines');
        editor.setValue(localStorage.getItem(TYPED_QUERIES_KEY));
    }, 0)
});