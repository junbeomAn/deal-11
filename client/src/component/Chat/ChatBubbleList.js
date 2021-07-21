import Component from '../../core/Component';

export default class ChatBubbleList extends Component {
  template() {
    const bubbles = [
      {
        content: '안녕하세요 ~',
        read: 0,
        fromId: 0,
      },
      {
        content: '방가워요 ㅎ',
        read: 0,
        fromId: 0,
      },
      {
        content: '저기요?',
        read: 0,
        fromId: 3,
      },
    ];

    // const { messages: bubbles } = this.store.getState('chatInfo')

    return `
      <ul class="chat-bubble-list">
      ${bubbles.reduce((acc, bubble) => {
        const { content, fromId } = bubble;
        return (
          acc +
          `
            <li class="bubble-item-wrapper ${
              fromId === 0 ? 'mine' : 'opponent'
            }">
              <div class="bubble-item">
                <div class="content">
                  ${content}
                </div>
              </div>
            </li>
          `
        );
      }, '')}
      </ul>
    `;
  }
}
