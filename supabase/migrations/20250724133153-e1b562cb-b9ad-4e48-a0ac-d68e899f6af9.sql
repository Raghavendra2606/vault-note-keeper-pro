-- Update existing unconfirmed users to be confirmed so they can login
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now()
WHERE email_confirmed_at IS NULL 
  AND email = 'raghavendradwivedi2004@gmail.com';