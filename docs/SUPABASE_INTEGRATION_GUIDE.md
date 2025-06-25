# Supabase Integration Guide for SEDP System

## 🚀 Complete Setup Instructions

### 1. Database Setup

Run the migration file `create_complete_sedp_schema.sql` in your Supabase SQL Editor to create:

- **Tables**: `categories`, `panchayaths`, `registrations`, `announcements`, `photo_gallery`, `push_notifications`, `profiles`, `user_roles`
- **Storage Buckets**: `uploads`, `sedp-assets`
- **Row Level Security**: Proper RLS policies for admin and public access
- **Real-time**: Enabled for all tables
- **Functions**: Admin role management and user creation

### 2. Frontend Integration

#### Real-time Data Fetching
```javascript
// Categories are automatically fetched and updated in real-time
const { categories, panchayaths, loading } = useSupabaseData();

// Categories will update automatically when admin changes them
useEffect(() => {
  console.log('Categories updated:', categories);
}, [categories]);
```

#### Registration Form Integration
```javascript
// Form automatically uses live data from Supabase
const RegistrationForm = () => {
  const { categories, panchayaths, createRegistration } = useSupabaseData();
  
  // Panchayath dropdown populated from live Supabase data
  <Select value={formData.panchayathDetails}>
    {panchayaths.map((panchayath) => (
      <SelectItem key={panchayath.id} value={panchayath.malayalam_name}>
        {panchayath.malayalam_name} - {panchayath.english_name}
      </SelectItem>
    ))}
  </Select>
  
  // Category fees fetched live from Supabase
  const getCategoryFees = (category) => {
    const cat = categories.find(c => c.name === category);
    return {
      actualFee: cat?.actual_fee || 0,
      offerFee: cat?.offer_fee || 0,
      hasOffer: cat?.has_offer || false
    };
  };
};
```

#### Application Status Checking
```javascript
const ApplicationStatusChecker = () => {
  const { checkApplicationStatus } = useSupabaseData();
  
  const handleSearch = async () => {
    const result = await checkApplicationStatus(searchQuery);
    if (result) {
      setSearchResult(result);
    } else {
      setNotFound(true);
    }
  };
};
```

#### Admin Real-time Updates
```javascript
// Admin dashboard automatically updates when new registrations come in
const AdminDashboard = () => {
  const { registrations, updateRegistrationStatus } = useSupabaseData();
  
  // Real-time subscription automatically refreshes data
  useEffect(() => {
    console.log('New registration received:', registrations);
  }, [registrations]);
  
  // Update registration status
  const handleApproval = async (id, status) => {
    await updateRegistrationStatus(id, status, uniqueId);
    // Data automatically refreshes via real-time subscription
  };
};
```

### 3. Key Features Implemented

#### ✅ Real-time Updates
- **Registration submissions**: Admin sees new registrations instantly
- **Category updates**: Form reflects fee/image changes immediately
- **Panchayath updates**: Dropdown updates automatically
- **Status changes**: Application status updates in real-time

#### ✅ Row Level Security
- **Admin universal access**: `evamarketingsolutions@gmail.com` has full access
- **Public read access**: Categories and panchayaths are publicly readable
- **User-specific access**: Users can only see their own registrations
- **Secure insertions**: Anyone can submit registrations, but only admins can modify

#### ✅ Storage Integration
- **Uploads bucket**: For user-uploaded files
- **SEDP-assets bucket**: For admin-managed assets
- **Public read access**: Images are publicly accessible
- **Admin write access**: Only admins can upload/modify files

#### ✅ Authentication Integration
- **Automatic profile creation**: New users get profiles and roles automatically
- **Admin role assignment**: Main admin is automatically assigned admin role
- **Role-based access**: Functions check user roles for permissions

### 4. API Examples

#### Fetch Live Categories
```javascript
const { data: categories } = await supabase
  .from('categories')
  .select('*')
  .order('name');
```

#### Submit Registration
```javascript
const { data, error } = await supabase
  .from('registrations')
  .insert([{
    full_name: 'John Doe',
    mobile_number: '9876543210',
    whatsapp_number: '9876543210',
    address: 'Complete address',
    panchayath_details: 'കൊണ്ടോട്ടി',
    category: 'pennyekart-free',
    user_id: user.id
  }]);
```

#### Check Application Status
```javascript
const { data } = await supabase
  .from('registrations')
  .select('*')
  .or(`mobile_number.eq.${searchQuery},unique_id.eq.${searchQuery}`)
  .single();
```

#### Real-time Subscription
```javascript
const subscription = supabase
  .channel('registrations_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'registrations'
  }, (payload) => {
    console.log('Registration change:', payload);
    // Refresh data automatically
  })
  .subscribe();
```

### 5. Admin Functions

#### Create Admin User
```sql
SELECT create_admin_user();
```

#### Assign Admin Role
```sql
SELECT assign_admin_role('user@example.com');
```

#### Check User Role
```sql
SELECT has_role(auth.uid(), 'admin');
```

### 6. Environment Variables

Your `.env` file should contain:
```
VITE_SUPABASE_URL=https://wrvyxkflqmnknescnlwz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indydnl4a2ZscW1ua25lc2NubHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzI0NDEsImV4cCI6MjA2NjM0ODQ0MX0.o6cH6jnfE5DVIeaX_svUYe4VF1KTE9rEFpF1J2VVNT4
```

### 7. Testing the Integration

1. **Run the migration** in Supabase SQL Editor
2. **Start your development server**: `npm run dev`
3. **Test registration form**: Submit a registration and verify it appears in Supabase
4. **Test real-time updates**: Open admin panel in another tab and watch for live updates
5. **Test status checking**: Use mobile number or unique ID to check application status
6. **Test admin functions**: Sign in as admin and verify universal access

### 8. Troubleshooting

#### Common Issues:
- **RLS blocking access**: Check if user has proper role assigned
- **Real-time not working**: Verify table is added to `supabase_realtime` publication
- **Admin access denied**: Ensure `evamarketingsolutions@gmail.com` is signed up and has admin role

#### Debug Commands:
```sql
-- Check user roles
SELECT u.email, ur.role FROM auth.users u 
JOIN user_roles ur ON u.id = ur.user_id;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'registrations';

-- Check realtime publication
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

This integration provides a complete, production-ready system with real-time updates, proper security, and seamless user experience.