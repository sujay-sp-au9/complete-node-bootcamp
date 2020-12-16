/* eslint-disable */

import { showAlert } from './alerts.js';

const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
      withCredentials: true,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => window.location.assign('/'), 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Try again');
  }
};

document.querySelector('.form-user-data').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  updateSettings({ name, email }, 'data');
});

document
  .querySelector('.form-user-password')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    updatePasswordBtn.innerText = 'Updating...';
    const currentPasswordElem = document.getElementById('password-current');
    const passwordElem = document.getElementById('password');
    const passwordConfirmElem = document.getElementById('password-confirm');
    const currentPassword = currentPasswordElem.value;
    const password = passwordElem.value;
    const passwordConfirm = passwordConfirmElem.value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );
    updatePasswordBtn.innerText = 'Save passwords';
    currentPasswordElem.innerText = '';
    passwordElem.innerText = '';
    passwordConfirmElem.innerText = '';
  });
