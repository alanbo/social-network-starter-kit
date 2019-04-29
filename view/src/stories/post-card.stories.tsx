import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, object, date } from '@storybook/addon-knobs';
import PostCard from '../components/PostCard';
import { UserQuery_user } from '../graphql/operation-result-types';

const text_content = 'Fugit consequatur dignissimos. Facilis et laborum sunt cumque cumque voluptatem est. Voluptatem facilis dignissimos quia hic eum.\n \rQuo quo quia earum non. Possimus cupiditate rerum quo et voluptatibus soluta corrupti. Enim aliquid id voluptatem odit atque facilis omnis ut. Accusantium quia culpa et ut odio. Natus sapiente sint facere cum aperiam neque alias.\n \rCorporis quod consequatur esse a dolore ipsam animi soluta. Earum voluptatem porro quo et cumque voluptas similique architecto. Voluptate nihil minima vero ullam qui.';

const comments = [
  {
    "_id": "6039d177-8f5d-4883-83e0-3f82c1b4f392",
    "message": "Quisquam quasi quis tenetur. Deleniti quod aliquid rerum sit. Error quia repellendus debitis voluptas exercitationem sapiente quaerat. Labore blanditiis saepe nobis quod animi. Officia quis aut.\n \rNam suscipit corrupti dolorem dolor. Eos mollitia quia vel. Ut mollitia sunt quidem laudantium veniam. Id assumenda dolores consequatur sint enim impedit sint tenetur. Corporis voluptates ut aspernatur non et quae et ut ut. Quis nihil maxime tenetur qui aut.\n \rAut non quibusdam sed delectus aut. Rem dolores et accusamus error itaque eum et. Fugit voluptate hic fugit accusantium illum aliquid ex. Sit et distinctio cumque.",
    "createdAt": "2018-06-06T17:50:31.731Z",
    "user": {
      "_id": "28397f52-2048-4646-a180-016e6415d91e",
      "first_name": "Ryann",
      "last_name": "Bahringer",
      "email": "crystel_sawayn51@gmail.com"
    }
  },
  {
    "_id": "f17812c8-86bc-464c-b689-b6abc6108d22",
    "message": "Deserunt repudiandae maxime incidunt doloribus. Corporis totam eaque. Esse eos doloremque dignissimos commodi. Molestiae repellat omnis et laboriosam ipsum. Blanditiis eius voluptas atque dolorem tempore.\n \rDolorum omnis vitae omnis iste voluptate consequatur numquam in. Aut autem exercitationem maiores consectetur earum et sapiente quas. Possimus unde et inventore.\n \rNecessitatibus repellat quo ut eos cumque et quis unde. Sunt in in nostrum voluptas hic. Qui a sunt fugiat quo nisi rerum sint voluptas exercitationem. Ea cupiditate quae ut nulla. Iusto atque accusantium quaerat alias. Deserunt saepe quam suscipit reiciendis beatae tenetur autem dignissimos quia.",
    "createdAt": "2019-03-15T22:57:47.201Z",
    "user": {
      "_id": "ff2517f0-f119-4d19-b483-7fd0e1ba8717",
      "first_name": "Kiarra",
      "last_name": "Mohr",
      "email": "heath_gaylord53@hotmail.com"
    }
  },
  {
    "_id": "7a6c5495-70c0-4ef2-bd8d-4a46609eae00",
    "message": "Repudiandae voluptatem in at pariatur amet dolores odio commodi harum. Magnam et reiciendis beatae ea molestiae voluptatem expedita facere et. Nisi et consequatur vitae qui eum ex aut. Est quae fugit ut tempora ducimus voluptas est minus nesciunt.\n \rTenetur et omnis voluptates reprehenderit ab. Rerum sit quia dolor unde ipsa quia et ea. Ad delectus reiciendis. Fugit voluptas sunt. At fugit in qui est adipisci. Officiis repudiandae amet nemo quos omnis exercitationem et.\n \rFuga aut voluptatem inventore autem rerum accusantium. Possimus vero porro. Esse sequi a vel vel quibusdam temporibus facere. Nisi minus quasi voluptatibus.",
    "createdAt": "2019-04-14T13:07:06.945Z",
    "user": {
      "_id": "a6fa95e1-c358-4392-9f6f-38c1083e1b3b",
      "first_name": "Emmy",
      "last_name": "O'Connell",
      "email": "issac_ondricka@hotmail.com"
    }
  }
]

const user: UserQuery_user = {
  "_id": "28397f52-2048-4646-a180-016e6415d91e",
  "first_name": "Ryann",
  "last_name": "Bahringer",
  "email": "crystel_sawayn51@gmail.com",
  gender: 'male',
  createdAt: new Date('2017-06-06T17:50:31.731Z'),
  phone_number: '19992228888'
};

const default_date = new Date('2018-11-15T14:45:25.703Z');

function myDateKnob(name: string, defaultValue: Date) {
  const stringTimestamp = date(name, defaultValue)
  return new Date(stringTimestamp)
}

storiesOf('PostCard', module)
  .addDecorator(withKnobs)
  .add('standard', () => (
    <PostCard
      author={text('Author', 'Benjamin Franklin')}
      text={text('Text Content', text_content)}
      date={myDateKnob('Created At', default_date)}
      comments={object('Comments', comments)}
      onAddComment={action('Add Comment')}
      onRemoveComment={action('Remove Comment')}
      post_id={text('ID', 'a26b84b7-a498-4231-9280-bf820ab5c43e')}
      user={object('User', user) as UserQuery_user}
    />
  ));