import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server configuration missing.' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required.' });
  }

  try {
    // 1. Create the user in auth.users
    const { data: userAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto confirm since admin is adding them
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = userAuth.user.id;

    // 2. Insert the role into public.user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert([{ id: userId, email: email, role: role }]);

    if (roleError) {
      // Rollback if role insert fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: 'Failed to assign role. User creation aborted.' });
    }

    return res.status(200).json({ message: 'User created successfully', user: userAuth.user });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
