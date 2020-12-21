import {app, ipcMain, Menu} from 'electron';
ipcMain.on('app_exit', (e) => {
    console.log("监听到退出事件");
    app.exit();
});

ipcMain.on('createSuspensionMenu', (e) => {
    const rightM = Menu.buildFromTemplate([
        {label: 'BTC/USDT', enabled: false},
        {label: 'ETH/USDT', enabled: false},
        {label: 'EOS/USDT',
            click:() => {
                app.win.webContents.send("change_symbol")
            }
        },
        {type: 'separator'},
        {
            label: '退出软件',
            click: () => {
                app.exit();
            }
        },
    ]);
    rightM.popup({});
});
