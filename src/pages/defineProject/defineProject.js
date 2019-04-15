import 'babel-polyfill'

import '../../assets/common/reset.css'
import '../../assets/common/manageCommon.css'
import "./defineProject.css"

import {Tree} from "../../assets/common/Tree.js"
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

window['GAME'] = {};

window['GAME'].Tree = Tree;

;(function() {
    const config = {
        addEventAPI: "http://188.131.244.33:8080/taiji/eventnew/add",
        deleteEventAPI: "http://188.131.244.33:8080/taiji/eventnew/delete",
        queryEventAPI: "http://188.131.244.33:8080/taiji/eventnew/query",
    }
    class Game {
        constructor() {
           this.projectTree = null;
        }
        _initSelfProjectTree() {
            var that = this;
            that.projectTree = new window['GAME'].Tree();

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: config.queryEventAPI,
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
        }

        _initFirstProject() {
            var that = this;
            var $type = $('#type');
            var html = ``;
            for (let firstLevelPro of that.projectTree.sonTrees.keys()) {
                html += `<option>${firstLevelPro}</option>`
            }
            $type.html(html);
        }

        _updateOtherProject() {
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
                                            </div>
                                          `);
                        tLevelDom.append(fLevelDom);
                    }
                    sLevelDom.append(tLevelDom);
                }
                container.append(sLevelDom);
            }

        }

        _bindEvent() {
            let that = this;
            $('#type').on('change', function(e) {
                that._updateOtherProject();
            });

            $('#add').on('click', function(e) {
                let _addEvent = function(data) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: config.addEventAPI,
                            data: data,
                            type: 'POST',
                            dataType: 'json'
                        }).done((data) => {
                            resolve(data);
                        }).fail((error) => {
                            reject(error);
                        })
                    })
                }

                let html = `<div>
                     <div>第一级：<input type="text" id="firstLevel"/></div>
                     <div>第二级：<input type="text" id="secondLevel"/></div>
                     <div>第三级：<input type="text" id="thirdLevel"/></div>
                     <div>第四级：<input type="text" id="eventName"/></div>
                </div>`;
                

                layer.open({
                    content: html,
                    offset: '140px',
                    yes: function() {
                        let firstLevel = $('#firstLevel').val();
                        let secondLevel = $('#secondLevel').val();
                        let thirdLevel = $('#thirdLevel').val();
                        let eventName = $('#eventName').val();
                        if(firstLevel === `` || secondLevel === `` || thirdLevel === `` ||
                           eventName === ``) {
                               return false;
                           }

                        _addEvent({
                            first: firstLevel,
                            second: secondLevel,
                            third: thirdLevel,
                            name: eventName
                        })
                        window.location.reload();
                        layer.closeAll();
                    },
                    cancel: function() {

                    }
                });
            })
            
            $('#delete').on('click', function(e) {
                let _deleteEvent = function(data) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: config.deleteEventAPI,
                            data: data,
                            type: 'POST',
                            dataType: 'json'
                        }).done((data) => {
                            resolve(data);
                        }).fail((error) => {
                            reject(error);
                        })
                    })
                }

                let html = `<div id="deleteContainer">
                     <div>
                     选择层级：
                     <select id="level">
                        <option value="1">第一级</option>
                        <option value="2">第二级</option>
                        <option value="3">第三级</option>
                        <option value="4">第四级</option>
                     </select>
                     </div>
                     <div>
                     名称：<input type="text" id="projectName"/>
                     </div>
                </div>`;
                layer.open({
                    content: html,
                    offset: '140px',
                    yes: function() {
                        let data = {};
                        data.level = Number($('#level').val());
                        data.del = $('#projectName').val();
                       _deleteEvent(data)
                       .then(() => {
                           window.location.reload();    
                       }).catch(() => {
                           window.location.reload();
                       })
                      
                    }
                });
            })
        }


        init() {
            let that = this;

            async function flow() {
                await that._initSelfProjectTree();   //拉取自定义的项目内容，并生成树
                that._initFirstProject();            //初始化自定义项目第一级
                that._updateOtherProject();            //初始化级别的项目
                that._bindEvent();                   //绑定事件
            }

            flow();
        }


    }

    window['GAME'].game = new Game();
    window['GAME'].game.init();
})();