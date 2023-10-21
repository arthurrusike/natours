
//VALUES declaration
const logOutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

hideAlert = () => {
  const el = document.querySelector('alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      // eslint-disable-next-line no-alert, no-undef
      showAlert('success', 'Logged In Sucessfully');
      // eslint-disable-next-line no-undef
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals, no-undef
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    // eslint-disable-next-line no-alert, no-undef
    showAlert('error', error.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (error) {
    // eslint-disable-next-line no-alert, no-undef
    showAlert('error', 'Error Logging Out Try again');
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', (e) => {
    logout();
  });
}

const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      // eslint-disable-next-line no-alert, no-undef
      showAlert(
        'success',
        `${type.toUpperCase()} has been updated Successfully!!`,
      );
      // eslint-disable-next-line no-undef
    }
  } catch (error) {
   
    //eslint-disable-next-line no-alert, no-undef
    showAlert('error', error.response.data.message);
  }
};

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
      });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
    
    document.querySelector('.password-current') = '';
    document.querySelector('.password') = '';
    document.querySelector('.password-confirm') ='';
  });
}

