
import './startup';

import {init as basicInit} from "./baseFunctions";
import installProcess from './install';
//import '../node_modules/dialog-polyfill/dist/dialog-polyfill.css';
import '../css/main.scss';
import '../css/startupApp.css';
basicInit(window);
installProcess(window);