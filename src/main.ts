import Handlebars from "handlebars";
import { registerComponent } from './framework';
import { router } from './router';

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

router
  .use('/', LoginPage)
  .use('/sign-up', RegistrationPage)
  .use('/settings', ProfilePage)
  .use('/messenger', ChatsPage)
  .use('/404', Error404Page)
  .use('/500', Error500Page)
  .start();
