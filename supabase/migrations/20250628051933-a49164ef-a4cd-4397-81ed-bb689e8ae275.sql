
-- Fix the handle_new_user function to have a secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Ensure RLS policies are properly configured
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;

CREATE POLICY "Users can view their own notes" ON public.notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON public.notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.notes
    FOR DELETE USING (auth.uid() = user_id);

-- Do the same for passwords table
DROP POLICY IF EXISTS "Users can view their own passwords" ON public.passwords;
DROP POLICY IF EXISTS "Users can create their own passwords" ON public.passwords;
DROP POLICY IF EXISTS "Users can update their own passwords" ON public.passwords;
DROP POLICY IF EXISTS "Users can delete their own passwords" ON public.passwords;

CREATE POLICY "Users can view their own passwords" ON public.passwords
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own passwords" ON public.passwords
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own passwords" ON public.passwords
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passwords" ON public.passwords
    FOR DELETE USING (auth.uid() = user_id);
