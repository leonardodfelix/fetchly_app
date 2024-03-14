import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="chat"
export default class extends Controller {
  static values = { currentUserId: String };

  connect() {
    this.setupScrollListener();
    this.setupMessageListener();
  }

  disconnect() {
    this.scrollObserver.disconnect();
    this.messageObserver.disconnect();
  }

  setupScrollListener() {
    this.scrollToBottom();

    this.scrollObserver = new MutationObserver(() => {
      this.scrollToBottom();
    });

    this.scrollObserver.observe(this.element, {
      childList: true,
      subtree: true
    });
  }

  setupMessageListener() {
    this.styleExistingMessages();

    this.messageObserver = new MutationObserver((mutations) => {
      this.styleAddedNodes(mutations);
    });

    this.messageObserver.observe(this.element, {
      childList: true,
      subtree: true
    });
  }

  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight;
  }

  styleExistingMessages() {
    this.element.querySelectorAll(".message").forEach((message) => {
      this.styleMessage(message);
    });
  }

  styleAddedNodes(mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          this.styleMessage(node);
        }
      });
    });
  }

  styleMessage(message) {
    let messageNode = this.getMessageNode(message);
    if (!messageNode) return;

    const userId = messageNode.dataset.userId;
    const messageBody = messageNode.querySelector(".message-body");

    this.applyStyle(messageBody, userId);
  }

  getMessageNode(node) {
    return node.closest(".message") || node.querySelector(".message");
  }

  applyStyle(messageBody, userId) {
    if (userId === this.currentUserIdValue) {
      messageBody.classList.add("bg-blue-500", "text-white");
    } else {
      messageBody.classList.add("bg-gray-200", "text-gray-900");
    }
  }
}
