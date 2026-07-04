import Handlebars from "handlebars";
import { registerComponent } from './framework';

// components
import { Button } from './components/button';
import { Input } from './components/input';
import { Link } from './components/link';
import { Heading } from './components/heading';

import chatItemTemplate from './components/chatItem/chatItem.hbs?raw';
import profileFieldTemplate from './components/profileField/profileField.hbs?raw';

// pages
import { LoginPage } from './pages/login';
import { RegistrationPage } from './pages/registration';

import error404Template from './pages/error404/error404.hbs?raw';
import error500Template from './pages/error500/error500.hbs?raw';
import chatsTemplate from './pages/chats/chats.hbs?raw';
import profileTemplate from './pages/profile/profile.hbs?raw'

import { chats } from './mocks/chats';
import eq from './helpers/eq';

import './styles/styles.scss';

registerComponent(Button);
registerComponent(Input);
registerComponent(Link);
registerComponent(Heading);

Handlebars.registerPartial("chatItem", chatItemTemplate);
Handlebars.registerPartial("profileField", profileFieldTemplate);
Handlebars.registerHelper("eq", eq);


function render() { 
  const route = window.location.hash; 
  const app = document.querySelector('#app'); 
  
  switch (route) {
    case '': {
      const page = new LoginPage();
      app!.innerHTML = '';
      app!.append(page.element()!);
      break;
    }
    case '#register': {
      const page = new RegistrationPage();
      app!.innerHTML = '';
      app!.append(page.element()!);

      break;
    }
    case '#404':
      app!.innerHTML = Handlebars.compile(error404Template)({});
      break;

    case '#500':
      app!.innerHTML = Handlebars.compile(error500Template)({});
      break;

    case '#chats':
      app!.innerHTML = Handlebars.compile(chatsTemplate)({chats});
      break;

    case '#profile':
      app!.innerHTML = Handlebars.compile(profileTemplate)({});
      break;

    default:
      app!.innerHTML = Handlebars.compile(error404Template)({});
      break;
  }
}

window.addEventListener('hashchange', render);
render();
