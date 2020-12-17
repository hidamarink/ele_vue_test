import {app, ipcMain} from 'electron';

ipcMain.on('app_exit', (e) => {
    console.log("监听到退出事件");
    app.exit();
});


