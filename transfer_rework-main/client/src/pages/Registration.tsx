import React, { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/Registration.css';

const AuthForm: FC = () => {
  const { t } = useTranslation();
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const handleAuth = async () => {
    try {
      if (isRegister == false) {
        await store.registration(email, password);
      } else {
        await store.login(email, password);
      }
      navigate('/account');
    } catch (error) {
      alert(t('AuthenticationError'));
    }
  };

  return (
    <div className='Registration'>
      <div className='LeftPart'>
        <div className='SignIn'>
          <h2>{isRegister ? t('Registration') : t('Login')}</h2>
          <div className='DownPart'>
            <div className='Form'>
              <input
                type='email'
                placeholder={t('Email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type='password'
                placeholder={t('Password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button onClick={handleAuth}>
                <span>{isRegister ? t('RegistrationButton') : t('LoginButton')}</span>
              </button>
            </div>
            <div className='SocialIcons'>
              <i className="fab fa-google"></i>
              <i className="fab fa-apple"></i>
            </div>
          </div>
        </div>
      </div>

      <div className='RightPart'>
        <h2>{t('WelcomeReg')}</h2>
        <p>{t('RegText')}</p>
        <a href='#' onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? t('login') : t('register')}
        </a>
      </div>
    </div>
  );
};

export default observer(AuthForm);
