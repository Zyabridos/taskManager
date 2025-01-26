import loginPic from '../../assets/loginPic.jpg';

export const LoginPicture = ({ t }) => {
  return (
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
      <img className="rounded-circle" src={loginPic} alt={t('assetsAltName.login')}/>
    </div>
  )
};
