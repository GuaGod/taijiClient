import 'babel-polyfill'

import '../../assets/common/reset.css'
import '../../assets/common/manageCommon.css'
import "./createNewGame.css"

import './app.js'
import {Tree} from '../../assets/common/Tree'

window['GAME'].Tree = Tree;


; (function () {
    const config = {
        submitUrl: "http://rammsteinlp.cn:8080/o2o/match/insert"
    }

    function Game() {
        this.submitData = {
            matchName: '',
            matchTime: '',
            matchPlace: '',
            applyTime: '',
            matchDesc: '',
            maleLimit: -1,
            femaleLimit: -1,
            matchContent: "",
            isFood: 0,
            isSleep: 0,
            matchType: '',
            matchNeedKnow: '',
            totalLimit: -1,
            eventIds: []
        }
        this.projectTree;
    }

    Game.prototype = {
        _initSelfProjectTree: function () {
            var that = this;
            that.projectTree = new window['GAME'].Tree();

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: `http://188.131.244.33:8080/taiji/eventnew/query`,
                    dataType: 'json',
                    type: 'POST'
                }).done((data) => {
                    var projectList = data.rows;
                    for (var i = 0, len = projectList.length; i < len; i++) {
                        that.projectTree.push(projectList[i]);
                    }
                    resolve(data);
                }).fail((error) => {
                    console.log(error);
                })
            })
        },

        _initFirstProject: function () {
            var that = this;
            var $type = $('#type');
            var html = ``;
            for (let firstLevelPro of that.projectTree.sonTrees.keys()) {
                html += `<option>${firstLevelPro}</option>`
            }
            $type.html(html);
        },

        _updateOtherProject: function () {
            let that = this;
            let container = $('#sonTypeContainer');
            container.html(``);
            let firstLevelNow = that.projectTree.sonTrees.get($('#type').val());
            
            for (let [sValue, sLevelTree] of firstLevelNow.sonTrees.entries()) {
                let sLevelDom = $(`<div class="sLevel">
                                     <div class="sValue">${sValue}</div>
                                 </div>`);
                
                for(let [tValue, tLevelTree] of sLevelTree.sonTrees.entries()) {
                    let tLevelDom = $(`<div class="tLevel">
                                         <div class="tValue">${tValue}</div>
                                    </div>`);
                                    
                    for(let [fValue, fLevelTree] of tLevelTree.sonTrees.entries()) {
                        let fLevelDom = $(`
                                            <div class="fLevel">${fValue}
                                              <input name="chooseProject" type="checkbox" data-eventid="${fLevelTree.eventId}"/>
                                            </div>
                                          `);
                        tLevelDom.append(fLevelDom);
                    }
                    sLevelDom.append(tLevelDom);
                }
                container.append(sLevelDom);
            }

        },

        _bindEvent: function() {
            let that = this;
            $('#type').on('change', function(e) {
                that._updateOtherProject();
            });

            $('#createGame').on('click', function(e) {
                that.submit();
            })
        },

        init: function () {
            let that = this;

            async function flow() {
                await that._initSelfProjectTree();   //拉取自定义的项目内容，并生成树
                that._initFirstProject();            //初始化自定义项目第一级
                that._updateOtherProject();            //初始化级别的项目
                that._bindEvent();                   //绑定事件
            }

            flow();
        },

        

        _updateData: function() {
             let obj = this.submitData;
             obj.matchName = $('#name').val();
             obj.matchTime = $('#gameBeginTime').val() + `-` + $('#gameEndTime').val();
             obj.matchPlace = $('#prov').val() + '-' + $('#city').val() + '-' +$('#country').val();
             obj.applyTime = $('#applicationBeginTime').val() + `-` + $('#applicationEndTime').val();
             obj.matchDesc = window['GAME'].descEditor.txt.html();
             obj.maleLimit = $('input[name=maleLimit]:checked').val() === "false"
                             ? -1
                             : Number($('#maleLimit').val());
             obj.femaleLimit = $('input[name=femaleLimit]:checked').val() === "false"
                             ? -1
                             : Number($('#femaleLimit').val());
             obj.totalLimit = $('input[name=peopleLimit]:checked').val() === "false"
                             ? -1
                             : Number($('#peopleLimit').val());  
             obj.isFood = $('input[name=food]:checked').val() === "false"
             ? 0
             : 1;  
             obj.isSleep = $('input[name=house]:checked').val() === "false"
             ? 0
             : 1;  
             obj.matchType = $('#stage').val();
             obj.matchNeedKnow = window['GAME'].knowEditor.txt.html();
             obj.matchContent = window['GAME'].contentEditor.txt.html();
             
             let projectsArr = [];
             let $projects = $('[name=chooseProject]:checked');
             for(let i = 0, len = $projects.length; i < len; i++) {
                  projectsArr.push($projects.eq(i).data('eventid'));
             }

             obj.eventIds = JSON.stringify(projectsArr);
             console.log(obj);
        },

        _isDataRight: function() {
             let message = {
                 isRight: false,
                 content: ''
             }
            
             let obj = this.submitData;

             if(obj.matchName === ``) {
                 message.content = `比赛名称不能为空`;
                 return message;
             }

             if(obj.matchNeedKnow === `<p><br></p>`) {
                message.content = `比赛须知不能为空`;
                return message;
            }

            if($('#gameBeginTime').val() === `` || $('#gameEndTime').val() === ``) {
                message.content = `比赛时间不能为空`;
                return message;
            }

            if($('#prov').val() === `请选择省份` || $('#city').val() === `请选择城市` || $('#country').val() === `请选择县区`) {
                message.content = `比赛地点不能为空`;
                return message;
             }

             if($('#applicationBeginTime').val() === `` || $('#applicationEndTime').val() === ``) {
                message.content = `报名时间不能为空`;
                return message;
            }

            if(obj.matchDesc === `<p><br></p>`) {
                message.content = `比赛描述不能为空`;
                return message;
            }

             if(obj.matchType === ``) {
                 message.content = `比赛阶段不能为空`;
                 return message;
             }

             if(JSON.parse(obj.eventIds).length === 0) {
                message.content = `比赛项目不能为空`;
                return message;
             }

             if(obj.matchContent === `<p><br></p>`) {
                 message.content = `比赛内容不能为空`
             }
            
            message.isRight = true;

             return message;
        },

        _submit: function() {
           let that = this;
           $.ajax({
               url: config.submitUrl,
               data: that.submitData,
               type: 'POST',
               dataType: 'json'
           }).done((data) => {
               console.log(data);
           })
        },

        submit: function () {
            this._updateData();

            let message = this._isDataRight();
            if(message.isRight !== true) {
             layer.open({
                content: message.content,
                offset:'140px'
             });
             return;
            }
            
            this._submit();
            
        }


    }

    var game = new Game();
    window['GAME'].game = game;
    game.init();

})();



