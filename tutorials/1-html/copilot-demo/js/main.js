const parseCount = (value) => {
  const normalized = value.trim().toLowerCase();
  if (normalized.endsWith('k')) {
    return Math.round(parseFloat(normalized) * 1000);
  }
  return Number(normalized) || 0;
};

const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(count);
};

const setupLikeButtons = () => {
  document.querySelectorAll('.action-button.like-button').forEach((button) => {
    const countEl = button.querySelector('.action-count');
    const startCount = parseCount(countEl.textContent);
    button.dataset.baseCount = startCount;

    button.addEventListener('click', () => {
      const liked = button.classList.toggle('liked');
      const count = liked ? startCount + 1 : startCount;
      countEl.textContent = formatCount(count);
      button.setAttribute('aria-pressed', liked.toString());
    });
  });
};

const setupCommentPanels = () => {
  document.querySelectorAll('.post-card').forEach((postCard) => {
    const commentButton = postCard.querySelector('.action-button.comment-button');
    const commentPanel = postCard.querySelector('.comment-panel');
    const commentForm = postCard.querySelector('.comment-form');
    const commentInput = postCard.querySelector('.comment-input');
    const commentCountEl = commentButton.querySelector('.action-count');
    const commentList = postCard.querySelector('.comment-list');
    const emptyState = commentList.querySelector('.comment-empty');

    if (!commentButton || !commentPanel || !commentForm || !commentInput || !commentCountEl || !commentList) {
      return;
    }

    commentButton.addEventListener('click', () => {
      const isOpen = commentPanel.classList.toggle('open');
      commentPanel.classList.toggle('hidden', !isOpen);
      commentPanel.setAttribute('aria-hidden', String(!isOpen));
      commentButton.setAttribute('aria-pressed', String(isOpen));
      if (isOpen) {
        commentInput.focus();
      }
    });

    commentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const commentText = commentInput.value.trim();
      if (!commentText) {
        return;
      }

      if (emptyState) {
        emptyState.remove();
      }

      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `
        <p class="comment-author">You</p>
        <p class="comment-text"></p>
      `;
      item.querySelector('.comment-text').textContent = commentText;
      commentList.appendChild(item);

      const currentCount = parseCount(commentCountEl.textContent);
      const nextCount = currentCount + 1;
      commentCountEl.textContent = formatCount(nextCount);
      commentButton.classList.add('commented');
      commentButton.setAttribute('aria-pressed', 'true');
      commentInput.value = '';
      commentInput.focus();
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  setupLikeButtons();
  setupCommentPanels();
});
