// Test: Sending a chat message

const Page = require('../core/page');
const e = require('./elements');
const util = require('./util');

class Send extends Page {
  constructor() {
    super('chat-send');
  }

  async test(testName) {
    try {
      await util.openChat(this);

      // 0 messages
      const chat0 = await this.page.evaluate((chatSelector) => document.querySelectorAll(chatSelector).length === 0, e.chatUserMessageText);
      await this.screenshot(`${testName}`, `01-before-chat-message-send-[${this.meetingId}]`);

      // send a message
      await this.type(e.chatBox, e.message);
      await this.screenshot(`${testName}`, `02-typing-chat-message-[${this.meetingId}]`);

      await this.click(e.sendButton, true);
      await this.screenshot(`${testName}`, `03-after-chat-message-send-[${this.meetingId}]`);

      await this.waitForSelector(e.chatUserMessageText);

      // 1 message
      const chat1 = await this.page.evaluate((chatSelector) => document.querySelectorAll(chatSelector).length === 1, e.chatUserMessageText);
      return chat0 === chat1;
    } catch (err) {
      await this.logger(err);
      return false;
    }
  }
}

module.exports = exports = Send;
