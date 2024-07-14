import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import '../stylesheets/Authorisation.css';

function Authorisation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await store.login(email, password);
      if (store.user.role === 'admin') {
        navigate('/adminpanel');
      } else {
        navigate('/account');
      }
    } catch (error) {
      alert(t('AuthenticationError'));
    }
  };

  return (
    <div className='Authorisation'>
      <div className='LeftPart'>
        <div className='SignIn'>
          <h2>{t('SignIn')}</h2>
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
              <button onClick={handleLogin}>
                <span>{t('SignIn')}</span>
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
        <h2>{t('WelcomeBack')}</h2>
        <p>{t('KeepConnected')}</p>
        <a href='/registration'>{t('CreateAccount')}</a>
      </div>
    </div>
  );
}

export default Authorisation;
