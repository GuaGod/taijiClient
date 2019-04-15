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

window['GAME'].appBeginTime = $('#applicationBeginTime');
window['GAME'].appEndTime = $('#applicationEndTime');
window['GAME'].gameBeginTime = $('#gameBeginTime');
window['GAME'].gameEndTime = $('#gameEndTime');


window['GAME'].appBeginTime.calendar({                      
    speed: 200,                                           
    complement: true,                                     
    readonly: true,                                      
});

window['GAME'].appEndTime.calendar({                               
    speed: 200,         
    complement: true,                                  
    readonly: true,                                       
});

window['GAME'].gameBeginTime.calendar({                               
    speed: 200,         
    complement: true,                                  
    readonly: true,                                       
});

window['GAME'].gameEndTime.calendar({                               
    speed: 200,         
    complement: true,                                  
    readonly: true,                                       
});

