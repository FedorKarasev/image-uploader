function upload(selector, { multiple = false, accept = [], onUpload = function () {} } = {}) {
  const inputEl = document.querySelector(selector);
  let files = [];

  if (multiple) {
    inputEl.setAttribute('multiple', true);
  }

  if (accept.length) {
    inputEl.setAttribute('accept', accept.join(', '));
  }

  const previewEl = document.createElement('div');
  previewEl.classList.add('preview');

  const openBtn = document.createElement('button');
  openBtn.classList.add('btn');
  openBtn.textContent = 'Open';

  const uploadBtn = document.createElement('button');
  uploadBtn.classList.add('btn', 'primary');
  uploadBtn.setAttribute('disabled', true);
  uploadBtn.textContent = 'Upload';

  inputEl.insertAdjacentElement('afterend', previewEl);
  inputEl.insertAdjacentElement('afterend', uploadBtn);
  inputEl.insertAdjacentElement('afterend', openBtn);

  const triggerInput = () => inputEl.click();
  const changeHandler = (event) => {
    if (!event.target.files) return;

    previewEl.innerHTML = '';

    files = Array.from(event.target.files);

    files.forEach((file) => {
      if (!file.type.match('image')) return;
      uploadBtn.removeAttribute('disabled');

      const reader = new FileReader();

      reader.onload = (event) => {
        const src = event.target.result;
        const alt = file.name;

        function formatBytes(bytes, decimals = 2) {
          if (!+bytes) return '0 Bytes';

          const k = 1024;
          const dm = decimals < 0 ? 0 : decimals;
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

          const i = Math.floor(Math.log(bytes) / Math.log(k));

          return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
        }

        previewEl.insertAdjacentHTML(
          'afterbegin',
          `<div class="preview-image">
             <div class="preview-remove" data-name="${file.name}">&times;</div>
             <img src="${src}" alt="${alt}" />
             <div class="preview-info">
               <span>${file.name}</span>
               <span>${formatBytes(file.size)}</span>
             </div>
           </div>`
        );
      };
      reader.readAsDataURL(file);
    });
  };

  function clearPreview(el) {
    el.innerHTML = '<div class="preview-info-progress"></div>';
    el.style.opacity = 1;
  }

  function uploadHandler() {
    previewEl.removeEventListener('click', removeHandler);
    previewEl.querySelectorAll('.preview-remove').forEach((el) => el.remove());
    previewEl.querySelectorAll('.preview-info').forEach(clearPreview);
    onUpload(files, previewEl.querySelectorAll('.preview-info-progress'));
  }

  function removeHandler(event) {
    if (!event.target.closest('.preview-remove')) return;
    files = files.filter((file) => file.name != event.target.closest('.preview-remove').dataset.name);
    if (!files.length) uploadBtn.setAttribute('disabled', true);
    event.target.closest('.preview-image').remove();
  }

  previewEl.addEventListener('click', removeHandler);
  openBtn.addEventListener('click', triggerInput);
  inputEl.addEventListener('change', changeHandler);
  uploadBtn.addEventListener('click', uploadHandler);
}

export default upload;
