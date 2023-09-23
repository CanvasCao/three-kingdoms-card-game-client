import 'normalize.css'
import "./jsoneditor/jsoneditor.min.css";
import {setI18nLan} from './i18n/i18nUtils';
import {setPageByFeatureToggle} from "./utils/toggle/toggle";
import {config} from './class/Gaming/Gaming';
import {bindLoginPageEvent, bindRoomPlayersPageEvent, bindRoomsPageEvent} from './event/bindPageEvent';

setI18nLan();
setPageByFeatureToggle();
bindLoginPageEvent();
bindRoomsPageEvent();
bindRoomPlayersPageEvent();

new Phaser.Game(config);
