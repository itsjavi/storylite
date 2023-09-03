import { Story } from '@storylite/storylite'

import '../src/styles/components.css'

export default {
  title: 'Welcome',
  navigation: {
    icon: <span>🏠</span>,
    // iconExpanded: <span>-🏠</span>,
    order: 0, // put on top
    hidden: false, // dont show the default export component in the navigation
  },
  renderFrame: 'root',
  component: () => (
    <div>
      <img src="logo.svg" width={64} height={64} alt="StoryLite Logo" />
      <h1>StoryLite, a lightweight alternative to StoryBook.</h1>
      <p>
        <b>StoryLite</b> is a modern and lightweight toolkit for crafting and managing design
        systems and components with ease. Inspired by the popular StoryBook UI and powered by
        Vite⚡️, StoryLite offers a streamlined and familiar developer experience.
      </p>
      <p>
        With StoryLite, you can swiftly create, test, and refine UI components in isolation,
        ensuring that your application maintains a consistent look and feel.
      </p>
      <p>
        Tailored for smaller projects that crave simplicity without the overhead of a full StoryBook
        setup, StoryLite provides an intuitive UI that's customizable to your unique needs.
      </p>
    </div>
  ),
} satisfies Story
