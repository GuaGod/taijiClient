import 'babel-polyfill'

import '../../assets/common/reset.css'
import '../../assets/common/manageCommon.css'
import "./mGetGameDetail.css"

import href from '../../assets/common/hrefData.js'


window['GAME'] = {}; 

var E = window['wangEditor'];


window['GAME'].descEditor = new E('#descEditor');
window['GAME'].knowEditor = new E('#knowEditor');
window['GAME'].contentEditor = new E('#contentEditor');


window['GAME'].descEditor.customConfig.uploadImgShowBase64 = true;
window['GAME'].knowEditor.customConfig.uploadImgShowBase64 = true;
window['GAME'].contentEditor.customConfig.uploadImgShowBase64 = true;

window['GAME'].descEditor.create();
window['GAME'].knowEditor.create();
window['GAME'].contentEditor.create();


;(function() {
   const config = {
       getGameDetailByIdAPI: 'http://rammsteinlp.cn:8080/o2o/match/select',     //post
       getGameProjectAPI: 'http://rammsteinlp.cn:8080/o2o/match/queryEventByMatch', //post
       getGameApplyTeamAPI: 'http://139.224.232.81:8080/o2o/user/getAllTeams',     //get
       getTeamDetailAPI: 'http://139.224.232.81:8080/o2o/user/getTeamMember'       
   }
   class Game {
      constructor() {
          this.matchId;
          this.applyTeam = {
              pageNum: 1,
              pageSize: 10,
              total: 0,
              pages: 0,
          }
      }

      _updateShowList(data) {
        function createHtml() {
            let lists = data.rows;
            let html = ``;
            for (let i = 0, len = lists.length; i < len; i++) {
                let list = lists[i];
                html += `<li class="item">
                <div>${list.teamName}</div>
                <div>${list.leaderName}</div>
                <div>${list.coachName}</div>
                <div>${list.doctorName}</div>
                <div>${list.teamFemaleNumber}</div>
                <div>${list.teamMaleNumber}</div>
                <div>${list.teamNumber}</div>
                <div data-teamid=${list.gameApplyId}>查看详情</div>
                </li>`
            }
            return html;
        }

        function render(html) {
            $('#team-ul').html(html);
        }

        function bindEvent() {
            let _getTeamData = function(teamId) {
                 return new Promise((resolve, reject) => {
                     $.ajax({
                         url: config.getTeamDetailAPI,
                         data: {
                            gameApplyId: teamId
                         },
                         dataType: 'json',
                         type: 'GET'
                     }).done((data) => {
                         resolve(data);
                     }).fail((error) => {
                         reject(error);
                     })
                 })
            }

            $('#team-ul').find(`[data-teamid]`).click(function() {
                let $target = $(this);
                let teamId = $target.data('teamid');
                _getTeamData(teamId)
                .then((data) => {
                    console.log(data);
                })
                
            })
        }

        async function flow() {
            let html = createHtml(data);
            render(html);
            bindEvent();
        }

        flow();

    }

    _updateDevidePage() {
        let that = this;
        let devidePage = $(`#devidePage`);
        let pageNum = this.applyTeam.pageNum;

        function createHtml() {
            let pages = that.applyTeam.pages;
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
    
    _getGameListData(pageNum) {
        let that = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: config.getGameApplyTeamAPI,
                data: {
                    matchId: that.matchId,
                    pageNum: pageNum
                },
                dataType: 'json',
                type: 'GET'
            }).done((data) => {
                resolve(data);
            }).fail((error) => {
                reject(error);
            });
        });
    }

    toPage(pageNum) {
        let that = this;
        this.applyTeam.pageNum = pageNum;

        function updateObjData(data) {
            that.applyTeam.total = data.count;
            that.applyTeam.pages = Math.ceil(data.count / 10)
        }

        function renderTotalTeam(){
             $('#teamNum').html(that.applyTeam.total);
        }

        async function flow() {
            let data = await that._getGameListData(pageNum);
            updateObjData(data);
            that._updateShowList(data);
            that._updateDevidePage(data);   
            renderTotalTeam();
        }
        
        flow();
    }

      
      _getGameData() {
          let that = this;
          return new Promise((resolve, reject) => {
              $.ajax({
                  url: config.getGameDetailByIdAPI,
                  data: {
                      matchId: that.matchId
                  },
                  dataType: 'json',
                  type: 'POST'
              }).done((data) => {
                  resolve(data);
              }).fail((error) => {
                  reject(error);
              })
          })
      }

      _getGameProject() {
          let that = this;
          return new Promise((resolve, reject) => {
               $.ajax({
                   url: config.getGameProjectAPI,
                   data: {
                       matchId: that.matchId
                   },
                   dataType: 'json',
                   type: 'POST'
               }).done((data) => {
                   resolve(data);
               }).fail((error) => {
                   reject(error);
               })
          })
      }

      _getApplyTeam() {
          let that = this;
          return new Promise((resolve, reject) => {
            $.ajax({
                url: config.getGameApplyTeamAPI,
                data: {
                    matchId: that.matchId,
                    pageNum: that.applyTeam.pageNum
                },
                type: 'GET',
                dataType: 'json',               
            }).done((data) => {
                resolve(data);
            }).fail((error) => {
                reject(error);
            })
          })
      }

      _renderGame(data) {                
           let match = data.match;
           $('#name').html(match.matchName);
           window['GAME'].knowEditor.txt.html(match.matchNeedKnow);
           $('#gameTime').html(match.matchTime);
           $('#position').html(match.matchPlace);
           $('#applicationTime').html(match.applyTime);
           window['GAME'].descEditor.txt.html(match.matchDesc);
           $('#stage').html(match.matchType);
           window['GAME'].contentEditor.txt.html(match.matchContent);
           $('#limitMale').html(match.maleLimit === -1 ? "无" : match.maleLimit);
           $('#limitFemale').html(match.femaleLimit === -1 ? "无" : match.femaleLimit);
           $('#limitAll').html(match.totalLimit === -1 ? "无" : match.totalLimit);
           $('#food').html(match.isFood === 1 ? "是" : "否");
           $('#house').html(match.isSleep === 1 ? "是" : "否");
      }

      _renderProject(data) {
          let events = data.events;
          try {
            $('#type').html(events[0].firstLevel);
          } catch {
              return;
          }
          
          let html = `<ul>`
          for(let i = 0, len = events.length; i < len; i++) {
            let event = events[i];  
            html += `<li>${event.secondLevel}-${event.thirdLevel}-${event.eventName}</li>`
          }

          html += `</ul>`
          $('#project').html(html);
      }

      _bindEvent() {
          let that = this;
          $('#devidePage').on('click', function (e) {
            let $target = $(e.target);
            let clickPage = Number($target.data(`pagenum`));
            that.toPage(clickPage);
        });
      }

      init() {
          let that = this;
          this.matchId = href.matchId;

          Promise.all([that._getGameData(),
                       that._getGameProject()])
                 .then(data => {
                     that._renderGame(data[0]);
                     that._renderProject(data[1]);
                 })
                 .catch(error => {
                     console.log(error);
                 })
          that.toPage(1);
          this._bindEvent();
      }
   }

   window['GAME'].game = new Game();
   window['GAME'].game.init();
})();


