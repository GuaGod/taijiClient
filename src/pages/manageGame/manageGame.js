import 'babel-polyfill';

import '../../assets/common/reset.css'
import '../../assets/common/manageCommon.css'
import './manageGame.css'

window['GAEMBLOCK'] = {};

; (function () {
    const config = {
        "searchGameAPI": "http://rammsteinlp.cn:8080/o2o/match/selectByMatchName",    //post
    }

    class GameBlock {
        constructor() {
            this._pageSize = 10;
            this._pageNum = 1;
            this._pages;
        }

        _updateShowList(data) {
            function createHtml() {
                let lists = data.matchPage.list;
                let html = ``;
                for (let i = 0, len = lists.length; i < len; i++) {
                    let list = lists[i];
                    html += `<li class="item">
                      <div>${list.matchName}</div>
                      <div>${list.matchTime}</div>
                      <div>${list.matchPlace}</div>
                      <div>${list.applyTime}</div>
                      <div>
                        <a href="../mGetGameDetail/mGetGameDetail.html?matchId=${list.matchId}">查看详情</a>
                      </div>
                     </li>`
                }
                return html;
            }

            function render(html) {
                $('#gameList').html(html);
            }

            async function flow() {
                let html = createHtml(data);
                render(html);
            }

            flow();

        }

        _updateDevidePage() {
            let that = this;
            let devidePage = $(`#devidePage`);
            let pageNum = this._pageNum;

            function createHtml() {
                let pages = that._pages;
                let start, end;
                let html = `<li data-pageNum="1">首页</li>`;
                if (pages <= 5) {
                    start = 1;
                    end = pages;
                } else if (pageNum <= 2) {
                    start = 1;
                    end = 5;
                } else if (pageNum >= pages - 2) {
                    start = pages - 4;
                    end = pages;
                } else {
                    start = pageNum - 2;
                    end = pageNum + 2;
                }

                for (let i = start; i <= end; i++) {
                    html += `<li data-pageNum=${i} data-action="pageBtn">${i}</li>`;
                }
                html += `<li data-pageNum=${pages}>尾页</li>`;

                return html;
            }

            function render(html) {
                devidePage.html(html);
                devidePage.find(`[data-action=pagebtn]`).removeClass('active');
                devidePage.find(`[data-pagenum=${pageNum}][data-action=pageBtn]`).addClass('active');
            }

            async function flow() {
                let html = createHtml();
                render(html);
            }

            flow();
        }

        _getGameListDataByName(gameName, pageNum) {
            let that = this;
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: config.searchGameAPI,
                    data: {
                        matchName: gameName,
                        pageNum: pageNum,
                        pageSize: that._pageSize
                    },
                    dataType: 'json',
                    type: 'POST'
                }).done((data) => {
                    resolve(data);
                }).fail((error) => {
                    reject(error);
                });
            });
        }

        searchGame(gameName, pageNum) {
            let that = this;
            this._pageNum = pageNum;

            function updateObjData(data) {
                that._pages = data.matchPage.totalPage;
            }

            async function flow() {
                let data = await that._getGameListDataByName(gameName, pageNum);
                data.matchPage = data.match;            //适配器
                delete data.match;
                updateObjData(data);
                that._updateShowList(data);
                that._updateDevidePage(data);   
            }
            
            flow();
        }

        init() {
            this.searchGame("", 1);
            this.bindEvent();
        }


        bindEvent() {
            let that = this;

            $('#search').on('input propertychange', function(e) {
                 let value = $(this).val();
                 that.searchGame(value, 1);
            })

            $('#devidePage').on('click', function (e) {
                let $target = $(e.target);
                let clickPage = Number($target.data(`pagenum`));
                let gameName = $('#search').val();
                that.searchGame(gameName, clickPage);
            });
        }
    }

    window['GAEMBLOCK'].gameBlock = new GameBlock();
    window['GAEMBLOCK'].gameBlock.init();
})();