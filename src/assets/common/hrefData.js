

class Href {
    constructor() {
      this.data = this.getData();
    }
    getData() {
        var href=window.location.href;
        var paraString=href.split('?')[1];
        var paraObj={};
        if(paraString!==undefined){
           var paraArray=paraString.split('&');
           for(var i in paraArray){
              var key=paraArray[i].split('=')[0];
              var value=paraArray[i].split('=')[1];
              paraObj[key]=value;
        }
       }
      return paraObj;
    }
}

export default (new Href()).data;
