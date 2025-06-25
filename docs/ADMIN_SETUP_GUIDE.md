# SEDP Admin Setup Guide

## 🔐 Admin Access Configuration

This guide provides complete instructions for setting up admin access for the SEDP (Self Employment Development Program) system.

## 📋 Admin Credentials

### Primary Admin Account
- **Email:** `evamarketingsolutions@gmail.com`
- **Password:** `admin919123`
- **Access Level:** Universal Admin (Full System Access)

⚠️ **Security Note:** Change the password immediately after first login.

## 🚀 Setup Process

### 1. Automatic Admin Setup
The system includes an automated setup process that:
- Creates the admin user if it doesn't exist
- Assigns admin role automatically
- Configures universal access permissions
- Sets up proper security policies

### 2. Manual Setup (if needed)
If automatic setup fails, you can manually create the admin:

```sql
-- Run this in Supabase SQL Editor
SELECT create_admin_user();
```

### 3. Verify Admin Access
1. Sign in with admin credentials
2. Navigate to Admin Panel
3. Verify access to all registration data
4. Test CRUD operations on all tables

## 🔑 Admin Permissions

The admin user has universal access to:

### ✅ Full Data Access
- All registration records (read/write)
- User management and roles
- Categories and fee management
- Panchayath data management
- Announcements and notifications
- Photo gallery management

### ✅ System Management
- User role assignment
- System configuration
- Data export capabilities
- Analytics and reporting

### ✅ Security Features
- Row Level Security (RLS) bypass for admin
- Cross-origin access enabled
- Secure authentication
- Audit trail capabilities

## 🌐 Universal Access Configuration

### Database Policies
The system includes special RLS policies that grant universal access:

```sql
-- Admin can access all data regardless of ownership
CREATE POLICY "Admin Universal Access" ON table_name
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    auth.email() = 'evamarketingsolutions@gmail.com'
  );
```

### Storage Access
For Supabase Storage (if used):
- Admin has read/write access to all buckets
- Universal file upload/download permissions
- Cross-origin resource sharing enabled

## 📊 Data Access Examples

### Registration Data
```javascript
// Admin can access all registrations
const { data: allRegistrations } = await supabase
  .from('registrations')
  .select('*');
```

### User Management
```javascript
// Admin can manage user roles
const { data } = await supabase
  .rpc('assign_admin_role', { user_email: 'user@example.com' });
```

## 🔒 Security Best Practices

### 1. Password Security
- Change default password immediately
- Use strong, unique passwords
- Enable 2FA if available
- Regular password updates

### 2. Access Monitoring
- Monitor admin login activities
- Review data access logs
- Track system changes
- Regular security audits

### 3. Backup & Recovery
- Regular database backups
- Admin credential backup
- Recovery procedures documented
- Test restore processes

## 🛠️ Troubleshooting

### Admin Access Issues
1. **Cannot login:** Verify credentials and account status
2. **No admin panel:** Check role assignment in database
3. **Limited access:** Verify RLS policies are active
4. **Data not visible:** Check table permissions

### Database Issues
```sql
-- Check admin role assignment
SELECT u.email, ur.role 
FROM auth.users u 
JOIN user_roles ur ON u.id = ur.user_id 
WHERE ur.role = 'admin';

-- Verify RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('registrations', 'announcements', 'photo_gallery');
```

## 📞 Support Information

### Technical Support
- **System Admin:** evamarketingsolutions@gmail.com
- **Database:** Supabase Cloud
- **Hosting:** Configured for universal access

### Emergency Access
If admin access is lost:
1. Contact Supabase support
2. Use database recovery tools
3. Restore from backup
4. Re-run setup migration

## 🔄 System Updates

### Regular Maintenance
- Monitor system performance
- Update security policies
- Review user access logs
- Backup critical data

### Version Updates
- Test in staging environment
- Backup before updates
- Verify admin access post-update
- Document any changes

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Production Ready