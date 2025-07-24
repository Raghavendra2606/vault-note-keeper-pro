-- Reset password for the user (this will allow them to set a new password)
-- Note: In production, this should be done through proper password reset flow
UPDATE auth.users 
SET encrypted_password = crypt('newpassword123', gen_salt('bf'))
WHERE email = 'raghavendradwivedi2004@gmail.com';