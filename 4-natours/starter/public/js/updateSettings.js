/* eslint-disable */

import { showAlert } from './alerts.js';

const updateSettings = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
      withCredentials: true,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully!');
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
  updateSettings(name, email);
});
