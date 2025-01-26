import { LoginPicture } from "../Attachments/Attachments";
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { t } = useTranslation();
  return (
    <LoginPicture t={t}/>
  )
};

export default LoginForm;
