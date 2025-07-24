-- Create trigger for handling new user signups (if it doesn't exist)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update existing unconfirmed users to be confirmed so they can login
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now()
WHERE email_confirmed_at IS NULL 
  AND email = 'raghavendradwivedi2004@gmail.com';