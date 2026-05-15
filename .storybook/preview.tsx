import type { Preview } from '@storybook/react'
import GlobalStyle from '../src/style/GlobalStyle'

const preview: Preview = {
  decorators: [
    (Story) => (
      <>
        <GlobalStyle />
        <div style={{ padding: '24px' }}>
          <Story />
        </div>
      </>
    )
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: 'centered'
  }
}

export default preview
