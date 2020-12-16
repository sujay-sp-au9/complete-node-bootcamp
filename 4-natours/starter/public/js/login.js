/* eslint-disable no-undef */

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/login`,
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    localStorage.setItem('jwt', res.data.token);
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
