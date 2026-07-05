import Handlebars from "handlebars";
import { Block, registerComponent } from './framework';

// components
import { Button } from './components/button';
import { Input } from './components/input';
import { Link } from './components/link';
import { Heading } from './components/heading';
import { ChatItem } from './components/chatItem';
import { ProfileField } from './components/profileField';

// pages
import { LoginPage } from './pages/login';
import { RegistrationPage } from './pages/registration';
import { Error404Page } from './pages/error404';
import { Error500Page } from './pages/error500';
import { ChatsPage } from './pages/chats';
import { ProfilePage } from './pages/profile';

import eq from './helpers/eq';

import './styles/styles.scss';

registerComponent(Button);
registerComponent(Input);
registerComponent(Link);
registerComponent(Heading);
registerComponent(ChatItem);
registerComponent(ProfileField);

Handlebars.registerHelper("eq", eq);

function renderPage(page: Block) {
  const app = document.querySelector('#app');

  if (!app) {
    throw new Error('App container not found');
  }

  app.innerHTML = '';
  app.append(page.element()!);
}

function render() { 
  const route = window.location.hash;  
  
  switch (route) {
    case '':
      renderPage(new LoginPage());
      break;

    case '#register':
      renderPage(new RegistrationPage());
      break;
    
    case '#404':
      renderPage(new Error404Page());
      break;
    
    case '#500':
      renderPage(new Error500Page());
      break;

    case '#chats':
      renderPage(new ChatsPage());
      break;

    case '#profile':
      renderPage(new ProfilePage());
      break;

    default:
      renderPage(new Error404Page());
      break;
  }
}

window.addEventListener('hashchange', render);
render();
