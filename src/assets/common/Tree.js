let Tree = (function() {
    var levelMap = new Map([
        [1, 'firstLevel'],
        [2, 'secondLevel'],
        [3, 'thirdLevel'],
        [4, 'eventName']
    ])

    function Tree() {
        this.sonTrees = new Map();
    }

    Tree.prototype = {
        push: function(dataObj) {
            var that = this;
            var first = dataObj.firstLevel;   //第一级的名字
            if(!that.sonTrees.has(first)) {
               this.sonTrees.set(first, new TreeNode(1, first));
            } 
            var __firstLevelObj__ = that.sonTrees.get(first);  //获取以前的
                __firstLevelObj__.push(2, dataObj);
        },
 
    }
    

    function TreeNode(level, value) {
        this.level = level;
        this.value = value;
        this.sonTrees = new Map();
    }

    TreeNode.prototype = {
        push: function(level, dataObj) {
            let that = this;
            let treeNode = new TreeNode(level, dataObj[levelMap.get(level)]);

            if(!this.sonTrees.has(treeNode.value)) {
                that.sonTrees.set(treeNode.value, treeNode);        
            } 
            
            if(level === 4) { 
                treeNode.sonTrees = null;
                treeNode.eventId = dataObj.eventId;
                return ;
            } 
             
             
            this.sonTrees.get(treeNode.value).push(level + 1, dataObj);
        },  

 
    }

    return Tree;

})();


export {
    Tree
}