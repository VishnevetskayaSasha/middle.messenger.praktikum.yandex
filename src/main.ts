import Handlebars from "handlebars";
import { registerComponent } from './framework';
import { router } from './router';
import { userController } from './controllers';

// components
import { Button } from './components/button';
import { Input } from './components/input';
import { Link } from './components/link';
import { Heading } from './components/heading';
import { ChatItem } from './components/chatItem';
import { ProfileField } from './components/profileField';
import { FormError } from './components/formError';

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
registerComponent(FormError);

Handlebars.registerHelper("eq", eq);

router
  .use('/', LoginPage)
  .use('/sign-up', RegistrationPage)
  .use('/settings', ProfilePage)
  .use('/messenger', ChatsPage)
  .use('/404', Error404Page)
  .use('/500', Error500Page);

async function startApp(): Promise<void> {
  try {
    await userController.getUser();
    router.start(true);
  } catch {
    router.start(false);
  }
}

startApp();
