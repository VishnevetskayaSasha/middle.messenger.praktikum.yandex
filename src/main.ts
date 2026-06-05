import Handlebars from "handlebars";
import buttonTemplate from './components/button/button.hbs?raw';
import inputTemplate from './components/input/input.hbs?raw';
import linkTemplate from './components/link/link.hbs?raw';
import headingTemplate from './components/heading/heading.hbs?raw';
import chatItemTemplate from './components/chatItem/chatItem.hbs?raw';

import loginTemplate from './pages/login/login.hbs?raw';
import registrationTemplate from './pages/registration/registration.hbs?raw';
import error404Template from './pages/error404/error404.hbs?raw';
import error500Template from './pages/error500/error500.hbs?raw';
import chatsTemplate from './pages/chats/chats.hbs?raw'

import { chats } from './mocks/chats.js';
import eq from './helpers/eq.js';

import './styles/styles.scss';


Handlebars.registerPartial("button", buttonTemplate);
Handlebars.registerPartial("input", inputTemplate);
Handlebars.registerPartial("link", linkTemplate);
Handlebars.registerPartial("heading", headingTemplate);
Handlebars.registerPartial("chatItem", chatItemTemplate);
Handlebars.registerHelper("eq", eq);


function render() { 
  const route = window.location.hash; 
  const app = document.querySelector('#app'); 
  
  switch (route) {
    case '':
      app!.innerHTML = Handlebars.compile(loginTemplate)({});
      break;

    case '#register':
      app!.innerHTML = Handlebars.compile(registrationTemplate)({});
      break;

    case '#404':
      app!.innerHTML = Handlebars.compile(error404Template)({});
      break;

    case '#500':
      app!.innerHTML = Handlebars.compile(error500Template)({});
      break;

    case '#chats':
      app!.innerHTML = Handlebars.compile(chatsTemplate)({chats});
      break;

    default:
      app!.innerHTML = Handlebars.compile(error404Template)({});
      break;
  }
}


window.addEventListener('hashchange', render);
render();