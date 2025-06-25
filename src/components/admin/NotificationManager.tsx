import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Bell, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PushNotification, categories } from "@/types/admin";

interface NotificationManagerProps {
  notifications: PushNotification[];
  onUpdate: (notifications: PushNotification[]) => void;
}

const NotificationManager = ({ notifications, onUpdate }: NotificationManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<PushNotification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: "all" as "all" | "category" | "panchayath" | "admin",
    targetValue: "",
    scheduledAt: "",
    isActive: true
  });

  const handleAdd = () => {
    setEditingNotification(null);
    setFormData({
      title: "",
      content: "",
      targetAudience: "all",
      targetValue: "",
      scheduledAt: "",
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (notification: PushNotification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      content: notification.content,
      targetAudience: notification.targetAudience,
      targetValue: notification.targetValue || "",
      scheduledAt: notification.scheduledAt || "",
      isActive: notification.isActive
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    let updatedNotifications;
    if (editingNotification) {
      updatedNotifications = notifications.map(n => 
        n.id === editingNotification.id 
          ? { ...editingNotification, ...formData }
          : n
      );
    } else {
      const newNotification: PushNotification = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      updatedNotifications = [newNotification, ...notifications];
    }

    onUpdate(updatedNotifications);
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: `Notification ${editingNotification ? 'updated' : 'created'} successfully`
    });
  };

  const handleDelete = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    onUpdate(updatedNotifications);
    toast({
      title: "Success",
      description: "Notification deleted successfully"
    });
  };

  const handleSendNow = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, sentAt: new Date().toISOString() } : n
    );
    onUpdate(updatedNotifications);
    toast({
      title: "Notification Sent",
      description: "Push notification has been sent to target audience"
    });
  };

  const getTargetDisplay = (notification: PushNotification) => {
    switch (notification.targetAudience) {
      case 'all':
        return 'All Users';
      case 'category':
        const category = categories.find(c => c.value === notification.targetValue);
        return `Category: ${category?.label || notification.targetValue}`;
      case 'panchayath':
        return `Panchayath: ${notification.targetValue}`;
      case 'admin':
        return 'Admin Only';
      default:
        return notification.targetAudience;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notification Management
            </CardTitle>
            <CardDescription>Create and send push notifications to users</CardDescription>
          </div>
          <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-1" />
            Create Notification
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">{notification.title}</TableCell>
                <TableCell className="max-w-xs truncate">{notification.content}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getTargetDisplay(notification)}</Badge>
                </TableCell>
                <TableCell>
                  {notification.sentAt ? (
                    <Badge className="bg-green-600">Sent</Badge>
                  ) : notification.scheduledAt ? (
                    <Badge variant="secondary">Scheduled</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(notification.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {!notification.sentAt && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendNow(notification.id)}
                        className="bg-green-50 hover:bg-green-100"
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(notification)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{notification.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(notification.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNotification ? 'Edit Notification' : 'Create New Notification'}
              </DialogTitle>
              <DialogDescription>
                Create push notifications to keep users informed about important updates
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>
              <div className="space-y-2">
                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Notification message"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value: any) => setFormData({ ...formData, targetAudience: value, targetValue: "" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="category">Specific Category</SelectItem>
                    <SelectItem value="panchayath">Specific Panchayath</SelectItem>
                    <SelectItem value="admin">Admin Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.targetAudience === 'category' && (
                <div className="space-y-2">
                  <Label>Select Category</Label>
                  <Select value={formData.targetValue} onValueChange={(value) => setFormData({ ...formData, targetValue: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {formData.targetAudience === 'panchayath' && (
                <div className="space-y-2">
                  <Label>Panchayath Name</Label>
                  <Input
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    placeholder="Enter panchayath name"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Schedule (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingNotification ? 'Update' : 'Create'} Notification
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default NotificationManager;